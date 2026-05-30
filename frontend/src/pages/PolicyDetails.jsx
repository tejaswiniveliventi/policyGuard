/**
 * pages/PolicyDetails.jsx
 * 
 * Detailed policy view showing:
 * - Full policy content (Markdown)
 * - Policy metadata (status, version, created date)
 * - Approval/rejection workflow (if pending review)
 * - Comments and review history
 * - Download option
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import '../styles/policy.css';

export default function PolicyDetails() {
  const { policyId } = useParams();
  const navigate = useNavigate();
  const { organization, policies, approvePolicy, rejectPolicy, setActiveNavItem } =
    useAppStore();

  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setActiveNavItem('policies');
    const foundPolicy = policies.find((p) => p.id === policyId);
    if (foundPolicy) {
      setPolicy(foundPolicy);
    }
    setLoading(false);
  }, [policyId, policies]);

  const handleApprove = async () => {
    setSubmitting(true);
    try {
      await approvePolicy(organization.id, policyId, {
        reviewed_by: 'current_user',
      });
      alert('Policy approved successfully');
      navigate('/policies');
    } catch (error) {
      console.error('Failed to approve policy:', error);
      alert('Failed to approve policy');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setSubmitting(true);
    try {
      await rejectPolicy(organization.id, policyId, rejectReason);
      alert('Policy rejected');
      setShowRejectModal(false);
      navigate('/policies');
    } catch (error) {
      console.error('Failed to reject policy:', error);
      alert('Failed to reject policy');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !policy) {
    return (
      <MainLayout>
        {loading ? (
          <LoadingSpinner fullPage={false} message="Loading policy..." />
        ) : (
          <Card>
            <p>Policy not found</p>
            <Button onClick={() => navigate('/policies')}>
              Back to Policies
            </Button>
          </Card>
        )}
      </MainLayout>
    );
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case 'approved':
      case 'active':
        return 'success';
      case 'pending_review':
        return 'warning';
      case 'rejected':
        return 'danger';
      default:
        return 'default';
    }
  };

  const canApprove =
    policy.status === 'pending_review' || policy.status === 'draft';

  return (
    <MainLayout>
      <div className="policy-details-container">
        {/* Header */}
        <div className="policy-details-header">
          <Button variant="secondary" onClick={() => navigate('/policies')}>
            ← Back to Policies
          </Button>

          <div className="policy-title-section">
            <h1>{policy.title}</h1>
            <Badge variant={getStatusVariant(policy.status)}>
              {policy.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>

          <div className="policy-meta-info">
            {policy.regulation && (
              <div className="meta-item">
                <span className="meta-label">Regulation</span>
                <span className="meta-value">{policy.regulation}</span>
              </div>
            )}
            {policy.version && (
              <div className="meta-item">
                <span className="meta-label">Version</span>
                <span className="meta-value">v{policy.version}</span>
              </div>
            )}
            {policy.created_at && (
              <div className="meta-item">
                <span className="meta-label">Created</span>
                <span className="meta-value">
                  {new Date(policy.created_at).toLocaleDateString()}
                </span>
              </div>
            )}
            {policy.approved_at && (
              <div className="meta-item">
                <span className="meta-label">Approved</span>
                <span className="meta-value">
                  {new Date(policy.approved_at).toLocaleDateString()}
                </span>
              </div>
            )}
            {policy.effective_date && (
              <div className="meta-item">
                <span className="meta-label">Effective Date</span>
                <span className="meta-value">
                  {new Date(policy.effective_date).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <Card title="Policy Content" className="policy-content-card">
          <div className="policy-markdown-content">
            {policy.content ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: policy.content,
                }}
              />
            ) : (
              <p>No content available</p>
            )}
          </div>
        </Card>

        {/* Review Comments */}
        {policy.review_comments && policy.review_comments.length > 0 && (
          <Card title="Review Comments" className="review-comments-card">
            <div className="comments-list">
              {policy.review_comments.map((comment, idx) => (
                <div key={idx} className="comment-item">
                  <p className="comment-text">{comment}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Approval Section */}
        {canApprove && (
          <Card title="Review & Approval" className="approval-card">
            <p>
              Review the policy content above and approve or request changes.
            </p>

            <div className="approval-actions">
              <Button
                variant="success"
                size="lg"
                onClick={handleApprove}
                loading={submitting}
                disabled={submitting}
              >
                ✓ Approve This Policy
              </Button>

              <Button
                variant="danger"
                size="lg"
                onClick={() => setShowRejectModal(true)}
                disabled={submitting}
              >
                ✕ Request Changes
              </Button>
            </div>
          </Card>
        )}

        {/* Reject Modal */}
        <Modal
          isOpen={showRejectModal}
          onClose={() => {
            setShowRejectModal(false);
            setRejectReason('');
          }}
          title="Request Changes"
          size="md"
          footer={
            <div className="modal-footer-buttons">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleReject}
                loading={submitting}
              >
                Request Changes
              </Button>
            </div>
          }
        >
          <Input
            label="Reason for changes"
            type="textarea"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Describe what changes are needed..."
            required
          />
        </Modal>

        {/* Actions */}
        <div className="policy-actions">
          <Button variant="secondary" onClick={() => navigate('/policies')}>
            ← Back to Policies
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
