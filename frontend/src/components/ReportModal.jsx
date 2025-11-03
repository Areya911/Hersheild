// src/components/ReportModal.jsx
import React, { useState } from "react";

export default function ReportModal({ open, onClose, coords, onSubmit }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [risk, setRisk] = useState("high");
  const [anon, setAnon] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        lat: coords.lat,
        lng: coords.lng,
        title: title || "Incident",
        description: desc,
        risk,
        radiusMeters: risk === "high" ? 1000 : risk === "medium" ? 1500 : 3000,
        file,
        anonymous: anon,
      });
      // reset fields after success
      setTitle("");
      setDesc("");
      setFile(null);
      setRisk("high");
      setAnon(true);
      onClose();
    } catch (err) {
      console.error("Failed to submit report:", err);
      alert("Failed to submit. See console.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 max-w-xl w-full bg-slate-900 border border-slate-700 rounded-lg p-6 shadow-lg"
      >
        <h3 className="text-lg font-semibold mb-2">Report Incident</h3>

        <div className="text-sm text-muted mb-3">
          Drop location: <strong>{coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</strong>
        </div>

        <label className="block mb-2">
          <div className="text-sm">Category</div>
          <select value={risk} onChange={(e) => setRisk(e.target.value)} className="mt-1 w-full p-2 bg-slate-800 border border-slate-700 rounded">
            <option value="high">Harassment / Dangerous (High)</option>
            <option value="medium">Crowded / Suspicious (Medium)</option>
            <option value="low">Streetlight / Minor (Low)</option>
          </select>
        </label>

        <label className="block mb-2">
          <div className="text-sm">Title</div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Short title" className="mt-1 w-full p-2 bg-slate-800 border border-slate-700 rounded" />
        </label>

        <label className="block mb-2">
          <div className="text-sm">Description (optional)</div>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} className="mt-1 w-full p-2 bg-slate-800 border border-slate-700 rounded" placeholder="What happened?"></textarea>
        </label>

        <label className="block mb-3">
          <div className="text-sm">Photo (optional)</div>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0] || null)} className="mt-1 w-full" />
        </label>

        <label className="flex items-center gap-2 mb-4 text-sm">
          <input type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)} />
          Post anonymously
        </label>

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-transparent border border-slate-700">Cancel</button>
          <button type="submit" disabled={submitting} className="px-4 py-2 rounded bg-rose-500 text-white">
            {submitting ? "Sending..." : "Submit Report"}
          </button>
        </div>
      </form>
    </div>
  );
}
