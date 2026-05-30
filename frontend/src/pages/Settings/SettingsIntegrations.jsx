/**
 * pages/settings/SettingsIntegrations.jsx
 * 
 * Integration settings:
 * - Slack webhook configuration
 * - Email notification settings
 * - API key management
 * - Test integrations
 */

import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/appStore';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import '../../styles/settings.css';

export default function SettingsIntegrations() {
  const { organization, updateOrganization } = useAppStore();
  const [slackWebhook, setSlackWebhook] = useState('');
  const [emailSettings, setEmailSettings] = useState({
    recipient_email: '',
    send_weekly_digest: true,
    send_alerts: true,
  });
  const [testing, setTesting] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (organization) {
      setSlackWebhook(organization.slack_webhook_url || '');
      setEmailSettings({
        recipient_email: organization.contact_email || '',
        send_weekly_digest: true,
        send_alerts: true,
      });
    }
  }, [organization]);

  const handleSaveSlack = async () => {
    setSaving(true);
    try {
      await updateOrganization(organization.id, {
        slack_webhook_url: slackWebhook,
      });
      setMessage('✓ Slack webhook saved');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('✗ Failed to save Slack webhook');
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleTestSlack = async () => {
    setTesting('slack');
    try {
      // TODO: Call API to test Slack webhook
      alert('Test message sent to Slack');
    } catch (error) {
      alert('Failed to send test message');
      console.error('Test error:', error);
    } finally {
      setTesting(null);
    }
  };

  const handleTestEmail = async () => {
    setTesting('email');
    try {
      // TODO: Call API to test email
      alert('Test email sent to ' + emailSettings.recipient_email);
    } catch (error) {
      alert('Failed to send test email');
      console.error('Test error:', error);
    } finally {
      setTesting(null);
    }
  };

  return (
    <div className="settings-integrations-container">
      {message && (
        <div
          className={`message ${message.includes('✓') ? 'success' : 'error'}`}
        >
          {message}
        </div>
      )}

      {/* Slack Integration */}
      <Card title="Slack Integration">
        <p className="integration-description">
          Connect PolicyGuard to your Slack workspace to receive real-time
          alerts and notifications.
        </p>

        <Input
          label="Slack Webhook URL"
          type="text"
          value={slackWebhook}
          onChange={(e) => setSlackWebhook(e.target.value)}
          placeholder="https://hooks.slack.com/services/..."
          helperText="Get your webhook URL from Slack App settings"
        />

        <div className="integration-actions">
          <Button
            variant="primary"
            onClick={handleSaveSlack}
            loading={saving}
            disabled={saving}
          >
            💾 Save Webhook
          </Button>

          <Button
            variant="secondary"
            onClick={handleTestSlack}
            loading={testing === 'slack'}
            disabled={!slackWebhook || testing === 'slack'}
          >
            🧪 Send Test Message
          </Button>
        </div>

        {slackWebhook && (
          <div className="integration-status">
            <Badge variant="success">✓ Connected</Badge>
          </div>
        )}
      </Card>

      {/* Email Integration */}
      <Card title="Email Notifications">
        <p className="integration-description">
          Configure email notifications for alerts and policy approvals.
        </p>

        <Input
          label="Notification Email"
          type="email"
          value={emailSettings.recipient_email}
          onChange={(e) =>
            setEmailSettings({
              ...emailSettings,
              recipient_email: e.target.value,
            })
          }
          placeholder="admin@example.com"
          required
        />

        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={emailSettings.send_alerts}
              onChange={(e) =>
                setEmailSettings({
                  ...emailSettings,
                  send_alerts: e.target.checked,
                })
              }
            />
            <span>Send email alerts</span>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={emailSettings.send_weekly_digest}
              onChange={(e) =>
                setEmailSettings({
                  ...emailSettings,
                  send_weekly_digest: e.target.checked,
                })
              }
            />
            <span>Send weekly digest</span>
          </label>
        </div>

        <div className="integration-actions">
          <Button
            variant="secondary"
            onClick={handleTestEmail}
            loading={testing === 'email'}
            disabled={testing === 'email'}
          >
            🧪 Send Test Email
          </Button>
        </div>

        {emailSettings.recipient_email && (
          <div className="integration-status">
            <Badge variant="success">✓ Configured</Badge>
          </div>
        )}
      </Card>

      {/* API Keys */}
      <Card title="API Access">
        <p className="integration-description">
          Manage API keys for programmatic access to PolicyGuard.
        </p>

        <div className="api-keys-list">
          <div className="api-key-item">
            <div className="key-info">
              <h4>Production API Key</h4>
              <p className="key-value">sk_live_****************************</p>
            </div>
            <div className="key-actions">
              <Button variant="secondary" size="sm">
                Regenerate
              </Button>
              <Button variant="danger" size="sm">
                Revoke
              </Button>
            </div>
          </div>
        </div>

        <Button variant="secondary">+ Generate New Key</Button>
      </Card>

      {/* Documentation */}
      <Card title="Integration Documentation">
        <div className="integration-docs">
          <div className="doc-item">
            <h4>📚 Slack Integration Guide</h4>
            <p>Learn how to set up Slack notifications</p>
            <Button variant="secondary" size="sm">
              Read Docs →
            </Button>
          </div>

          <div className="doc-item">
            <h4>🔌 API Reference</h4>
            <p>Complete API documentation and examples</p>
            <Button variant="secondary" size="sm">
              View API Docs →
            </Button>
          </div>

          <div className="doc-item">
            <h4>🔗 Webhook Events</h4>
            <p>Learn about webhook events and payloads</p>
            <Button variant="secondary" size="sm">
              See Events →
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
