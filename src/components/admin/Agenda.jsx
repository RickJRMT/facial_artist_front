import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { useGestionHoraria } from '../../hooks/useGestionHoraria';
import ModalGestionHoraria from '../layout/ModalGestionHoraria';

const Agenda = () => {
    const {
        eventos, citaSeleccionada, stats, profesionales, selectedPro, showModal, formData, loading, error,
        setFormData, handleSelectEvent, openModal, handleGuardarHorario, setShowModal, handleSelectPro
    } = useGestionHoraria();

    if (loading) return <div style={{ padding: '20px' }}>Cargando calendario...</div>;
    if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;

    return (
        <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
            <style>{`
                .fc .fc-daygrid-day:hover {
                    background-color: #f0f0f0 !important;
                    opacity: 0.8;
                }
                .fc .fc-timegrid-slot:hover {
                    background-color: #e9ecef !important;
                }
                .fc-event:hover {
                    opacity: 0.7;
                    cursor: pointer;
                }
            `}</style> {/* CSS simple para hover/sombreado */}

            <header style={{ padding: '10px', background: '#f8f9fa', borderBottom: '1px solid #ddd' }}>
                <h1>Gestión Horaria</h1>
            </header>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Calendario - Izquierda 50% */}
                <div style={{ width: '50%', padding: '10px', borderRight: '1px solid #ddd' }}>
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
                        initialView="timeGridWeek"
                        events={eventos}
                        eventClick={handleSelectEvent}
                        height="100%"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                        }}
                        eventDisplay="block"
                        slotMinTime="08:00:00"
                        slotMaxTime="20:00:00"
                        dayCellDidMount={(arg) => {
                            arg.el.style.cursor = 'pointer'; // Pointer para interactividad
                        }}
                    />
                </div>

                {/* Panel Derecho - 50% */}
                <div style={{ width: '50%', padding: '10px', display: 'flex', flexDirection: 'column' }}>
                    <h3>Detalles del Evento Seleccionado</h3>
                    <label>
                        Selecciona Profesional:
                        <select
                            value={selectedPro?.idProfesional || ''}
                            onChange={(e) => {
                                const pro = profesionales.find(p => p.idProfesional === Number(e.target.value));
                                handleSelectPro(pro);
                            }}
                            style={{ width: '100%', marginBottom: '20px', padding: '5px' }}
                        >
                            <option value="">Selecciona...</option>
                            {profesionales.map(pro => (
                                <option key={pro.idProfesional} value={pro.idProfesional}>
                                    {pro.nombreProfesional}
                                </option>
                            ))}
                        </select>
                    </label>
                    {citaSeleccionada ? (
                        <div style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '20px', borderRadius: '4px' }}>
                            <p><strong>Profesional:</strong> {citaSeleccionada.nombreProfesional}</p>
                            <p><strong>Fecha:</strong> {citaSeleccionada.fecha}</p>
                            <p><strong>Hora:</strong> {citaSeleccionada.hora}</p>
                            <p><strong>Descripción:</strong> {citaSeleccionada.descripcion}</p>
                        </div>
                    ) : (
                        <p style={{ color: '#666', marginBottom: '20px' }}>Selecciona un evento en el calendario para ver detalles.</p>
                    )}
                    <button
                        onClick={() => openModal()}
                        style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Gestión Horaria
                    </button>
                </div>
            </div>

            {/* Cards Inferiores - Stats */}
            <footer style={{ display: 'flex', justifyContent: 'space-around', padding: '15px', background: '#f8f9fa', borderTop: '1px solid #ddd' }}>
                <div style={{ textAlign: 'center', border: '1px solid #ddd', padding: '15px', borderRadius: '4px', width: '30%' }}>
                    <h4>Total Citas</h4>
                    <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalCitas}</p>
                </div>
                <div style={{ textAlign: 'center', border: '1px solid #ddd', padding: '15px', borderRadius: '4px', width: '30%' }}>
                    <h4>Pendientes</h4>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>{stats.citasPendientes}</p>
                </div>
                <div style={{ textAlign: 'center', border: '1px solid #ddd', padding: '15px', borderRadius: '4px', width: '30%' }}>
                    <h4>Confirmadas</h4>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>{stats.citasConfirmadas}</p>
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