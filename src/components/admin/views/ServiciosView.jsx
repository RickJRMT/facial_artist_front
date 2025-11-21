import React, { useState, useEffect } from 'react';
import { obtenerServicios, crearServicio, eliminarServicio, actualizarServicio } from '../../../Services/ServiciosConexion';
import { Search, Plus, Eye, Edit, Trash2, Grid, List } from 'lucide-react';
import CrearServicioModal from '../modals/CrearServicioModal';
import EditarServicioModal from '../modals/EditarServicioModal';
import DescripcionModal from '../modals/DescripcionModal';
import ImagenModal from '../modals/ImagenModal';
import EliminarServicioModal from '../modals/EliminarServicioModal';
import ModalMensaje from '../../layout/ModalMensaje';
import './ServiciosView.css';

/**
 * Componente principal para la gestión de servicios en el panel de administración
 * Permite listar, buscar, crear, editar y eliminar servicios
 */
const ServiciosView = () => {
  // Estados para el manejo de datos y UI
  const [searchTerm, setSearchTerm] = useState('');
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isMobile, setIsMobile] = useState(false);
  const [descripcionModal, setDescripcionModal] = useState({
    isOpen: false,
    descripcion: '',
    titulo: ''
  });
  const [imagenModal, setImagenModal] = useState({
    isOpen: false,
    imagen: ''
  });
  const [eliminarModal, setEliminarModal] = useState({
    isOpen: false,
    servicioId: null,
    servicioNombre: ''
  });
  const [editarModal, setEditarModal] = useState({
    isOpen: false,
    servicio: null
  });
  const [modalMensaje, setModalMensaje] = useState({
    isOpen: false,
    type: 'success',
    mensaje: ''
  });

  /**
   * Efecto para detectar el tamaño de pantalla
   */
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  /**
   * Efecto para cargar la lista de servicios al montar el componente
   */
  useEffect(() => {
    const fetchServicios = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await obtenerServicios();
        setServicios(data);
      } catch (err) {
        setError('Error al cargar los servicios');
      } finally {
        setLoading(false);
      }
    };
    fetchServicios();
  }, []);

  const filteredServicios = servicios.filter(servicio =>
    servicio.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular la paginación
  const totalPages = Math.ceil(filteredServicios.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentServicios = filteredServicios.slice(startIndex, endIndex);

  // Resetear página cuando cambia el filtro de búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Funciones de paginación
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Scroll hacia arriba - en móviles scroll a la tabla, en desktop al inicio
    const scrollTarget = isMobile 
      ? document.querySelector('.servicios-table-card')?.offsetTop || 0
      : 0;
    window.scrollTo({ top: scrollTarget - (isMobile ? 20 : 0), behavior: 'smooth' });
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisible = isMobile ? 3 : 5; // Menos botones en móviles
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="servicios-pagination-btn"
        >
          1
        </button>
      );
      if (start > 2) {
        buttons.push(
          <span key="ellipsis-start" className="servicios-pagination-ellipsis">
            ...
          </span>
        );
      }
    }

    for (let i = start; i <= end; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`servicios-pagination-btn ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        buttons.push(
          <span key="ellipsis-end" className="servicios-pagination-ellipsis">
            ...
          </span>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="servicios-pagination-btn"
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  // Función para manejar el cambio en el campo de búsqueda con validación
  const handleSearchChange = (e) => {
    const value = e.target.value;
    // Solo permitir letras, números y espacios
    const searchRegex = /^[a-zA-Z0-9\s]*$/;
    if (searchRegex.test(value)) {
      setSearchTerm(value);
    }
  };

  const handleNuevoServicio = () => {
    setModalOpen(true);
  };

  const handleSubmitServicio = async (formData) => {
    try {
      // Función para limpiar el formato de moneda
      const cleanCurrencyFormat = (value) => {
        return value.replace(/\./g, '');
      };

      // Limpiar el precio del formato colombiano antes de convertir
      const precioCleaned = cleanCurrencyFormat(formData.precio.toString());
      const servCosto = parseFloat(precioCleaned);
      const servDuracion = parseInt(formData.duracion);

      // Validar que los valores numéricos sean válidos
      if (isNaN(servCosto) || servCosto <= 0) {
        throw new Error('El costo debe ser un valor numérico válido mayor a 0');
      }

      if (isNaN(servDuracion) || servDuracion <= 0) {
        throw new Error('La duración debe ser un valor numérico válido mayor a 0');
      }

      let servicioData = new FormData();

      // Agregar los campos básicos
      servicioData.append('servNombre', formData.nombre);
      servicioData.append('servDescripcion', formData.descripcion);
      servicioData.append('servCosto', servCosto);
      servicioData.append('servDuracion', servDuracion);
      servicioData.append('servEstado', formData.estado);

      // Si hay una imagen, procesarla
      if (formData.imagen) {
        servicioData.append('servImagen', formData.imagen);
      }

      // Convertir FormData a objeto regular
      const plainData = {};
      for (let [key, value] of servicioData.entries()) {
        plainData[key] = value;
      }

      // Si hay imagen, convertirla a base64
      if (formData.imagen) {
        const base64Image = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
          };
          reader.readAsDataURL(formData.imagen);
        });
        plainData.servImagen = base64Image;
      }

      
      await crearServicio(plainData);
      // Actualizar la lista de servicios
      const nuevosServicios = await obtenerServicios();
      setServicios(nuevosServicios);
      setModalOpen(false);
    } catch (error) {
      console.error('Error al crear el servicio:', error);
      setModalMensaje({
        isOpen: true,
        type: 'error',
        mensaje: 'Error al crear el servicio. Por favor, intente nuevamente.'
      });
    }
  };

  const handleSubmitEditarServicio = async (formData) => {
    try {
      // Función para limpiar el formato de moneda
      const cleanCurrencyFormat = (value) => {
        return value.replace(/\./g, '');
      };

      // Limpiar el precio del formato colombiano antes de convertir
      const precioCleaned = cleanCurrencyFormat(formData.precio.toString());
      const servCosto = parseFloat(precioCleaned);
      const servDuracion = parseInt(formData.duracion);

      // Validar que los valores numéricos sean válidos
      if (isNaN(servCosto) || servCosto <= 0) {
        throw new Error('El costo debe ser un valor numérico válido mayor a 0');
      }

      if (isNaN(servDuracion) || servDuracion <= 0) {
        throw new Error('La duración debe ser un valor numérico válido mayor a 0');
      }

      let servicioData = new FormData();

      // Agregar los campos básicos
      servicioData.append('servNombre', formData.nombre);
      servicioData.append('servDescripcion', formData.descripcion);
      servicioData.append('servCosto', servCosto);
      servicioData.append('servDuracion', servDuracion);
      servicioData.append('servEstado', formData.estado);

      // Si hay una imagen nueva, procesarla
      if (formData.imagen && formData.hasImageChanged) {
        servicioData.append('servImagen', formData.imagen);
      } else if (editarModal.servicio && editarModal.servicio.imagen) {
        // Si no hay imagen nueva, mantener la imagen original
        servicioData.append('servImagen', editarModal.servicio.imagen);
      }

      // Convertir FormData a objeto regular
      const plainData = {};
      for (let [key, value] of servicioData.entries()) {
        plainData[key] = value;
      }

      // Si hay imagen nueva, convertirla a base64
      if (formData.imagen && formData.hasImageChanged) {
        const base64Image = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
          };
          reader.readAsDataURL(formData.imagen);
        });
        plainData.servImagen = base64Image;
      } else if (editarModal.servicio && editarModal.servicio.imagen) {
        // Si no hay imagen nueva, mantener la imagen original en base64
        plainData.servImagen = editarModal.servicio.imagen;
      }

      // Actualizar el servicio
      await actualizarServicio(editarModal.servicio.id, plainData);
      
      // Actualizar la lista de servicios
      const nuevosServicios = await obtenerServicios();
      setServicios(nuevosServicios);
      
      // Cerrar el modal
      setEditarModal({
        isOpen: false,
        servicio: null
      });
      
      setModalMensaje({
        isOpen: true,
        type: 'success',
        mensaje: 'Servicio actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar el servicio:', error);
      setModalMensaje({
        isOpen: true,
        type: 'error',
        mensaje: 'Error al actualizar el servicio. Por favor, intente nuevamente.'
      });
    }
  };

  const handleVisualizar = (servicio) => {
    // Verificar si el servicio tiene imagen
    if (servicio.imagen) {
      const imagen = servicio.imagen;
      // Si la imagen no tiene el prefijo data:image, agregarlo
      const imagenSrc = imagen.startsWith('data:image') 
        ? imagen 
        : `data:image/png;base64,${imagen}`;
      
      setImagenModal({
        isOpen: true,
        imagen: imagenSrc
      });
    } else {
      setModalMensaje({
        isOpen: true,
        type: 'error',
        mensaje: 'Este servicio no tiene imagen disponible'
      });
    }
  };

  const handleEditarServicio = (servicio) => {
    setEditarModal({
      isOpen: true,
      servicio: servicio
    });
  };

  const handleEliminarServicio = (servicio) => {
    setEliminarModal({
      isOpen: true,
      servicioId: servicio.id,
      servicioNombre: servicio.nombre
    });
  };

  const handleConfirmarEliminacion = async () => {
    try {
      await eliminarServicio(eliminarModal.servicioId);
      // Actualizar la lista de servicios después de eliminar
      const nuevosServicios = await obtenerServicios();
      setServicios(nuevosServicios);
      setEliminarModal({ isOpen: false, servicioId: null, servicioNombre: '' });
    } catch (error) {
      console.error('Error al eliminar el servicio:', error);
      
      let mensajeError;
      
      // Verificar si es un error por citas activas
      if (error.code === 'ACTIVE_APPOINTMENTS' || error.message.includes('citas')) {
        mensajeError = `❌ No se puede eliminar el servicio "${eliminarModal.servicioNombre}"\n\n🔗 Este servicio tiene citas activas asociadas.\n\nPara eliminarlo debes:\n• Cancelar o completar todas las citas programadas\n• Verificar que no hay citas pendientes en el sistema\n• Luego podrás eliminarlo sin problemas\n\n💡 Tip: Revisa la sección de "Citas" para gestionar las citas asociadas.`;
      } else {
        mensajeError = `Error al eliminar el servicio "${eliminarModal.servicioNombre}". Por favor, intente nuevamente o contacte al administrador del sistema.`;
      }
      
      setModalMensaje({
        isOpen: true,
        type: 'error',
        mensaje: mensajeError
      });
      setEliminarModal({ isOpen: false, servicioId: null, servicioNombre: '' });
    }
  };

  return (
    <div className="servicios-container">
      {/* Header */}
      <div className="servicios-header">
        <div className="servicios-title-container">
          <h1 className="servicios-title">Servicios</h1>
          <p className="servicios-subtitle">Gestión de servicios y tratamientos</p>
        </div>
        <button className="btn-nuevo-servicio" onClick={handleNuevoServicio}>
          <Plus size={isMobile ? 18 : 16} />
          <span>{isMobile ? 'Nuevo' : 'Nuevo Servicio'}</span>
        </button>
      </div>

      {/* Modal de Crear Servicio */}
      <CrearServicioModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitServicio}
      />

      {/* Modal de Editar Servicio */}
      <EditarServicioModal
        isOpen={editarModal.isOpen}
        onClose={() => setEditarModal({ isOpen: false, servicio: null })}
        onSubmit={handleSubmitEditarServicio}
        servicio={editarModal.servicio}
      />

      {/* Modal de Descripción */}
      <DescripcionModal
        isOpen={descripcionModal.isOpen}
        onClose={() => setDescripcionModal(prev => ({ ...prev, isOpen: false }))}
        descripcion={descripcionModal.descripcion}
        titulo={descripcionModal.titulo}
      />

      {/* Modal de Imagen */}
      <ImagenModal
        isOpen={imagenModal.isOpen}
        onClose={() => setImagenModal(prev => ({ ...prev, isOpen: false }))}
        imagen={imagenModal.imagen}
      />

      {/* Modal de Eliminar Servicio */}
      <EliminarServicioModal
        isOpen={eliminarModal.isOpen}
        onClose={() => setEliminarModal({ isOpen: false, servicioId: null, servicioNombre: '' })}
        onConfirm={handleConfirmarEliminacion}
        servicioNombre={eliminarModal.servicioNombre}
      />

      {/* Search Bar */}
      <div className="servicios-search-section">
        <div className="servicios-search-bar">
          <input
            type="text"
            placeholder="Buscar servicios por nombre..."
            className="servicios-search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Servicios Table/Cards */}
      <div className="servicios-table-card">
        <h3 className="servicios-table-title">Lista de Servicios</h3>
        
        {loading ? (
          <div className="servicios-empty-state">
            <p>Cargando servicios...</p>
          </div>
        ) : error ? (
          <div className="servicios-empty-state">
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* Vista Desktop - Tabla */}
            {!isMobile && (
              <div className="servicios-table-wrapper">
                <table className="servicios-table">
                  <thead>
                    <tr className="servicios-table-header">
                      <th>ID</th>
                      <th>Servicio</th>
                      <th>Descripción</th>
                      <th>Imagen</th>
                      <th>Costo</th>
                      <th>Duración (min)</th>
                      <th>Estado</th>
                      <th>Opciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentServicios.map((servicio) => (
                      <tr key={servicio.id} className="servicios-table-row">
                        <td>{servicio.id}</td>
                        <td>
                          <span className="servicio-nombre">{servicio.nombre}</span>
                        </td>
                        <td>
                          <span 
                            className="descripcion-truncada"
                            onClick={() => setDescripcionModal({
                              isOpen: true,
                              descripcion: servicio.descripcion,
                              titulo: servicio.nombre
                            })}
                            title="Click para ver descripción completa"
                          >
                            {servicio.descripcion}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="servicios-btn-visualizar"
                            onClick={() => handleVisualizar(servicio)}
                          >
                            <Eye size={16} />
                            <span>Visualizar</span>
                          </button>
                        </td>
                        <td>
                          <span className="costo">
                            ${new Intl.NumberFormat('es-CO', { 
                              maximumFractionDigits: 0 
                            }).format(servicio.costo)}
                          </span>
                        </td>
                        <td>
                          <span className="duracion">
                            {servicio.servDuracion}
                          </span>
                        </td>
                        <td>
                          <span className={`estado-badge estado-${servicio.estado || servicio.servEstado || 'activo'}`}>
                            {(servicio.estado || servicio.servEstado || 'activo').charAt(0).toUpperCase() + (servicio.estado || servicio.servEstado || 'activo').slice(1)}
                          </span>
                        </td>
                        <td>
                          <div className="servicios-action-buttons">
                            <button 
                              className="servicios-btn-edit"
                              onClick={() => handleEditarServicio(servicio)}
                              title="Editar"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              className="servicios-btn-delete"
                              onClick={() => handleEliminarServicio(servicio)}
                              title="Eliminar"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Vista Mobile - Tarjetas */}
            {isMobile && (
              <div className="servicios-cards-container">
                {currentServicios.map((servicio) => (
                  <div key={servicio.id} className="servicio-card">
                    <div className="servicio-card-header">
                      <div className="servicio-card-title">
                        <h4 className="servicio-nombre">{servicio.nombre}</h4>
                        <span className="servicio-id">#{servicio.id}</span>
                      </div>
                      <span className={`estado-badge estado-${servicio.estado || servicio.servEstado || 'activo'}`}>
                        {(servicio.estado || servicio.servEstado || 'activo').charAt(0).toUpperCase() + (servicio.estado || servicio.servEstado || 'activo').slice(1)}
                      </span>
                    </div>

                    <div className="servicio-card-body">
                      <div className="servicio-info-row">
                        <span className="servicio-info-label">Precio:</span>
                        <span className="costo">
                          ${new Intl.NumberFormat('es-CO', { 
                            maximumFractionDigits: 0 
                          }).format(servicio.costo)}
                        </span>
                      </div>
                      
                      <div className="servicio-info-row">
                        <span className="servicio-info-label">Duración:</span>
                        <span className="duracion">
                          {servicio.servDuracion} min
                        </span>
                      </div>

                      <div className="servicio-descripcion">
                        <span className="servicio-info-label">Descripción:</span>
                        <p 
                          className="descripcion-truncada-mobile"
                          onClick={() => setDescripcionModal({
                            isOpen: true,
                            descripcion: servicio.descripcion,
                            titulo: servicio.nombre
                          })}
                        >
                          {servicio.descripcion}
                        </p>
                      </div>
                    </div>

                    <div className="servicio-card-actions">
                      <button 
                        className="servicios-btn-visualizar-mobile"
                        onClick={() => handleVisualizar(servicio)}
                      >
                        <Eye size={14} />
                        Ver Imagen
                      </button>
                      <div className="servicios-action-buttons-mobile">
                        <button 
                          className="servicios-btn-edit-mobile"
                          onClick={() => handleEditarServicio(servicio)}
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="servicios-btn-delete-mobile"
                          onClick={() => handleEliminarServicio(servicio)}
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredServicios.length === 0 && (
              <div className="servicios-empty-state">
                <p>No se encontraron servicios</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Paginación */}
      {!loading && !error && filteredServicios.length > 0 && (
        <div className="servicios-pagination-container">
          <div className="servicios-pagination-info">
            Mostrando {startIndex + 1} - {Math.min(endIndex, filteredServicios.length)} de {filteredServicios.length} servicios
          </div>
          <div className="servicios-pagination-controls">
            <button
              className="servicios-pagination-btn servicios-pagination-nav"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            {renderPaginationButtons()}
            <button
              className="servicios-pagination-btn servicios-pagination-nav"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
      
      {/* Modal de Mensaje */}
      {modalMensaje.isOpen && (
        <ModalMensaje
          type={modalMensaje.type}
          mensaje={modalMensaje.mensaje}
          onClose={() => setModalMensaje({ isOpen: false, type: 'success', mensaje: '' })}
        />
      )}
    </div>
  );
};

export default ServiciosView;