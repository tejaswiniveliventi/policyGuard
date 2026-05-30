/**
 * components/assessment/FindingCard.jsx
 * 
 * Display a single finding/violation from assessment with:
 * - Severity badge
 * - Issue description
 * - Affected systems
 * - Regulation citation
 * - Remediation steps
 * - Approve/Dismiss actions
 * 
 * Props:
 * - finding: object with finding data
 * - onApprove: function
 * - onDismiss: function
 * - index: number
 */

import React, { useState } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import './FindingCard.css';

export default function FindingCard({
  finding,
  onApprove,
  onDismiss,
  index,
}) {
  const [expanded, setExpanded] = useState(false);

  const getSeverityVariant = (severity) => {
    switch (severity) {
      case 'critical':
        return 'danger';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Card className={`finding-card ${expanded ? 'expanded' : ''}`}>
      <div className="finding-header-wrapper">
        <div className="finding-header-left">
          <span className="finding-number">#{index + 1}</span>
          <Badge variant={getSeverityVariant(finding.severity)}>
            {finding.severity.toUpperCase()}
          </Badge>
          <h3 className="finding-title">{finding.area}</h3>
        </div>

        <button
          className="finding-expand-btn"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? '▼' : '▶'}
        </button>
      </div>

      <p className="finding-issue">{finding.issue}</p>

      {expanded && (
        <div className="finding-details">
          {finding.regulation && (
            <div className="finding-section">
              <h4>Regulation</h4>
              <p className="finding-regulation">{finding.regulation}</p>
            </div>
          )}

          {finding.business_impact && (
            <div className="finding-section">
              <h4>Business Impact</h4>
              <p>{finding.business_impact}</p>
            </div>
          )}

          {finding.affected_systems && finding.affected_systems.length > 0 && (
            <div className="finding-section">
              <h4>Affected Systems</h4>
              <div className="systems-list">
                {finding.affected_systems.map((system, idx) => (
                  <Badge key={idx} variant="default">
                    {system}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {finding.remediation_steps && (
            <div className="finding-section">
              <h4>Remediation Steps</h4>
              <ol className="remediation-list">
                {finding.remediation_steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          {finding.estimated_effort_days && (
            <div className="finding-section">
              <h4>Estimated Effort</h4>
              <p>{finding.estimated_effort_days} days</p>
            </div>
          )}

          <div className="finding-actions">
            <Button
              variant="success"
              size="sm"
              onClick={() => onApprove(finding.id)}
            >
              ✓ Acknowledge
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onDismiss(finding.id)}
            >
              × Dismiss
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
