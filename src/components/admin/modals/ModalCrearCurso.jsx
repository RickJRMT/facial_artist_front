import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import './ModalCrearCurso.css';

/**
 * Modal para crear un nuevo curso
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Controla la visibilidad del modal
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {Function} props.onSave - Función que maneja el envío del formulario
 */
const ModalCrearCurso = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    duracion: '',
    costo: '',
    descripcion: '',
    imagen: null,
    estado: 'activo'
  });

  const [errors, setErrors] = useState({
    nombre: '',
    descripcion: '',
    costo: '',
    duracion: '',
    imagen: ''
  });

  const [imagenPreview, setImagenPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Verificar si el formulario es válido
  const isFormValid = () => {
    return (
      formData.nombre.trim() !== '' &&
      formData.descripcion.length >= 10 &&
      formData.costo.trim() !== '' &&
      formData.duracion.trim() !== '' &&
      formData.imagen !== null &&
      !Object.values(errors).some(error => error !== '')
    );
  };

  // Función para formatear números como moneda colombiana
  const formatCurrency = (value) => {
    // Eliminar todo excepto números
    const numbers = value.replace(/[^\d]/g, '');
    
    // Convertir a formato de moneda colombiana (con puntos)
    const formatted = new Intl.NumberFormat('es-CO', {
      style: 'decimal',
      maximumFractionDigits: 0
    }).format(numbers);

    return formatted;
  };

  // Función para limpiar el formato de moneda
  const cleanCurrencyFormat = (value) => {
    return value.replace(/\./g, '');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    let error = '';

    switch (name) {
      case 'nombre':
        // Solo permitir letras, números y espacios
        const nombreRegex = /^[a-zA-Z0-9\s]*$/;
        if (!nombreRegex.test(value)) {
          error = 'El nombre solo puede contener letras, números y espacios';
          return; // No actualizar el valor si contiene caracteres no permitidos
        } else if (value.trim() === '') {
          error = 'El nombre es obligatorio';
        }
        break;

      case 'descripcion':
        if (value.trim() === '') {
          error = 'La descripción es obligatoria';
        } else if (value.length < 10) {
          error = `La descripción debe tener al menos 10 caracteres. Actualmente: ${value.length}`;
        }
        break;

      case 'costo':
        if (value === '') {
          error = 'El costo es obligatorio';
        } else {
          // Primero limpiar cualquier formato existente
          const cleanValue = cleanCurrencyFormat(value);
          // Verificar que solo contenga números
          if (!/^\d*$/.test(cleanValue)) {
            error = 'Ingrese solo números';
          } else if (parseInt(cleanValue) <= 0) {
            error = 'El costo debe ser mayor a 0';
          } else {
            // Si es válido, formatear como moneda colombiana
            newValue = formatCurrency(cleanValue);
          }
        }
        break;

      case 'duracion':
        if (value.trim() === '') {
          error = 'La duración es obligatoria';
        }
        break;

      default:
        break;
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Función para convertir archivo a base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  /**
   * Maneja el cambio de la imagen seleccionada
   * Valida el tipo y tamaño de la imagen, y crea una vista previa
   * @param {Event} e - Evento del input de tipo file
   */
  const handleImagenChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          imagen: 'Por favor, seleccione un archivo de imagen válido'
        }));
        return;
      }
      
      // Validar tamaño máximo (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          imagen: 'La imagen no debe superar los 5MB'
        }));
        return;
      }

      try {
        const base64 = await fileToBase64(file);
        setFormData(prev => ({
          ...prev,
          imagen: base64
        }));
        setImagenPreview(base64);
        setErrors(prev => ({
          ...prev,
          imagen: ''
        }));
      } catch (error) {
        console.error('Error al convertir imagen:', error);
        setErrors(prev => ({
          ...prev,
          imagen: 'Error al procesar la imagen'
        }));
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        // Validar tamaño máximo (5MB)
        if (file.size > 5 * 1024 * 1024) {
          setErrors(prev => ({
            ...prev,
            imagen: 'La imagen no debe superar los 5MB'
          }));
          return;
        }

        try {
          const base64 = await fileToBase64(file);
          setFormData(prev => ({
            ...prev,
            imagen: base64
          }));
          setImagenPreview(base64);
          setErrors(prev => ({
            ...prev,
            imagen: ''
          }));
        } catch (error) {
          console.error('Error al convertir imagen:', error);
          setErrors(prev => ({
            ...prev,
            imagen: 'Error al procesar la imagen'
          }));
        }
      } else {
        setErrors(prev => ({
          ...prev,
          imagen: 'Por favor, seleccione un archivo de imagen válido'
        }));
      }
    }
  };

  const handleSubmit = () => {
    if (!isFormValid()) {
      // Mostrar errores si el formulario no es válido
      const newErrors = { ...errors };
      
      if (formData.nombre.trim() === '') {
        newErrors.nombre = 'El nombre es obligatorio';
      }
      if (formData.descripcion.length < 10) {
        newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
      }
      if (formData.costo.trim() === '') {
        newErrors.costo = 'El costo es obligatorio';
      }
      if (formData.duracion.trim() === '') {
        newErrors.duracion = 'La duración es obligatoria';
      }
      if (formData.imagen === null) {
        newErrors.imagen = 'La imagen es obligatoria';
      }
      
      setErrors(newErrors);
      return;
    }

    // Limpiar el costo del formato colombiano antes de convertir
    const costoLimpio = cleanCurrencyFormat(formData.costo);
    const costoNumerico = parseFloat(costoLimpio);

    // Preparar los datos para el envío
    const submitData = {
      ...formData,
      // Convertir el costo: primero limpiar el formato y luego convertir a número
      costo: costoNumerico
    };

    // Validación final del costo
    if (isNaN(submitData.costo) || submitData.costo <= 0) {
      setErrors(prev => ({
        ...prev,
        costo: 'El costo debe ser un valor válido mayor a 0'
      }));
      return;
    }

    onSave(submitData);
    handleCancelar();
  };

  const handleCancelar = () => {
    setFormData({
      nombre: '',
      duracion: '',
      costo: '',
      descripcion: '',
      imagen: null,
      estado: 'activo'
    });
    setImagenPreview(null);
    setErrors({
      nombre: '',
      descripcion: '',
      costo: '',
      duracion: '',
      imagen: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="modal-crear-curso-overlay" onClick={handleCancelar}></div>
      
      {/* Modal */}
      <div className="modal-crear-curso-modal">
        {/* Header */}
        <div className="modal-crear-curso-header">
          <h2 className="modal-crear-curso-title">Crear Nuevo Curso</h2>
          <button className="modal-crear-curso-close-button" onClick={handleCancelar}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="modal-crear-curso-content">
          {/* Nombre del curso */}
          <div className="modal-crear-curso-form-group">
            <label className="modal-crear-curso-label">Nombre del curso *</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Ej. Curso Básico de Limpieza Facial"
              className={`modal-crear-curso-input ${errors.nombre ? 'input-error' : ''}`}
            />
            {errors.nombre && <span className="error-message">{errors.nombre}</span>}
          </div>

          {/* Duración y Costo en la misma fila */}
          <div className="modal-crear-curso-row">
            <div className="modal-crear-curso-form-group">
              <label className="modal-crear-curso-label">Duración *</label>
              <input
                type="text"
                name="duracion"
                value={formData.duracion}
                onChange={handleInputChange}
                placeholder="Ej. 8 horas, 2 días, 1 semana"
                className={`modal-crear-curso-input ${errors.duracion ? 'input-error' : ''}`}
              />
              {errors.duracion && <span className="error-message">{errors.duracion}</span>}
            </div>
            <div className="modal-crear-curso-form-group">
              <label className="modal-crear-curso-label">Costo ($) *</label>
              <input
                type="text"
                name="costo"
                value={formData.costo}
                onChange={handleInputChange}
                placeholder="Ingrese el costo del curso"
                className={`modal-crear-curso-input ${errors.costo ? 'input-error' : ''}`}
              />
              {errors.costo && <span className="error-message">{errors.costo}</span>}
            </div>
          </div>

          {/* Estado del curso */}
          <div className="modal-crear-curso-form-group">
            <label className="modal-crear-curso-label">Estado del curso</label>
            <select
              name="estado"
              className="modal-crear-curso-input"
              value={formData.estado}
              onChange={handleInputChange}
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          {/* Descripción */}
          <div className="modal-crear-curso-form-group">
            <label className="modal-crear-curso-label">Descripción *</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder="Describe el contenido y objetivos del curso (mínimo 10 caracteres)..."
              className={`modal-crear-curso-textarea ${errors.descripcion ? 'input-error' : ''}`}
              rows={3}
            />
            {errors.descripcion && <span className="error-message">{errors.descripcion}</span>}
          </div>

          {/* Imagen del curso */}
          <div className="modal-crear-curso-form-group">
            <label className="modal-crear-curso-label">Imagen del curso *</label>
            <div
              className={`modal-crear-curso-dropzone ${isDragging ? 'modal-crear-curso-dropzone-active' : ''} ${errors.imagen ? 'dropzone-error' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('fileInput').click()}
            >
              {imagenPreview ? (
                <div className="modal-crear-curso-preview-container">
                  <img src={imagenPreview} alt="Preview" className="modal-crear-curso-preview-image" />
                  <p className="modal-crear-curso-dropzone-text-small">Haz clic para cambiar la imagen</p>
                </div>
              ) : (
                <>
                  <Upload size={36} className="modal-crear-curso-upload-icon" />
                  <p className="modal-crear-curso-dropzone-text">
                    Arrastra una imagen aquí o haz clic para seleccionar
                  </p>
                  <p className="modal-crear-curso-dropzone-hint">
                    Máximo 5MB - JPG, PNG o GIF
                  </p>
                </>
              )}
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleImagenChange}
                className="modal-crear-curso-file-input"
              />
            </div>
            {errors.imagen && <span className="error-message">{errors.imagen}</span>}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-crear-curso-footer">
          <button className="modal-crear-curso-btn-cancelar" onClick={handleCancelar}>
            Cancelar
          </button>
          <button 
            className={`modal-crear-curso-btn-crear ${!isFormValid() ? 'btn-disabled' : ''}`}
            onClick={handleSubmit}
            disabled={!isFormValid()}
          >
            Crear Curso
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalCrearCurso;