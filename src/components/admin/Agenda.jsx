import React, { useState } from 'react';
import { useGestionHoraria } from '../../hooks/useGestionHoraria';
import ModalGestionHoraria from '../layout/ModalGestionHoraria';
import ModalMensaje from '../layout/ModalMensaje';
import CalendarioGestionHoraria from '../layout/CalendarioGestionHoraria';
import './Agenda.css';

const Agenda = () => {
    const [currentView, setCurrentView] = useState('dayGridMonth');
    const [currentDate, setCurrentDate] = useState(new Date());

    const {
        eventos, citaSeleccionada, selectedDateCitas, selectedDateHorarios, stats, profesionales, showModal, formData, setFormData, loading, error,
        handleSelectEvent, handleDateClick, openModal, handleGuardarHorario, setShowModal,
        showSuccess, showError, mensaje, setShowSuccess, setShowError, setMensaje
    } = useGestionHoraria();

    const handleDatesSet = (arg) => {
        setCurrentView(arg.view.type);
        setCurrentDate(new Date(arg.start));
    };

    if (loading) return <div className="gh-carga-calendario">Cargando calendario...</div>;
    if (error) return <div className="gh-error-calendario">Error: {error}</div>;

    const mostrarDetalle = citaSeleccionada || (selectedDateCitas.length > 0 ? selectedDateCitas[0] : null) || (selectedDateHorarios.length > 0 ? selectedDateHorarios[0] : null);
    const hasHorarioInDay = selectedDateHorarios.length > 0;

    // Función safe para hora
    const formatHora = (hora) => {
        if (!hora) return 'N/A';
        const parts = hora.trim().split(':');
        if (parts.length < 2) return 'N/A';
        const hh = parts[0].padStart(2, '0');
        const mm = parts[1].padStart(2, '0');
        const horaPadded = `${hh}:${mm}:00`;
        try {
            return new Intl.DateTimeFormat('es-ES', { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(`2000-01-01T${horaPadded}`));
        } catch {
            return 'N/A';
        }
    };

    // Función safe para fecha simple "dia/mes/año"
    const formatFecha = (fecha) => {
        if (!fecha) return 'N/A';
        try {
            return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(fecha));
        } catch {
            return 'N/A';
        }
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
                        currentView={currentView}
                        currentDate={currentDate}
                        onDatesSet={handleDatesSet}
                    />
                </div>

                <div className="gh-panel-descripcion">
                    <h3 className="gh-titulo-panel">Descripción del Evento</h3>
                    {mostrarDetalle ? (
                        <div className="gh-detalle-evento">
                            <div className="gh-label-detalle">
                                <span className="gh-label-titulo">Profesional:</span>
                                <span className="gh-label-valor">{mostrarDetalle.nombreProfesional || 'N/A'}</span>
                            </div>
                            <div className="gh-label-detalle">
                                <span className="gh-label-titulo">Fecha:</span>
                                <span className="gh-label-valor">{formatFecha(mostrarDetalle.fecha || mostrarDetalle.fechaCita)}</span>
                            </div>
                            <div className="gh-label-detalle">
                                <span className="gh-label-titulo">Hora:</span>
                                <span className="gh-label-valor">{formatHora(mostrarDetalle.hora || mostrarDetalle.horaCita)}</span>
                            </div>
                            <div className="gh-label-detalle">
                                <span className="gh-label-titulo">Descripción:</span>
                                <span className="gh-label-valor">{mostrarDetalle.descripcion || mostrarDetalle.descripcionServicio || 'N/A'}</span>
                            </div>
                        </div>
                    ) : (
                        <p className="gh-placeholder-panel">Selecciona un evento o día en el calendario para ver detalles.</p>
                    )}
                    <button
                        className="gh-boton-gestion-horaria"
                        onClick={openModal}
                    >
                        Gestión Horaria
                    </button>
                    {hasHorarioInDay && (
                        <button
                            className="gh-boton-editar-horario"
                            onClick={() => openModal(selectedDateHorarios[0])}
                        >
                            Editar Horario del Día
                        </button>
                    )}
                </div>
            </div>

            <footer className="gh-pie-agenda">
                <div className="gh-tarjeta-estadisticas">
                    <h4>Total Citas</h4>
                    <p>{stats.totalCitas}</p>
                </div>
                <div className="gh-tarjeta-estadisticas">
                    <h4>Pendientes</h4>
                    <p>{stats.citasPendientes}</p>
                </div>
                <div className="gh-tarjeta-estadisticas">
                    <h4>Confirmadas</h4>
                    <p>{stats.citasConfirmadas}</p>
                </div>
            </footer>

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