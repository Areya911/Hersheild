import React from "react";

export default function SOSButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="sos-pulse relative inline-flex items-center justify-center rounded-full bg-rose-600 text-white font-bold text-xl w-28 h-28 hover:bg-rose-700 active:scale-95 transition-all duration-200 shadow-lg"
    >
      SOS
      <span className="absolute inset-0 rounded-full border-4 border-rose-400/30 animate-ping opacity-75"></span>
    </button>
  );
}
