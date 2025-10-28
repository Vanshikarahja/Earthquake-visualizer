// src/App.jsx
import React, { useState, useEffect, useMemo } from 'react';
import EarthquakeMap from './components/EarthquakeMap';
import EarthquakeList from './components/EarthquakeList';

// Helper function to format time (optional, but good practice)
const formatTime = (time) => {
  return new Date(time).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const USGS_API_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

function App() {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [minMagnitude, setMinMagnitude] = useState(2.5); // Initial filter

  // Step 5(a): Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(USGS_API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEarthquakes(data.features);
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(`Error fetching data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Step 5(b): Filter Logic
  const filteredEarthquakes = useMemo(() => {
    return earthquakes.filter(eq => eq.properties.mag >= minMagnitude);
  }, [earthquakes, minMagnitude]);

  // Step 8: Compute Insights (Strongest Quake)
  const strongestQuake = useMemo(() => {
    return earthquakes.reduce((max, current) => {
      return (current.properties.mag > max.properties.mag) ? current : max;
    }, { properties: { mag: 0 } }); // Start with a dummy quake of mag 0
  }, [earthquakes]);

  const totalQuakes = earthquakes.length;

  // Step 7: Handle Loading & Errors
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-xl font-semibold text-blue-600">Loading real-time earthquake data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-100">
        <p className="text-xl text-red-700 font-medium">🚨 {error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar (Step 6) */}
      <aside className="w-80 p-4 bg-white shadow-xl flex flex-col overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-2">
          Global Quakes 🌍
        </h1>

        {/* Insights Panel */}
        <div className="bg-blue-50 p-3 rounded-lg mb-4 shadow-inner">
          <p className="text-lg font-semibold text-blue-800">
            🌋 **{totalQuakes}** quakes detected in the past 24h.
          </p>
          {strongestQuake.properties.mag > 0 && (
            <p className="text-sm mt-1 text-blue-700">
              **Strongest:** M{strongestQuake.properties.mag.toFixed(1)} in {strongestQuake.properties.place}
            </p>
          )}
        </div>

        {/* Magnitude Filter */}
        <div className="mb-4 p-3 border rounded-lg">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Minimum Magnitude: **M{minMagnitude.toFixed(1)}**
          </label>
          <input
            type="range"
            min="0.0"
            max="6.0"
            step="0.1"
            value={minMagnitude}
            onChange={(e) => setMinMagnitude(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-xs text-gray-500 mt-1">
            Showing **{filteredEarthquakes.length}** of {totalQuakes} events.
          </p>
        </div>

        {/* List View */}
        <div className="flex-grow overflow-y-auto">
          <h2 className="text-xl font-semibold mb-2">Recent Events</h2>
          <EarthquakeList earthquakes={filteredEarthquakes} formatTime={formatTime} />
        </div>
      </aside>

      {/* Map Visualization (Step 5(c)) */}
      <main className="flex-grow">
        <EarthquakeMap earthquakes={filteredEarthquakes} />
      </main>
    </div>
  );
}

export default App;
