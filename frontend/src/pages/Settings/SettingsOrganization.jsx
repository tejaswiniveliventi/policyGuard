/**
 * pages/settings/SettingsOrganization.jsx
 * 
 * Organization settings:
 * - Organization name
 * - Industry
 * - Contact email
 * - Geographic presence
 * - AI use cases
 * - Notification preferences
 */

import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/appStore';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import '../../styles/settings.css';

const INDUSTRIES = [
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Technology',
  'Government',
  'Manufacturing',
  'Other',
];

const REGIONS = [
  'North America',
  'South America',
  'Europe',
  'Asia-Pacific',
  'Middle East & Africa',
];

export default function SettingsOrganization() {
  const { organization, updateOrganization } = useAppStore();
  const [formData, setFormData] = useState({
    org_name: '',
    primary_industry: '',
    contact_email: '',
    geographic_presence: [],
    ai_use_cases: [],
    notification_channels: [],
    review_approval_required: true,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (organization) {
      setFormData({
        org_name: organization.org_name || '',
        primary_industry: organization.primary_industry || '',
        contact_email: organization.contact_email || '',
        geographic_presence: organization.geographic_presence || [],
        ai_use_cases: organization.ai_use_cases || [],
        notification_channels: organization.notification_channels || [],
        review_approval_required: organization.review_approval_required ?? true,
      });
    }
  }, [organization]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleMultiSelect = (field, value) => {
    setFormData((prev) => {
      const current = prev[field];
      if (current.includes(value)) {
        return {
          ...prev,
          [field]: current.filter((item) => item !== value),
        };
      } else {
        return {
          ...prev,
          [field]: [...current, value],
        };
      }
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await updateOrganization(organization.id, formData);
      setMessage('✓ Settings saved successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('✗ Failed to save settings');
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-org-container">
      {message && <div className={`message ${message.includes('✓') ? 'success' : 'error'}`}>{message}</div>}

      <Card title="Organization Profile">
        <Input
          label="Organization Name"
          type="text"
          name="org_name"
          value={formData.org_name}
          onChange={handleInputChange}
          placeholder="Your Organization"
          required
        />

        <div className="form-group">
          <label>Industry</label>
          <select
            name="primary_industry"
            value={formData.primary_industry}
            onChange={handleInputChange}
          >
            <option value="">Select an industry</option>
            {INDUSTRIES.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Contact Email"
          type="email"
          name="contact_email"
          value={formData.contact_email}
          onChange={handleInputChange}
          placeholder="admin@example.com"
          required
        />
      </Card>

      <Card title="Geographic Presence">
        <p className="form-hint">Where does your organization operate?</p>
        <div className="checkbox-group">
          {REGIONS.map((region) => (
            <label key={region} className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.geographic_presence.includes(region)}
                onChange={() =>
                  handleMultiSelect('geographic_presence', region)
                }
              />
              <span>{region}</span>
            </label>
          ))}
        </div>
      </Card>

      <Card title="AI Use Cases">
        <p className="form-hint">
          Which AI/ML use cases does your organization use or plan to use?
        </p>
        <div className="checkbox-group">
          {[
            'Predictive Analytics',
            'Natural Language Processing',
            'Computer Vision',
            'Recommendation Systems',
            'Chatbots/Conversational AI',
            'Fraud Detection',
            'Other',
          ].map((useCase) => (
            <label key={useCase} className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.ai_use_cases.includes(useCase)}
                onChange={() => handleMultiSelect('ai_use_cases', useCase)}
              />
              <span>{useCase}</span>
            </label>
          ))}
        </div>
      </Card>

      <Card title="Notification Settings">
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="notification_channels"
              checked={formData.notification_channels.includes('email')}
              onChange={(e) => {
                if (e.target.checked) {
                  handleMultiSelect('notification_channels', 'email');
                }
              }}
            />
            <span>Email Notifications</span>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="notification_channels"
              checked={formData.notification_channels.includes('slack')}
              onChange={(e) => {
                if (e.target.checked) {
                  handleMultiSelect('notification_channels', 'slack');
                }
              }}
            />
            <span>Slack Notifications</span>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="notification_channels"
              checked={formData.notification_channels.includes('dashboard')}
              onChange={(e) => {
                if (e.target.checked) {
                  handleMultiSelect('notification_channels', 'dashboard');
                }
              }}
            />
            <span>Dashboard Alerts</span>
          </label>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="review_approval_required"
              checked={formData.review_approval_required}
              onChange={handleInputChange}
            />
            <span>Require approval before activating policies</span>
          </label>
        </div>
      </Card>

      <div className="settings-actions">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSave}
          loading={saving}
          disabled={saving}
        >
          💾 Save Settings
        </Button>
      </div>
    </div>
  );
}
