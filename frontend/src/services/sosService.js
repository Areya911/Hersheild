// src/services/sosService.js
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { reportIncident } from "../utils/reportIncident";
import { uploadEvidence } from "./storageService";

/**
 * sendSos
 * - uploads evidenceFile to Storage (if any)
 * - creates a /sos doc
 * - creates a corresponding incident via reportIncident (category: 'SOS')
 *
 * Params: { uid = null, location = {lat,lng}, method = 'manual'|'auto', recipients = [], evidenceFile = null }
 * Returns { sosId, incidentId }
 */
export async function sendSos({ uid = null, location = null, method = "manual", recipients = [], evidenceFile = null }) {
  let evidenceUrl = null;
  if (evidenceFile) {
    try {
      evidenceUrl = await uploadEvidence(uid, evidenceFile);
    } catch (err) {
      console.warn("sendSos: evidence upload failed", err);
    }
  }

  const sosDoc = {
    uid,
    timestamp: serverTimestamp(),
    location: location ? { latitude: Number(location.lat), longitude: Number(location.lng) } : null,
    method,
    recipients: Array.isArray(recipients) ? recipients : [],
    deliveryStatus: "pending",
    evidenceUrl: evidenceUrl || null,
  };

  const sosRef = await addDoc(collection(db, "sos"), sosDoc);

  const incident = await reportIncident({
    reporterUid: uid,
    lat: location?.lat ?? location?.latitude ?? null,
    lng: location?.lng ?? location?.longitude ?? null,
    title: "SOS - Immediate help",
    description: "User triggered SOS",
    risk: "high",
    radiusMeters: 1000,
    file: evidenceFile || null,
    anonymous: false,
    recipientsAlerted: recipients || [],
    sosId: sosRef.id,
    category: "SOS",
  });

  return { sosId: sosRef.id, incidentId: incident.id };
}
