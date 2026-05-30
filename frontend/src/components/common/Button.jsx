/**
 * components/common/Button.jsx
 * 
 * Reusable button component with multiple variants and sizes.
 * 
 * Props:
 * - variant: 'primary' | 'secondary' | 'danger' | 'success' (default: primary)
 * - size: 'sm' | 'md' | 'lg' (default: md)
 * - disabled: boolean
 * - loading: boolean (shows spinner)
 * - fullWidth: boolean
 * - onClick: function
 * - children: React node
 */

import React from 'react';
// import './Button.css';

export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  children,
  className = '',
  type = 'button',
  ...props
}) {
  const baseClass = `btn btn-${variant} btn-${size}`;
  const finalClass = `${baseClass} ${fullWidth ? 'btn-full' : ''} ${className}`;

  return (
    <button
      type={type}
      className={finalClass}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <span className="btn-spinner">⟳</span>
          <span>{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
