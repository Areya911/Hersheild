import React from "react";

export default function Hero() {
  return (
    <section className="bg-slate-800/40 rounded-xl p-8 shadow-[0_10px_30px_rgba(2,6,23,0.7)] mt-6">
      <div className="flex flex-col items-center text-center gap-3">
        <div className="w-12 h-12 rounded-md border border-rose-400 flex items-center justify-center text-rose-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M12 2l7 3v5c0 5-3 9-7 11-4-2-7-6-7-11V5l7-3z"/>
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Welcome to HerShield</h1>
        <p className="text-slate-400 max-w-2xl">
          Your safety is our priority. Report incidents or use the SOS button instantly to alert nearby trusted contacts and communities.
        </p>
      </div>
    </section>
  );
}
