import { useState, useEffect } from 'react';
import { getAllCitas, getCitasByDate, getEstadisticasCitas } from '../Services/citasProfesionalConexion';
import { getAllHorarios, getHorariosByDate, createHorario, updateHorario } from '../services/horariosConexion';
import { obtenerProfesionales } from '../services/profesionalesConexion';

const getAllProfesionales = async () => obtenerProfesionales();

export const useGestionHoraria = (idProfesionalInicial = 1) => {
    const [eventos, setEventos] = useState([]);
    const [citaSeleccionada, setCitaSeleccionada] = useState(null);
    const [selectedDateCitas, setSelectedDateCitas] = useState([]);
    const [selectedDateHorarios, setSelectedDateHorarios] = useState([]);
    const [stats, setStats] = useState({ totalCitas: 0, citasPendientes: 0, citasConfirmadas: 0 });
    const [profesionales, setProfesionales] = useState([]);
    const [selectedPro, setSelectedPro] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ idProfesional: '', fecha: '', hora_inicio: '', hora_fin: '', estado: 'activo', idHorario: null });
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAllData = async (idPro = idProfesionalInicial) => {
        setLoading(true);
        setError(null);
        try {
            const [allCitasEvents, allHorariosEvents, statsData, pros] = await Promise.all([
                getAllCitas(),
                getAllHorarios(),
                getEstadisticasCitas(),
                getAllProfesionales()
            ]);
            const citasEventsWithProps = (allCitasEvents || []).filter(ev => ev && ev.title).map(ev => ({
                ...ev,
                extendedProps: {
                    nombreProfesional: ev.extendedProps?.nombreProfesional || (ev.title || '').split(' - ')[0] || 'N/A',
                    descripcionServicio: ev.extendedProps?.descripcionServicio || (ev.title || '').split(' - ')[1] || ''
                }
            })).filter(ev => ev.extendedProps.nombreProfesional !== 'N/A' || ev.extendedProps.descripcionServicio);
            const horariosEventsWithProps = (allHorariosEvents || []).filter(ev => ev && ev.title).map(ev => ({
                ...ev,
                extendedProps: {
                    estado: ev.extendedProps?.estado || (ev.title.includes('Activo') ? 'activo' : 'inactivo'),
                    nombreProfesional: ev.extendedProps?.nombreProfesional || 'N/A',
                    idHorario: ev.id
                }
            }));
            const combinedEvents = [...citasEventsWithProps, ...horariosEventsWithProps];
            const finalEvents = combinedEvents.map(ev => {
                const solapHorario = horariosEventsWithProps.find(h => h.extendedProps.estado === 'inactivo' && h.start <= ev.start && h.end >= ev.end);
                if (solapHorario && ev.extendedProps?.estado !== 'confirmada') {
                    return { ...ev, classNames: ['gh-cita-solapada-inactiva'], backgroundColor: '#dc3545' };
                }
                return ev;
            });
            setEventos(finalEvents);
            setStats(statsData || { totalCitas: 0, citasPendientes: 0, citasConfirmadas: 0 });
            setProfesionales(pros || []);
            const initialPro = (pros || []).find(p => p.idProfesional === idPro) || (pros || [])[0];
            setSelectedPro(initialPro);
        } catch (err) {
            setError(err.message || 'Error al cargar datos');
            console.error('Error en fetchAllData:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCitasByDate = async (fecha) => {
        try {
            const citasDia = await getCitasByDate(fecha);
            const formattedCitas = citasDia.map(cita => ({
                ...cita,
                fechaFormatted: new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(cita.fechaCita)), // Local time
                horaFormatted: new Intl.DateTimeFormat('es-ES', { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(`2000-01-01T${cita.horaCita}`))
            }));
            setSelectedDateCitas(formattedCitas);
        } catch (err) {
            console.error('Error fetch citas por fecha:', err);
            setSelectedDateCitas([]);
        }
    };

    const fetchHorariosByDate = async (fecha) => {
        try {
            const horariosDia = await getHorariosByDate(fecha);
            const formattedHorarios = horariosDia.map(horario => ({
                ...horario,
                fechaFormatted: new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(horario.fecha)), // Local time
                horaFormatted: new Intl.DateTimeFormat('es-ES', { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(`2000-01-01T${horario.hora_inicio}`))
            }));
            setSelectedDateHorarios(formattedHorarios);
        } catch (err) {
            console.error('Error fetch horarios por fecha:', err);
            setSelectedDateHorarios([]);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleSelectPro = (newPro) => {
        setSelectedPro(newPro);
        fetchAllData(newPro?.idProfesional);
    };

    const handleSelectEvent = (info) => {
        const eventoFull = eventos.find(e => e && e.id === parseInt(info.event.id));
        if (eventoFull) {
            const title = eventoFull.title || '';
            const isHorario = title.includes('Activo') || title.includes('Inactivo');
            // FIX: Usar local time para evitar merma de día
            const startLocal = new Date(info.event.start); // Convertir a local
            const fechaLocal = startLocal.toLocaleDateString('en-CA'); // YYYY-MM-DD local
            const horaLocal = startLocal.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); // HH:MM local
            const fechaFormatted = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(startLocal); // Local
            const horaFormatted = new Intl.DateTimeFormat('es-ES', { hour: 'numeric', minute: '2-digit', hour12: true }).format(startLocal); // Local
            if (isHorario) {
                setCitaSeleccionada({
                    nombreProfesional: eventoFull.extendedProps?.nombreProfesional || 'N/A',
                    fecha: fechaLocal,
                    hora: horaLocal,
                    fechaFormatted,
                    horaFormatted,
                    descripcion: title,
                    idHorario: eventoFull.id,
                    estado: eventoFull.extendedProps.estado,
                    hora_fin: eventoFull.end ? new Date(eventoFull.end).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : null
                });
                return;
            }
            setCitaSeleccionada({
                nombreProfesional: eventoFull.extendedProps?.nombreProfesional || title.split(' - ')[0] || 'N/A',
                fecha: fechaLocal,
                hora: horaLocal,
                fechaFormatted,
                horaFormatted,
                descripcion: eventoFull.extendedProps?.descripcionServicio || title.split(' - ')[1] || 'N/A'
            });
        }
    };

    const handleDateClick = (info) => {
        const fecha = info.dateStr;
        setCitaSeleccionada(null);
        fetchCitasByDate(fecha);
        fetchHorariosByDate(fecha);
    };

    const openModal = () => {
        let initialData = { idProfesional: '', fecha: '', hora_inicio: '', hora_fin: '', estado: 'activo', idHorario: null };

        if (citaSeleccionada) {
            const horaFin = citaSeleccionada.idHorario ? '' : new Date(new Date(`2000-01-01T${citaSeleccionada.hora.replace(' ', '')}`).getTime() + 60 * 60 * 1000).toTimeString().slice(0, 5);
            initialData = {
                ...initialData,
                idProfesional: profesionales.find(p => p.nombreProfesional === citaSeleccionada.nombreProfesional)?.idProfesional || '',
                fecha: citaSeleccionada.fecha,
                hora_inicio: citaSeleccionada.hora.replace(' ', ''), // HH:MM
                hora_fin: horaFin,
                idHorario: citaSeleccionada.idHorario
            };
        } else if (selectedDateHorarios.length > 0) {
            const horario = selectedDateHorarios[0];
            initialData = {
                ...initialData,
                idProfesional: horario.idProfesional || '',
                fecha: horario.fecha.split('T')[0] || '',
                hora_inicio: horario.hora_inicio,
                hora_fin: horario.hora_fin,
                estado: horario.estado,
                idHorario: horario.idHorario
            };
        }

        setFormData(initialData);
        setShowModal(true);
        setError(null);
    };

    const validateForm = () => {
        if (!formData.idProfesional || !formData.fecha || !formData.hora_inicio || !formData.hora_fin) {
            return 'Faltan campos requeridos';
        }
        if (new Date(`2000-01-01T${formData.hora_inicio}`) >= new Date(`2000-01-01T${formData.hora_fin}`)) {
            return 'Hora inicio debe ser menor que hora fin';
        }
        return null;
    };

    const handleGuardarHorario = async () => {
        const validationError = validateForm();
        if (validationError) {
            setMensaje(validationError);
            setShowError(true);
            setError(validationError);
            return;
        }

        const isEdit = formData.idHorario && !isNaN(Number(formData.idHorario)) && Number(formData.idHorario) > 0;

        try {
            setError(null);
            let responseData;
            if (isEdit) {
                responseData = await updateHorario(formData.idHorario, formData);
            } else {
                responseData = await createHorario(formData);
            }
            setShowModal(false);
            setMensaje('Horario guardado exitosamente');
            setShowSuccess(true);

            fetchAllData(selectedPro?.idProfesional);
        } catch (err) {
            const errMsg = err.response?.data?.error || err.message || 'Error al guardar horario';
            let variant = null;
            if (errMsg.includes('Solapamiento') || errMsg.includes('cerrada') || errMsg.includes('inactivo')) {
                variant = 'agenda-cerrada'; // ← NUEVO: Variant para cierre de agenda
                setMensaje('No se puede guardar: Hay citas existentes en ese horario o la agenda está cerrada. Cancela citas primero o elige otro rango.');
            } else {
                setMensaje(errMsg);
            }
            setShowError(true);
            setError(errMsg);
            console.error('Error en guardar:', err);
        }
    };

    return {
        eventos,
        citaSeleccionada,
        selectedDateCitas,
        selectedDateHorarios,
        stats,
        profesionales,
        selectedPro,
        showModal,
        formData,
        setFormData,
        loading,
        error,
        handleSelectEvent,
        handleDateClick,
        openModal,
        handleGuardarHorario,
        setShowModal,
        fetchAllData,
        handleSelectPro,
        showSuccess,
        showError,
        mensaje,
        setShowSuccess,
        setShowError,
        setMensaje
    };
};