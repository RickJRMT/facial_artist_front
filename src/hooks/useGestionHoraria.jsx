import { useState, useEffect } from 'react';
import { getHorariosByProfesional, createHorario, updateHorario } from '../services/horariosConexion';
import { getCitasByProfesional, getEstadisticasCitas } from '../services/citasProfesionalConexion';
import { obtenerProfesionales } from '../services/profesionalesConexion';

const getAllProfesionales = async () => obtenerProfesionales();

export const useGestionHoraria = (idProfesionalInicial = 1) => {
    const [eventos, setEventos] = useState([]);
    const [citaSeleccionada, setCitaSeleccionada] = useState(null);
    const [stats, setStats] = useState({ totalCitas: 0, citasPendientes: 0, citasConfirmadas: 0 });
    const [profesionales, setProfesionales] = useState([]);
    const [selectedPro, setSelectedPro] = useState(null); // ← FIX: State definido al inicio
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ idProfesional: idProfesionalInicial, fecha: '', hora_inicio: '', hora_fin: '', estado: 'activo' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [initialDate] = useState('2025-10-20');

    const fetchAllData = async (idPro = idProfesionalInicial) => {
        const validIdPro = idPro || idProfesionalInicial;
        setLoading(true);
        setError(null);
        try {
            const [horariosEvents, citasRaw, statsData, pros] = await Promise.all([
                getHorariosByProfesional(validIdPro),
                getCitasByProfesional(validIdPro),
                getEstadisticasCitas(),
                getAllProfesionales()
            ]);

            const horariosEventsFiltered = horariosEvents.filter(e => e.start);

            const citasEvents = citasRaw.map(cita => {
                const fechaCitaStr = cita.fechaCita ? cita.fechaCita.split('T')[0] : new Date().toISOString().split('T')[0];
                const horaCita = cita.horaCita || '00:00:00';
                const startStr = `${fechaCitaStr}T${horaCita}`;
                const startDate = new Date(startStr);
                const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

                if (isNaN(startDate.getTime())) {
                    console.warn('Fecha inválida para cita:', cita, 'startStr:', startStr);
                    return null;
                }
                return {
                    id: cita.idCita,
                    title: `${cita.nombreProfesional || 'N/A'} - ${cita.descripcionServicio || 'Servicio N/A'}`,
                    start: startDate.toISOString(),
                    end: endDate.toISOString(),
                    classNames: cita.estadoCita === 'confirmada' ? ['event-active'] :
                        cita.estadoCita === 'pendiente' ? ['event-pending'] : ['event-cancelled'],
                    extendedProps: {
                        idCliente: cita.idCliente || null,
                        idProfesional: cita.idProfesional || null,
                        horaCita,
                        nombreProfesional: cita.nombreProfesional || 'N/A',
                        descripcionServicio: cita.descripcionServicio || 'Servicio N/A',
                        estadoCita: cita.estadoCita || 'pendiente'
                    }
                };
            }).filter(evento => evento !== null);

            const combinedEvents = [...horariosEventsFiltered, ...citasEvents];
            setEventos(combinedEvents);
            console.log('DEBUG Citas mapeadas (con pro name):', citasEvents.length, 'eventos válidos');
            console.log('Ejemplos:', citasEvents.slice(0, 2));
            setStats(statsData);
            setProfesionales(pros);
            const initialPro = pros.find(p => p.idProfesional === validIdPro) || pros[0];
            setSelectedPro(initialPro); // ← Set después de fetch
            setFormData(prev => ({ ...prev, idProfesional: initialPro?.idProfesional || idProfesionalInicial }));
        } catch (err) {
            setError(err.message || 'Error al cargar datos');
            console.error('Error en fetchAllData (ID:', validIdPro, '):', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleSelectEvent = (info) => {
        const eventoFull = eventos.find(e => e.id === parseInt(info.event.id));
        if (eventoFull) {
            setCitaSeleccionada({
                nombreProfesional: eventoFull.extendedProps.nombreProfesional || 'N/A (Horario)',
                fecha: info.event.start.toISOString().split('T')[0],
                hora: info.event.start.toTimeString().slice(0, 5),
                descripcion: eventoFull.extendedProps.descripcionServicio || eventoFull.title
            });
        }
    };

    const validateForm = (isEdit = false) => {
        if (isEdit && !formData.fecha && !formData.hora_inicio && !formData.hora_fin) {
            return null;
        }
        if (!formData.idProfesional || !formData.fecha || !formData.hora_inicio || !formData.hora_fin) {
            return 'Faltan campos requeridos';
        }
        if (new Date(`2000-01-01T${formData.hora_inicio}`) >= new Date(`2000-01-01T${formData.hora_fin}`)) {
            return 'Hora inicio debe ser menor que hora fin';
        }
        return null;
    };

    const handleGuardarHorario = async (isEdit = false) => {
        const validationError = validateForm(isEdit);
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setError(null);
            let newEvent = null;
            const startStr = `${formData.fecha}T${formData.hora_inicio}:00`;
            const endStr = `${formData.fecha}T${formData.hora_fin}:00`;
            if (isEdit) {
                await updateHorario(formData.idHorario, formData);
                newEvent = {
                    id: formData.idHorario,
                    title: formData.estado === 'activo' ? `Disponible - ${formData.hora_inicio} a ${formData.hora_fin}` : 'Agenda Cerrada',
                    start: startStr,
                    end: endStr,
                    backgroundColor: formData.estado === 'activo' ? '#28a745' : '#dc3545',
                    borderColor: formData.estado === 'activo' ? '#28a745' : '#dc3545'
                };
                setEventos(prev => prev.map(e => e.id === formData.idHorario ? newEvent : e));
            } else {
                const response = await createHorario(formData);
                newEvent = {
                    id: response.id,
                    title: formData.estado === 'activo' ? `Disponible - ${formData.hora_inicio} a ${formData.hora_fin}` : 'Agenda Cerrada',
                    start: startStr,
                    end: endStr,
                    backgroundColor: formData.estado === 'activo' ? '#28a745' : '#dc3545',
                    borderColor: formData.estado === 'activo' ? '#28a745' : '#dc3545'
                };
                setEventos(prev => [...prev, newEvent]);
                console.log('DEBUG Nuevo evento agregado:', newEvent);
            }
            setShowModal(false);
            await fetchAllData();
        } catch (err) {
            setError(err.message || 'Error al guardar horario');
            console.error('Error en handleGuardarHorario:', err);
        }
    };

    const openModal = (horarioEdit = null) => {
        let initialData = { idProfesional: selectedPro ? selectedPro.idProfesional : idProfesionalInicial, fecha: '', hora_inicio: '', hora_fin: '', estado: 'activo' };
        if (horarioEdit) {
            initialData = { ...horarioEdit };
        } else if (citaSeleccionada) {
            initialData = {
                ...initialData,
                idProfesional: citaSeleccionada.idProfesional || idProfesionalInicial,
                fecha: citaSeleccionada.fecha,
                hora_inicio: citaSeleccionada.hora,
                hora_fin: '01:00:00',
                descripcion: citaSeleccionada.descripcion
            };
        }
        setFormData(initialData);
        setShowModal(true);
        setError(null);
    };

    return {
        eventos,
        citaSeleccionada,
        stats,
        profesionales,
        selectedPro,
        showModal,
        formData,
        loading,
        error,
        setFormData,
        handleSelectEvent,
        openModal,
        handleGuardarHorario,
        setShowModal,
        fetchAllData,
        initialDate
    };
};