import React from "react";

export default function MapPlaceholder() {
  return (
    <div className="w-full h-80 md:h-96 rounded-xl overflow-hidden bg-slate-900/40 flex items-center justify-center text-slate-500">
      {/* Replace with a real map (Leaflet / Google Maps) later */}
      <div className="text-center">
        <div className="text-2xl font-semibold">Map will appear here</div>
        <div className="text-slate-400 mt-2">Use Google Maps / Leaflet for an interactive map</div>
      </div>
    </div>
  );
}
