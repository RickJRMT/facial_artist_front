import React from 'react';
import './ModalGestionHoraria.css';

const ModalGestionHoraria = ({ formData, setFormData, profesionales, handleGuardarHorario, error, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 className="modal-titulo">Gestión Horaria</h3>
                {error && <p className="modal-error">{error}</p>}
                <div className="modal-form">
                    <label className="form-label">
                        Profesional:
                        <select
                            value={formData.idProfesional || ''}
                            onChange={(e) => setFormData({ ...formData, idProfesional: Number(e.target.value) })}
                            required
                            className="form-select"
                        >
                            <option value="">Selecciona un profesional</option>
                            {profesionales.map(pro => (
                                <option key={pro.idProfesional} value={pro.idProfesional}>
                                    {pro.nombreProfesional}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="form-label">
                        Fecha:
                        <input
                            type="date"
                            value={formData.fecha}
                            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                            required
                            className="form-input"
                        />
                    </label>
                    <label className="form-label">
                        Hora Inicio:
                        <input
                            type="time"
                            value={formData.hora_inicio}
                            onChange={(e) => setFormData({ ...formData, hora_inicio: e.target.value })}
                            required
                            className="form-input"
                        />
                    </label>
                    <label className="form-label">
                        Hora Fin:
                        <input
                            type="time"
                            value={formData.hora_fin}
                            onChange={(e) => setFormData({ ...formData, hora_fin: e.target.value })}
                            required
                            className="form-input"
                        />
                    </label>
                    <label className="form-label">
                        Estado:
                        <select
                            value={formData.estado}
                            onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                            className="form-select"
                        >
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                        </select>
                    </label>
                    <div className="modal-buttons">
                        <button type="button" className="btn-guardar" onClick={handleGuardarHorario}>
                            Guardar
                        </button>
                        <button type="button" className="btn-cancelar" onClick={onClose}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalGestionHoraria;