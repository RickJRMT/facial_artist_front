import React from 'react';
import './ModalGestionHoraria.css'; // ← NUEVO: Import CSS

const ModalGestionHoraria = ({ formData, setFormData, profesionales, handleGuardarHorario, error, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{formData.idHorario ? 'Editar Horario' : 'Nuevo Horario'}</h3>
                {error && <p className="modal-error">{error}</p>}
                <div className="modal-form">
                    <label>
                        Profesional:
                        <select
                            value={formData.idProfesional || ''}
                            onChange={(e) => setFormData({ ...formData, idProfesional: Number(e.target.value) })}
                            required
                            className="modal-input"
                        >
                            <option value="">Seleccionar profesional</option>
                            {profesionales.map(pro => (
                                <option key={pro.idProfesional} value={pro.idProfesional}>
                                    {pro.nombreProfesional}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Fecha:
                        <input
                            type="date"
                            value={formData.fecha}
                            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                            required
                            className="modal-input"
                        />
                    </label>
                    <label>
                        Hora Inicio:
                        <input
                            type="time"
                            value={formData.hora_inicio}
                            onChange={(e) => setFormData({ ...formData, hora_inicio: e.target.value })}
                            required
                            className="modal-input"
                        />
                    </label>
                    <label>
                        Hora Fin:
                        <input
                            type="time"
                            value={formData.hora_fin}
                            onChange={(e) => setFormData({ ...formData, hora_fin: e.target.value })}
                            required
                            className="modal-input"
                        />
                    </label>
                    <label>
                        Estado:
                        <select
                            value={formData.estado}
                            onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                            className="modal-input"
                        >
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                        </select>
                    </label>
                    <div className="modal-buttons">
                        <button type="button" onClick={() => handleGuardarHorario(!!formData.idHorario)} className="btn-save">
                            Guardar
                        </button>
                        <button type="button" onClick={onClose} className="btn-cancel">
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalGestionHoraria;