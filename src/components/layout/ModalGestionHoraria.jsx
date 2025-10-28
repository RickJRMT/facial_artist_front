import React from 'react';
import './ModalGestionHoraria.css';

const ModalGestionHoraria = ({ formData, setFormData, profesionales, handleGuardarHorario, error, onClose }) => {
    const handleClose = (e) => {
        e.stopPropagation(); // Evita cerrar al click en X
        onClose();
    };

    return (
        <div className="gh-superposicion-modal" onClick={onClose}>
            <div className="gh-contenido-modal" onClick={(e) => e.stopPropagation()}>
                <div className="gh-header-modal">
                    <h3 className="gh-titulo-modal">Gestión Horaria</h3>
                    <button className="gh-boton-cerrar" onClick={handleClose}>×</button>
                </div>
                {error && <p className="gh-error-modal">{error}</p>}
                <div className="gh-formulario-modal">
                    <div className="gh-row-form">
                        <label className="gh-etiqueta-form">
                            Profesional:
                            <select
                                value={formData.idProfesional || ''}
                                onChange={(e) => setFormData({ ...formData, idProfesional: Number(e.target.value) })}
                                required
                                className="gh-select-form"
                            >
                                <option value="">Selecciona un profesional</option>
                                {profesionales.map(pro => (
                                    <option key={pro.idProfesional} value={pro.idProfesional}>
                                        {pro.nombreProfesional}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="gh-etiqueta-form">
                            Fecha:
                            <input
                                type="date"
                                value={formData.fecha}
                                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                                required
                                className="gh-entrada-form"
                            />
                        </label>
                    </div>
                    <div className="gh-row-form">
                        <label className="gh-etiqueta-form">
                            Hora Inicio:
                            <input
                                type="time"
                                value={formData.hora_inicio}
                                onChange={(e) => setFormData({ ...formData, hora_inicio: e.target.value })}
                                required
                                className="gh-entrada-form"
                            />
                        </label>
                        <label className="gh-etiqueta-form">
                            Hora Fin:
                            <input
                                type="time"
                                value={formData.hora_fin}
                                onChange={(e) => setFormData({ ...formData, hora_fin: e.target.value })}
                                required
                                className="gh-entrada-form"
                            />
                        </label>
                    </div>
                    <label className="gh-etiqueta-form">
                        Estado:
                        <select
                            value={formData.estado}
                            onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                            className="gh-select-form"
                        >
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                        </select>
                    </label>
                    <div className="gh-botones-modal">
                        <button type="button" className="gh-boton-guardar" onClick={handleGuardarHorario}>
                            Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalGestionHoraria;