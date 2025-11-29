// frontend/src/components/Login.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Login({ onSuccess = () => {}, onBack = () => {} }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e?.preventDefault?.();
    setMsg("");
    if (!email || !pw) {
      setMsg("Please enter email and password");
      return;
    }
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email, pw);
      setMsg("Login successful");
      onSuccess();
    } catch (err) {
      console.error("Login failed:", err);
      setMsg("Authentication failed. Check credentials.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-start justify-center bg-[radial-gradient(ellipse_at_top_left,_#1b1f22,_#0e1112)] p-6">
      <div className="w-full max-w-md bg-[#0d0f10] border border-slate-800 rounded-md p-8 text-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold text-rose-400">LOGIN</h3>
          <button onClick={onBack} className="text-sm text-slate-400 underline">Back</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-300">Email</label>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full mt-1 p-2 rounded bg-slate-900 text-slate-100" />
          </div>
          <div>
            <label className="text-sm text-slate-300">Password</label>
            <input type="password" value={pw} onChange={(e)=>setPw(e.target.value)} className="w-full mt-1 p-2 rounded bg-slate-900 text-slate-100" />
          </div>

          <div>
            <button type="submit" disabled={busy} className="w-full py-3 rounded-full bg-rose-600 text-white font-semibold">
              {busy ? "Signing in..." : "Sign in"}
            </button>
          </div>
          {msg && <div className="text-sm text-rose-400">{msg}</div>}
        </form>
      </div>
    </div>
  );
}
