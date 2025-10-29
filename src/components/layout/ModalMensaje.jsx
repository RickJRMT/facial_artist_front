import React from 'react';
import './ModalMensaje.css';

const ModalMensaje = ({ type = 'success', variant = null, mensaje, onClose }) => {
    // Iconos y estilos por type/variant
    const getIcon = () => {
        if (type === 'success') return '✅';
        if (type === 'error') return '❌';
        if (variant === 'agenda-cerrada') return '🔒'; // Icono para cierre de agenda
        return 'ℹ️';
    };

    const getTitle = () => {
        if (type === 'success') return 'Éxito';
        if (type === 'error') return 'Error';
        if (variant === 'agenda-cerrada') return 'Agenda Cerrada';
        return 'Información';
    };

    const getContainerClass = () => {
        if (type === 'success') return 'mm-contenido-modal mm-success';
        if (type === 'error') return 'mm-contenido-modal mm-error';
        if (variant === 'agenda-cerrada') return 'mm-contenido-modal mm-agenda-cerrada';
        return 'mm-contenido-modal mm-info';
    };

    return (
        <div className="mm-superposicion-modal">
            <div className={getContainerClass()}>
                <div className="mm-header-mensaje">
                    <span className="mm-icono-mensaje">{getIcon()}</span>
                    <h3 className="mm-titulo-mensaje">{getTitle()}</h3>
                </div>
                <p className="mm-mensaje-texto">{mensaje}</p>
                <button className="mm-boton-ok" onClick={onClose}>
                    OK
                </button>
            </div>
        </div>
    );
};

export default ModalMensaje;