import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { useGestionHoraria } from '../../hooks/useGestionHoraria';
import ModalGestionHoraria from '../layout/ModalGestionHoraria';
import './Agenda.css';

const Agenda = () => {
    const {
        eventos, citaSeleccionada, stats, profesionales, showModal, formData, loading, error, // ← FIX: Destructurado profesionales
        setFormData, handleSelectEvent, openModal, handleGuardarHorario, setShowModal, fetchAllData, initialDate
    } = useGestionHoraria();

    if (loading) return <div className="loading">Cargando calendario...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    const handleRecargar = () => fetchAllData();

    const renderEventContent = (eventInfo) => {
        const { event } = eventInfo;
        const horaCita = event.extendedProps.horaCita || event.startStr.split('T')[1].slice(0, 5);
        return (
            <div className="fc-event-main">
                <div className="fc-event-title">{event.title}</div>
                {horaCita && <div className="fc-event-time">{horaCita}</div>}
            </div>
        );
    };

    return (
        <div className="agenda-container">
            <header className="header">
                <h1>Gestión Horaria</h1>
            </header>

            <div className="main-layout">
                {/* Calendario - Izquierda 50% */}
                <div className="calendar-section">
                    {eventos.length === 0 ? (
                        <div className="empty-calendar">
                            <p>No hay eventos visibles. Recarga para ver citas.</p>
                            <button onClick={handleRecargar}>Recargar</button>
                        </div>
                    ) : (
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
                            initialView="dayGridMonth"
                            initialDate={initialDate}
                            events={eventos}
                            eventContent={renderEventContent}
                            eventClick={handleSelectEvent}
                            height="100%"
                            contentHeight="auto"
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                            }}
                            eventDisplay="block"
                            slotMinTime="08:00:00"
                            slotMaxTime="20:00:00"
                            validRange={{ start: '2025-10-01', end: '2025-11-01' }}
                            dayCellDidMount={(arg) => {
                                arg.el.style.cursor = 'pointer';
                            }}
                            buttonText={{
                                today: 'Hoy',
                                month: 'Mes',
                                week: 'Semana',
                                day: 'Día',
                                list: 'Lista'
                            }}
                            locale="es"
                            titleFormat={{ year: 'numeric', month: 'long' }}
                        />
                    )}
                </div>

                {/* Panel Derecho - Solo Descripción */}
                <div className="panel-section">
                    <h3>Detalles del Evento Seleccionado</h3>
                    {citaSeleccionada ? (
                        <div className="panel-detalles">
                            <p><strong>Profesional:</strong> {citaSeleccionada.nombreProfesional}</p>
                            <p><strong>Fecha:</strong> {citaSeleccionada.fecha}</p>
                            <p><strong>Hora:</strong> {citaSeleccionada.hora}</p>
                            <p><strong>Descripción:</strong> {citaSeleccionada.descripcion}</p>
                        </div>
                    ) : (
                        <p>Selecciona un evento en el calendario para ver detalles.</p>
                    )}
                    <button
                        className="btn-gestion"
                        onClick={() => openModal()}
                    >
                        Gestión Horaria
                    </button>
                </div>
            </div>

            {/* Cards Inferiores - Stats */}
            <footer className="stats-footer">
                <div className="stat-card">
                    <h4>Total Citas</h4>
                    <p className="stat-number">{stats.totalCitas}</p>
                </div>
                <div className="stat-card">
                    <h4>Pendientes</h4>
                    <p className="stat-number" style={{ color: '#ffc107' }}>{stats.citasPendientes}</p>
                </div>
                <div className="stat-card">
                    <h4>Confirmadas</h4>
                    <p className="stat-number" style={{ color: '#28a745' }}>{stats.citasConfirmadas}</p>
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
        </div>
    );
};

export default Agenda;