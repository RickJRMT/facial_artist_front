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
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const renderEventContent = (eventInfo) => {
        const { event } = eventInfo;
        const title = event.title;
        const isHorario = title.includes('Disponible') || title.includes('Agenda Cerrada');
        const isCita = !isHorario;

        return (
            <div className="fc-event-main">
                <div className="fc-event-title">
                    {isCita ? event.extendedProps.nombreProfesional || title.split(' - ')[0] : title}
                </div>
                {isCita && event.extendedProps.descripcionServicio && (
                    <div className="fc-event-description" style={{ fontSize: '0.8em', color: '#666' }}>
                        {event.extendedProps.descripcionServicio}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="calendario-container">
            <div className="calendario-wrapper">
                {currentView === 'timeGridDay' && (
                    <div className="titulo-fecha-dia">
                        {formatFechaDia(currentDate)}
                    </div>
                )}
                <div className={`calendario-citas ${currentView === 'timeGridDay' ? 'ocultar-titulo' : ''}`}>
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
                        dateClick={onDateClick} // ← FIX: Click día para tabla
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
                        dayCellClassNames="calendario-day"
                        datesSet={onDatesSet}
                    />
                </div>
            </div>
        </div>
    );
};

export default CalendarioGestionHoraria;