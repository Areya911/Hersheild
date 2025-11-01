import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 mt-6">
      <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-slate-500">
        © {new Date().getFullYear()} HerShield — Community Safety Prototype
      </div>
    </footer>
  );
}
