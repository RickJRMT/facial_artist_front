import React, { useState, useEffect } from 'react';
import { X, Edit, Trash2, Calendar, Clock, User, AlertCircle } from 'lucide-react';
import './ModalHojasVida.css';
import { useHojasVida } from '../../../hooks/useHojasVida';

const ModalHojasVida = ({ isOpen, onClose, cliente }) => {
  const { hojasVida, loading, error, eliminarHoja, actualizarLista } = useHojasVida(cliente?.idCliente);

  const handleEditar = (hoja) => {
    alert(`Editar: ${hoja.hvDesc || 'Hoja de vida'}`);
  };

  const handleEliminar = async (idHv) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta hoja de vida?')) {
      const success = await eliminarHoja(idHv);
      if (success) {
        alert('Hoja de vida eliminada correctamente');
      } else {
        alert('Error al eliminar la hoja de vida');
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
    </>
  );
};

export default ModalHojasVida;