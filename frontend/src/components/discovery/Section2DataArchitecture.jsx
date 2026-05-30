import React from 'react';
import { useDiscoveryStore } from '../../store/discoveryStore';
import FormSection from './FormSection';
import Input from '../common/Input';
import '../../styles/discovery.css';

const DATA_TYPES = [
  { id: 'phi', label: 'PHI (Patient Health Information)', description: 'Medical records, diagnoses, medications' },
  { id: 'pii', label: 'PII (Personally Identifiable Information)', description: 'Names, SSNs, addresses, emails' },
  { id: 'financial', label: 'Financial Data', description: 'Payment info, insurance, billing' },
  { id: 'biometric', label: 'Biometric Data', description: 'Fingerprints, facial recognition, DNA' },
  { id: 'genetic', label: 'Genetic Data', description: 'DNA, family history' },
  { id: 'behavioral', label: 'Behavioral Data', description: 'Usage patterns, activity logs' },
  { id: 'location', label: 'Location Data', description: 'GPS, device location, IP addresses' },
];

export default function Section2DataArchitecture() {
  const { discovery, updateNestedField, toggleDataType } = useDiscoveryStore();

  const isSkipped = discovery.skip_data_architecture || false;

  const handleSkipToggle = (e) => {
    const shouldSkip = e.target.checked;
    
    // Set skip flag at the root level via updateNestedField
    updateNestedField('skip_data_architecture', shouldSkip);
    
    if (shouldSkip) {
      // Clear out the data fields to remove stale data and pass validation requirements
      updateNestedField('data_types_processed', {
        phi: false, pii: false, financial: false, biometric: false,
        genetic: false, behavioral: false, location: false, device_data: false, aggregated_only: false
      });
      updateNestedField('data_flows', {
        description: '', num_integrations: 0, num_data_transfers_daily: 0,
        real_time_streaming: false, batch_processing: false
      });
      updateNestedField('data_classification', { public: 0, internal: 0, confidential: 0, restricted: 0 });
    }
  };

  return (
    <div className="discovery-section">
      <FormSection
        title="Data Architecture & Storage"
        description="Understand your data landscape, storage systems, and data flows"
      >
        {/* Skip Option Wrapper */}
        <div className="skip-section-wrapper" style={{ marginBottom: '1.5rem', background: '#f8f9fa', padding: '15px', borderRadius: '6px', border: '1px solid #e3e6f0' }}>
          <label className="checkbox-label" style={{ fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              checked={isSkipped}
              onChange={handleSkipToggle}
            />
            <span>Skip this section (We do not manage custom architecture layouts or complex ingestion flows)</span>
          </label>
        </div>

        {isSkipped ? (
          <div className="skip-notice-box" style={{ padding: '20px', textAlign: 'center', color: '#666', border: '2px dashed #ccc', borderRadius: '6px' }}>
            <p><strong>Section Skipped.</strong> Form validation parameters successfully bypassed.</p>
            <p style={{ fontSize: '13px', margin: '5px 0 0' }}>Uncheck the box above if you need to register data infrastructure parameters.</p>
          </div>
        ) : (
          <div className="section-content">
            
            {/* 1. Data Classification Checkboxes */}
            <div className="form-group">
              <label className="form-label">
                What types of data does your organization process?
              </label>
              <div className="checkbox-group">
                {DATA_TYPES.map((type) => (
                  <label key={type.id} className="checkbox-label" style={{ display: 'block', marginBottom: '10px' }}>
                    <input
                      type="checkbox"
                      checked={discovery.data_types_processed?.[type.id] || false}
                      onChange={() => toggleDataType(type.id)}
                  />
                    <strong> {type.label}</strong>
                    <p style={{ margin: '2px 0 0 20px', fontSize: '13px', color: '#666' }}>{type.description}</p>
                  </label>
                ))}
              </div>
            </div>

            {/* 2. Cloud Providers Checkboxes */}
            <div className="form-group">
              <label className="form-label">
                Which cloud providers do you use?
              </label>
              <div className="cloud-providers">
                {[
                  { id: 'aws', label: 'AWS' },
                  { id: 'azure', label: 'Azure' },
                  { id: 'gcp', label: 'Google Cloud' },
                ].map((provider) => {
                  const currentProviders = discovery.systems_in_use?.cloud_providers || [];
                  const isChecked = currentProviders.includes(provider.id);

                  return (
                    <label key={provider.id} className="checkbox-item" style={{ marginRight: '15px' }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          const nextProviders = isChecked
                            ? currentProviders.filter((p) => p !== provider.id)
                            : [...currentProviders, provider.id];
                          updateNestedField('systems_in_use.cloud_providers', nextProviders);
                        }}
                      />
                      <span> {provider.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 3. Data Flows Description Input */}
            <div className="form-group">
              <Input
                label="Data Flow Description"
                type="text"
                value={discovery.data_flows?.description || ''}
                onChange={(e) => updateNestedField('data_flows.description', e.target.value)}
                placeholder="Describe how data enters, moves through, and leaves your infrastructure..."
                helperText="Minimum 10 characters required for validation step."
              />
            </div>

            {/* 4. Integrations & Transfers */}
            <div className="form-row" style={{ display: 'flex', gap: '20px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <Input
                  label="Number of Integrations"
                  type="number"
                  value={discovery.data_flows?.num_integrations || 0}
                  onChange={(e) => updateNestedField('data_flows.num_integrations', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <Input
                  label="Daily Data Transfers"
                  type="number"
                  value={discovery.data_flows?.num_data_transfers_daily || 0}
                  onChange={(e) => updateNestedField('data_flows.num_data_transfers_daily', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            {/* 5. Data Flow Architectures Flags */}
            <div className="form-group">
              <label className="checkbox-label" style={{ marginRight: '20px' }}>
                <input
                  type="checkbox"
                  checked={discovery.data_flows?.real_time_streaming || false}
                  onChange={(e) => updateNestedField('data_flows.real_time_streaming', e.target.checked)}
                />
                <span> Utilizes Real-Time Streaming</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={discovery.data_flows?.batch_processing || false}
                  onChange={(e) => updateNestedField('data_flows.batch_processing', e.target.checked)}
                />
                <span> Utilizes Batch Processing</span>
              </label>
            </div>

            {/* 6. Data Classification Metrics Map */}
            <div className="form-group">
              <label className="form-label">Data Classification Split (%)</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['public', 'internal', 'confidential', 'restricted'].map((tier) => (
                  <div key={tier} style={{ flex: 1 }}>
                    <Input
                      label={tier.charAt(0).toUpperCase() + tier.slice(1)}
                      type="number"
                      value={discovery.data_classification?.[tier] || 0}
                      onChange={(e) => updateNestedField(`data_classification.${tier}`, parseInt(e.target.value) || 0)}
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </FormSection>
    </div>
  );
}