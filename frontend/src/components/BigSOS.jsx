import React from "react";
import SOSButton from "./SOSButton";

export default function BigSOS({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50">
      <div className="text-center">
        <h2 className="text-5xl font-extrabold text-rose-500 mb-6">
          EMERGENCY MODE
        </h2>
        <SOSButton onClick={() => alert("Emergency Broadcast Sent! 🚨")} />
        <p className="text-slate-400 mt-6 text-lg">
          Your trusted contacts have been notified.
        </p>
        <button
          onClick={onClose}
          className="mt-8 px-6 py-3 rounded-md bg-slate-700 hover:bg-slate-600 text-white"
        >
          Exit SOS Mode
        </button>
      </div>
    </div>
  );
}
