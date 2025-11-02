// src/App.jsx
import React, { useState } from "react";
import GoogleMapView from "./components/GoogleMapView";

export default function App() {
  const [toast, setToast] = useState({ msg: "", kind: "" }); // kind: success | error | info
  const [sending, setSending] = useState(false);

  // small helper to show toasts
  function showToast(msg, kind = "info", ms = 4000) {
    setToast({ msg, kind });
    setTimeout(() => setToast({ msg: "", kind: "" }), ms);
  }

  // Try to get current position with a timeout; returns {lat,lng} or null
  function getCurrentPositionPromise(timeoutMs = 7000) {
    return new Promise((resolve) => {
      if (!("geolocation" in navigator)) return resolve(null);
      let resolved = false;
      const onSuccess = (pos) => {
        if (resolved) return;
        resolved = true;
        resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      };
      const onError = () => {
        if (resolved) return;
        resolved = true;
        resolve(null);
      };
      navigator.geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 0 });
      // safety timeout
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          resolve(null);
        }
      }, timeoutMs + 500);
    });
  }

  // main SOS handler
  async function handleSOS() {
    const confirmSOS = window.confirm("Are you sure you want to send an SOS? This will alert nearby users.");
    if (!confirmSOS) return;

    setSending(true);
    showToast("Sending SOS...", "info");

    // get user coords, fall back to default center
    const fallback = { lat: 12.9716, lng: 77.5946 };
    let coords = await getCurrentPositionPromise(7000);
    if (!coords) coords = fallback;

    const payload = {
      lat: coords.lat,
      lng: coords.lng,
      title: "SOS - Immediate Help",
      description: "User triggered SOS",
      risk: "high",
      radiusMeters: 1000,
    };

    try {
      // Attempt to call server API
      const res = await fetch("http://localhost:4000/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // fallback: try the window helper if available
        if (window.createLocalIncidentFromUI) {
          await window.createLocalIncidentFromUI(payload);
          showToast("SOS sent locally (frontend).", "success");
        } else {
          throw new Error("Server returned error");
        }
      } else {
        const json = await res.json();
        // ensure frontend state is updated quickly if helper exists
        if (window.createLocalIncidentFromUI) {
          try { await window.createLocalIncidentFromUI(payload); } catch(e){ /* ignore */ }
        }
        showToast("SOS sent successfully.", "success");
      }

      // ask notification permission & show brief notification
      if ("Notification" in window) {
        if (Notification.permission === "default") await Notification.requestPermission();
        if (Notification.permission === "granted") {
          new Notification("HerShield — SOS sent", { body: "Your SOS has been shared with nearby users and trusted contacts." });
        }
      }
    } catch (err) {
      console.error("SOS failed:", err);
      showToast("Failed to send SOS. Try again.", "error");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="header-bar">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md border border-rose-400 flex items-center justify-center text-rose-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 2l7 3v5c0 5-3 9-7 11-4-2-7-6-7-11V5l7-3z"
                />
              </svg>
            </div>
            <div className="font-semibold text-lg tracking-wide">HerShield</div>
          </div>

          <div className="hidden md:flex gap-6 text-sm text-muted">
            <a href="#" className="hover:text-white">
              Home
            </a>
            <a href="#" className="hover:text-white">
              Reports
            </a>
            <a href="#" className="hover:text-white">
              Heatmap
            </a>
            <a href="#" className="hover:text-white">
              Settings
            </a>
          </div>

          <div className="md:hidden">
            <button className="px-3 py-2 bg-slate-800/40 rounded-md">Menu</button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 text-center">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
              Stay Safe. Stay Connected.
            </h1>
            <p className="text-muted max-w-2xl mx-auto mb-8">
              HerShield empowers women to report unsafe incidents, alert others,
              and find safer routes in real time — powered by community trust.
            </p>

            <button
              onClick={handleSOS}
              className="sos-pulse px-8 py-3 rounded-full shadow-lg text-lg"
              disabled={sending}
              aria-busy={sending}
              title="Send SOS"
            >
              {sending ? "Sending..." : "SOS"}
            </button>
            <p className="text-muted mt-3 text-sm">
              Tap SOS to alert nearby users & trusted contacts.
            </p>
          </div>
        </section>

        {/* Dashboard Section */}
        <section className="container pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Map */}
            <div className="lg:col-span-2">
              <div className="card mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Live Map</h2>
                  <span className="text-sm text-muted">
                    Auto-updating • Nearby reports
                  </span>
                </div>

               <GoogleMapView />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                  <div className="card text-center border-l-4 border-rose-500">
                    <p className="text-sm text-muted">Reports Today</p>
                    <p className="text-3xl font-bold mt-2 text-rose-400">8</p>
                  </div>
                  <div className="card text-center border-l-4 border-sky-500">
                    <p className="text-sm text-muted">Active Alerts</p>
                    <p className="text-3xl font-bold mt-2 text-sky-400">3</p>
                  </div>
                  <div className="card text-center border-l-4 border-amber-400">
                    <p className="text-sm text-muted">Trusted Contacts</p>
                    <p className="text-3xl font-bold mt-2 text-amber-400">24</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div>
              <div className="card mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Recent Alerts</h3>
                  <span className="text-sm text-muted">Sorted by newest</span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="p-2 rounded-md alert-item">
                    <div className="font-semibold text-rose-400">
                      Suspicious Activity
                    </div>
                    <div className="text-muted text-xs">
                      2m ago • Near Central Park
                    </div>
                  </div>
                  <div className="p-2 rounded-md alert-item">
                    <div className="font-semibold text-sky-400">
                      Harassment Report
                    </div>
                    <div className="text-muted text-xs">
                      15m ago • Baker St.
                    </div>
                  </div>
                  <div className="p-2 rounded-md alert-item">
                    <div className="font-semibold text-amber-400">
                      Crowded Area
                    </div>
                    <div className="text-muted text-xs">
                      50m ago • Near station
                    </div>
                  </div>
                  <div className="text-center text-muted text-sm mt-3">
                    End of feed
                  </div>
                </div>
              </div>

              <div className="card text-center">
                <p className="text-muted text-sm mb-3">Quick Actions</p>
                <div className="flex flex-col gap-3">
                  <button className="btn-primary px-4 py-2">Quick SOS</button>
                  <button className="btn-outline px-4 py-2">
                    Report Incident
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer-bar text-center py-4 text-sm">
        © {new Date().getFullYear()} HerShield — Community Safety Prototype
      </footer>

      {/* toast */}
      {toast.msg && (
        <div
          role="status"
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full text-sm font-medium ${
            toast.kind === "success" ? "bg-emerald-600/90 text-white" :
            toast.kind === "error" ? "bg-red-600/90 text-white" :
            "bg-slate-700/90 text-white"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
