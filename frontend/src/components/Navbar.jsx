import React, { useState, useRef, useEffect } from "react";
import MobileDrawer from "./MobileDrawer";

/**
 * Clean, theme-consistent Navbar.
 * Props:
 * - profilePhoto: url (optional)
 * - user: firebase user object (optional)
 * - onAvatarClick: function
 * - onSOS: function
 */
export default function Navbar({ profilePhoto, user, onAvatarClick, onSOS }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const authRef = useRef(null);

  // click outside to close small auth menu
  useEffect(() => {
    function onDocClick(e) {
      if (!authRef.current) return;
      if (!authRef.current.contains(e.target)) setAuthOpen(false);
    }
    window.addEventListener("click", onDocClick);
    return () => window.removeEventListener("click", onDocClick);
  }, []);

  // explicit inline gradient to defeat any global button overrides
  const menuButtonStyle = {
    background: "linear-gradient(90deg, #f43f5e, #c7bce1ff 50%, #38bdf8)",
    color: "#fff",
  };

  return (
    <>
      <header className="w-full header-bar border-b border-slate-800/30">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

          {/* LEFT: Logo + Title */}
          <a
            href="/"
            className="flex items-center gap-3"
            style={{ textDecoration: "none" }}
          >
            <div className="w-10 h-10 rounded-md border border-rose-400/45 flex items-center justify-center text-rose-400 bg-white/3 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 2l7 3v5c0 5-3 9-7 11-4-2-7-6-7-11V5l7-3z" />
              </svg>
            </div>

            <h1 className="text-lg md:text-xl font-semibold tracking-tight gradient-heading m-0">
              HerShield
            </h1>
          </a>

          {/* CENTER (desktop) nav — hidden on mobile */}
          <nav className="hidden md:flex gap-6 text-slate-300">
            <a className="hover:text-white transition-colors" href="#">Home</a>
            <a className="hover:text-white transition-colors" href="#">Reports</a>
            <a className="hover:text-white transition-colors" href="#">Heatmap</a>
            <a className="hover:text-white transition-colors" href="#">Settings</a>
          </nav>

          {/* RIGHT: SOS / Menu / Avatar */}
          <div className="flex items-center gap-3">

            {/* SOS (desktop) */}
            <button
              onClick={() => onSOS && onSOS()}
              className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-md font-semibold sos-pulse"
              title="Send SOS"
              aria-label="SOS"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M12 2v20" />
                <circle cx="12" cy="7" r="2" strokeWidth="1.6" />
              </svg>
              SOS
            </button>

            {/* MOBILE: Big gradient Menu button */}
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              className="md:hidden flex items-center gap-2 px-5 py-2.5 rounded-full shadow-[0_6px_24px_rgba(0,0,0,0.45)] transition-all duration-200"
              style={{
                ...menuButtonStyle,
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="text-sm font-semibold">Menu</span>
            </button>

            {/* Avatar */}
            <div className="relative" ref={authRef}>
              <button
                onClick={() => {
                  if (onAvatarClick) onAvatarClick();
                  setAuthOpen((s) => !s);
                }}
                title="Account"
                aria-haspopup="true"
                aria-expanded={authOpen}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-white/40 to-white/10 border border-white/20 shadow-[0_0_12px_rgba(255,255,255,0.12)] backdrop-blur-md flex items-center justify-center transition-all hover:scale-[1.05]"
              >
                {profilePhoto ? (
                  <img src={profilePhoto} alt="avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-[#0f1720] font-semibold">{(user && user.email && user.email[0]) ? user.email[0].toUpperCase() : "U"}</span>
                )}
              </button>

              {/* small dropdown */}
              {authOpen && (
                <div className="auth-dropdown absolute right-0 mt-3 w-48 bg-[#0b1115]/95 border border-white/10 rounded-xl shadow-xl backdrop-blur-md py-2 z-30">
                  <a href="/login" className="block px-4 py-2 text-sm text-slate-200 hover:bg-white/10 rounded-md">Log in</a>
                  <a href="/signup" className="block px-4 py-2 text-sm text-slate-200 hover:bg-white/10 rounded-md">Sign up</a>
                  <div className="my-2 border-t border-white/10"></div>
                  <a href="/profile" className="block px-4 py-2 text-sm text-slate-400 hover:bg-white/10 rounded-md">Profile</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Drawer for mobile */}
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onSOS={() => onSOS && onSOS()} />
    </>
  );
}
