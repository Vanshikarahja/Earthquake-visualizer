// src/components/EarthquakeList.jsx
import React from 'react';

const EarthquakeList = ({ earthquakes, formatTime }) => {
  return (
    <ul className="space-y-3">
      {earthquakes.length === 0 ? (
        <p className="text-gray-500 italic">No earthquakes match the current filter.</p>
      ) : (
        earthquakes.map((eq) => {
          const { mag, place, time, url } = eq.properties;
          return (
            <li key={eq.id} className="p-3 bg-gray-50 border-l-4 border-blue-400 hover:bg-gray-100 transition duration-150 rounded-md shadow-sm">
              <a href={url} target="_blank" rel="noopener noreferrer" className="block">
                <p className="text-lg font-semibold text-gray-800">
                  <span className="inline-block px-2 py-0.5 mr-2 rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: mag >= 5.0 ? 'red' : mag >= 4.0 ? 'orange' : 'green' }}>
                    M{mag.toFixed(1)}
                  </span>
                  {place}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTime(time)}
                </p>
              </a>
            </li>
          );
        })
      )}
    </ul>
  );
};

export default EarthquakeList;