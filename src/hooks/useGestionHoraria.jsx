import { useState, useEffect } from 'react';
import { getAllCitas, getCitasByDate, getEstadisticasCitas } from '../Services/citasProfesionalConexion';
import { getAllHorarios, getHorariosByDate, createHorario, updateHorario } from '../services/horariosConexion';
import { obtenerProfesionales } from '../services/profesionalesConexion';

const padTime = (time) => {
    if (!time) return '';
    const [hour, minute] = time.split(':');
    const h = hour.padStart(2, '0');
    const m = minute ? minute.padStart(2, '0') : '00';
    return `${h}:${m}`;
};

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
    const [formData, setFormData] = useState({
        idProfesional: '',
        fecha: '',
        hora_inicio: '',
        hora_fin: '',
        estado: 'activo',
        idHorario: null
    });
    const [isEditMode, setIsEditMode] = useState(false); // NUEVO: Controla POST vs PUT
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
                fechaFormatted: new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(cita.fechaCita)),
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
                fechaFormatted: new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(horario.fecha)),
                horaFormatted: new Intl.DateTimeFormat('es-ES', { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(`2000-01-01T${horario.hora_inicio}`)),
                hora_inicio: padTime(horario.hora_inicio),
                hora_fin: padTime(horario.hora_fin)
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
            const startLocal = new Date(info.event.start);
            const fechaLocal = startLocal.toLocaleDateString('en-CA');
            const horaLocal = startLocal.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
            const fechaFormatted = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(startLocal);
            const horaFormatted = new Intl.DateTimeFormat('es-ES', { hour: 'numeric', minute: '2-digit', hour12: true }).format(startLocal);
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

    // ABRIR MODAL PARA CREAR NUEVO (POST)
    const openModal = () => {
        setFormData({
            idProfesional: '',
            fecha: '',
            hora_inicio: '',
            hora_fin: '',
            estado: 'activo',
            idHorario: null
        });
        setIsEditMode(false); // SOLO POST
        setShowModal(true);
        setError(null);
    };

    // ABRIR MODAL PARA EDITAR (PUT)
    const openEditModal = (horario) => {

        const idProfesional = horario.idProfesional ||
            profesionales.find(p => p.nombreProfesional === horario.nombreProfesional)?.idProfesional || '';

        const fecha = horario.fecha
            ? (typeof horario.fecha === 'string' ? horario.fecha.split('T')[0] : new Date(horario.fecha).toISOString().split('T')[0])
            : '';

        setFormData({
            idProfesional: idProfesional,
            fecha: fecha,
            hora_inicio: padTime(horario.hora_inicio) || '',
            hora_fin: padTime(horario.hora_fin) || '',
            estado: horario.estado || 'activo',
            idHorario: horario.idHorario
        });
        setIsEditMode(true); // SOLO PUT
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

        const payload = {
            ...formData,
            hora_inicio: formData.hora_inicio, // ← Ya está en HH:mm
            hora_fin: formData.hora_fin
        };

        const validationError = validateForm();
        if (validationError) {
            setMensaje(validationError);
            setShowError(true);
            setError(validationError);
            return;
        }

        try {
            setError(null);
            let responseData;

            if (isEditMode && formData.idHorario) {
                // PUT: Actualizar
                responseData = await updateHorario(formData.idHorario, formData);
                setMensaje('Horario actualizado correctamente');
            } else {
                // POST: Crear nuevo
                responseData = await createHorario(formData);
                setMensaje('Horario creado correctamente');
            }

            setShowModal(false);
            setShowSuccess(true);
            fetchAllData(selectedPro?.idProfesional);
        } catch (err) {
            const errMsg = err.response?.data?.error || err.message || 'Error al guardar horario';
            let variant = null;
            if (errMsg.includes('Solapamiento') || errMsg.includes('cerrada') || errMsg.includes('inactivo')) {
                variant = 'agenda-cerrada';
                setMensaje('No se puede guardar: Hay citas existentes o la agenda está cerrada.');
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
        isEditMode, // NUEVO: para el modal
        loading,
        error,
        handleSelectEvent,
        handleDateClick,
        openModal,        // SOLO POST
        openEditModal,    // SOLO PUT
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