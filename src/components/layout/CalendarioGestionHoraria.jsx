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
        const isHorario = title.includes('Activo') || title.includes('Inactivo');
        const isCita = !isHorario;

        return (
            <div className="gh-contenido-evento">
                <div className="gh-titulo-evento">
                    {isCita ? event.extendedProps.nombreProfesional || title.split(' - ')[0] : title}
                </div>
                {isCita && event.extendedProps.descripcionServicio && (
                    <div className="gh-descripcion-evento">
                        {event.extendedProps.descripcionServicio}
                    </div>
                )}
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
                    />
                </div>
            </div>
        </div>
    );
};

export default CalendarioGestionHoraria;