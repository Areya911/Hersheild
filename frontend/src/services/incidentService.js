// frontend/src/services/incidentService.js
import { db, makeGeoPoint } from "../firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from "firebase/firestore";

/**
 * createIncident - create an incident in /incidents and increment user's reportsCount
 * payload: { reporterUid, location: {lat,lng} | {latitude,longitude}, category, description, anonymousFlag, recipientsAlerted, sosId }
 * returns incidentId
 */
export async function createIncident(payload) {
  const {
    reporterUid = null,
    location = null,
    category = "general",
    description = "",
    anonymousFlag = true,
    recipientsAlerted = [],
    sosId = null,
  } = payload;

  let geo = null;
  if (location) {
    const lat = location.lat ?? location.latitude;
    const lng = location.lng ?? location.longitude;
    if (typeof lat === "number" && typeof lng === "number") geo = makeGeoPoint(lat, lng);
  }

  const incident = {
    reporterUid,
    location: geo,
    timestamp: serverTimestamp(),
    category,
    description,
    anonymousFlag,
    status: "open",
    recipientsAlerted,
    sosId,
  };

  const ref = await addDoc(collection(db, "incidents"), incident);

  // best-effort increment of user's stats
  if (reporterUid) {
    try {
      const userRef = doc(db, "users", reporterUid);
      await updateDoc(userRef, { "stats.reportsCount": increment(1) });
    } catch (err) {
      console.warn("createIncident: could not increment reportsCount", err);
    }
  }

  return ref.id;
}
