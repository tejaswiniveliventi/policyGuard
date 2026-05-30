import Button from '../common/Button';
//import '../../styles/form.css';

export default function SystemCard({ system, index, onRemove, onChange }) {
  return (
    <div className="system-card">
      <div className="system-card-header">
        <h4>System {index + 1}: {system.name || 'New System'}</h4>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onRemove(index)}
        >
          Remove
        </Button>
      </div>

      <div className="form-group">
        <label>System Name</label>
        <input
          type="text"
          value={system.name || ''}
          onChange={(e) =>
            onChange(index, { ...system, name: e.target.value })
          }
          placeholder="e.g., Patient Risk Prediction"
        />
      </div>

      <div className="form-group">
        <label>System Type</label>
        <select
          value={system.type || ''}
          onChange={(e) =>
            onChange(index, { ...system, type: e.target.value })
          }
        >
          <option value="">Select type...</option>
          <option value="prediction">Prediction Model</option>
          <option value="classification">Classification</option>
          <option value="nlp">Natural Language Processing</option>
          <option value="vision">Computer Vision</option>
        </select>
      </div>

      <div className="form-group">
        <label>Deployment Date</label>
        <input
          type="date"
          value={system.deployment_date || ''}
          onChange={(e) =>
            onChange(index, { ...system, deployment_date: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label>Data Sources (Comma-separated)</label>
        <input
          type="text"
          value={system.data_sources || ''}
          onChange={(e) =>
            onChange(index, { ...system, data_sources: e.target.value })
          }
          placeholder="PHI, EHR, lab results..."
        />
      </div>

      <div className="form-group">
        <label>Bias Testing Done?</label>
        <select
          value={system.bias_testing || ''}
          onChange={(e) =>
            onChange(index, { ...system, bias_testing: e.target.value })
          }
        >
          <option value="">Select...</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
          <option value="planned">Planned</option>
        </select>
      </div>
    </div>
  );
}