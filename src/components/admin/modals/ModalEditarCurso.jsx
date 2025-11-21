import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import './ModalEditarCurso.css';

/**
 * Modal para editar un curso existente
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Controla la visibilidad del modal
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {Function} props.onSave - Función que maneja el envío del formulario
 * @param {Object} props.curso - Datos del curso a editar
 */
const ModalEditarCurso = ({ isOpen, onClose, onSave, curso }) => {
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
  const [imagenCambiada, setImagenCambiada] = useState(false);

  // Cargar datos del curso cuando se abre el modal
  useEffect(() => {
    if (isOpen && curso) {
      const costoValue = curso.costo || curso.cursoCosto || curso.precio || '';
      
      // Limpiar el costo de formato colombiano: 15000.00 -> 15000
      const costoCleaned = costoValue 
        ? costoValue.toString()
            .replace(/\./g, '')      // Eliminar puntos separadores: 150.000,00 -> 150000,00
            .replace(/,/g, '')       // Eliminar comas decimales: 150000,00 -> 15000000
            .slice(0, -2) || ''      // Remover últimos 2 dígitos (decimales): 15000000 -> 150000
        : '';
      
      setFormData({
        nombre: curso.nombre || curso.nombreCurso || '',
        duracion: curso.duracion || curso.cursoDuracion || '',
        costo: costoCleaned,
        descripcion: curso.descripcion || curso.cursoDescripcion || '',
        imagen: null,
        estado: curso.estado || curso.cursoEstado || 'activo'
      });
      
      // Si el curso tiene imagen, mostrarla como preview
      if (curso.imagen || curso.cursoImagen) {
        setImagenPreview(curso.imagen || curso.cursoImagen);
      } else {
        setImagenPreview(null);
      }
      
      setImagenCambiada(false);
      setErrors({
        nombre: '',
        descripcion: '',
        costo: '',
        duracion: '',
        imagen: ''
      });
    }
  }, [isOpen, curso]);

  // Verificar si el formulario es válido
  const isFormValid = () => {
    return (
      formData.nombre.trim() !== '' &&
      formData.descripcion.length >= 10 &&
      formData.costo.trim() !== '' &&
      formData.duracion.trim() !== '' &&
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

  /**
   * Maneja el cambio de la imagen seleccionada
   * Valida el tipo y tamaño de la imagen, y crea una vista previa
   * @param {Event} e - Evento del input de tipo file
   */
  const handleImagenChange = (e) => {
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

      setFormData(prev => ({
        ...prev,
        imagen: file
      }));

      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result);
        setImagenCambiada(true);
      };
      reader.readAsDataURL(file);
      
      setErrors(prev => ({
        ...prev,
        imagen: ''
      }));
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
      
      setErrors(newErrors);
      return;
    }

    // Limpiar el costo del formato colombiano antes de convertir
    const costoLimpio = cleanCurrencyFormat(formData.costo);
    const costoNumerico = parseFloat(costoLimpio);

    // Preparar los datos para el envío
    const submitData = {
      ...formData,
      costo: costoNumerico,
      imagenCambiada: imagenCambiada
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
    handleCleanForm();
  };

  // Función para limpiar el formulario
  const handleCleanForm = () => {
    setFormData({
      nombre: '',
      duracion: '',
      costo: '',
      descripcion: '',
      imagen: null,
      estado: 'activo'
    });
    setImagenPreview(null);
    setImagenCambiada(false);
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
      <div className="modal-editar-curso-overlay" onClick={handleCleanForm}></div>
      
      {/* Modal */}
      <div className="modal-editar-curso-modal">
        {/* Header */}
        <div className="modal-editar-curso-header">
          <h2 className="modal-editar-curso-title">Editar Curso</h2>
          <button className="modal-editar-curso-close-button" onClick={handleCleanForm}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          {/* Content */}
          <div className="modal-editar-curso-content">
            {/* Nombre del curso */}
            <div className="modal-editar-curso-form-group">
              <label className="modal-editar-curso-label">Nombre del curso *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ej. Curso Básico de Limpieza Facial"
                className={`modal-editar-curso-input ${errors.nombre ? 'input-error' : ''}`}
              />
              {errors.nombre && <span className="error-message">{errors.nombre}</span>}
            </div>

            {/* Duración y Costo en la misma fila */}
            <div className="modal-editar-curso-row">
              <div className="modal-editar-curso-form-group">
                <label className="modal-editar-curso-label">Duración *</label>
                <input
                  type="text"
                  name="duracion"
                  value={formData.duracion}
                  onChange={handleInputChange}
                  placeholder="Ej. 8 horas, 2 días, 1 semana"
                  className={`modal-editar-curso-input ${errors.duracion ? 'input-error' : ''}`}
                />
                {errors.duracion && <span className="error-message">{errors.duracion}</span>}
              </div>
              <div className="modal-editar-curso-form-group">
                <label className="modal-editar-curso-label">Costo ($) *</label>
                <input
                  type="text"
                  name="costo"
                  value={formData.costo}
                  onChange={handleInputChange}
                  placeholder="Ingrese el costo del curso"
                  className={`modal-editar-curso-input ${errors.costo ? 'input-error' : ''}`}
                />
                {errors.costo && <span className="error-message">{errors.costo}</span>}
              </div>
            </div>

            {/* Estado del curso */}
            <div className="modal-editar-curso-form-group">
              <label className="modal-editar-curso-label">Estado del curso</label>
              <select
                name="estado"
                className="modal-editar-curso-input"
                value={formData.estado}
                onChange={handleInputChange}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

            {/* Descripción */}
            <div className="modal-editar-curso-form-group">
              <label className="modal-editar-curso-label">Descripción *</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                placeholder="Describe el contenido y objetivos del curso (mínimo 10 caracteres)..."
                className={`modal-editar-curso-textarea ${errors.descripcion ? 'input-error' : ''}`}
                rows={3}
              />
              {errors.descripcion && <span className="error-message">{errors.descripcion}</span>}
            </div>

            {/* Imagen del curso */}
            <div className="modal-editar-curso-form-group">
              <label className="modal-editar-curso-label">Imagen del curso</label>
              <div className="image-upload-container">
                <label className="image-upload-label">
                  <input
                    type="file"
                    className="image-input"
                    accept="image/*"
                    onChange={handleImagenChange}
                  />
                  {imagenPreview ? (
                    <img src={imagenPreview} alt="Preview" className="image-preview" />
                  ) : (
                    <>
                      <Upload size={48} className="upload-icon" />
                      <p className="upload-text">
                        Arrastra una imagen aquí o haz clic para seleccionar
                      </p>
                    </>
                  )}
                </label>
              </div>
              {errors.imagen && <span className="error-message">{errors.imagen}</span>}
            </div>
          </div>

          {/* Footer */}
          <div className="modal-editar-curso-footer">
            <button type="button" className="modal-editar-curso-btn-cancelar" onClick={handleCleanForm}>
              Cancelar
            </button>
            <button 
              type="submit"
              className={`modal-editar-curso-btn-guardar ${!isFormValid() ? 'btn-disabled' : ''}`}
              disabled={!isFormValid()}
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ModalEditarCurso;
