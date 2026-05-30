/**
 * components/common/Modal.jsx
 * 
 * Reusable modal/dialog component with title, body, and footer.
 * 
 * Props:
 * - isOpen: boolean
 * - onClose: function
 * - title: string
 * - children: React node (body content)
 * - footer: React node (footer buttons)
 * - size: 'sm' | 'md' | 'lg' (default: md)
 */

import React, { useEffect } from 'react';
//import './Modal.css';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeButton = true,
}) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal modal-${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          {closeButton && (
            <button className="modal-close" onClick={onClose}>
              ✕
            </button>
          )}
        </div>

        <div className="modal-body">{children}</div>

        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
