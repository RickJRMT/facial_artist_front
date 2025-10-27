import { useState, useEffect } from 'react';
import './EditarServicioModal.css';

/**
 * Modal para editar un servicio existente
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Controla la visibilidad del modal
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {Function} props.onSubmit - Función que maneja el envío del formulario
 * @param {Object} props.servicio - Datos del servicio a editar
 */
const EditarServicioModal = ({ isOpen, onClose, onSubmit, servicio }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    duracion: '',
    precio: '',
    imagen: null
  });

  const [errors, setErrors] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    duracion: '',
    imagen: ''
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [hasImageChanged, setHasImageChanged] = useState(false);
  
  // Cargar datos del servicio cuando se abre el modal
  useEffect(() => {
    if (isOpen && servicio) {
      setFormData({
        nombre: servicio.nombre || '',
        descripcion: servicio.descripcion || '',
        duracion: servicio.duracion ? servicio.duracion.toString() : '',
        precio: servicio.precio ? formatCurrency(servicio.precio.toString()) : '',
        imagen: null
      });

      // Si el servicio tiene imagen, mostrarla como preview
      if (servicio.imagen) {
        const imagenSrc = servicio.imagen.startsWith('data:image') 
          ? servicio.imagen 
          : `data:image/png;base64,${servicio.imagen}`;
        setPreviewImage(imagenSrc);
      } else {
        setPreviewImage(null);
      }

      setHasImageChanged(false);
      setErrors({
        nombre: '',
        descripcion: '',
        precio: '',
        duracion: '',
        imagen: ''
      });
    }
  }, [isOpen, servicio]);

  // Verificar si el formulario es válido
  const isFormValid = () => {
    return (
      formData.nombre.trim() !== '' &&
      formData.descripcion.length >= 50 &&
      formData.precio.trim() !== '' &&
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    let error = '';

    switch (name) {
      case 'nombre':
        if (value.trim() === '') {
          error = 'El nombre es obligatorio';
        }
        break;

      case 'descripcion':
        if (value.trim() === '') {
          error = 'La descripción es obligatoria';
        } else if (value.length < 50) {
          error = `La descripción debe tener al menos 50 caracteres. Actualmente: ${value.length}`;
        }
        break;

      case 'precio':
        if (value === '') {
          error = 'El precio es obligatorio';
        } else {
          // Primero limpiar cualquier formato existente
          const cleanValue = cleanCurrencyFormat(value);
          // Verificar que solo contenga números
          if (!/^\d*$/.test(cleanValue)) {
            error = 'Ingrese solo números';
          } else if (parseInt(cleanValue) <= 0) {
            error = 'El precio debe ser mayor a 0';
          } else {
            // Si es válido, formatear como moneda colombiana
            newValue = formatCurrency(cleanValue);
          }
        }
        break;

      case 'duracion':
        if (value === '') {
          error = 'La duración es obligatoria';
        } else if (!/^\d+$/.test(value)) {
          error = 'Ingrese solo números';
        } else if (parseInt(value) <= 0) {
          error = 'La duración debe ser mayor a 0';
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
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor, seleccione un archivo de imagen válido');
        return;
      }
      
      // Validar tamaño máximo (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        imagen: file
      }));

      setHasImageChanged(true);

      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    // Preparar los datos para el envío
    const submitData = {
      ...formData,
      // Convertir el precio: primero limpiar el formato y luego convertir a número
      precio: parseInt(cleanCurrencyFormat(formData.precio)),
      // Convertir la duración a número si existe
      duracion: formData.duracion ? parseInt(formData.duracion) : 60,
      // Incluir información sobre si la imagen cambió
      hasImageChanged: hasImageChanged
    };

    // Validación final del precio
    if (isNaN(submitData.precio) || submitData.precio <= 0) {
      setErrors(prev => ({
        ...prev,
        precio: 'El precio debe ser un valor válido mayor a 0'
      }));
      return;
    }

    onSubmit(submitData);
  };

  // Función para limpiar el formulario
  const handleCleanForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      duracion: '',
      precio: '',
      imagen: null
    });
    setPreviewImage(null);
    setHasImageChanged(false);
    setErrors({
      nombre: '',
      descripcion: '',
      precio: '',
      duracion: '',
      imagen: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Editar Servicio</h2>
          <button className="modal-close-btn" onClick={handleCleanForm}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Nombre del Servicio *</label>
              <input
                type="text"
                name="nombre"
                className={`form-input ${errors.nombre ? 'input-error' : ''}`}
                placeholder="Ingrese el nombre del servicio"
                value={formData.nombre}
                onChange={handleChange}
              />
              {errors.nombre && <span className="error-message">{errors.nombre}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Descripción *</label>
              <textarea
                name="descripcion"
                className={`form-textarea ${errors.descripcion ? 'input-error' : ''}`}
                placeholder="Ingrese la descripción del servicio (mínimo 50 caracteres)"
                value={formData.descripcion}
                onChange={handleChange}
                rows={4}
              />
              {errors.descripcion && <span className="error-message">{errors.descripcion}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Duración (minutos)</label>
              <input
                type="text"
                name="duracion"
                className={`form-input ${errors.duracion ? 'input-error' : ''}`}
                placeholder="Ej: 60"
                value={formData.duracion}
                onChange={handleChange}
              />
              {errors.duracion && <span className="error-message">{errors.duracion}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Precio *</label>
              <input
                type="text"
                name="precio"
                className={`form-input ${errors.precio ? 'input-error' : ''}`}
                placeholder="Ingrese el precio del servicio"
                value={formData.precio}
                onChange={handleChange}
              />
              {errors.precio && <span className="error-message">{errors.precio}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Imagen del Servicio</label>
              <div className="image-upload-container">
                <label className="image-upload-label">
                  <input
                    type="file"
                    className="image-input"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="image-preview" />
                  ) : (
                    <>
                      <svg
                        className="upload-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="upload-text">
                        {servicio?.imagen ? 'Cambiar imagen' : 'Arrastra una imagen aquí o haz clic para seleccionar'}
                      </p>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancelar" onClick={handleCleanForm}>
              Cancelar
            </button>
            <button 
              type="submit" 
              className={`btn-crear ${!isFormValid() ? 'btn-disabled' : ''}`}
              disabled={!isFormValid()}
            >
              Actualizar Servicio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarServicioModal;
