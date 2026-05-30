/**
 * Initial Setup Page - First time user onboarding
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAppStore from '../store/appStore';
import '../styles/settings.css';
import '../styles/components.css';
import '../styles/variables.css';

export default function InitialSetup() {
  const navigate = useNavigate();
  const setCurrentOrg = useAppStore((state) => state.setCurrentOrg);
  const setError = useAppStore((state) => state.setError);
  const setIsLoading = useAppStore((state) => state.setIsLoading);

  const [formData, setFormData] = useState({
    org_name: '',
    industry: 'healthcare',
    contact_email: '',
    ai_use_cases: [],
    notification_channels: ['email', 'dashboard'],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAiUseCaseChange = (useCase) => {
    setFormData((prev) => ({
      ...prev,
      ai_use_cases: prev.ai_use_cases.includes(useCase)
        ? prev.ai_use_cases.filter((u) => u !== useCase)
        : [...prev.ai_use_cases, useCase],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const org = await api.createOrg(formData);
      setCurrentOrg(org);
      localStorage.setItem('orgId', org.org_id);
      navigate('/dashboard');
    } catch (error) {
      setError(`Failed to create organization: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">PolicyGuard</h1>
        <p className="text-gray-600 mb-6">Privacy-First AI Policy Framework</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization Name
            </label>
            <input
              type="text"
              name="org_name"
              value={formData.org_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Organization"
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
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@organization.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Use Cases
            </label>
            <div className="space-y-2">
              {['diagnosis', 'scheduling', 'beneficiary_intake', 'donation_processing'].map(
                (useCase) => (
                  <label key={useCase} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.ai_use_cases.includes(useCase)}
                      onChange={() => handleAiUseCaseChange(useCase)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="ml-2 text-gray-700 capitalize">{useCase.replace('_', ' ')}</span>
                  </label>
                )
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={useAppStore((state) => state.isLoading)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
          >
            {useAppStore((state) => state.isLoading) ? 'Creating...' : 'Get Started'}
          </button>
        </form>
      </div>
    </div>
  );
}