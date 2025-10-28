import React, { useState } from 'react';
import { X } from 'lucide-react';
import './ImagenModal.css';

/**
 * Componente modal para visualizar imágenes de servicios
 * Muestra la imagen en base64 con un tamaño preestablecido
 */
const ImagenModal = ({ isOpen, onClose, imagen }) => {
  const [errorLoading, setErrorLoading] = useState(false);

  // No renderizar si el modal no está abierto
  if (!isOpen) return null;

  // No renderizar si no hay imagen
  if (!imagen) {
    console.warn('ImagenModal: No se proporcionó imagen');
    return null;
  }

  const handleImageError = (e) => {
    console.error('Error al cargar la imagen:', e);
    setErrorLoading(true);
  };

  const handleLoad = () => {
    setErrorLoading(false);
  };

  return (
    <div className="imagen-modal-overlay" onClick={onClose}>
      <div className="imagen-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="imagen-modal-header">
          <h3 className="imagen-modal-title">Imagen del Servicio</h3>
          <button className="imagen-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="imagen-modal-content">
          {errorLoading ? (
            <div className="imagen-modal-error">
              <p>Error al cargar la imagen</p>
              <p className="error-details">La imagen no está disponible o el formato es incorrecto</p>
            </div>
          ) : (
            <img 
              src={imagen} 
              alt="Imagen del servicio" 
              className="imagen-modal-image"
              onError={handleImageError}
              onLoad={handleLoad}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagenModal;

