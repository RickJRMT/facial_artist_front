import React from 'react';
import './ModalMensaje.css';

const ModalMensaje = ({ type, mensaje, onClose }) => {
    return (
        <div className="gh-superposicion-modal">
            <div className={`gh-contenido-modal ${type}`}>
                <h3 className="gh-titulo-modal">{type === 'success' ? 'Éxito' : 'Error'}</h3>
                <p className="gh-mensaje-modal">{mensaje}</p>
                <button className="gh-boton-ok" onClick={onClose}>
                    OK
                </button>
            </div>
        </div>
    );
};

export default ModalMensaje;