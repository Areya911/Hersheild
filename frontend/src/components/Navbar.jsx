import React from "react";

export default function Navbar() {
  return (
    <header className="w-full">
      <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md border border-rose-400 flex items-center justify-center text-rose-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 2l7 3v5c0 5-3 9-7 11-4-2-7-6-7-11V5l7-3z" />
            </svg>
          </div>
          <div className="font-semibold text-lg select-none">HerShield</div>
        </div>

        <ul className="hidden md:flex items-center gap-6 list-none text-slate-300">
          <li><a className="px-3 py-2 rounded-md bg-slate-700/30 shadow-sm" href="#">Home</a></li>
          <li><a className="hover:text-white" href="#">Report</a></li>
          <li><a className="hover:text-white" href="#">Alerts</a></li>
          <li><a className="hover:text-white" href="#">Heatmap</a></li>
          <li><a className="hover:text-white" href="#">Settings</a></li>
        </ul>

        <div className="flex items-center gap-3">
          <button className="md:hidden px-3 py-2 rounded-md bg-slate-800/40">Menu</button>
          <button className="hidden md:inline-block bg-rose-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-rose-600 transition">
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}
