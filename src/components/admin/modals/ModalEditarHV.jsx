import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import './ModalEditarHV.css';

const ModalEditarHV = ({ isOpen, onClose, onSave, hojaVida }) => {
  const [formData, setFormData] = useState({
    // Campos no editables (solo lectura)
    servicio: '',
    cliente: '',
    profesional: '',
    fechaCreacion: '',
    
    // Campos editables
    descripcion: '',
    imagenAntes: null,
    imagenDespues: null,
  });

  const [previewAntes, setPreviewAntes] = useState(null);
  const [previewDespues, setPreviewDespues] = useState(null);
  const [hasImageAntesChanged, setHasImageAntesChanged] = useState(false);
  const [hasImageDespuesChanged, setHasImageDespuesChanged] = useState(false);

  // Actualizar formData cuando cambie hojaVida
  useEffect(() => {
    if (hojaVida) {
      setFormData({
        servicio: hojaVida.servicio || '',
        cliente: hojaVida.nombreCliente || '',
        profesional: hojaVida.nombreProfesional || '',
        fechaCreacion: hojaVida.hvFechaCreacion ? formatearFecha(hojaVida.hvFechaCreacion) : '',
        descripcion: hojaVida.hvDesc || '',
        imagenAntes: null,
        imagenDespues: null,
      });
      
      // Si hay imágenes existentes, mostrarlas como preview
      if (hojaVida.hvImagenAntes) {
        const imagenAntesData = hojaVida.hvImagenAntes;
        const imagenAntesSrc = imagenAntesData.startsWith('data:image') 
          ? imagenAntesData 
          : `data:image/png;base64,${imagenAntesData}`;
        setPreviewAntes(imagenAntesSrc);
      } else {
        setPreviewAntes(null);
      }

      if (hojaVida.hvImagenDespues) {
        const imagenDespuesData = hojaVida.hvImagenDespues;
        const imagenDespuesSrc = imagenDespuesData.startsWith('data:image') 
          ? imagenDespuesData 
          : `data:image/png;base64,${imagenDespuesData}`;
        setPreviewDespues(imagenDespuesSrc);
      } else {
        setPreviewDespues(null);
      }

      setHasImageAntesChanged(false);
      setHasImageDespuesChanged(false);
    }
  }, [hojaVida]);

  const formatearFecha = (fecha) => {
    try {
      return new Date(fecha).toLocaleDateString('es-ES');
    } catch (error) {
      return fecha;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImagenChange = (e, tipo) => {
    const file = e.target.files[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor, seleccione un archivo de imagen válido');
        e.target.value = ''; // Limpiar el input
        return;
      }
      
      // Validar tamaño máximo (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        e.target.value = ''; // Limpiar el input
        return;
      }

      setFormData(prev => ({
        ...prev,
        [tipo === 'antes' ? 'imagenAntes' : 'imagenDespues']: file
      }));

      // Marcar que la imagen ha cambiado
      if (tipo === 'antes') {
        setHasImageAntesChanged(true);
      } else {
        setHasImageDespuesChanged(true);
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (tipo === 'antes') {
          setPreviewAntes(reader.result);
        } else {
          setPreviewDespues(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.descripcion.trim()) {
      alert('Por favor completa la descripción');
      return;
    }
    
    // Preparar datos para enviar - solo incluir campos que han cambiado
    const dataToSave = {
      idHv: hojaVida.idHv,
      descripcion: formData.descripcion.trim(),
      hasImageAntesChanged,
      hasImageDespuesChanged
    };
    
    try {
      // Convertir imágenes a base64 solo si se seleccionaron nuevas
      if (formData.imagenAntes && formData.imagenAntes instanceof File && hasImageAntesChanged) {
        dataToSave.imagenAntes = await convertirImagenABase64(formData.imagenAntes);
      }
      
      if (formData.imagenDespues && formData.imagenDespues instanceof File && hasImageDespuesChanged) {
        dataToSave.imagenDespues = await convertirImagenABase64(formData.imagenDespues);
      }
      
      onSave(dataToSave);
      handleCancelar();
    } catch (error) {
      console.error('Error al procesar imágenes:', error);
      alert('Error al procesar las imágenes');
    }
  };

  // Función para convertir archivo a base64
  const convertirImagenABase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Extraer solo la parte base64 (sin el prefijo data:image/...)
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleCancelar = () => {
    // Resetear formulario
    setFormData({
      servicio: '',
      cliente: '',
      profesional: '',
      fechaCreacion: '',
      descripcion: '',
      imagenAntes: null,
      imagenDespues: null,
    });
    setPreviewAntes(null);
    setPreviewDespues(null);
    setHasImageAntesChanged(false);
    setHasImageDespuesChanged(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="mehv-overlay" onClick={handleCancelar}></div>
      
      <div className="mehv-modal">
        <div className="mehv-header">
          <h2 className="mehv-title">Editar Hoja de Vida</h2>
          <button className="mehv-close" onClick={handleCancelar}>
            <X size={18} />
          </button>
        </div>

        <div className="mehv-content">
          {/* Campos no editables - Primera fila */}
          <div className="mehv-row">
            <div className="mehv-form-group">
              <label className="mehv-label">Nombre del Servicio</label>
              <input
                type="text"
                value={formData.servicio}
                className="mehv-input-disabled"
                disabled
                readOnly
              />
            </div>
            <div className="mehv-form-group">
              <label className="mehv-label">Nombre del Cliente</label>
              <input
                type="text"
                value={formData.cliente}
                className="mehv-input-disabled"
                disabled
                readOnly
              />
            </div>
          </div>

          {/* Campos no editables - Segunda fila */}
          <div className="mehv-row">
            <div className="mehv-form-group">
              <label className="mehv-label">Profesional Asignado</label>
              <input
                type="text"
                value={formData.profesional}
                className="mehv-input-disabled"
                disabled
                readOnly
              />
            </div>
            <div className="mehv-form-group">
              <label className="mehv-label">Fecha de Creación</label>
              <input
                type="text"
                value={formData.fechaCreacion}
                className="mehv-input-disabled"
                disabled
                readOnly
              />
            </div>
          </div>

          {/* Descripción - Editable */}
          <div className="mehv-form-group">
            <label className="mehv-label">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder="Describe el procedimiento realizado..."
              className="mehv-textarea"
              rows={4}
            />
          </div>

          {/* Imágenes Antes y Después */}
          <div className="mehv-imagenes-container">
            {/* Imagen Antes */}
            <div className="mehv-imagen-group">
              <label className="mehv-label">Imagen Antes</label>
              <div
                className="mehv-dropzone"
                onClick={() => document.getElementById('imagenAntes').click()}
              >
                {previewAntes ? (
                  <div className="mehv-preview-container">
                    <img src={previewAntes} alt="Antes" className="mehv-preview-image" />
                    <p className="mehv-dropzone-text-small">Haz clic para cambiar imagen</p>
                  </div>
                ) : (
                  <>
                    <Upload size={28} className="mehv-upload-icon" />
                    <p className="mehv-dropzone-text">Subir imagen</p>
                  </>
                )}
                <input
                  id="imagenAntes"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImagenChange(e, 'antes')}
                  className="mehv-file-input"
                />
              </div>
            </div>

            {/* Imagen Después */}
            <div className="mehv-imagen-group">
              <label className="mehv-label">Imagen Después</label>
              <div
                className="mehv-dropzone"
                onClick={() => document.getElementById('imagenDespues').click()}
              >
                {previewDespues ? (
                  <div className="mehv-preview-container">
                    <img src={previewDespues} alt="Después" className="mehv-preview-image" />
                    <p className="mehv-dropzone-text-small">Haz clic para cambiar imagen</p>
                  </div>
                ) : (
                  <>
                    <Upload size={28} className="mehv-upload-icon" />
                    <p className="mehv-dropzone-text">Subir imagen</p>
                  </>
                )}
                <input
                  id="imagenDespues"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImagenChange(e, 'despues')}
                  className="mehv-file-input"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mehv-footer">
          <button className="mehv-btn-cancelar" onClick={handleCancelar}>
            Cancelar
          </button>
          <button className="mehv-btn-actualizar" onClick={handleSubmit}>
            Actualizar
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalEditarHV;