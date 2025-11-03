// src/components/GoogleMapView.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Circle,
  InfoWindow,
} from "@react-google-maps/api";

import ReportModal from "./ReportModal";
import { reportIncident } from "../utils/reportIncident";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

/* small helper: haversine distance (meters) */
function haversine([lat1, lon1], [lat2, lon2]) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const containerStyle = {
  width: "100%",
  height: "420px",
  borderRadius: "12px",
};

const defaultCenter = { lat: 12.9716, lng: 77.5946 };

export default function GoogleMapView() {
  const googleKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: googleKey,
  });

  const [userPos, setUserPos] = useState(null); // {lat,lng}
  const [incidents, setIncidents] = useState([]); // live from Firestore
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCoords, setModalCoords] = useState(defaultCenter);
  const [nearbyHits, setNearbyHits] = useState([]);

  // get current location (once)
  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {},
      { enableHighAccuracy: true, timeout: 7000 }
    );
  }, []);

  // realtime listener for incidents collection
  useEffect(() => {
    const q = query(collection(db, "incidents"), orderBy("ts", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => {
        const data = d.data();
        // keep numeric lat/lng if Firestore stored as numbers
        return {
          id: d.id,
          lat: Number(data.lat),
          lng: Number(data.lng),
          title: data.title,
          desc: data.description || "",
          risk: data.risk || "high",
          radius: Number(data.radiusMeters || 1000),
          photoUrl: data.photoUrl || null,
          ts: data.ts || null,
        };
      });
      setIncidents(arr);
    });
    return () => unsub();
  }, []);

  // whenever userPos or incidents change, compute which incidents affect user
  useEffect(() => {
    if (!userPos || incidents.length === 0) {
      setNearbyHits([]);
      return;
    }
    const hits = incidents
      .map((inc) => {
        const d = haversine([userPos.lat, userPos.lng], [inc.lat, inc.lng]);
        return { ...inc, distance: d };
      })
      .filter((i) => i.distance <= i.radius)
      .sort((a, b) => a.distance - b.distance);
    setNearbyHits(hits);
  }, [userPos, incidents]);

  // map click handler => open report modal with clicked coords
  const handleMapClick = useCallback((e) => {
    // for google maps click event, latLng available
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setModalCoords({ lat, lng });
    setModalOpen(true);
  }, []);

  if (!isLoaded) return <div className="text-center py-8">Loading map…</div>;

  // color map
  const riskColor = {
    high: "#f43f5e",
    medium: "#f59e0b",
    low: "#38bdf8",
  };

  // Danger banner if nearby hits exist
  function DangerBanner({ hits }) {
    if (!hits || hits.length === 0) return null;
    const top = hits[0];
    const label = top.risk === "high" ? "EMERGENCY" : top.risk === "medium" ? "CAUTION" : "NOTICE";
    return (
      <div className="absolute left-1/2 -translate-x-1/2 top-4 z-40">
        <div
          className={`px-4 py-2 rounded-full text-sm font-semibold`}
          style={{
            background: top.risk === "high" ? "rgba(244,63,94,0.95)" : top.risk === "medium" ? "rgba(245,158,11,0.95)" : "rgba(56,189,248,0.95)",
            color: "#fff",
          }}
        >
          {label}: {top.title} — {Math.round(top.distance)} m away
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <DangerBanner hits={nearbyHits} />

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userPos || defaultCenter}
        zoom={13}
        onClick={handleMapClick}
      >
        {/* user marker */}
        {userPos && (
          <Marker
            position={userPos}
            icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            onClick={() => {
              setSelected({
                position: userPos,
                title: "You are here",
                desc: `${userPos.lat.toFixed(5)}, ${userPos.lng.toFixed(5)}`,
              });
            }}
          />
        )}

        {/* incidents from Firestore */}
        {incidents.map((inc) => {
          const pos = { lat: inc.lat, lng: inc.lng };
          return (
            <React.Fragment key={inc.id}>
              <Circle
                center={pos}
                radius={inc.radius}
                options={{
                  strokeColor: riskColor[inc.risk] || riskColor.high,
                  fillColor: riskColor[inc.risk] || riskColor.high,
                  fillOpacity: inc.risk === "high" ? 0.18 : inc.risk === "medium" ? 0.12 : 0.06,
                  strokeOpacity: 0.9,
                  strokeWeight: 1,
                }}
              />
              <Marker
                position={pos}
                onClick={() =>
                  setSelected({
                    id: inc.id,
                    position: pos,
                    title: inc.title,
                    desc: inc.desc,
                    photoUrl: inc.photoUrl,
                    risk: inc.risk,
                    radius: inc.radius,
                  })
                }
                icon={{
                  url:
                    inc.risk === "high"
                      ? "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                      : inc.risk === "medium"
                      ? "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
                      : "http://maps.google.com/mapfiles/ms/icons/ltblue-dot.png",
                }}
              />
            </React.Fragment>
          );
        })}

        {/* InfoWindow for selected */}
        {selected && selected.position && (
          <InfoWindow
            position={selected.position}
            onCloseClick={() => setSelected(null)}
          >
            <div style={{ minWidth: 180 }}>
              <div style={{ fontWeight: 700 }}>{selected.title}</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>{selected.desc}</div>
              {selected.photoUrl && (
                <img src={selected.photoUrl} alt="photo" style={{ width: "100%", marginTop: 8, borderRadius: 6 }} />
              )}
              {selected.risk && (
                <div style={{ fontSize: 12, marginTop: 6, color: "#cbd5e1" }}>Risk: {selected.risk}</div>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Report modal */}
      <ReportModal
        open={modalOpen}
        coords={modalCoords}
        onClose={() => setModalOpen(false)}
        onSubmit={async (data) => {
          // call the report helper which uploads image to ImgBB then creates Firestore doc
          try {
            await reportIncident(data);
            setModalOpen(false);
            // tiny UX feedback
            window.alert("Report submitted — thank you!");
          } catch (err) {
            console.error("report submit error:", err);
            window.alert("Failed to submit report. See console.");
          }
        }}
      />
    </div>
  );
}
