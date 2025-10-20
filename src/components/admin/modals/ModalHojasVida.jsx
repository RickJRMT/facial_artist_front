import React, { useState } from 'react';
import { X, Plus, Edit, Trash2, Calendar, Clock, User } from 'lucide-react';
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

  const handleCrearNueva = () => {
    alert('Abrir formulario para crear nueva hoja de vida');
  };

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
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-hv">
        <div className="modal-header">
          <h2 className="modal-title">
            Hoja de Vida - {cliente?.nombre}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-content">
          <div className="action-bar">
            <button className="btn-crear" onClick={handleCrearNueva}>
              <Plus size={20} />
              <span>Crear Nueva H/V</span>
            </button>
          </div>

          <div className="lista-container">
            {hojasVida.map((hoja) => (
              <div key={hoja.id} className="hoja-card">
                <div className="card-header">
                  <div className="card-header-left">
                    <h3 className="card-titulo">{hoja.titulo}</h3>
                    <div className="action-buttons">
                      <button
                        className="btn-edit"
                        onClick={() => handleEditar(hoja)}
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleEliminar(hoja.id)}
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <p className="card-subtitulo">{hoja.subtitulo}</p>

                <div className="metadata">
                  <div className="metadata-item">
                    <Calendar size={14} className="metadata-icon" />
                    <span>{hoja.fecha}</span>
                  </div>
                  <div className="metadata-item">
                    <Clock size={14} className="metadata-icon" />
                    <span>{hoja.hora}</span>
                  </div>
                  <div className="metadata-item">
                    <User size={14} className="metadata-icon" />
                    <span>{hoja.profesional}</span>
                  </div>
                </div>

                <p className="descripcion">{hoja.descripcion}</p>
              </div>
            ))}

            {hojasVida.length === 0 && (
              <div className="empty-state">
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