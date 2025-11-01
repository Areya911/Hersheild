import React from "react";

export default function Footer() {
  return (
    <footer className="max-w-6xl mx-auto px-6 py-10 text-center text-slate-500 text-sm">
      © {new Date().getFullYear()} HerShield — community safety network
    </footer>
  );
}
