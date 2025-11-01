import React from "react";

export default function ActionTiles() {
  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 mt-10">
      <a id="report" className="group block w-[min(42rem,45%)] rounded-xl p-6 bg-slate-700/30 backdrop-blur-md shadow-md hover:scale-[1.01] transition-transform" href="#">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-md bg-rose-700/10 flex items-center justify-center text-rose-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M7 10l5 5 5-5"/>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Report Incident</h3>
            <p className="text-slate-400 text-sm">Drop a pin, add details, and optionally stay anonymous.</p>
          </div>
        </div>
      </a>

      <a id="alerts" className="group block w-[min(42rem,45%)] rounded-xl p-6 bg-slate-700/30 backdrop-blur-md shadow-md hover:scale-[1.01] transition-transform" href="#">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-md bg-sky-800/10 flex items-center justify-center text-sky-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M12 3v9"/>
              <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Alerts</h3>
            <p className="text-slate-400 text-sm">View local safety alerts and community reports in real time.</p>
          </div>
        </div>
      </a>
    </div>
  );
}
