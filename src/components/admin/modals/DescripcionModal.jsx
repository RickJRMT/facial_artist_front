import React from 'react';
import './DescripcionModal.css';

const DescripcionModal = ({ isOpen, onClose, descripcion, titulo }) => {
  if (!isOpen) return null;

  return (
    <div className="descripcion-modal-overlay" onClick={onClose}>
      <div className="descripcion-modal-container" onClick={e => e.stopPropagation()}>
        <div className="descripcion-modal-header">
          <h3>{titulo}</h3>
          <button className="descripcion-modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="descripcion-modal-content">
          <p>{descripcion}</p>
        </div>
      </div>
    </div>
  );
};

export default DescripcionModal;