/**
 * Alert Card Component
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AlertCard({ alert }) {
  const navigate = useNavigate();

  const severityColors = {
    critical: 'bg-red-900 text-white',
    high: 'bg-red-600 text-white',
    medium: 'bg-yellow-500 text-white',
    low: 'bg-green-500 text-white',
  };

  return (
    <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className={`inline-block px-3 py-1 rounded text-sm font-bold ${severityColors[alert.severity]}`}>
            {alert.severity.toUpperCase()}
          </span>
          <h3 className="text-lg font-bold text-gray-900 mt-2">{alert.title}</h3>
        </div>
      </div>
      <p className="text-gray-700 mb-4">{alert.description}</p>
      <button
        onClick={() => navigate(`/alert/${alert.alert_id}`)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
      >
        Review Details
      </button>
    </div>
  );
}