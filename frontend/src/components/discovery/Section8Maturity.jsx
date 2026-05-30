import React from 'react';
import { useDiscoveryStore } from '../../store/discoveryStore';
import FormSection from './FormSection';
import '../../styles/discovery.css';

const MATURITY_LEVELS = {
  0: 'Ad Hoc - No formal process',
  1: 'Initial - Basic/informal process',
  2: 'Repeatable - Documented process',
  3: 'Managed - Monitored & measured',
  4: 'Optimized - Continuous improvement',
};

export default function Section8Maturity() {
  const { discovery, updateNestedField } = useDiscoveryStore();

  const maturity = discovery.organization_maturity || {};
  const isSkipped = discovery.skip_maturity_section || false;

  const handleSkipToggle = (e) => {
    const shouldSkip = e.target.checked;
    
    // Set skip flag at root level via updateNestedField helper
    updateNestedField('skip_maturity_section', shouldSkip);
    
    if (shouldSkip) {
      // Clear store data inside organization_maturity schema when skipped
      updateNestedField('organization_maturity', {
        security_maturity: 0,
        governance_maturity: 0,
        data_quality_maturity: 0,
        ai_readiness: 0,
      });
    }
  };

  return (
    <div className="discovery-section">
      <FormSection
        title="Organizational Maturity Assessment"
        description="Assess your current AI governance, security, and compliance maturity profiles"
      >
        {/* Skip Option Selector */}
        <div className="skip-section-wrapper" style={{ marginBottom: '1.5rem', background: '#f8f9fa', padding: '15px', borderRadius: '6px', border: '1px solid #e3e6f0' }}>
          <label className="checkbox-label" style={{ fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              checked={isSkipped}
              onChange={handleSkipToggle}
            />
            <span>Skip this assessment (We prefer to skip optional self-scoring maturity levels)</span>
          </label>
        </div>

        {isSkipped ? (
          <div className="skip-notice-box" style={{ padding: '20px', textAlign: 'center', color: '#666', border: '2px dashed #ccc', borderRadius: '6px' }}>
            <p><strong>Section Skipped.</strong> Optional maturity index evaluation bypassed.</p>
            <p style={{ fontSize: '13px', margin: '5px 0 0' }}>Uncheck the box above if you want to complete the subjective grading matrix.</p>
          </div>
        ) : (
          <div className="section-content">
            <p className="section-instruction">
              For each area below, select the level that best describes your organization (0-4):
            </p>

            <div className="maturity-scale" style={{ marginBottom: '2rem', padding: '15px', background: '#f8f9fa', borderRadius: '6px' }}>
              {Object.entries(MATURITY_LEVELS).map(([level, description]) => (
                <div key={level} className="maturity-level" style={{ fontSize: '14px', marginBottom: '4px' }}>
                  <strong>Level {level}:</strong> {description}
                </div>
              ))}
            </div>

            {/* 1. Security Maturity Index */}
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                Security & Access Control Maturity
              </label>
              <div className="radio-group" style={{ display: 'flex', gap: '20px' }}>
                {[0, 1, 2, 3, 4].map((level) => (
                  <label key={level} className="radio-item" style={{ cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="security_maturity"
                      value={level}
                      checked={(maturity.security_maturity || 0) === level}
                      onChange={(e) => updateNestedField('organization_maturity.security_maturity', parseInt(e.target.value))}
                    />
                    <span> Level {level}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 2. Governance Maturity Index */}
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                Operational & Compliance Governance Maturity
              </label>
              <div className="radio-group" style={{ display: 'flex', gap: '20px' }}>
                {[0, 1, 2, 3, 4].map((level) => (
                  <label key={level} className="radio-item" style={{ cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="governance_maturity"
                      value={level}
                      checked={(maturity.governance_maturity || 0) === level}
                      onChange={(e) => updateNestedField('organization_maturity.governance_maturity', parseInt(e.target.value))}
                    />
                    <span> Level {level}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 3. Data Quality Maturity Index */}
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                Data Quality Management Maturity
              </label>
              <div className="radio-group" style={{ display: 'flex', gap: '20px' }}>
                {[0, 1, 2, 3, 4].map((level) => (
                  <label key={level} className="radio-item" style={{ cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="data_quality_maturity"
                      value={level}
                      checked={(maturity.data_quality_maturity || 0) === level}
                      onChange={(e) => updateNestedField('organization_maturity.data_quality_maturity', parseInt(e.target.value))}
                    />
                    <span> Level {level}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 4. AI Readiness Index */}
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                Enterprise AI/ML Deployment Readiness
              </label>
              <div className="radio-group" style={{ display: 'flex', gap: '20px' }}>
                {[0, 1, 2, 3, 4].map((level) => (
                  <label key={level} className="radio-item" style={{ cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="ai_readiness"
                      value={level}
                      checked={(maturity.ai_readiness || 0) === level}
                      onChange={(e) => updateNestedField('organization_maturity.ai_readiness', parseInt(e.target.value))}
                    />
                    <span> Level {level}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        )}
      </FormSection>
    </div>
  );
}