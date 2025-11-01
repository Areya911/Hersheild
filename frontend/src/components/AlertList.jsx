import React from "react";

const AlertItem = ({ title, when, detail }) => (
  <div className="p-3 rounded-md hover:bg-slate-800/30 cursor-pointer">
    <div className="flex items-start justify-between">
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-slate-400">{detail}</div>
      </div>
      <div className="text-xs text-slate-500">{when}</div>
    </div>
  </div>
);

export default function AlertList() {
  // placeholder data — later load from API
  const alerts = [
    { title: "Suspicious Activity", when: "2m ago", detail: "Reported near Central Park" },
    { title: "Harassment Report", when: "15m ago", detail: "User reported incident on Baker St." },
    { title: "Crowded Area", when: "50m ago", detail: "Possible unsafe crowd near station" },
  ];

  return (
    <div className="space-y-2">
      {alerts.map((a, i) => <AlertItem key={i} {...a} />)}
      <div className="text-center text-sm text-slate-400 mt-4">End of feed</div>
    </div>
  );
}
