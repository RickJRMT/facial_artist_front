import React, { useState } from 'react';
import { useGestionHoraria } from '../../hooks/useGestionHoraria';
import ModalGestionHoraria from '../layout/ModalGestionHoraria';
import ModalMensaje from '../layout/ModalMensaje';
import CalendarioGestionHoraria from '../layout/CalendarioGestionHoraria';
import './Agenda.css';
import moment from 'moment'; // ← Asegúrate de tenerlo para formateo local

const Agenda = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const {
        eventos, citaSeleccionada, selectedDateCitas, selectedDateHorarios, profesionales, showModal, formData, setFormData, loading, error,
        handleSelectEvent, handleDateClick, openModal, handleGuardarHorario, setShowModal,
        showSuccess, showError, mensaje, setShowSuccess, setShowError, setMensaje
    } = useGestionHoraria();

    const handleDatesSet = (arg) => {
        setCurrentDate(new Date(arg.start));
    };

    if (loading) return <div className="gh-carga-calendario">Cargando calendario...</div>;
    if (error) return <div className="gh-error-calendario">Error: {error}</div>;

    // FIX: Filtrar por tipo: Citas vs Horarios (sin duplicados)
    const isBloque = !!citaSeleccionada;
    let citasItems = [];
    let horariosItems = [];
    if (isBloque) {
        // Bloque: Clasificar el seleccionado
        const item = citaSeleccionada;
        if (item.estado && (item.estado === 'activo' || item.estado === 'inactivo')) {
            horariosItems = [item];
        } else {
            citasItems = [item];
        }
    } else {
        // Día: Combina y filtra por tipo/uniques
        const allCitas = selectedDateCitas || [];
        const allHorarios = selectedDateHorarios || [];
        citasItems = allCitas.filter((item, index, self) =>
            index === self.findIndex((t) => t.idCita === item.idCita)
        );
        horariosItems = allHorarios.filter((item, index, self) =>
            index === self.findIndex((t) => t.idHorario === item.idHorario)
        );
    }
    const hasHorarioInDay = horariosItems.length > 0;

    // FIX: Formateo prioriza hook/backend, fallback a Moment local (evita merma)
    const formatFecha = (item) => {
        if (item.fechaFormatted || item.fechaLocal) {
            return item.fechaFormatted || item.fechaLocal;
        }
        const fechaRaw = item.fecha || item.fechaCita || item.start;
        if (!fechaRaw) return 'N/A';
        try {
            return moment(fechaRaw).local().format('DD/MM/YYYY');
        } catch {
            return 'N/A';
        }
    };

    // FIX: Hora prioriza hook, fallback a raw; para horarios, soporta rango
    const formatHora = (item, isRango = false) => {
        if (item.horaFormatted) {
            return item.horaFormatted;
        }
        let horaInicio = item.hora || item.horaCita || item.hora_inicio || (item.start ? moment(item.start).local().format('HH:mm') : null);
        if (isRango && item.hora_fin) {
            const horaFin = moment(`${item.fecha || '2000-01-01'}T${item.hora_fin}`).local().format('h:mm A');
            const inicioFormatted = new Intl.DateTimeFormat('es-ES', { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(`2000-01-01T${horaInicio}:00`));
            return `${inicioFormatted} - ${horaFin}`;
        }
        if (!horaInicio) return 'N/A';
        try {
            const horaStr = typeof horaInicio === 'string' ? horaInicio.split('T')[1]?.split(':').slice(0, 2).join(':') :
                moment(horaInicio).local().format('HH:mm');
            if (!horaStr) return 'N/A';
            return new Intl.DateTimeFormat('es-ES', { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(`2000-01-01T${horaStr}:00`));
        } catch {
            return 'N/A';
        }
    };

    // Render card para citas (sin editar)
    const renderCitaCard = (item, index) => (
        <div key={item.idCita || index} className="gh-card-evento gh-card-cita">
            <div className="gh-card-header">
                <span className="gh-estado-icon">📅</span>
                <h4>{item.nombreProfesional || 'N/A'}</h4>
            </div>
            <div className="gh-card-body">
                <p><strong>Fecha:</strong> {formatFecha(item)}</p>
                <p><strong>Hora:</strong> {formatHora(item)}</p>
                <p><strong>Descripción:</strong> {item.descripcion || item.descripcionServicio || 'N/A'}</p>
            </div>
        </div>
    );

    // Render card para horarios (con botón editar)
    const renderHorarioCard = (item, index) => {
        const estadoText = item.estado === 'activo' ? 'Activo' : 'Inactivo (No reservable)';
        const estadoIcon = item.estado === 'activo' ? '🟢' : '🔴';
        return (
            <div key={item.idHorario || index} className="gh-card-evento gh-card-horario">
                <div className="gh-card-header">
                    <span className="gh-estado-icon">{estadoIcon}</span>
                    <h4>{item.nombreProfesional || 'N/A'}</h4>
                </div>
                <div className="gh-card-body">
                    <p><strong>Fecha:</strong> {formatFecha(item)}</p>
                    <p><strong>Hora:</strong> {formatHora(item, true)} {/* ← Rango para horarios */}</p>
                    <p><strong>Estado:</strong> {estadoText}</p>
                    <div className="gh-card-actions">
                        <button
                            className="gh-boton-editar-horario-card"
                            onClick={() => openModal(item)} // ← Abre modal prefilled con este horario
                        >
                            ✏️ Editar
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="gh-contenedor-agenda">
            <header className="gh-encabezado-agenda">
                <h1>Gestión Horaria</h1>
            </header>

            <div className="gh-principal-agenda">
                <div className="gh-panel-calendario">
                    <CalendarioGestionHoraria
                        eventos={eventos}
                        onEventClick={handleSelectEvent}
                        onDateClick={handleDateClick}
                        currentView={currentDate}
                        onDatesSet={handleDatesSet}
                    />
                </div>

                <div className="gh-panel-descripción">
                    <h3 className="gh-título-panel">Descripción del Evento</h3>
                    {(citasItems.length > 0 || horariosItems.length > 0) ? (
                        <div className="gh-secciones-cards">
                            {citasItems.length > 0 && (
                                <div className="gh-sección-agendamientos">
                                    <h4 className="gh-sección-título">Agendamientos</h4>
                                    <div className="gh-contenedor-cards">
                                        {citasItems.map((item, index) => renderCitaCard(item, index))}
                                    </div>
                                </div>
                            )}
                            {horariosItems.length > 0 && (
                                <div className="gh-sección-estados">
                                    <h4 className="gh-sección-título">Estados de Agenda</h4>
                                    <div className="gh-contenedor-cards">
                                        {horariosItems.map((item, index) => renderHorarioCard(item, index))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="gh-placeholder-panel">Selecciona un evento o día en el calendario para ver detalles.</p>
                    )}
                    <button
                        className="gh-boton-gestión-horaria"
                        onClick={openModal}
                    >
                        Gestión Horaria
                    </button>
                </div>
            </div>

            {showModal && (
                <ModalGestionHoraria
                    formData={formData}
                    setFormData={setFormData}
                    profesionales={profesionales}
                    handleGuardarHorario={handleGuardarHorario}
                    error={error}
                    onClose={() => setShowModal(false)}
                />
            )}
            {showSuccess && (
                <ModalMensaje
                    type="success"
                    mensaje={mensaje}
                    onClose={() => {
                        setShowSuccess(false);
                        setMensaje('');
                    }}
                />
            )}
            {showError && (
                <ModalMensaje
                    type="error"
                    mensaje={mensaje}
                    onClose={() => {
                        setShowError(false);
                        setMensaje('');
                    }}
                />
            )}
        </div>
    );
};

export default Agenda;