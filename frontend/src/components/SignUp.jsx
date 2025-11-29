// frontend/src/components/SignUp.jsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { uploadProfilePhoto } from "../services/storageService";

export default function SignUp({ onSuccess = () => {}, onBack = () => {} }) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    phone: "",
    city: "",
    email: "",
    country: "",
    password: "",
    confirm: "",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  function update(k, v) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function handleSubmit(e) {
    e?.preventDefault?.();
    setMsg("");
    if (!form.name || !form.email || !form.password) {
      setMsg("Name, email and password are required.");
      return;
    }
    if (form.password !== form.confirm) {
      setMsg("Passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const uid = cred.user.uid;
      const userDoc = {
        username: form.name,
        age: form.age,
        phone: form.phone,
        city: form.city,
        email: form.email,
        country: form.country,
        photoURL: null,
        stats: { reportsCount: 0, sosCount: 0 },
        trustedContacts: [],
        createdAt: serverTimestamp(),
      };

      if (photoFile) {
        try {
          const url = await uploadProfilePhoto(uid, photoFile);
          userDoc.photoURL = url;
        } catch (err) {
          console.warn("Profile photo upload failed:", err);
        }
      }

      await setDoc(doc(db, "users", uid), userDoc);
      setMsg("Account created. Redirecting...");
      onSuccess();
    } catch (err) {
      console.error("SignUp error:", err);
      setMsg(err?.message || "Sign up failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-start justify-center bg-[radial-gradient(ellipse_at_top_left,_#1b1f22,_#0e1112)] p-6">
      <div className="w-full max-w-3xl bg-[#0d0f10] border border-slate-800 rounded-md p-8 text-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-rose-400 tracking-wide">SIGN UP</h2>
          <button onClick={onBack} className="text-sm text-slate-400 underline">Back</button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-300">Name</label>
            <input className="w-full mt-1 p-2 rounded bg-slate-900 text-slate-100" value={form.name} onChange={(e)=>update("name", e.target.value)} />
          </div>

          <div>
            <label className="text-sm text-slate-300">Age</label>
            <input className="w-full mt-1 p-2 rounded bg-slate-900 text-slate-100" value={form.age} onChange={(e)=>update("age", e.target.value)} />
          </div>

          <div>
            <label className="text-sm text-slate-300">Phone Number</label>
            <input className="w-full mt-1 p-2 rounded bg-slate-900 text-slate-100" value={form.phone} onChange={(e)=>update("phone", e.target.value)} />
          </div>

          <div>
            <label className="text-sm text-slate-300">City</label>
            <input className="w-full mt-1 p-2 rounded bg-slate-900 text-slate-100" value={form.city} onChange={(e)=>update("city", e.target.value)} />
          </div>

          <div>
            <label className="text-sm text-slate-300">Enter Email</label>
            <input required type="email" className="w-full mt-1 p-2 rounded bg-slate-900 text-slate-100" value={form.email} onChange={(e)=>update("email", e.target.value)} />
          </div>

          <div>
            <label className="text-sm text-slate-300">Country</label>
            <input className="w-full mt-1 p-2 rounded bg-slate-900 text-slate-100" value={form.country} onChange={(e)=>update("country", e.target.value)} />
          </div>

          <div>
            <label className="text-sm text-slate-300">Create Password</label>
            <input required type="password" className="w-full mt-1 p-2 rounded bg-slate-900 text-slate-100" value={form.password} onChange={(e)=>update("password", e.target.value)} />
          </div>

          <div>
            <label className="text-sm text-slate-300">Confirm Password</label>
            <input required type="password" className="w-full mt-1 p-2 rounded bg-slate-900 text-slate-100" value={form.confirm} onChange={(e)=>update("confirm", e.target.value)} />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-slate-300">Profile photo (optional)</label>
            <input type="file" accept="image/*" onChange={(e)=>setPhotoFile(e.target.files[0])} className="mt-2 text-sm text-slate-300" />
          </div>

          <div className="md:col-span-2 flex flex-col items-center mt-2">
            <button
              type="submit"
              disabled={busy}
              className="w-60 py-3 rounded-full bg-gradient-to-r from-rose-600 to-rose-500 text-white font-semibold"
            >
              {busy ? "Completing..." : "COMPLETE"}
            </button>
            <div className="text-xs text-slate-500 mt-2">CLICK ON "COMPLETE" TO FINISH SIGNUP</div>
            {msg && <div className="text-sm text-rose-400 mt-3">{msg}</div>}
          </div>
        </form>
      </div>
    </div>
  );
}
