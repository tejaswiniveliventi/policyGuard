/**
 * components/dashboard/RecentPolicies.jsx
 * 
 * Display recently generated or modified policies.
 * 
 * Props:
 * - policies: array of policy objects
 * - loading: boolean
 * - onViewPolicy: function (policy) => navigate
 */

import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
//import './RecentPolicies.css';

export default function RecentPolicies({
  policies = [],
  loading = false,
  onViewPolicy,
}) {
  if (loading) {
    return (
      <Card title="Recent Policies">
        <p>Loading...</p>
      </Card>
    );
  }

  const recentPolicies = policies.slice(0, 5);

  if (recentPolicies.length === 0) {
    return (
      <Card title="Recent Policies">
        <div className="empty-state">
          <p>No policies yet. Run an assessment to generate policies.</p>
        </div>
      </Card>
    );
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending_review':
        return 'warning';
      case 'rejected':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <Card title="Recent Policies">
      <div className="policies-list">
        {recentPolicies.map((policy) => (
          <div
            key={policy.id}
            className="policy-item"
            onClick={() => onViewPolicy(policy.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="policy-main">
              <h4 className="policy-title">{policy.title}</h4>
              <p className="policy-description">{policy.description}</p>
            </div>

            <div className="policy-meta">
              <Badge variant={getStatusVariant(policy.status)}>
                {policy.status.replace('_', ' ').toUpperCase()}
              </Badge>

              {policy.regulation && (
                <span className="policy-regulation">{policy.regulation}</span>
              )}

              <span className="policy-date">
                {new Date(policy.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
