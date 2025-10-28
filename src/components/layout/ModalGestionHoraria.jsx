import React from 'react';
import './ModalGestionHoraria.css';

const ModalGestionHoraria = ({ formData, setFormData, profesionales, handleGuardarHorario, error, onClose }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="gh-superposicion-modal">
            <div className="gh-contenido-modal">
                {/* Botón X de cerrar */}
                <button className="gh-boton-cerrar" onClick={onClose}>×</button>

                <div className="gh-formulario-citas">
                    <h1 className="gh-titulo">Gestión Horaria</h1>
                    <p className="gh-subtitulo">
                        Completa los campos para definir el horario del profesional
                    </p>

                    {error && <p className="gh-error">{error}</p>}

                    <form onSubmit={(e) => { e.preventDefault(); handleGuardarHorario(); }}>
                        {/* Fila 1: Profesional + Fecha */}
                        <div className="gh-fila">
                            <div className="gh-campo">
                                <label>Profesional</label>
                                <div className="gh-input-icono">
                                    <select
                                        name="idProfesional"
                                        value={formData.idProfesional || ''}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled>Selecciona un profesional</option>
                                        {profesionales.map(pro => (
                                            <option key={pro.idProfesional} value={pro.idProfesional}>
                                                {pro.nombreProfesional}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="gh-campo">
                                <label>Fecha</label>
                                <div className="gh-input-icono">
                                    <input
                                        type="date"
                                        name="fecha"
                                        value={formData.fecha}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span className="gh-icono">Calendar</span>
                                </div>
                            </div>
                        </div>

                        {/* Fila 2: Hora Inicio + Hora Fin */}
                        <div className="gh-fila">
                            <div className="gh-campo">
                                <label>Hora Inicio</label>
                                <div className="gh-input-icono">
                                    <input
                                        type="time"
                                        name="hora_inicio"
                                        value={formData.hora_inicio}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span className="gh-icono">Clock</span>
                                </div>
                            </div>

                            <div className="gh-campo">
                                <label>Hora Fin</label>
                                <div className="gh-input-icono">
                                    <input
                                        type="time"
                                        name="hora_fin"
                                        value={formData.hora_fin}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span className="gh-icono">Clock</span>
                                </div>
                            </div>
                        </div>

                        {/* Fila 3: Estado (solo) */}
                        <div className="gh-fila">
                            <div className="gh-campo">
                                <label>Estado</label>
                                <div className="gh-input-icono">
                                    <select
                                        name="estado"
                                        value={formData.estado}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="activo">Activo</option>
                                        <option value="inactivo">Inactivo</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Botón centrado */}
                        <div className="gh-boton-centrado">
                            <button type="submit" className="gh-boton-agendar">
                                Guardar Horario
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModalGestionHoraria;