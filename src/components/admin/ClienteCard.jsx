import React from 'react';
import { FileText, Phone, Calendar, User, Hash } from 'lucide-react';
import './ClienteCard.css';

/**
 * Componente de tarjeta para mostrar información de un cliente
 * Diseñado para dispositivos móviles con diseño tipo card
 */
const ClienteCard = ({ cliente, onVerHojasVida }) => {
  
  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Función para formatear fecha y hora
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '-';
    const date = new Date(dateTimeString);
    return date.toLocaleString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para calcular la edad
  const calculateAge = (birthDate) => {
    if (!birthDate) return '-';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleVerHojasVida = () => {
    if (onVerHojasVida) {
      onVerHojasVida(cliente);
    }
  };

  return (
    <div className="cliente-card-container">
      {/* Header con nombre e ID */}
      <div className="cliente-card-header">
        <div className="cliente-card-title-section">
          <div className="cliente-card-icon-wrapper">
            <User size={20} className="cliente-card-user-icon" />
          </div>
          <div className="cliente-card-title-content">
            <h4 className="cliente-card-nombre">{cliente.nombreCliente}</h4>
            <div className="cliente-card-id">
              <Hash size={12} />
              <span>{cliente.idCliente}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body con información del cliente */}
      <div className="cliente-card-body">
        <div className="cliente-card-info-row">
          <div className="cliente-card-info-item">
            <Phone size={16} className="cliente-card-info-icon" />
            <div className="cliente-card-info-content">
              <span className="cliente-card-info-label">Celular</span>
              <span className="cliente-card-info-value">{cliente.celularCliente}</span>
            </div>
          </div>
        </div>

        <div className="cliente-card-info-row">
          <div className="cliente-card-info-item">
            <Calendar size={16} className="cliente-card-info-icon" />
            <div className="cliente-card-info-content">
              <span className="cliente-card-info-label">Nacimiento</span>
              <span className="cliente-card-info-value">
                {formatDate(cliente.fechaNacCliente)} ({calculateAge(cliente.fechaNacCliente)} años)
              </span>
            </div>
          </div>
        </div>

        <div className="cliente-card-info-row">
          <div className="cliente-card-info-item">
            <Calendar size={16} className="cliente-card-info-icon" />
            <div className="cliente-card-info-content">
              <span className="cliente-card-info-label">Registro</span>
              <span className="cliente-card-info-value">
                {formatDateTime(cliente.fechaRegistro)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer con botón de acción */}
      <div className="cliente-card-footer">
        <button
          className="cliente-card-btn-hv"
          onClick={handleVerHojasVida}
          title="Ver hojas de vida"
        >
          <FileText size={16} />
          <span>Ver Hojas de Vida</span>
        </button>
      </div>
    </div>
  );
};

export default ClienteCard;
