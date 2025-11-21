import React, { useState, useEffect } from 'react';
import { X, Edit, Trash2, Calendar, Clock, User, AlertCircle, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';
import './ModalHojasVida.css';
import { useHojasVida } from '../../../hooks/useHojasVida';
import ModalEditarHV from './ModalEditarHV';
import ModalMensaje from '../../layout/ModalMensaje';

const ModalHojasVida = ({ isOpen, onClose, cliente }) => {
  const { hojasVida, loading, error, eliminarHoja, actualizarHoja, actualizarLista } = useHojasVida(cliente?.idCliente);
  
  // Estados para el modal de edición
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [hojaSeleccionada, setHojaSeleccionada] = useState(null);
  
  // Estado para controlar qué acordeones están abiertos
  const [imagenesAbiertas, setImagenesAbiertas] = useState({});
  
  // Estado para el modal de mensajes
  const [modalMensaje, setModalMensaje] = useState({
    isOpen: false,
    type: 'success',
    mensaje: ''
  });

  const handleEditar = (hoja) => {
    setHojaSeleccionada(hoja);
    setModalEditarOpen(true);
  };

  const toggleImagenes = (idHv) => {
    setImagenesAbiertas(prev => ({
      ...prev,
      [idHv]: !prev[idHv]
    }));
  };

  const convertirImagenAURL = (imagenBase64) => {
    if (!imagenBase64) return null;
    if (imagenBase64.startsWith('data:image')) return imagenBase64;
    return `data:image/png;base64,${imagenBase64}`;
  };

  const handleGuardarEdicion = async (datosActualizados) => {
    try {
      const success = await actualizarHoja(datosActualizados.idHv, datosActualizados);
      
      if (success) {
        setModalMensaje({
          isOpen: true,
          type: 'success',
          mensaje: 'Hoja de vida actualizada correctamente'
        });
        setModalEditarOpen(false);
        setHojaSeleccionada(null);
      } else {
        setModalMensaje({
          isOpen: true,
          type: 'error',
          mensaje: 'Error al actualizar la hoja de vida'
        });
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
      setModalMensaje({
        isOpen: true,
        type: 'error',
        mensaje: 'Error al actualizar la hoja de vida'
      });
    }
  };

  const handleEliminar = async (idHv) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta hoja de vida?')) {
      const success = await eliminarHoja(idHv);
      if (success) {
        setModalMensaje({
          isOpen: true,
          type: 'success',
          mensaje: 'Hoja de vida eliminada correctamente'
        });
      } else {
        setModalMensaje({
          isOpen: true,
          type: 'error',
          mensaje: 'Error al eliminar la hoja de vida'
        });
      }
    }
  };

  const formatearFecha = (fecha) => {
    try {
      return new Date(fecha).toLocaleDateString('es-ES');
    } catch (error) {
      return fecha;
    }
  };

  const formatearHora = (hora) => {
    try {
      // Si la hora viene en formato HH:MM:SS, tomar solo HH:MM
      return hora.substring(0, 5);
    } catch (error) {
      return hora;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="mhv-overlay" onClick={onClose}></div>
      <div className="mhv-modal">
        <div className="mhv-header">
          <h2 className="mhv-title">
            Hoja de Vida - {cliente?.nombreCliente || 'Cliente'}
          </h2>
          <button className="mhv-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="mhv-content">
          {loading && (
            <div className="mhv-loading">
              <p>Cargando hojas de vida...</p>
            </div>
          )}

          {error && (
            <div className="mhv-error">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="mhv-lista-container">
              {hojasVida.map((hoja) => (
                <div key={hoja.idHv} className="mhv-hoja-card">
                  <div className="mhv-card-header">
                    <div className="mhv-card-header-left">
                      <h3 className="mhv-card-titulo">{hoja.servicio}</h3>
                      <div className="mhv-card-underline"></div>
                    </div>
                    <div className="mhv-action-buttons">
                      <button
                        className="mhv-btn-edit"
                        onClick={() => handleEditar(hoja)}
                        title="Editar"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        className="mhv-btn-delete"
                        onClick={() => handleEliminar(hoja.idHv)}
                        title="Eliminar"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  <p className="mhv-card-subtitulo">Cita #{hoja.idCita}</p>

                  <div className="mhv-metadata">
                    <div className="mhv-metadata-item">
                      <Calendar size={14} className="mhv-metadata-icon" />
                      <span>{formatearFecha(hoja.fechaCita)}</span>
                    </div>
                    <div className="mhv-metadata-item">
                      <Clock size={14} className="mhv-metadata-icon" />
                      <span>{formatearHora(hoja.horaCita)}</span>
                    </div>
                    <div className="mhv-metadata-item">
                      <User size={14} className="mhv-metadata-icon" />
                      <span>{hoja.nombreProfesional}</span>
                    </div>
                  </div>

                  <div className="mhv-hv-info">
                    <div className="mhv-hv-fecha">
                      <strong>Fecha de creación HV:</strong> {formatearFecha(hoja.hvFechaCreacion)}
                    </div>
                    <p className="mhv-descripcion">{hoja.hvDesc}</p>
                  </div>

                  {/* Botón para ver imágenes */}
                  <button 
                    className="mhv-toggle-imagenes"
                    onClick={() => toggleImagenes(hoja.idHv)}
                  >
                    <ImageIcon size={16} />
                    <span>Ver imágenes</span>
                    {imagenesAbiertas[hoja.idHv] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {/* Panel desplegable de imágenes */}
                  {imagenesAbiertas[hoja.idHv] && (
                    <div className="mhv-imagenes-panel">
                      <div className="mhv-imagenes-grid">
                        {/* Imagen Antes */}
                        <div className="mhv-imagen-item">
                          <h4 className="mhv-imagen-titulo">Antes</h4>
                          {hoja.hvImagenAntes ? (
                            <img 
                              src={convertirImagenAURL(hoja.hvImagenAntes)} 
                              alt="Antes del tratamiento" 
                              className="mhv-imagen-preview"
                            />
                          ) : (
                            <div className="mhv-imagen-vacia">
                              <ImageIcon size={32} />
                              <p>Sin imagen</p>
                            </div>
                          )}
                        </div>

                        {/* Imagen Después */}
                        <div className="mhv-imagen-item">
                          <h4 className="mhv-imagen-titulo">Después</h4>
                          {hoja.hvImagenDespues ? (
                            <img 
                              src={convertirImagenAURL(hoja.hvImagenDespues)} 
                              alt="Después del tratamiento" 
                              className="mhv-imagen-preview"
                            />
                          ) : (
                            <div className="mhv-imagen-vacia">
                              <ImageIcon size={32} />
                              <p>Sin imagen</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {hojasVida.length === 0 && (
                <div className="mhv-empty-state">
                  <p>No hay hojas de vida registradas para este cliente</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Edición */}
      <ModalEditarHV
        isOpen={modalEditarOpen}
        onClose={() => {
          setModalEditarOpen(false);
          setHojaSeleccionada(null);
        }}
        onSave={handleGuardarEdicion}
        hojaVida={hojaSeleccionada}
      />

      {/* Modal de Mensaje */}
      {modalMensaje.isOpen && (
        <ModalMensaje
          type={modalMensaje.type}
          mensaje={modalMensaje.mensaje}
          onClose={() => setModalMensaje({ isOpen: false, type: 'success', mensaje: '' })}
        />
      )}
    </>
  );
};

export default ModalHojasVida;