import React from "react";
import SOSButton from "./SOSButton";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-24 px-6 bg-gradient-to-b from-slate-900 to-slate-950">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
        Stay Safe. Stay Connected.
      </h1>
      <p className="text-slate-400 max-w-2xl mb-8 text-lg">
        HerShield empowers women to report unsafe incidents, alert others, and find safer routes in real time — powered by community trust.
      </p>

      <SOSButton onClick={() => alert("SOS Alert Sent 🚨")} />

      <p className="text-slate-500 mt-6 text-sm">
        Tap SOS to alert nearby users & trusted contacts.
      </p>
    </section>
  );
}
