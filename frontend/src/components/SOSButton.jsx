import React from "react";

export default function BigSOS() {
  return (
    <section className="mt-12 flex flex-col items-center gap-8">
      <button
        aria-label="SOS"
        className="relative w-[52rem] max-w-full md:w-[60%] px-12 py-10 md:py-12 rounded-full bg-gradient-to-b from-red-600 to-rose-600 text-white font-extrabold text-2xl shadow-[0_30px_80px_rgba(220,38,38,0.25)] hover:scale-[1.01] transition-transform">
        <div className="flex items-center justify-center gap-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M12 21V3" />
            <circle cx="12" cy="7" r="2" strokeWidth="1.6" />
          </svg>
          SOS
        </div>
      </button>

      {/* small floating version for bottom-right */}
      <button aria-label="quick-sos" className="fixed right-6 bottom-6 w-14 h-14 rounded-full bg-rose-500/90 flex items-center justify-center shadow-lg ring-2 ring-rose-400/30">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M12 2v20" />
          <circle cx="12" cy="7" r="2" strokeWidth="1.6" />
        </svg>
      </button>
    </section>
  );
}
