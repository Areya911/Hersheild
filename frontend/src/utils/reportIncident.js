// src/utils/reportIncident.js
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from "firebase/firestore";
import { uploadEvidence } from "../services/storageService";

/**
 * create Firestore incident doc with Storage-backed photo (if provided).
 *
 * Params:
 * {
 *   reporterUid = null,
 *   lat,
 *   lng,
 *   title,
 *   description = "",
 *   risk = "high",
 *   radiusMeters = 1000,
 *   file = null,               // File object for photo (optional)
 *   anonymous = true,
 *   recipientsAlerted = [],
 *   sosId = null,
 *   category = "general"
 * }
 *
 * Returns { id, ...payload }.
 */
export async function reportIncident({
  reporterUid = null,
  lat,
  lng,
  title,
  description = "",
  risk = "high",
  radiusMeters = 1000,
  file = null,
  anonymous = true,
  recipientsAlerted = [],
  sosId = null,
  category = "general",
}) {
  let photoUrl = null;
  try {
    if (file) {
      // upload to Firebase Storage via service (best for privacy/control)
      photoUrl = await uploadEvidence(reporterUid, file);
    }
  } catch (err) {
    console.warn("reportIncident: photo upload failed", err);
  }

  const payload = {
    reporterUid,
    location: lat !== undefined && lng !== undefined ? { latitude: Number(lat), longitude: Number(lng) } : null,
    timestamp: serverTimestamp(),
    category,
    title: String(title).slice(0, 200),
    description: String(description || "").slice(0, 2000),
    risk: ["low", "medium", "high"].includes(risk) ? risk : "high",
    radiusMeters: Number(radiusMeters) || 1000,
    photoUrl: photoUrl || null,
    anonymousFlag: !!anonymous,
    status: "open",
    recipientsAlerted: Array.isArray(recipientsAlerted) ? recipientsAlerted : [],
    sosId: sosId || null,
  };

  const col = collection(db, "incidents");
  const docRef = await addDoc(col, payload);

  // best-effort increment of user's reportsCount
  if (reporterUid) {
    try {
      await updateDoc(doc(db, "users", reporterUid), { "stats.reportsCount": increment(1) });
    } catch (err) {
      console.warn("reportIncident: could not increment reportsCount", err);
    }
  }

  return { id: docRef.id, ...payload };
}
