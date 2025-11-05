import React, { useState } from 'react';
import { X, Edit, Trash2, Calendar, Clock, User } from 'lucide-react';
import './ModalHojasVida.css';

const ModalHojasVida = ({ isOpen, onClose, cliente }) => {
  const [hojasVida, setHojasVida] = useState([
    {
      id: 1,
      titulo: 'Consulta inicial',
      subtitulo: 'Evaluación facial completa',
      fecha: '2024-01-15',
      hora: '10:00',
      profesional: 'Dr. Ana',
      descripcion: 'Primera consulta para evaluar el estado de la piel y determinar tratamiento.'
    },
    {
      id: 2,
      titulo: 'Limpieza facial profunda',
      subtitulo: 'Limpieza facial con extracción',
      fecha: '2024-01-22',
      hora: '11:30',
      profesional: 'Dr. Sofía',
      descripcion: 'Limpieza profunda con vapor y extracción de comedones.'
    }
  ]);

  const handleEditar = (hoja) => {
    alert(`Editar: ${hoja.titulo}`);
  };

  const handleEliminar = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta hoja de vida?')) {
      setHojasVida(hojasVida.filter(h => h.id !== id));
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
          <div className="mhv-lista-container">
            {hojasVida.map((hoja) => (
              <div key={hoja.id} className="mhv-hoja-card">
                <div className="mhv-card-header">
                  <div className="mhv-card-header-left">
                    <h3 className="mhv-card-titulo">{hoja.titulo}</h3>
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
                      onClick={() => handleEliminar(hoja.id)}
                      title="Eliminar"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <p className="mhv-card-subtitulo">{hoja.subtitulo}</p>

                <div className="mhv-metadata">
                  <div className="mhv-metadata-item">
                    <Calendar size={14} className="mhv-metadata-icon" />
                    <span>{hoja.fecha}</span>
                  </div>
                  <div className="mhv-metadata-item">
                    <Clock size={14} className="mhv-metadata-icon" />
                    <span>{hoja.hora}</span>
                  </div>
                  <div className="mhv-metadata-item">
                    <User size={14} className="mhv-metadata-icon" />
                    <span>{hoja.profesional}</span>
                  </div>
                </div>

                <p className="mhv-descripcion">{hoja.descripcion}</p>
              </div>
            ))}

            {hojasVida.length === 0 && (
              <div className="mhv-empty-state">
                <p>No hay hojas de vida registradas</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalHojasVida;