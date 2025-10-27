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
        // Local time explícito
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
        const title = event.title || '';

        // Diferenciar: Horario vs Cita
        const isHorario = extendedProps.estado && (extendedProps.estado === 'activo' || extendedProps.estado === 'inactivo');
        let bloqueText = '';

        if (isHorario) {
            // Forzar: Nombre - Estado (incluso si title no lo tiene)
            const estadoText = extendedProps.estado === 'activo' ? 'Activo' : 'Inactivo';
            bloqueText = `${extendedProps.nombreProfesional || title.split(' - ')[0] || 'N/A'} - ${estadoText}`;
        } else {
            // Para citas: Solo nombre profesional
            bloqueText = extendedProps.nombreProfesional || title.split(' - ')[0] || 'N/A';
        }

        return (
            <div className="gh-contenido-evento">
                <div className="gh-titulo-evento">{bloqueText}</div>
            </div>
        );
    };

    return (
        <div className="gh-contenedor-calendario">
            <div className="gh-envoltorio-calendario">
                {currentView === 'timeGridDay' && (
                    <div className="gh-titulo-fecha-dia">
                        {formatFechaDia(currentDate)}
                    </div>
                )}
                <div className={`gh-calendario-citas ${currentView === 'timeGridDay' ? 'gh-ocultar-titulo' : ''}`}>
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
                        dayCellClassNames="gh-dia-calendario"
                        datesSet={onDatesSet}
                        eventDidMount={(info) => {
                            // Forzar colores directos en mount (para horarios inactivos)
                            const extendedProps = info.event.extendedProps || {};
                            const isHorario = extendedProps.estado && (extendedProps.estado === 'activo' || extendedProps.estado === 'inactivo');
                            if (isHorario) {
                                if (extendedProps.estado === 'activo') {
                                    info.el.style.backgroundColor = '#28a745';
                                    info.el.style.borderColor = '#28a745';
                                } else {
                                    info.el.style.backgroundColor = '#dc3545';
                                    info.el.style.borderColor = '#dc3545';
                                    info.el.style.opacity = '0.8';
                                }
                                info.el.classList.add(extendedProps.estado === 'activo' ? 'gh-horario-activo' : 'gh-horario-inactivo');
                            } else {
                                // Citas: Verde
                                info.el.style.backgroundColor = '#28a745';
                                info.el.style.borderColor = '#28a745';
                                info.el.classList.add('gh-cita-agendada');
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default CalendarioGestionHoraria;