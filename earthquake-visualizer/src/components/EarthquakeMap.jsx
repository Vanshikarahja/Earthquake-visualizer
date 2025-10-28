// src/components/EarthquakeMap.jsx
import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS

// Function to determine marker style based on magnitude
const getMarkerStyle = (mag) => {
  let color;
  if (mag >= 6.0) color = 'darkred';
  else if (mag >= 5.0) color = 'red';
  else if (mag >= 4.0) color = 'orange';
  else if (mag >= 3.0) color = 'gold';
  else color = 'yellowgreen';

  // Radius proportional to magnitude (scaled for visibility)
  const radius = Math.max(4, mag * 2.5);

  return { radius, color, fillColor: color, weight: 1, opacity: 0.8, fillOpacity: 0.5 };
};

const EarthquakeMap = ({ earthquakes }) => {
  const center = [20, 0]; // Default center (near equator, 0 meridian)
  const zoom = 2; // Default zoom level

  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className="h-full w-full">
      {/* Tile Layer (The actual map skin) */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Render Markers for each earthquake */}
      {earthquakes.map((feature) => {
        const { mag, place, time, url } = feature.properties;
        const [longitude, latitude] = feature.geometry.coordinates;

        // Leaflet requires latitude first, then longitude
        const position = [latitude, longitude];
        const markerStyle = getMarkerStyle(mag);

        return (
          <CircleMarker
            key={feature.id}
            center={position}
            radius={markerStyle.radius}
            pathOptions={{ color: markerStyle.color, fillColor: markerStyle.fillColor, fillOpacity: markerStyle.fillOpacity }}
          >
            {/* Popup content */}
            <Popup>
              <div className="font-sans">
                <strong className="text-base text-gray-800">{place}</strong><br/>
                Magnitude: <span className="font-bold" style={{ color: markerStyle.color }}>M{mag.toFixed(1)}</span><br/>
                Time: {new Date(time).toLocaleString()}<br/>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 text-sm">
                  View Details
                </a>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
};

export default EarthquakeMap;