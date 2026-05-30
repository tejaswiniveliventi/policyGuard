/**
 * Policy Card Component
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PolicyCard({ policy }) {
  const navigate = useNavigate();

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    approved: 'bg-blue-100 text-blue-800',
    pending_review: 'bg-yellow-100 text-yellow-800',
    draft: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold text-gray-900 capitalize">{policy.policy_type.replace('_', ' ')}</h3>
          <span className={`inline-block px-2 py-1 rounded text-sm font-semibold ${statusColors[policy.status]}`}>
            {policy.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        <span className="text-sm text-gray-600">v{policy.version}</span>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Updated {new Date(policy.updated_at).toLocaleDateString()}
      </p>
      <button
        onClick={() => navigate(`/policy/${policy.policy_id}`)}
        className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
      >
        View Policy →
      </button>
    </div>
  );
}