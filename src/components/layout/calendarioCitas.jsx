import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { message } from 'antd';
import { getCitas, getProfesionales, getServicios } from '../../Services/calendarioConexion';
import '../layout/calendarioCitas.css';

const CalendarioCitas = () => {
    const [eventos, setEventos] = useState([]);
    const [profesionales, setProfesionales] = useState([]);
    const [servicios, setServicios] = useState([]);
    // const [horarios, setHorarios] = useState([]);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const citas = await getCitas();
                const citasMapeadas = citas.map(cita => {
                    const fechaCita = cita.fechaCita ? new Date(cita.fechaCita) : new Date();
                    const horaCita = cita.horaCita ? cita.horaCita : '00:00:00';
                    const startDate = new Date(`${fechaCita.toISOString().split('T')[0]}T${horaCita}`);

                    if (isNaN(startDate.getTime())) {
                        console.warn('Fecha inválida para cita:', cita);
                        return null;
                    }

                    return {
                        id: cita.idCita,
                        title: `Ocupado`,
                        start: startDate.toISOString(),
                        end: new Date(startDate.getTime() + 60 * 60 * 1000).toISOString(),
                        classNames: cita.estadoCita === 'cancelada' ? ['event-cancelled'] : ['event-active'],
                        extendedProps: {
                            idCliente: cita.idCliente,
                            idProfesional: cita.idProfesional
                        }
                    };
                }).filter(evento => evento !== null);

                setEventos(citasMapeadas);

                const profesionalesResp = await getProfesionales();
                const serviciosResp = await getServicios();
                // const horariosResp = await getHorarios();

                setProfesionales(profesionalesResp.data || []);
                setServicios(serviciosResp.data || []);
                // setHorarios(horariosResp.data || []);
            } catch (error) {
                console.error('Error al cargar datos:', error);
                message.error('Error al conectar con el servidor. Verifica los endpoints.');
            }
        };

        cargarDatos();
    }, []);

    const renderEventContent = (eventInfo) => {
        const { event } = eventInfo;
        return (
            <div className="fc-event-main">
                <div className="fc-event-title">{event.title}</div>
                {event.extendedProps.horaCita && (
                    <div className="fc-event-time">{event.extendedProps.horaCita}</div>
                )}
            </div>
        );
    };

    return (
        <div className="calendario-container">
            <div className="calendario-citas">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                    }}
                    initialView="dayGridMonth"
                    events={eventos}
                    eventContent={renderEventContent}
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
                />
            </div>
        </div>
    );
};

export default CalendarioCitas;
