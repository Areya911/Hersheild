// frontend/src/components/AuthLanding.jsx
import React from "react";

export default function AuthLanding({ onChoose = () => {} }) {
  return (
    <div className="min-h-screen flex items-start justify-center bg-[radial-gradient(ellipse_at_top_left,_#1b1f22,_#0e1112)]">
      <div className="w-full max-w-xl p-8">
        <div className="text-3xl font-bold text-rose-400 mb-10">HERSHEILD</div>

        <div className="mt-12 flex flex-col items-center gap-8">
          <button
            onClick={() => onChoose("signup")}
            className="w-64 md:w-72 lg:w-80 py-5 rounded-full bg-rose-700/85 hover:bg-rose-600 transition text-rose-100 font-semibold tracking-wide text-xl shadow-xl"
          >
            SIGN UP
          </button>

          <button
            onClick={() => onChoose("login")}
            className="w-64 md:w-72 lg:w-80 py-5 rounded-full bg-slate-800 border border-rose-700/40 hover:bg-slate-900 transition text-rose-200 font-semibold tracking-wide text-xl shadow"
          >
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}
