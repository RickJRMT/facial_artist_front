import React from 'react';
import './EliminarServicioModal.css';
import { AlertTriangle, X } from 'lucide-react';

const EliminarServicioModal = ({ isOpen, onClose, onConfirm, servicioNombre }) => {
  if (!isOpen) return null;

  return (
    <div className="eliminar-modal-overlay" onClick={onClose}>
      <div className="eliminar-modal-container" onClick={e => e.stopPropagation()}>
        <div className="eliminar-modal-header">
          <div className="eliminar-icon-container">
            <AlertTriangle size={24} />
          </div>
          <button className="eliminar-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="eliminar-modal-content">
          <h3>¿Eliminar servicio?</h3>
          <p>
            ¿Estás seguro de que deseas eliminar el servicio <strong>"{servicioNombre}"</strong>?
          </p>
          <div className="eliminar-warning">
            <strong>⚠️ Importante:</strong> Antes de eliminar este servicio, verifica que no existan citas activas asociadas a él. Si hay citas programadas con este servicio, la eliminación fallará.
          </div>
          <p className="eliminar-notice">
            Esta acción no se puede deshacer.
          </p>
        </div>

        <div className="eliminar-modal-actions">
          <button 
            className="eliminar-btn-cancelar" 
            onClick={onClose}
          >
            Cancelar
          </button>
          <button 
            className="eliminar-btn-confirmar" 
            onClick={onConfirm}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EliminarServicioModal;

