import React from 'react';
import { useDiscoveryStore } from '../../store/discoveryStore';
import FormSection from './FormSection';
import Input from '../common/Input';
import '../../styles/discovery.css';

export default function Section6RiskManagement() {
  const { discovery, updateNestedField } = useDiscoveryStore();

  const riskMgmt = discovery.risk_management || {};
  const isSkipped = discovery.skip_risk_management || false;

  const handleSkipToggle = (e) => {
    const shouldSkip = e.target.checked;
    
    // Set the skip flag at the root level using our nested field helper
    updateNestedField('skip_risk_management', shouldSkip);
    
    if (shouldSkip) {
      // Clear out the data properties to keep state clean if skipped
      updateNestedField('risk_management', {
        risk_assessment_framework: '',
        last_risk_assessment: null,
        breach_history: 0,
        breach_notification_process: false,
        incident_response_plan: false,
        disaster_recovery_plan: false,
        rto_hours: 0,
        rpo_hours: 0,
      });
    }
  };

  return (
    <div className="discovery-section">
      <FormSection
        title="Risk & Incident Management"
        description="Understand and manage your key enterprise risks, breach histories, and recovery parameters"
      >
        {/* Skip Option Selector */}
        <div className="skip-section-wrapper" style={{ marginBottom: '1.5rem', background: '#f8f9fa', padding: '15px', borderRadius: '6px', border: '1px solid #e3e6f0' }}>
          <label className="checkbox-label" style={{ fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              checked={isSkipped}
              onChange={handleSkipToggle}
            />
            <span>Skip this section (We do not track formalized RTO/RPO metrics or active business continuity plans)</span>
          </label>
        </div>

        {isSkipped ? (
          <div className="skip-notice-box" style={{ padding: '20px', textAlign: 'center', color: '#666', border: '2px dashed #ccc', borderRadius: '6px' }}>
            <p><strong>Section Skipped.</strong> Optional risk parameter requirements bypassed.</p>
            <p style={{ fontSize: '13px', margin: '5px 0 0' }}>Uncheck the box above if you need to register operational risk metrics.</p>
          </div>
        ) : (
          <div className="section-content">

            {/* 1. Risk Assessment Framework Selection */}
            <div className="form-group">
              <label className="form-label">
                Do you have a formal risk assessment framework?
              </label>
              <select
                value={riskMgmt.risk_assessment_framework || ''}
                onChange={(e) => updateNestedField('risk_management.risk_assessment_framework', e.target.value)}
                className="form-input"
              >
                <option value="">Select...</option>
                <option value="comprehensive">Comprehensive (documented, scored, prioritized)</option>
                <option value="documented">Documented but basic</option>
                <option value="informal">Informal/ad hoc</option>
                <option value="none">No formal framework</option>
              </select>
            </div>

            {/* 2. Last Assessment Date Input */}
            <div className="form-group">
              <label className="form-label">Last Formal Risk Assessment Date</label>
              <input
                type="date"
                value={riskMgmt.last_risk_assessment || ''}
                onChange={(e) => updateNestedField('risk_management.last_risk_assessment', e.target.value)}
                className="form-input"
              />
            </div>

            {/* 3. Incident History Counter */}
            <div className="form-group">
              <Input
                label="Breach/Security Incident History (Count over past 2 years)"
                type="number"
                min="0"
                value={riskMgmt.breach_history || 0}
                onChange={(e) => updateNestedField('risk_management.breach_history', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>

            {/* 4. Action Strategy Checkbox Flags */}
            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label className="form-label" style={{ fontWeight: 'bold' }}>Incident Response & Disaster Strategy</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={riskMgmt.breach_notification_process || false}
                    onChange={(e) => updateNestedField('risk_management.breach_notification_process', e.target.checked)}
                  />
                  <span> Formal Breach Notification Process active (SLA matching legal/regulatory limits)</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={riskMgmt.incident_response_plan || false}
                    onChange={(e) => updateNestedField('risk_management.incident_response_plan', e.target.checked)}
                  />
                  <span> Formal Incident Response Plan established & documented</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={riskMgmt.disaster_recovery_plan || false}
                    onChange={(e) => updateNestedField('risk_management.disaster_recovery_plan', e.target.checked)}
                  />
                  <span> Formal Disaster Recovery & Business Continuity Plan operational</span>
                </label>

              </div>
            </div>

            {/* 5. Metrics Framework targets (RTO / RPO) */}
            <div className="form-row" style={{ display: 'flex', gap: '20px', marginTop: '1.5rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <Input
                  label="Recovery Time Objective (RTO in Hours)"
                  type="number"
                  min="0"
                  value={riskMgmt.rto_hours || 0}
                  onChange={(e) => updateNestedField('risk_management.rto_hours', parseInt(e.target.value) || 0)}
                  helperText="Maximum acceptable duration of downtime before system recovery."
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <Input
                  label="Recovery Point Objective (RPO in Hours)"
                  type="number"
                  min="0"
                  value={riskMgmt.rpo_hours || 0}
                  onChange={(e) => updateNestedField('risk_management.rpo_hours', parseInt(e.target.value) || 0)}
                  helperText="Maximum acceptable age of data files or backup states to restore."
                />
              </div>
            </div>

          </div>
        )}
      </FormSection>
    </div>
  );
}