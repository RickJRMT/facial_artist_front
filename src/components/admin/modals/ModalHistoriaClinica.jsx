import React, { useState } from 'react';
import { X, Edit, Trash2, Calendar, Clock, User } from 'lucide-react';
import './ModalHistoriaClinica.css';

/**
 * Modal para mostrar las historias clínicas de un cliente
 * Permite visualizar historias clínicas existentes
 */
const ModalHistoriaClinica = ({ isOpen, onClose, cliente }) => {

  // Datos de ejemplo de historias clínicas
  const historiasClinicas = [
    {
      id: 1,
      titulo: 'Consulta inicial',
      subtitulo: 'Evaluación facial completa',
      descripcion: 'Primera consulta para evaluar el estado de la piel y determinar tratamiento.',
      fecha: '2024-01-15',
      hora: '10:00',
      doctor: 'Dr. Ana'
    },
    {
      id: 2,
      titulo: 'Limpieza facial profunda',
      subtitulo: 'Limpieza facial con extracción',
      descripcion: 'Limpieza profunda con vapor y extracción de comedones.',
      fecha: '2024-01-22',
      hora: '11:30',
      doctor: 'Dr. Sofia'
    }
  ];

  if (!isOpen || !cliente) return null;

  const handleEditHV = (hv) => {
    // Función placeholder para futura implementación
    console.log('Editar HV:', hv);
  };

  const handleDeleteHV = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta historia clínica?')) {
      console.log('Eliminar HV:', id);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-historia-clinica">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            Historia Clínica - {cliente.nombreCliente}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="modal-content">
          {/* Lista de Historias Clínicas */}
          <div className="historias-list">
            {historiasClinicas.map((hv) => (
              <div key={hv.id} className="historia-card">
                <div className="historia-content">
                  <h3 className="historia-titulo">{hv.titulo}</h3>
                  <p className="historia-subtitulo">{hv.subtitulo}</p>
                  
                  <div className="historia-details">
                    <div className="detail-item">
                      <Calendar size={14} />
                      <span>{hv.fecha}</span>
                    </div>
                    <div className="detail-item">
                      <Clock size={14} />
                      <span>{hv.hora}</span>
                    </div>
                    <div className="detail-item">
                      <User size={14} />
                      <span>{hv.doctor}</span>
                    </div>
                  </div>
                  
                  <p className="historia-descripcion">{hv.descripcion}</p>
                </div>
                
                <div className="historia-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => handleEditHV(hv)}
                    title="Editar"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDeleteHV(hv.id)}
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            
            {historiasClinicas.length === 0 && (
              <div className="empty-historias">
                <p>No hay historias clínicas registradas</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalHistoriaClinica;
