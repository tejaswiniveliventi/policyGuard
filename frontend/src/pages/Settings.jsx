/**
 * Settings Page - Manage organization preferences
 */

import React, { useEffect, useState } from 'react';
import api from '../services/api';
import useAppStore from '../store/appStore';

export default function Settings() {
  const currentOrg = useAppStore((state) => state.currentOrg);
  const orgId = localStorage.getItem('orgId');

  const [formData, setFormData] = useState({
    org_name: '',
    industry: '',
    contact_email: '',
    notification_channels: [],
    slack_webhook_url: '',
  });

  const [saving, setSaving] = useState(false);
  const [notificationTest, setNotificationTest] = useState(null);

  useEffect(() => {
    if (currentOrg) {
      setFormData({
        org_name: currentOrg.org_name,
        industry: currentOrg.industry,
        contact_email: currentOrg.contact_email,
        notification_channels: currentOrg.notification_channels,
        slack_webhook_url: currentOrg.slack_webhook_url || '',
      });
    }
  }, [currentOrg]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChannelChange = (channel) => {
    setFormData((prev) => ({
      ...prev,
      notification_channels: prev.notification_channels.includes(channel)
        ? prev.notification_channels.filter((c) => c !== channel)
        : [...prev.notification_channels, channel],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateOrg(orgId, formData);
      useAppStore.setState({ currentOrg: { ...currentOrg, ...formData } });
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleTestNotification = async () => {
    setNotificationTest('sending');
    try {
      const result = await api.testNotification(
        orgId,
        formData.contact_email,
        formData.notification_channels
      );
      setNotificationTest('success');
    } catch (error) {
      setNotificationTest('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Organization Profile */}
          <section className="border-b pb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Organization Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name
                </label>
                <input
                  type="text"
                  name="org_name"
                  value={formData.org_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Industry</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="humanitarian_ngo">Humanitarian NGO</option>
                  <option value="social_services">Social Services</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>

          {/* Notification Preferences */}
          <section className="border-b pb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Notification Preferences</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Notification Channels
                </label>
                <div className="space-y-2">
                  {['email', 'slack', 'dashboard'].map((channel) => (
                    <label key={channel} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.notification_channels.includes(channel)}
                        onChange={() => handleChannelChange(channel)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="ml-3 text-gray-700 capitalize">{channel}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slack Webhook URL
                </label>
                <input
                  type="url"
                  name="slack_webhook_url"
                  value={formData.slack_webhook_url}
                  onChange={handleChange}
                  placeholder="https://hooks.slack.com/services/..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Leave empty if not using Slack notifications
                </p>
              </div>

              <button
                onClick={handleTestNotification}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
              >
                {notificationTest === 'sending' ? 'Testing...' : 'Test Notifications'}
              </button>
              {notificationTest === 'success' && (
                <p className="text-sm text-green-600 font-semibold">✓ Test notification sent!</p>
              )}
            </div>
          </section>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}