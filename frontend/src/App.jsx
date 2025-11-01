import React from "react";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="header-bar">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md border border-rose-400 flex items-center justify-center text-rose-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" d="M12 2l7 3v5c0 5-3 9-7 11-4-2-7-6-7-11V5l7-3z" />
              </svg>
            </div>
            <div className="font-semibold text-lg tracking-wide">HerShield</div>
          </div>

          <div className="hidden md:flex gap-6 text-sm text-muted">
            <a href="#" className="hover:text-white">Home</a>
            <a href="#" className="hover:text-white">Reports</a>
            <a href="#" className="hover:text-white">Heatmap</a>
            <a href="#" className="hover:text-white">Settings</a>
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

            <button className="sos-pulse px-8 py-3 rounded-full shadow-lg text-lg">
              SOS
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
                  <span className="text-sm text-muted">Auto-updating • Nearby reports</span>
                </div>
                <div className="h-72 md:h-96 rounded-lg bg-slate-900/30 flex items-center justify-center text-muted">
                  Map will appear here — integrate Google Maps / Leaflet later
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

            {/* Alerts */}
            <div>
              <div className="card mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Recent Alerts</h3>
                  <span className="text-sm text-muted">Sorted by newest</span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="p-2 rounded-md alert-item">
                    <div className="font-semibold text-rose-400">Suspicious Activity</div>
                    <div className="text-muted text-xs">2m ago • Near Central Park</div>
                  </div>
                  <div className="p-2 rounded-md alert-item">
                    <div className="font-semibold text-sky-400">Harassment Report</div>
                    <div className="text-muted text-xs">15m ago • Baker St.</div>
                  </div>
                  <div className="p-2 rounded-md alert-item">
                    <div className="font-semibold text-amber-400">Crowded Area</div>
                    <div className="text-muted text-xs">50m ago • Near station</div>
                  </div>
                  <div className="text-center text-muted text-sm mt-3">End of feed</div>
                </div>
              </div>

              <div className="card text-center">
                <p className="text-muted text-sm mb-3">Quick Actions</p>
                <div className="flex flex-col gap-3">
                  <button className="btn-primary px-4 py-2">Quick SOS</button>
                  <button className="btn-outline px-4 py-2">Report Incident</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer-bar text-center py-4 text-sm">
        © {new Date().getFullYear()} HerShield — Community Safety Prototype
      </footer>
    </div>
  );
}
