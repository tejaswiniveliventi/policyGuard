import '../styles/progress.css';

export default function ProgressBar({ currentStep, totalSteps }) {
  return (
    <div className="progress-container">
      <div className="progress-bar-wrapper">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`progress-step ${
              i < currentStep ? 'completed' : i === currentStep ? 'active' : ''
            }`}
          />
        ))}
      </div>
      <div className="progress-info">
        <span>Step {currentStep + 1} of {totalSteps}</span>
        <span>
          {Math.round(((currentStep + 1) / totalSteps) * 100)}% complete
        </span>
      </div>
    </div>
  );
}