import React from "react";
import MapPlaceholder from "./MapPlaceholder";
import AlertList from "./AlertList";

export default function Dashboard() {
  return (
    <div className="section">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main map (spans two columns on lg) */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Live Map</h2>
              <div className="text-sm text-slate-400">Auto-updating • Nearby reports</div>
            </div>

            <MapPlaceholder />
          </div>
        </div>

        {/* Alerts / feed */}
        <div>
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Alerts</h3>
              <div className="text-sm text-slate-400">Sorted by newest</div>
            </div>

            <AlertList />
          </div>
        </div>
      </div>

      {/* small stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="card">
          <div className="text-sm text-slate-400">Reports Today</div>
          <div className="text-2xl font-bold mt-2">8</div>
        </div>

        <div className="card">
          <div className="text-sm text-slate-400">Active Alerts</div>
          <div className="text-2xl font-bold mt-2">3</div>
        </div>

        <div className="card">
          <div className="text-sm text-slate-400">Trusted Contacts</div>
          <div className="text-2xl font-bold mt-2">24</div>
        </div>
      </div>
    </div>
  );
}

