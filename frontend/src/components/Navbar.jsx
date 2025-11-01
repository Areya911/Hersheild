import React from "react";

export default function Navbar() {
  return (
    <header className="w-full border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md border border-rose-400 flex items-center justify-center text-rose-400">
            {/* shield icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 2l7 3v5c0 5-3 9-7 11-4-2-7-6-7-11V5l7-3z" />
            </svg>
          </div>
          <div className="text-xl font-semibold select-none">HerShield</div>
        </div>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-6 text-slate-300">
            <a className="hover:text-white" href="#">Home</a>
            <a className="hover:text-white" href="#">Reports</a>
            <a className="hover:text-white" href="#">Heatmap</a>
            <a className="hover:text-white" href="#">Settings</a>
          </nav>

          <button className="hidden md:inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 px-3 py-2 rounded-md text-white font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M12 2v20" />
              <circle cx="12" cy="7" r="2" strokeWidth="1.6" />
            </svg>
            SOS
          </button>

          <button className="md:hidden px-3 py-2 rounded-md bg-slate-800/40">Menu</button>
        </div>
      </div>
    </header>
  );
}
