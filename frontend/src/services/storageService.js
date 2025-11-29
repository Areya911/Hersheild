// frontend/src/services/storageService.js
import { storage } from "../firebase";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Upload a file to Firebase Storage at path `profiles/{uid}/{timestamp}_{filename}`
 * Returns the download URL string.
 */
export async function uploadProfilePhoto(uid, file) {
  if (!uid) throw new Error("uploadProfilePhoto: uid required");
  if (!file) throw new Error("uploadProfilePhoto: file required");
  const path = `profiles/${uid}/${Date.now()}_${file.name}`;
  const r = storageRef(storage, path);
  await uploadBytes(r, file);
  const url = await getDownloadURL(r);
  return url;
}

/**
 * Upload generic evidence (for incidents / SOS) under `evidence/{uid}/{timestamp}_{filename}`
 * uid may be null (anonymous), in which case path uses 'anonymous'
 */
export async function uploadEvidence(uid, file) {
  if (!file) return null;
  const owner = uid || "anonymous";
  const path = `evidence/${owner}/${Date.now()}_${file.name}`;
  const r = storageRef(storage, path);
  await uploadBytes(r, file);
  const url = await getDownloadURL(r);
  return url;
}
