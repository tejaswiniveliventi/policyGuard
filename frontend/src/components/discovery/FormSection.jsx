import '../../styles/form.css';

export default function FormSection({ title, description, children }) {
  return (
    <div className="form-section">
      <div className="section-header">
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </div>
      <div className="section-content">
        {children}
      </div>
    </div>
  );
}