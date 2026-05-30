/**
 * Alert Detail Page - Review and approve policies
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import api from '../services/api';

export default function AlertDetail() {
  const { alertId } = useParams();
  const navigate = useNavigate();
  const orgId = localStorage.getItem('orgId');

  const [alert, setAlert] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewComments, setReviewComments] = useState('');
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    const loadAlertData = async () => {
      try {
        const alertData = await api.getAlert(orgId, alertId);
        setAlert(alertData);

        if (alertData.policy_id) {
          const policyData = await api.getPolicy(orgId, alertData.policy_id);
          setPolicy(policyData);
        }
      } catch (error) {
        console.error('Failed to load alert:', error);
      } finally {
        setLoading(false);
      }
    }; 
    loadAlertData();
  }, [alertId, orgId]);

  

  const handleApprovePolicy = async () => {
    if (!policy) return;

    setApproving(true);
    try {
      await api.updatePolicyStatus(
        orgId,
        policy.policy_id,
        'approved',
        'user@example.com',
        reviewComments.split('\n').filter((c) => c.trim())
      );

      await api.acknowledgeAlert(orgId, alertId, 'user@example.com', 'Policy approved');

      alert('Policy approved successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to approve policy:', error);
      alert('Failed to approve policy');
    } finally {
      setApproving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!alert) {
    return <div className="flex items-center justify-center h-screen">Alert not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 text-blue-600 hover:text-blue-700 font-semibold"
        >
          ← Back to Dashboard
        </button>

        {/* Alert Details */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{alert.title}</h1>
          <div className="flex gap-4 mb-4">
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
              {alert.severity.toUpperCase()}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
              {alert.alert_type}
            </span>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">{alert.description}</p>
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              <strong>Recommended Action:</strong> {alert.recommended_action}
            </p>
          </div>
        </div>

        {/* Policy Draft */}
        {policy && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Generated Policy Draft</h2>
            <div className="bg-gray-50 p-6 rounded-lg prose prose-sm max-w-none mb-4">
              <ReactMarkdown>{policy.content}</ReactMarkdown>
            </div>

            {/* Review Form */}
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Comments (optional)
              </label>
              <textarea
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
                placeholder="Add your comments here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
              />

              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleApprovePolicy}
                  disabled={approving}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition disabled:opacity-50"
                >
                  {approving ? 'Approving...' : 'Approve Policy'}
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}