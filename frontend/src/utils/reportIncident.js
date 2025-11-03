// src/utils/reportIncident.js
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/**
 * Convert File to base64 string
 * @param {File} file
 * @returns {Promise<string>} dataURL
 */
function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = () => reject(new Error("Failed to read file"));
    r.onload = () => resolve(r.result);
    r.readAsDataURL(file);
  });
}

/**
 * Upload file to ImgBB (returns URL) - uses client-side API key from env.
 * Requires VITE_IMGBB_API_KEY in .env
 * @param {File} file
 * @returns {Promise<string|null>}
 */
export async function uploadToImgBB(file) {
  if (!file) return null;
  const key = import.meta.env.VITE_IMGBB_API_KEY;
  if (!key) throw new Error("VITE_IMGBB_API_KEY not set in .env");

  // ImgBB expects base64 without the data:... prefix
  const dataUrl = await fileToDataURL(file);
  const base64 = dataUrl.split(",")[1];

  const form = new FormData();
  form.append("key", key);
  form.append("image", base64);

  const res = await fetch("https://api.imgbb.com/1/upload", {
    method: "POST",
    body: form,
  });

  const json = await res.json();
  if (!json.success) {
    console.warn("ImgBB upload failed", json);
    return null;
  }
  return json.data.url;
}

/**
 * Create Firestore incident doc (and optionally upload photo to ImgBB).
 * Returns the created doc id & values.
 */
export async function reportIncident({
  lat,
  lng,
  title,
  description = "",
  risk = "high",
  radiusMeters = 1000,
  file = null,
  anonymous = true,
}) {
  // upload image first (if provided)
  let photoUrl = null;
  try {
    if (file) {
      photoUrl = await uploadToImgBB(file);
    }
  } catch (err) {
    console.warn("Image upload error:", err);
  }

  const payload = {
    lat: Number(lat),
    lng: Number(lng),
    title: String(title).slice(0, 200),
    description: String(description || "").slice(0, 1000),
    risk: ["low", "medium", "high"].includes(risk) ? risk : "high",
    radiusMeters: Number(radiusMeters) || 1000,
    photoUrl: photoUrl || null,
    anonymous: !!anonymous,
    ts: serverTimestamp(),
  };

  const col = collection(db, "incidents");
  const docRef = await addDoc(col, payload);
  return { id: docRef.id, ...payload };
}
