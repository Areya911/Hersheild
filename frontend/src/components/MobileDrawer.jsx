import React, { useEffect, useRef } from "react";

export default function MobileDrawer({ open, onClose, onSOS }) {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      closeBtnRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && open) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex" aria-hidden={!open} role="dialog" aria-modal="true">
      {/* backdrop */}
      <button onClick={onClose} aria-label="Close menu" className="absolute inset-0 bg-black/50 transition-opacity" />

      <aside
        className="relative ml-auto w-[86%] max-w-xs bg-[#0b1115] text-slate-100 shadow-2xl transform transition-transform duration-300 ease-in-out translate-x-0"
        style={{ borderLeft: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="p-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md border border-rose-400/50 flex items-center justify-center text-rose-400 bg-white/3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 2l7 3v5c0 5-3 9-7 11-4-2-7-6-7-11V5l7-3z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold">HerShield</h2>
          </div>

          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="p-2 rounded-md bg-white/5 hover:bg-white/8 focus:outline-none focus:ring-2 focus:ring-rose-400"
            aria-label="Close menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>

        <nav className="p-4">
          <ul className="flex flex-col gap-3">
            <li><a onClick={onClose} href="#" className="block px-3 py-2 rounded-md hover:bg-white/3">Home</a></li>
            <li><a onClick={onClose} href="#" className="block px-3 py-2 rounded-md hover:bg-white/3">Reports</a></li>
            <li><a onClick={onClose} href="#" className="block px-3 py-2 rounded-md hover:bg-white/3">Heatmap</a></li>
            <li><a onClick={onClose} href="#" className="block px-3 py-2 rounded-md hover:bg-white/3">Settings</a></li>
          </ul>

          <div className="mt-6">
            <button
              onClick={() => { if (onClose) onClose(); if (onSOS) onSOS(); }}
              className="w-full sos-pulse px-4 py-2 rounded-md font-semibold flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M12 2v20" />
                <circle cx="12" cy="7" r="2" strokeWidth="1.6" />
              </svg>
              SOS
            </button>
          </div>

          <div className="mt-6 border-t border-white/5 pt-4">
            <a href="/login" onClick={onClose} className="w-full inline-flex items-center gap-3 px-3 py-2 rounded-md bg-white/5 hover:bg-white/6">
              <div className="w-9 h-9 rounded-full bg-white/90 text-[#0f1720] flex items-center justify-center font-semibold">U</div>
              <div className="text-left">
                <div className="text-sm font-semibold">Log in</div>
                <div className="text-xs text-slate-400">Access your account</div>
              </div>
            </a>

            <a href="/signup" onClick={onClose} className="mt-3 block w-full text-center px-3 py-2 rounded-md border border-white/6 text-slate-200 hover:bg-white/3">
              Create an account
            </a>
          </div>
        </nav>
      </aside>
    </div>
  );
}
