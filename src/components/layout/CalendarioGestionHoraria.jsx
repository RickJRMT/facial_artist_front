import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import './calendarioGestionHoraria.css';

const CalendarioGestionHoraria = ({ eventos, onEventClick, onDateClick, currentView, currentDate, onDatesSet }) => {
    const formatFechaDia = (date) => {
        if (!date) return '';
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }).format(date);
    };

    const renderEventContent = (eventInfo) => {
        const { event } = eventInfo;
        const extendedProps = event.extendedProps || {};
        const isHorario = extendedProps.estado && (extendedProps.estado === 'activo' || extendedProps.estado === 'inactivo');
        let nombreText = '';
        let estadoText = '';

        if (isHorario) {
            // FIX: Dos líneas: Nombre arriba, Estado abajo
            nombreText = extendedProps.nombreProfesional || 'N/A';
            estadoText = extendedProps.estado === 'activo' ? 'Activo' : 'Inactivo (No reservable)';
        } else {
            // Citas: Solo nombre (una línea)
            nombreText = extendedProps.nombreProfesional || 'N/A';
            estadoText = '';
        }

        return (
            <div className="gcal-contenido-evento">
                <div className="gcal-titulo-evento">{nombreText}</div>
                {estadoText && <div className="gcal-estado-evento">{estadoText}</div>}
            </div>
        );
    };

    return (
        <div className="gcal-contenedor-calendario">
            <div className="gcal-envoltorio-calendario">
                {currentView === 'timeGridDay' && (
                    <div className="gcal-titulo-fecha-dia">
                        {formatFechaDia(currentDate)}
                    </div>
                )}
                <div className={`gcal-calendario-citas ${currentView === 'timeGridDay' ? 'gcal-ocultar-titulo' : ''}`}>
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                        }}
                        initialView="dayGridMonth"
                        events={eventos || []}
                        eventContent={renderEventContent}
                        eventClick={onEventClick}
                        dateClick={onDateClick}
                        editable={false}
                        selectable={false}
                        eventOverlap={false}
                        slotMinTime="09:00:00"
                        slotMaxTime="18:00:00"
                        height="auto"
                        locale="es"
                        buttonText={{
                            today: 'Hoy',
                            month: 'Mes',
                            week: 'Semana',
                            day: 'Día',
                            list: 'Lista'
                        }}
                        contentHeight="600px"
                        titleFormat={{ year: 'numeric', month: 'long' }}
                        dayCellClassNames="gcal-dia-calendario"
                        datesSet={onDatesSet}
                        eventDidMount={(info) => {
                            const extendedProps = info.event.extendedProps || {};
                            const isHorario = extendedProps.estado && (extendedProps.estado === 'activo' || extendedProps.estado === 'inactivo');
                            if (isHorario) {
                                // Semaforización: Verde activo (reservable), Rojo inactivo (no reservable)
                                if (extendedProps.estado === 'activo') {
                                    info.el.style.backgroundColor = '#28a745';
                                    info.el.style.borderColor = '#28a745';
                                    info.el.style.color = 'white';
                                    info.el.style.cursor = 'pointer'; // Interactivo
                                    info.el.title = 'Disponible para citas';
                                    info.el.classList.add('gcal-horario-activo');
                                } else {
                                    info.el.style.backgroundColor = '#dc3545';
                                    info.el.style.borderColor = '#dc3545';
                                    info.el.style.color = 'white';
                                    info.el.style.opacity = '0.7';
                                    info.el.style.cursor = 'not-allowed'; // No interactivo
                                    info.el.style.pointerEvents = 'none'; // Bloquea clicks
                                    info.el.title = 'Agenda cerrada - No reservable';
                                    info.el.classList.add('gcal-horario-inactivo');
                                }
                            } else {
                                // Citas: Verde por default
                                info.el.style.backgroundColor = '#28a745';
                                info.el.style.borderColor = '#28a745';
                                info.el.style.color = 'white';
                                info.el.style.cursor = 'pointer';
                                info.el.classList.add('gcal-cita-agendada');
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default CalendarioGestionHoraria;