// frontend/src/components/ProfilePage.jsx
import React, { useEffect, useState, useRef } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { uploadProfilePhoto } from "../services/storageService";
import { sendSos } from "../services/sosService";

/**
 * ProfilePage
 * - registration/login (email)
 * - optional profile photo upload to Firebase Storage
 * - phone OTP verification (web)
 * - trusted contacts list (verification code stored; backend required to SMS)
 * - quick SOS with 10s undo
 */
export default function ProfilePage() {
  const [userDoc, setUserDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [govId, setGovId] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const confirmationRef = useRef(null);
  const recaptchaRef = useRef(null);
  const sosTimerRef = useRef(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          const d = await getDoc(doc(db, "users", u.uid));
          setUserDoc(d.exists() ? { id: u.uid, ...d.data() } : { id: u.uid });
        } catch (err) {
          console.error("Failed to fetch user doc:", err);
          setUserDoc({ id: u.uid });
        }
      } else {
        setUserDoc(null);
      }
    });
    return () => unsub();
  }, []);

  function ensureRecaptcha() {
    if (recaptchaRef.current) return recaptchaRef.current;
    try {
      recaptchaRef.current = new RecaptchaVerifier("recaptcha-container", { size: "invisible" }, auth);
    } catch (e) {
      // recaptcha may already be initialized in some environments
      console.warn("Recaptcha init:", e?.message || e);
    }
    return recaptchaRef.current;
  }

  async function handleRegister(e) {
    e?.preventDefault?.();
    setLoading(true);
    setMessage("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pw);
      const uid = cred.user.uid;
      const payload = {
        username,
        email,
        gender,
        govIdHash: "demo_hash_" + String(govId).slice(0, 12),
        govIdIsFake: true,
        photoURL: null,
        stats: { reportsCount: 0, sosCount: 0 },
        trustedContacts: [],
        createdAt: serverTimestamp(),
      };

      if (photoFile) {
        try {
          const url = await uploadProfilePhoto(uid, photoFile);
          payload.photoURL = url;
        } catch (err) {
          console.warn("Profile photo upload failed:", err);
        }
      }

      await setDoc(doc(db, "users", uid), payload);
      setMessage("Registered & profile created");
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Register failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e) {
    e?.preventDefault?.();
    setLoading(true);
    setMessage("");
    try {
      await signInWithEmailAndPassword(auth, email, pw);
      setMessage("Logged in");
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function sendPhoneOtp() {
    setMessage("");
    try {
      const verifier = ensureRecaptcha();
      const confirmation = await signInWithPhoneNumber(auth, phone, verifier);
      confirmationRef.current = confirmation;
      setMessage("OTP sent to " + phone);
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Send OTP failed");
    }
  }

  async function verifyOtp() {
    setMessage("");
    try {
      if (!confirmationRef.current) throw new Error("Send OTP first");
      const res = await confirmationRef.current.confirm(otp);
      const phoneNumber = res.user.phoneNumber;
      if (auth.currentUser) {
        await updateDoc(doc(db, "users", auth.currentUser.uid), { phoneNumber });
      }
      setMessage("Phone verified: " + phoneNumber);
    } catch (err) {
      console.error(err);
      setMessage(err.message || "OTP verify failed");
    }
  }

  async function addTrustedContact(name, phoneToAdd) {
    if (!auth.currentUser) return setMessage("Login required to add contacts");
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const userRef = doc(db, "users", auth.currentUser.uid);
      const snapshot = await getDoc(userRef);
      const current = snapshot.exists() ? snapshot.data().trustedContacts || [] : [];
      current.push({ name, phone: phoneToAdd, verified: false, verificationCode: code, addedAt: serverTimestamp() });
      await updateDoc(userRef, { trustedContacts: current });
      setMessage(`Trusted contact added; verification code stored (send via backend): ${code}`);
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Add contact failed");
    }
  }

  async function handleUploadProfilePhoto() {
    if (!auth.currentUser) return setMessage("Login required");
    if (!photoFile) return setMessage("Choose a photo first");
    setLoading(true);
    try {
      const url = await uploadProfilePhoto(auth.currentUser.uid, photoFile);
      await updateDoc(doc(db, "users", auth.currentUser.uid), { photoURL: url });
      setMessage("Profile photo uploaded");
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  function startSos(location = { lat: 0, lng: 0 }) {
    if (sosTimerRef.current) {
      clearTimeout(sosTimerRef.current);
      sosTimerRef.current = null;
    }
    setMessage("SOS will be sent in 10s — cancel to abort");
    let cancelled = false;
    sosTimerRef.current = setTimeout(async () => {
      if (cancelled) return;
      setMessage("Sending SOS...");
      try {
        const recipients = (userDoc?.trustedContacts || []).map((c) => c.phone);
        const res = await sendSos({ uid: userDoc?.id || null, location, recipients, method: "manual" });
        setMessage("SOS sent: incident " + res.incidentId);
      } catch (err) {
        console.error(err);
        setMessage("SOS failed: " + (err.message || err));
      }
    }, 10000);
    return {
      cancel: () => {
        cancelled = true;
        if (sosTimerRef.current) {
          clearTimeout(sosTimerRef.current);
          sosTimerRef.current = null;
        }
        setMessage("SOS cancelled.");
      },
    };
  }

  function cancelSos() {
    if (sosTimerRef.current) {
      clearTimeout(sosTimerRef.current);
      sosTimerRef.current = null;
      setMessage("SOS cancelled.");
    }
  }

  if (!userDoc) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Sign in / Register</h2>

        <form onSubmit={handleLogin}>
          <div><label>Email: <input value={email} onChange={(e) => setEmail(e.target.value)} /></label></div>
          <div><label>Password: <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} /></label></div>
          <div><button type="submit">Sign in</button></div>
        </form>

        <hr />

        <form onSubmit={handleRegister}>
          <h3>Create account</h3>
          <div><label>Username: <input value={username} onChange={(e) => setUsername(e.target.value)} /></label></div>
          <div><label>Gender: <input value={gender} onChange={(e) => setGender(e.target.value)} /></label></div>
          <div><label>GovID (demo): <input value={govId} onChange={(e) => setGovId(e.target.value)} /></label></div>
          <div><label>Profile photo: <input type="file" onChange={(e) => setPhotoFile(e.target.files[0])} /></label></div>
          <div><button type="submit" disabled={loading}>Create account</button></div>
        </form>

        <div style={{ marginTop: 8, color: "red" }}>{message}</div>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Profile</h2>
      <div><strong>Username:</strong> {userDoc.username}</div>
      <div><strong>Gender:</strong> {userDoc.gender}</div>
      <div><strong>Phone:</strong> {userDoc.phoneNumber || "Not verified"}</div>

      <div style={{ marginTop: 12 }}>
        <h3>Phone verification</h3>
        <div id="recaptcha-container" />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91..." />
        <button onClick={sendPhoneOtp}>Send OTP</button>
        <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="OTP" />
        <button onClick={verifyOtp}>Verify</button>
      </div>

      <div style={{ marginTop: 12 }}>
        <h3>Profile photo</h3>
        {userDoc.photoURL && <img src={userDoc.photoURL} alt="profile" style={{ width: 96, height: 96, borderRadius: 8 }} />}
        <div><input type="file" onChange={(e) => setPhotoFile(e.target.files[0])} /></div>
        <div><button onClick={handleUploadProfilePhoto}>Upload photo</button></div>
      </div>

      <div style={{ marginTop: 12 }}>
        <h3>Trusted contacts</h3>
        {(userDoc.trustedContacts || []).map((c, i) => (
          <div key={i}>{c.name} — {c.phone} — {c.verified ? "Verified" : "Unverified"}</div>
        ))}
        <div style={{ marginTop: 8 }}>
          <button onClick={() => addTrustedContact(prompt("Name"), prompt("Phone e.g. +91..."))}>Add trusted contact</button>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <h3>Quick SOS</h3>
        <button onClick={() => startSos({ lat: 0, lng: 0 })}>Trigger SOS (10s undo)</button>
        <button onClick={cancelSos} style={{ marginLeft: 8 }}>Cancel SOS</button>
      </div>

      <div style={{ marginTop: 12 }}>
        <h3>Stats</h3>
        <div>Reports: {userDoc.stats?.reportsCount ?? 0}</div>
        <div>SOS sent: {userDoc.stats?.sosCount ?? 0}</div>
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={() => signOut(auth)}>Sign out</button>
      </div>

      <div style={{ marginTop: 12, color: "red" }}>{message}</div>
    </div>
  );
}
