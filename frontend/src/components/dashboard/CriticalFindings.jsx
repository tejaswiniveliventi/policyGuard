/**
 * components/dashboard/CriticalFindings.jsx
 * 
 * Display critical and high severity findings from assessment.
 * 
 * Features:
 * - Shows top 5 findings
 * - Color coded by severity
 * - Links to detailed assessment
 * 
 * Props:
 * - findings: array of finding objects
 * - loading: boolean
 * - onViewAll: function
 */

import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
//import './CriticalFindings.css';

export default function CriticalFindings({ findings = [], loading = false, onViewAll }) {
  if (loading) {
    return <Card title="Critical Findings" body={<p>Loading...</p>} />;
  }

  const criticalFindings = findings
    .filter((f) => f.severity === 'critical' || f.severity === 'high')
    .slice(0, 5);

  if (criticalFindings.length === 0) {
    return (
      <Card title="Critical Findings">
        <div className="empty-state">
          <p>✅ No critical findings detected</p>
        </div>
      </Card>
    );
  }

  const getSeverityVariant = (severity) => {
    switch (severity) {
      case 'critical':
        return 'danger';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Card
      title="Critical Findings"
      subtitle={`${criticalFindings.length} of ${findings.length} total`}
    >
      <div className="findings-list">
        {criticalFindings.map((finding, index) => (
          <div key={index} className="finding-item">
            <div className="finding-header">
              <Badge variant={getSeverityVariant(finding.severity)}>
                {finding.severity.toUpperCase()}
              </Badge>
              <span className="finding-area">{finding.area}</span>
            </div>
            <p className="finding-issue">{finding.issue}</p>
            <div className="finding-footer">
              {finding.regulation && (
                <span className="finding-regulation">📋 {finding.regulation}</span>
              )}
              {finding.affected_systems && (
                <span className="finding-systems">
                  🖥️ {finding.affected_systems.length} systems
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      {findings.length > 5 && (
        <button className="card-footer-link" onClick={onViewAll}>
          View all {findings.length} findings →
        </button>
      )}
    </Card>
  );
}
