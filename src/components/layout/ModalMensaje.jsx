import React from 'react';
import './ModalMensaje.css';

const ModalMensaje = ({ type, mensaje, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className={`modal-content ${type}`}>
                <h3 className="modal-titulo">{type === 'success' ? 'Éxito' : 'Error'}</h3>
                <p className="modal-mensaje">{mensaje}</p>
                <button className="btn-ok" onClick={onClose}>
                    OK
                </button>
            </div>
        </div>
    );
};

export default ModalMensaje;