import React, { useState } from 'react';
import './ModalGestionHoraria.css';

const ModalGestionHoraria = ({
    formData, setFormData, profesionales, handleGuardarHorario, error, onClose, isEditMode, citasEnHorario = []
}) => {
    const [expandirInfo, setExpandirInfo] = useState(false);

    const handleClose = (e) => {
        e.stopPropagation();
        onClose();
    };

    // Función para formatear hora en 12 horas con a.m./p.m.
    const formatearHora = (horaStr) => {
        if (!horaStr) return '';
        try {
            const [horas, minutos] = horaStr.split(':');
            const date = new Date(`2000-01-01T${horas}:${minutos}:00`);
            const formatoHora = { hour: 'numeric', minute: '2-digit', hour12: true };
            return new Intl.DateTimeFormat('es-ES', formatoHora).format(date);
        } catch {
            return horaStr;
        }
    };

    // Detectar si hay citas en el horario (para bloquear campos)
    // Solo bloquear si estamos en modo edición Y hay citas detectadas
    const hayCitasEnHorario = isEditMode && citasEnHorario && citasEnHorario.length > 0;

    return (
        <div className="gh-superposicion-modal" onClick={onClose}>
            <div className="gh-contenido-modal" onClick={(e) => e.stopPropagation()}>
                <div className="gh-header-modal">
                    <h3 className="gh-titulo-modal">
                        {isEditMode ? 'Editar Horario' : 'Crear Horario'}
                    </h3>
                    <button className="gh-boton-cerrar" onClick={handleClose}>×</button>
                </div>

                {error && <p className="gh-error-modal">{error}</p>}

                {/* Información sobre citas existentes - ACCORDION */}
                {isEditMode && (
                    <div className="gh-accordion-container">
                        <button
                            type="button"
                            className="gh-accordion-header"
                            onClick={() => setExpandirInfo(!expandirInfo)}
                            aria-expanded={expandirInfo}
                        >
                            <span className="gh-accordion-icon">
                                {expandirInfo ? '▼' : '▶'}
                            </span>
                            <span className="gh-accordion-titulo">ℹ️ Información Importante</span>
                            {hayCitasEnHorario && <span className="gh-accordion-badge">Citas detectadas</span>}
                        </button>

                        {expandirInfo && (
                            <div className="gh-accordion-contenido">
                                {/* Contexto del rango de horario actual */}
                                <p className="gh-contexto-horario">
                                    <strong>Rango de horario actual:</strong> {formatearHora(formData.hora_inicio)} a {formatearHora(formData.hora_fin)}
                                </p>

                                {/* Si hay citas existentes, mostrar información sobre ellas */}
                                {hayCitasEnHorario && citasEnHorario.length > 0 && (
                                    <div className="gh-citas-detectadas">
                                        <p className="gh-subtitulo-citas">Citas agendadas detectadas:</p>
                                        <ul className="gh-listado-citas">
                                            {citasEnHorario.map((cita, idx) => {
                                                const inicio = cita.horaInicio || '';
                                                const fin = cita.horaFin || '';
                                                const inicioFormato = formatearHora(inicio);
                                                const finFormato = formatearHora(fin);
                                                return (
                                                    <li key={idx}>
                                                        <span className="gh-horario-cita">{inicioFormato} - {finFormato}</span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}

                                {/* Texto explicativo sobre cierre de agenda */}
                                <div className="gh-explicacion-cierre">
                                    <p>
                                        <strong>💡 Tip sobre cierre de agenda:</strong> Si deseas cerrar la agenda en algún periodo del día 
                                        (por ejemplo, en la tarde), puedes reducir la hora de fin. Esto impedirá nuevas reservas después de esa hora.
                                    </p>
                                    <p className="gh-ejemplo-cierre">
                                        <em>Ejemplo:</em> Si el profesional tiene horario de 8:00 a.m. a 6:00 p.m. pero no puede trabajar por la tarde, 
                                        puedes cambiar la hora de fin a 12:00 p.m. o 2:00 p.m. Las citas existentes se mantendrán pero no se podrán agendar nuevas citas después de esa hora.
                                    </p>
                                </div>

                                {hayCitasEnHorario && citasEnHorario.length > 0 && (
                                    <p className="gh-alerta-citas">
                                        ⚠️ Ten en cuenta que al modificar el horario, el nuevo rango debe cubrir todas las citas ya agendadas.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                <div className="gh-formulario-modal">
                    <div className="gh-row-form">
                        <label className="gh-etiqueta-form">
                            Profesional:
                            <select
                                value={formData.idProfesional || ''}
                                onChange={(e) => setFormData({ ...formData, idProfesional: Number(e.target.value) })}
                                required
                                className="gh-select-form"
                                disabled={hayCitasEnHorario}
                                title={hayCitasEnHorario ? "Este campo está bloqueado porque hay citas agendadas en este horario" : ""}
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
                                disabled={hayCitasEnHorario}
                                title={hayCitasEnHorario ? "Este campo está bloqueado porque hay citas agendadas en este horario" : ""}
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
                            disabled={hayCitasEnHorario}
                            title={hayCitasEnHorario ? "Este campo está bloqueado porque hay citas agendadas en este horario" : ""}
                        >
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                        </select>
                    </label>

                    <div className="gh-botones-modal">
                        <button type="button" className="gh-boton-guardar" onClick={handleGuardarHorario}>
                            {isEditMode ? 'Actualizar' : 'Crear'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalGestionHoraria;