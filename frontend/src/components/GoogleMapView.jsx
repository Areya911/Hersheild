// src/components/GoogleMapView.jsx
import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Circle,
  InfoWindow,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "12px",
};

const defaultCenter = { lat: 12.9716, lng: 77.5946 };

const incidents = [
  {
    id: 1,
    position: { lat: 12.9716, lng: 77.5946 },
    title: "Harassment Report",
    desc: "Reported on Baker St.",
    risk: "high",
    radius: 800,
  },
  {
    id: 2,
    position: { lat: 12.9595, lng: 77.5906 },
    title: "Crowded Area",
    desc: "Unsafe crowd near station",
    risk: "medium",
    radius: 1400,
  },
  {
    id: 3,
    position: { lat: 12.975, lng: 77.580 },
    title: "Suspicious Activity",
    desc: "Reported near Central Park",
    risk: "low",
    radius: 3500,
  },
];

export default function GoogleMapView() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDxIBa1jraQa8ZLYsCEfnCawtgEaUKKHAQ", // ← add it here
  });

  const [selected, setSelected] = useState(null);
  const [userPos, setUserPos] = useState(null);

  // Get user's current location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  if (!isLoaded) return <div>Loading Map...</div>;

  // Color codes by risk
  const riskColor = {
    high: "#f43f5e",
    medium: "#f59e0b",
    low: "#38bdf8",
  };

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={userPos || defaultCenter} zoom={13}>
      {userPos && (
        <Marker position={userPos} icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" />
      )}

      {incidents.map((inc) => (
        <React.Fragment key={inc.id}>
          <Circle
            center={inc.position}
            radius={inc.radius}
            options={{
              strokeColor: riskColor[inc.risk],
              fillColor: riskColor[inc.risk],
              fillOpacity: 0.2,
            }}
          />
          <Marker
            position={inc.position}
            onClick={() => setSelected(inc)}
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
      ))}

      {selected && (
        <InfoWindow
          position={selected.position}
          onCloseClick={() => setSelected(null)}
        >
          <div>
            <h3 className="font-bold">{selected.title}</h3>
            <p>{selected.desc}</p>
            <p>Risk: {selected.risk}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
