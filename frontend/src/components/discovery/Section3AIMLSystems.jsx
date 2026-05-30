import React, { useState } from 'react';
import { useDiscoveryStore } from '../../store/discoveryStore';
import FormSection from './FormSection';
import Button from '../common/Button';
import Input from '../common/Input';
import '../../styles/discovery.css';

const MODEL_TYPES = [
  { id: 'prediction', label: 'Predictive Models', description: 'Risk scoring, forecasting' },
  { id: 'classification', label: 'Classification', description: 'Disease diagnosis, categorization' },
  { id: 'nlp', label: 'Natural Language Processing', description: 'Text analysis, summarization' },
  { id: 'vision', label: 'Computer Vision', description: 'Image analysis, medical imaging' },
  { id: 'recommendation', label: 'Recommendation Systems', description: 'Content or treatment suggestions' },
  { id: 'anomaly', label: 'Anomaly Detection', description: 'Fraud, unusual patterns' },
  { id: 'clustering', label: 'Clustering/Segmentation', description: 'Patient segmentation, cohort analysis' },
  { id: 'reinforcement', label: 'Reinforcement Learning', description: 'Optimization, adaptive systems' },
];

const DECISION_TYPES = [
  { id: 'autonomous', label: 'Fully Autonomous', description: 'Model makes decision alone' },
  { id: 'high_impact', label: 'Human-in-Loop (High-Impact)', description: 'Requires human approval' },
  { id: 'advisory', label: 'Advisory Only', description: 'Provides recommendation only' },
];

export default function Section3AIMLSystems() {
  // Leveraged store actions to perfectly match discoveryStore.js schema
  const { 
    discovery, 
    addAISystem, 
    updateAISystem, 
    removeAISystem, 
    updateNestedField 
  } = useDiscoveryStore();

  const aiSystems = discovery.ai_ml_systems || [];
  
  // Track skip status locally. If ai_ml_systems already has content, initialize as false.
  const [skipSection, setSkipSection] = useState(aiSystems.length === 0);

  const handleSkipToggle = (e) => {
  const shouldSkip = e.target.checked;
  
  // 1. Tell the store's validator to ignore this section
  updateNestedField('skip_ai_systems', shouldSkip);
  
  if (shouldSkip) {
    // 2. Clear out the fields so empty remnants don't linger in your state
    updateNestedField('ai_ml_systems', []);
    updateNestedField('ml_infrastructure.ml_platform', '');
  }
};

  return (
    <div className="discovery-section">
      <FormSection
        title="AI/ML Systems in Production"
        description="Document each AI/ML model currently deployed and how it impacts decisions"
      >
        {/* Skip Option Selector */}
        <div className="skip-section-wrapper" style={{ marginBottom: '1.5rem', background: '#f8f9fa', padding: '15px', borderRadius: '6px', border: '1px solid #e3e6f0' }}>
          <label className="checkbox-label" style={{ fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              checked={skipSection}
              onChange={handleSkipToggle}
            />
            <span>Our organization does not currently use or deploy any production AI/ML systems (Skip Section)</span>
          </label>
        </div>

        {skipSection ? (
          <div className="skip-notice-box" style={{ padding: '20px', textAlign: 'center', color: '#666', border: '2px dashed #ccc', borderRadius: '6px' }}>
            <p><strong>Section Skipped.</strong> You can safely proceed to the next stage.</p>
            <p style={{ fontSize: '13px', margin: '5px 0 0' }}>Uncheck the box above if you need to register a model.</p>
          </div>
        ) : (
          <>
            <div className="tip-box">
              <strong>💡 Important:</strong> Document ALL AI systems, including third-party services.
              Each system impacts compliance, governance, and bias risk.
            </div>

            {/* Existing Systems Container */}
            <div className="systems-container">
              <h4 className="systems-title">Deployed Systems</h4>

              {aiSystems.length === 0 ? (
                <div className="empty-state" style={{ padding: '20px', textAlign: 'center', border: '1px dashed #ddd', marginBottom: '15px' }}>
                  <p>No AI systems added yet</p>
                  <p className="empty-hint" style={{ fontSize: '13px', color: '#888' }}>Click below to add your first system</p>
                </div>
              ) : (
                aiSystems.map((system, index) => (
                  <div key={system.id} className="system-wrapper" style={{ border: '1px solid #e3e6f0', padding: '20px', borderRadius: '6px', marginBottom: '20px' }}>
                    <div className="system-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <h4 style={{ margin: 0 }}>System {index + 1}: {system.name || '(Untitled)'}</h4>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeAISystem(system.id)}
                      >
                        Remove
                      </Button>
                    </div>

                    <div className="system-form">
                      <div className="form-row" style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                          <label className="form-label">System Name/Purpose *</label>
                          <input
                            type="text"
                            value={system.name || ''}
                            onChange={(e) => updateAISystem(system.id, { name: e.target.value })}
                            placeholder="e.g., Patient Risk Prediction Model"
                            className="form-input"
                            required
                          />
                        </div>

                        <div className="form-group" style={{ flex: 1 }}>
                          <label className="form-label">Model Type *</label>
                          <select
                            value={system.type || ''}
                            onChange={(e) => updateAISystem(system.id, { type: e.target.value })}
                            className="form-input"
                            required
                          >
                            <option value="">Select type...</option>
                            {MODEL_TYPES.map((t) => (
                              <option key={t.id} value={t.id}>{t.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="form-row" style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                          <label className="form-label">Deployment Date</label>
                          <input
                            type="date"
                            value={system.deployed_since || ''}
                            onChange={(e) => updateAISystem(system.id, { deployed_since: e.target.value })}
                            className="form-input"
                          />
                        </div>

                        <div className="form-group" style={{ flex: 1 }}>
                          <label className="form-label">Decision Type *</label>
                          <select
                            value={system.decision_type || ''}
                            onChange={(e) => updateAISystem(system.id, { decision_type: e.target.value })}
                            className="form-input"
                            required
                          >
                            <option value="">Select...</option>
                            {DECISION_TYPES.map((t) => (
                              <option key={t.id} value={t.id}>{t.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label className="form-label">How many decisions does this model make per day?</label>
                        <input
                          type="number"
                          value={system.num_predictions_daily || ''}
                          onChange={(e) => updateAISystem(system.id, { num_predictions_daily: parseInt(e.target.value) || 0 })}
                          placeholder="e.g., 50000"
                          className="form-input"
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label className="form-label">Primary Data Sources (Comma-separated)</label>
                        <textarea
                          value={system.input_data?.join(', ') || ''}
                          onChange={(e) => updateAISystem(system.id, {
                            input_data: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                          })}
                          placeholder="PHI, EHR, lab results, demographic data..."
                          rows="3"
                          className="form-input"
                          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                      </div>

                      <div className="checklist" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' }}>
                        <label className="checkbox-item">
                          <input
                            type="checkbox"
                            checked={system.accuracy_measured || false}
                            onChange={(e) => updateAISystem(system.id, { accuracy_measured: e.target.checked })}
                          />
                          <span> Accuracy/performance regularly tested</span>
                        </label>

                        <label className="checkbox-item">
                          <input
                            type="checkbox"
                            checked={system.bias_testing || false}
                            onChange={(e) => updateAISystem(system.id, { bias_testing: e.target.checked })}
                          />
                          <span> Bias testing performed (demographic fairness)</span>
                        </label>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Explainability Documentation Method</label>
                        <input 
                          type="text"
                          value={system.explainability_method || ''}
                          placeholder="e.g., SHAP, LIME, Integrated Gradients"
                          onChange={(e) => updateAISystem(system.id, { explainability_method: e.target.value })}
                          className="form-input"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Button variant="secondary" onClick={addAISystem} fullWidth>
              + Add AI/ML System
            </Button>

            {/* ML Infrastructure Platform (Required field under state validation schemas) */}
            <div className="form-group" style={{ marginTop: '2rem' }}>
              <label className="form-label">
                ML Platform/Framework Used *
              </label>
              <select
                value={discovery.ml_infrastructure?.ml_platform || ''}
                onChange={(e) => updateNestedField('ml_infrastructure.ml_platform', e.target.value)}
                className="form-input"
                required={aiSystems.length > 0}
              >
                <option value="">Select...</option>
                <option value="custom">Custom (in-house development)</option>
                <option value="sagemaker">AWS SageMaker</option>
                <option value="vertex">Google Vertex AI</option>
                <option value="azure_ml">Azure ML</option>
                <option value="mlflow">MLflow</option>
                <option value="kubeflow">Kubeflow</option>
                <option value="huggingface">Hugging Face</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Model Governance Flags */}
            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label className="form-label" style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Model Governance Practices</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={discovery.ml_infrastructure?.model_registry || false}
                    onChange={(e) => updateNestedField('ml_infrastructure.model_registry', e.target.checked)}
                  />
                  <span> Model registry (version control enabled)</span>
                </label>
                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={discovery.ml_infrastructure?.experiment_tracking || false}
                    onChange={(e) => updateNestedField('ml_infrastructure.experiment_tracking', e.target.checked)}
                  />
                  <span> Experiment tracking active</span>
                </label>
                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={discovery.ml_infrastructure?.monitoring_enabled || false}
                    onChange={(e) => updateNestedField('ml_infrastructure.monitoring_enabled', e.target.checked)}
                  />
                  <span> Real-time model performance monitoring enabled</span>
                </label>
              </div>
            </div>
          </>
        )}
      </FormSection>
    </div>
  );
}