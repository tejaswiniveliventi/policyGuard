import '../../styles/form.css';

export default function CheckboxGroup({ items, selected, onChange, help }) {
  return (
    <div className="checkbox-group">
      {help && <p className="checkbox-help-text">{help}</p>}
      {items.map((item) => (
        <label key={item.id} className="checkbox-item">
          <input
            type="checkbox"
            checked={selected.includes(item.id)}
            onChange={(e) => {
              if (e.target.checked) {
                onChange([...selected, item.id]);
              } else {
                onChange(selected.filter((id) => id !== item.id));
              }
            }}
          />
          <span className="checkbox-label">{item.label}</span>
          {item.description && (
            <span className="checkbox-description">{item.description}</span>
          )}
        </label>
      ))}
    </div>
  );
}