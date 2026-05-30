/**
 * components/common/Input.jsx
 * 
 * Reusable input component with label, error, and helper text.
 * 
 * Props:
 * - label: string
 * - type: 'text' | 'email' | 'password' | 'number' | 'date' | 'textarea'
 * - value: string
 * - onChange: function
 * - error: string (error message)
 * - disabled: boolean
 * - placeholder: string
 * - required: boolean
 */

import React from 'react';
//import './Input.css';

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  error,
  disabled = false,
  placeholder = '',
  required = false,
  helperText,
  className = '',
  ...props
}) {
  const isTextarea = type === 'textarea';
  const Component = isTextarea ? 'textarea' : 'input';

  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <Component
        type={isTextarea ? undefined : type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`input ${error ? 'input-error' : ''}`}
        {...props}
      />
      {error && <span className="input-error-text">{error}</span>}
      {helperText && <span className="input-helper-text">{helperText}</span>}
    </div>
  );
}
