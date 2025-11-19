import "./ModalEliminarCita.css";
import React from "react";

const ModalEliminarCita = ({ cita, onClose, onConfirm }) => {
    if (!cita) return null;

    const formatearHora = (horaStr) => {
        if (!horaStr) return 'N/A';
        try {
            return new Date(`2025-01-01 ${horaStr}`).toLocaleTimeString('es-ES', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }).replace('.', '.').toLowerCase();
        } catch {
            return horaStr;
        }
    };

    const handleConfirmar = () => {
        onConfirm(cita.idCita);
        onClose();
    };

    return (
        <div className="eliminar-overlay">
            <div className="eliminar-modal">
                <button className="eliminar-btn-cerrar" onClick={onClose}>
                    ×
                </button>

                <div className="eliminar-header">
                    <div className="eliminar-icono">
                        🗑️
                    </div>
                    <h2 className="eliminar-titulo">
                        Eliminar Cita
                    </h2>
                </div>

                <div className="eliminar-body">
                    <div className="eliminar-advertencia">
                        <p className="eliminar-mensaje-principal">
                            ¿Estás seguro de que deseas eliminar esta cita?
                        </p>
                        <p className="eliminar-submensaje">
                            El registro de la cita quedará eliminado, como tambien la hoja de vida del cliente.
                        </p>
                    </div>

                    <div className="eliminar-detalles">
                        <h3 className="eliminar-detalles-titulo">Detalles de la cita:</h3>
                        <div className="eliminar-info">
                            <p><strong>Cliente:</strong> {cita.nombreCliente}</p>
                            <p><strong>Servicio:</strong> {cita.servNombre}</p>
                            <p><strong>Profesional:</strong> {cita.nombreProfesional}</p>
                            <p><strong>Fecha:</strong> {new Date(cita.fechaCita).toLocaleDateString('es-ES', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}</p>
                            <p><strong>Hora:</strong> {formatearHora(cita.horaCita)}</p>
                            <div className="eliminar-estados">
                                <p>
                                    <strong>Estado Cita:</strong>
                                    <span className={`eliminar-badge eliminar-badge-cita-${(cita.estadoCita || 'pendiente').toLowerCase()}`}>
                                        {cita.estadoCita || 'Pendiente'}
                                    </span>
                                </p>
                                <p>
                                    <strong>Estado Pago:</strong>
                                    <span className={`eliminar-badge eliminar-badge-pago-${(cita.estadoPago || 'pendiente').toLowerCase()}`}>
                                        {cita.estadoPago || 'Pendiente'}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="eliminar-acciones">
                    <button className="eliminar-btn-cancelar" onClick={onClose}>
                        Cancelar
                    </button>
                    <button className="eliminar-btn-confirmar" onClick={handleConfirmar}>
                        Sí, Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalEliminarCita;