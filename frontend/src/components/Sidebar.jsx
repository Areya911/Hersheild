import React from "react";

const NavItem = ({ children }) => (
  <li className="py-2 px-3 rounded-md hover:bg-slate-800/40 cursor-pointer">
    {children}
  </li>
);

export default function Sidebar() {
  return (
    <aside className="w-72 hidden lg:block border-r border-slate-800 bg-transparent">
      <div className="h-full overflow-auto">
        <div className="px-6 py-6">
          <div className="text-slate-400 text-sm mb-3">Quick Actions</div>

          <div className="space-y-3">
            <button className="w-full btn-primary sos-pulse">Quick SOS</button>
            <button className="btn-outline w-full mt-2">Report Incident</button>
          </div>
        </div>

        <nav className="px-4 mt-6">
          <ul className="space-y-1 text-slate-300">
            <NavItem>Dashboard</NavItem>
            <NavItem>Live Alerts</NavItem>
            <NavItem>Heatmap</NavItem>
            <NavItem>Trusted Contacts</NavItem>
            <NavItem>Settings</NavItem>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
