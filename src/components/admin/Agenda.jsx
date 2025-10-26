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

    if (loading) return <div className="loading-calendario">Cargando calendario...</div>;
    if (error) return <div className="error-calendario">Error: {error}</div>;

    const mostrarTabla = citaSeleccionada ? [citaSeleccionada] : selectedDateCitas;
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

    // Render rows flat array (no inline map, no whitespace)
    const renderRows = () => {
        if (!mostrarTabla || mostrarTabla.length === 0) return [];
        return mostrarTabla.map((cita, index) => {
            const fecha = cita.fecha || cita.fechaCita;
            const hora = cita.hora || cita.horaCita;
            const fechaFormatted = formatFecha(fecha);
            const horaFormatted = formatHora(hora);
            return <tr key={cita.idCita || index}><td>{cita.nombreProfesional}</td><td>{fechaFormatted}</td><td>{horaFormatted}</td><td>{cita.descripcion || cita.descripcionServicio || 'N/A'}</td></tr>;
        });
    };

    return (
        <div className="agenda-container">
            <header className="agenda-header">
                <h1>Gestión Horaria</h1>
            </header>

            <div className="agenda-main">
                <div className="calendario-panel">
                    <CalendarioGestionHoraria
                        eventos={eventos}
                        onEventClick={handleSelectEvent}
                        onDateClick={handleDateClick}
                        currentView={currentView}
                        currentDate={currentDate}
                        onDatesSet={handleDatesSet}
                    />
                </div>

                <div className="panel-descripcion">
                    <h3 className="panel-titulo">Descripción del Evento</h3>
                    {mostrarTabla && mostrarTabla.length > 0 ? (
                        <table className="tabla-visualizacion">
                            <thead>
                                <tr>
                                    <th>Profesional</th>
                                    <th>Fecha</th>
                                    <th>Hora</th>
                                    <th>Descripción</th>
                                </tr>
                            </thead>
                            <tbody>{renderRows()}</tbody>
                        </table>
                    ) : (
                        <p className="panel-placeholder">Selecciona un evento o día en el calendario para ver detalles.</p>
                    )}
                    <button
                        className="btn-gestion-horaria"
                        onClick={openModal}
                    >
                        Gestión Horaria
                    </button>
                    {hasHorarioInDay && (
                        <button
                            className="btn-edit-horario"
                            onClick={() => openModal(selectedDateHorarios[0])}
                        >
                            Editar Horario del Día
                        </button>
                    )}
                </div>
            </div>

            <footer className="agenda-footer">
                <div className="card-stats">
                    <h4>Total Citas</h4>
                    <p>{stats.totalCitas}</p>
                </div>
                <div className="card-stats">
                    <h4>Pendientes</h4>
                    <p>{stats.citasPendientes}</p>
                </div>
                <div className="card-stats">
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