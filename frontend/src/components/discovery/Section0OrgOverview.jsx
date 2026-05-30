/**
 * components/discovery/Section0OrgOverview.jsx
 * 
 * Section 0: Organization Overview
 * 
 * Collects:
 * - Organization size (SMB, Mid-Market, Enterprise)
 * - Number of employees
 * - Number of facilities
 * - Number of users
 * - Geographic presence
 * - Primary industry
 */

import React from 'react';
import { useDiscoveryStore } from '../../store/discoveryStore';
import Card from '../common/Card';
import Input from '../common/Input';
//import '../../styles/discovery.css';

export default function Section0OrgOverview() {
  const { discovery, updateField, toggleGeographicPresence, validationErrors } =
    useDiscoveryStore();

  const ORG_SIZES = [
    { value: 'startup', label: 'Startup (< 50 employees)' },
    { value: 'smb', label: 'Small-Medium Business (50-500 employees)' },
    { value: 'enterprise', label: 'Enterprise (500+ employees)' },
  ];

  const INDUSTRIES = [
    'Healthcare',
    'Financial Services',
    'Education',
    'Government',
    'Technology',
    'Manufacturing',
    'Retail',
    'Other',
  ];

  const REGIONS = [
    'North America',
    'South America',
    'Europe',
    'Asia-Pacific',
    'Middle East & Africa',
  ];

  return (
    <div className="discovery-section">
      <Card title="Organization Overview" subtitle="Tell us about your organization">
        <div className="form-group">
          <label className="form-label">Organization Size *</label>
          <div className="radio-group">
            {ORG_SIZES.map((size) => (
              <label key={size.value} className="radio-label">
                <input
                  type="radio"
                  name="org_size"
                  value={size.value}
                  checked={discovery.org_size === size.value}
                  onChange={(e) => updateField('org_size', e.target.value)}
                />
                <span>{size.label}</span>
              </label>
            ))}
          </div>
          {validationErrors.org_size && (
            <span className="error">{validationErrors.org_size}</span>
          )}
        </div>

        <Input
          label="Number of Employees *"
          type="number"
          value={discovery.num_employees}
          onChange={(e) => updateField('num_employees', parseInt(e.target.value) || 0)}
          placeholder="1000"
          error={validationErrors.num_employees}
          required
        />

        <Input
          label="Number of Facilities *"
          type="number"
          value={discovery.num_facilities}
          onChange={(e) => updateField('num_facilities', parseInt(e.target.value) || 0)}
          placeholder="5"
          error={validationErrors.num_facilities}
          required
        />

        <Input
          label="Number of Active Users *"
          type="number"
          value={discovery.num_users}
          onChange={(e) => updateField('num_users', parseInt(e.target.value) || 0)}
          placeholder="5000"
          helperText="Employees + contractors with system access"
          error={validationErrors.num_users}
          required
        />

        <div className="form-group">
          <label className="form-label">Primary Industry *</label>
          <select
            value={discovery.primary_industry}
            onChange={(e) => updateField('primary_industry', e.target.value)}
            className="form-select"
          >
            <option value="">Select an industry</option>
            {INDUSTRIES.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
          {validationErrors.primary_industry && (
            <span className="error">{validationErrors.primary_industry}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Geographic Presence *</label>
          <p className="form-hint">
            In which regions does your organization operate or process data?
          </p>
          <div className="checkbox-group">
            {REGIONS.map((region) => (
              <label key={region} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={discovery.geographic_presence.includes(region)}
                  onChange={() => toggleGeographicPresence(region)}
                />
                <span>{region}</span>
              </label>
            ))}
          </div>
          {validationErrors.geographic_presence && (
            <span className="error">{validationErrors.geographic_presence}</span>
          )}
        </div>
      </Card>
    </div>
  );
}
