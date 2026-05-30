/**
 * components/assessment/PolicyCard.jsx
 * 
 * Display a single auto-generated policy with:
 * - Policy title and description
 * - Status badge
 * - Regulation citation
 * - Preview of policy content
 * - Approve/Modify/Reject actions
 * 
 * Props:
 * - policy: object with policy data
 * - onApprove: function
 * - onModify: function
 * - onReject: function
 */

import React, { useState } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import '../../styles/components.css';

export default function PolicyCard({
  policy,
  onApprove,
  onModify,
  onReject,
}) {
  const [showPreview, setShowPreview] = useState(false);

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
    <Card className="policy-card">
      <div className="policy-header">
        <div className="policy-left">
          <h3 className="policy-title">{policy.title}</h3>
          <p className="policy-description">{policy.description}</p>
        </div>

        <div className="policy-status">
          <Badge variant={getStatusVariant(policy.status)}>
            {policy.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="policy-meta">
        {policy.regulation && (
          <span className="policy-meta-item">
            📋 <strong>{policy.regulation}</strong>
          </span>
        )}
        {policy.generated_at && (
          <span className="policy-meta-item">
            📅 Generated: {new Date(policy.generated_at).toLocaleDateString()}
          </span>
        )}
        {policy.effective_date && (
          <span className="policy-meta-item">
            ⏰ Effective: {new Date(policy.effective_date).toLocaleDateString()}
          </span>
        )}
      </div>

      {showPreview && policy.content && (
        <div className="policy-preview">
          <div className="preview-content">
            {policy.content.substring(0, 500)}...
          </div>
          <button
            className="preview-toggle"
            onClick={() => setShowPreview(false)}
          >
            Hide Preview
          </button>
        </div>
      )}

      {!showPreview && (
        <button
          className="preview-toggle"
          onClick={() => setShowPreview(true)}
        >
          Show Preview →
        </button>
      )}

      {policy.status === 'pending_review' && (
        <div className="policy-actions">
          <Button
            variant="success"
            onClick={() => onApprove(policy.id)}
            size="sm"
          >
            ✓ Approve
          </Button>
          <Button
            variant="secondary"
            onClick={() => onModify(policy.id)}
            size="sm"
          >
            ✏️ Modify
          </Button>
          <Button
            variant="danger"
            onClick={() => onReject(policy.id)}
            size="sm"
          >
            ✕ Reject
          </Button>
        </div>
      )}

      {policy.status === 'approved' && (
        <div className="policy-approved">
          <p>✓ This policy has been approved and is now active.</p>
        </div>
      )}
    </Card>
  );
}
