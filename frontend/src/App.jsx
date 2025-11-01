import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import BigSOS from "./components/BigSOS";
import ActionTiles from "./components/ActionTiles";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-[#0f1720] text-slate-200 antialiased">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6">
        <Hero />
        <BigSOS />
        <ActionTiles />
      </main>
      <Footer />
    </div>
  );
}
