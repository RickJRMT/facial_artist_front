import { useState, useEffect } from 'react';
import { getAllCitas, getCitasByDate, getEstadisticasCitas } from '../Services/citasProfesionalConexion';
import { getAllHorarios, getHorariosByDate, createHorario, updateHorario } from '../Services/horariosConexion';
import { obtenerProfesionales } from '../Services/profesionalesConexion';

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
    const [isEditMode, setIsEditMode] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAllData = async (idPro = idProfesionalInicial) => {
        setLoading(true);
        setError(null);
        try {
            const [allCitasResponse, allHorariosResponse, statsData, pros] = await Promise.all([
                getAllCitas(),
                getAllHorarios(),
                getEstadisticasCitas(),
                getAllProfesionales()
            ]);

            const allCitasEvents = allCitasResponse.eventosParaCalendario || [];
            const citasEventsWithProps = allCitasEvents.filter(ev => ev && ev.title).map(ev => ({
                ...ev,
                extendedProps: {
                    ...ev.extendedProps,
                    nombreProfesional: ev.extendedProps?.nombreProfesional || (ev.title || '').split(' - ')[0] || 'N/A',
                    descripcionServicio: ev.extendedProps?.descripcionServicio || (ev.title || '').split(' - ')[1] || ''
                }
            })).filter(ev => ev.extendedProps.nombreProfesional !== 'N/A' || ev.extendedProps.descripcionServicio);

            // FIX: Maneja si allHorariosResponse es array directo o {eventosParaCalendario}
            const allHorariosEvents = Array.isArray(allHorariosResponse) ? allHorariosResponse : allHorariosResponse.eventosParaCalendario || [];

            const horariosEventsWithProps = allHorariosEvents.filter(ev => ev && ev.title).map(ev => {
                let nombreProfesional = ev.extendedProps?.nombreProfesional || 'N/A';
                if (nombreProfesional === 'N/A' && ev.idProfesional) {
                    const pro = pros.find(p => p.idProfesional === ev.idProfesional);
                    nombreProfesional = pro ? pro.nombreProfesional : 'N/A';
                }
                const estado = ev.extendedProps?.estado || (ev.title.includes('Activo') ? 'activo' : 'inactivo');
                const estadoText = estado === 'activo' ? 'Activo' : 'Inactivo';
                const titleWithEstado = `${nombreProfesional} - ${estadoText}`; // Título con nombre + estado como en el original
                // FIX: Usa raw fecha del backend para evitar timezone issues en fechas futuras
                const fechaRaw = ev.extendedProps?.fechaLocal || ev.start.split('T')[0]; // Usa raw o start
                const horaInicioRaw = ev.start.split('T')[1] || ev.extendedProps?.hora_inicio;
                const horaFinRaw = ev.end.split('T')[1] || ev.extendedProps?.hora_fin;
                const startStr = `${fechaRaw}T${horaInicioRaw}`;
                const endStr = `${fechaRaw}T${horaFinRaw}`;

                return {
                    ...ev,
                    title: ev.title || titleWithEstado, // Forzar título si no viene del backend
                    start: startStr,
                    end: endStr,
                    extendedProps: {
                        estado,
                        nombreProfesional,
                        idHorario: ev.id,
                        idProfesional: ev.idProfesional || ev.extendedProps?.idProfesional
                    }
                };
            });

            // Solo mostrar horarios en el calendario, no las citas
            const finalEvents = horariosEventsWithProps;

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
                horaFormatted: new Intl.DateTimeFormat('es-ES', { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(`2000-01-01T${cita.horaCita}`)),
                // Agregar nombre completo del cliente
                nombreCliente: `${cita.nombreCliente || 'N/A'} ${cita.apellidoCliente || ''}`.trim() || 'Cliente no especificado'
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

    // VALIDACIÓN: Verifica citas raw en rango para pro/fecha, con duración de cita (replica backend)
    const checkCitasInHorario = async (fecha, horaInicio, horaFin, idProfesional) => {
        try {
            let fechaNorm = fecha;
            if (fechaNorm.includes('T')) {
                fechaNorm = fechaNorm.split('T')[0];
            }

            const todasCitasResponse = await getAllCitas();
            const todasCitas = todasCitasResponse.citas || [];

            // Filtrar por fecha y pro
            const citasDiaPro = todasCitas.filter(cita => {
                const fechaCitaNorm = cita.fechaCita ? (typeof cita.fechaCita === 'string' ? cita.fechaCita.split('T')[0] : new Date(cita.fechaCita).toISOString().split('T')[0]) : null;
                const matchesFecha = fechaCitaNorm === fechaNorm;
                const matchesPro = parseInt(cita.idProfesional, 10) === parseInt(idProfesional, 10);
                return matchesFecha && matchesPro;
            });

            if (citasDiaPro.length === 0) {
                return { hasCitas: false, citas: [] };
            }

            // Calcular horarios de las citas con duración
            const citasConHorarios = citasDiaPro.map(cita => {
                const horaCitaStr = cita.horaCita ? cita.horaCita.split(':').slice(0, 2).join(':') : '';
                const citaInicio = new Date(`2000-01-01T${horaCitaStr}:00`);
                const citaDuracionMin = cita.servDuracion || 60;
                const citaFin = new Date(citaInicio.getTime() + (citaDuracionMin * 60 * 1000));

                return {
                    ...cita,
                    horaInicio: horaCitaStr,
                    horaFin: citaFin.toTimeString().slice(0, 5),
                    inicioTime: citaInicio.getTime(),
                    finTime: citaFin.getTime()
                };
            });

            // Verificar solapamiento con el horario propuesto
            const inicio = new Date(`2000-01-01T${horaInicio}:00`).getTime();
            const fin = new Date(`2000-01-01T${horaFin}:00`).getTime();

            const citasEnConflicto = citasConHorarios.filter(cita => {
                return cita.inicioTime < fin && cita.finTime > inicio;
            });

            return {
                hasCitas: citasEnConflicto.length > 0,
                citas: citasConHorarios,
                citasEnConflicto: citasEnConflicto
            };
        } catch (err) {
            console.error('Error en validación citas:', err);
            return { hasCitas: false, citas: [] };
        }
    };

    // Validación específica para cambio de estado (activo/inactivo)
    const validateEstadoChange = async (horarioOriginal, nuevoEstado) => {
        // Si estamos activando un horario, siempre permitir
        if (nuevoEstado === 'activo') {
            return { esValido: true, mensaje: '' };
        }

        // Si estamos inactivando, verificar si hay citas
        const { hasCitas, citas } = await checkCitasInHorario(
            horarioOriginal.fecha,
            horarioOriginal.hora_inicio,
            horarioOriginal.hora_fin,
            horarioOriginal.idProfesional
        );

        if (hasCitas) {
            const horariosAfectados = citas.map(cita =>
                `${cita.horaInicio}-${cita.horaFin}`
            ).join(', ');

            return {
                esValido: true, // Permitimos inactivar aún con citas, pero mostramos advertencia
                advertencia: `Hay citas agendadas en los siguientes horarios: ${horariosAfectados}. Las citas se mantendrán pero no se podrán agendar nuevas citas en este horario.`
            };
        }

        return { esValido: true, mensaje: '' };
    };

    // Validación de modificación de horario
    const validateHorarioModification = async (horarioOriginal, nuevoHorario) => {
        // Si solo estamos cambiando el estado, usar validación específica
        if (
            horarioOriginal.hora_inicio === nuevoHorario.hora_inicio &&
            horarioOriginal.hora_fin === nuevoHorario.hora_fin &&
            horarioOriginal.fecha === nuevoHorario.fecha &&
            horarioOriginal.estado !== nuevoHorario.estado
        ) {
            return await validateEstadoChange(horarioOriginal, nuevoHorario.estado);
        }

        // Para otros cambios, validar que las citas queden dentro del nuevo horario
        const { citas } = await checkCitasInHorario(
            horarioOriginal.fecha,
            horarioOriginal.hora_inicio,
            horarioOriginal.hora_fin,
            horarioOriginal.idProfesional
        );

        if (citas.length === 0) {
            return { esValido: true, mensaje: '' };
        }

        const nuevoInicio = new Date(`2000-01-01T${nuevoHorario.hora_inicio}:00`).getTime();
        const nuevoFin = new Date(`2000-01-01T${nuevoHorario.hora_fin}:00`).getTime();

        const citasNoContempladas = citas.filter(cita => {
            return cita.inicioTime < nuevoInicio || cita.finTime > nuevoFin;
        });

        if (citasNoContempladas.length > 0) {
            const horariosAfectados = citasNoContempladas.map(cita =>
                `${cita.horaInicio}-${cita.horaFin}`
            ).join(', ');

            return {
                esValido: false,
                mensaje: `No se puede modificar: hay citas agendadas en ${horariosAfectados} que quedarían fuera del nuevo horario.`,
                citasAfectadas: citasNoContempladas,
                sugerencia: getSugerenciaHorario(citas, nuevoHorario)
            };
        }

        return { esValido: true, mensaje: '' };
    };

    // Función para sugerir horarios válidos
    const getSugerenciaHorario = (citas, horarioDeseado) => {
        if (citas.length === 0) return null;

        // Encontrar el rango mínimo necesario para cubrir todas las citas
        const inicioMinimo = Math.min(...citas.map(c => c.inicioTime));
        const finMaximo = Math.max(...citas.map(c => c.finTime));

        const sugerenciaInicio = new Date(inicioMinimo).toTimeString().slice(0, 5);
        const sugerenciaFin = new Date(finMaximo).toTimeString().slice(0, 5);

        return {
            hora_inicio: sugerenciaInicio,
            hora_fin: sugerenciaFin,
            mensaje: `Horario sugerido para cubrir todas las citas: ${sugerenciaInicio} - ${sugerenciaFin}`
        };
    };

    // Función para formatear citas en listado (hh:mm a.m. - hh:mm p.m.)
    const formatCitasComListado = (citas) => {
        if (!citas || citas.length === 0) return [];
        
        return citas.map(cita => {
            const horaInicio = cita.horaInicio || '';
            const horaFin = cita.horaFin || '';
            
            if (!horaInicio) return null;
            
            // Convertir a formato 12 horas con a.m./p.m.
            const inicioDate = new Date(`2000-01-01T${horaInicio}:00`);
            const finDate = horaFin ? new Date(`2000-01-01T${horaFin}:00`) : new Date(inicioDate.getTime() + 60 * 60 * 1000);
            
            const formatoHora = { hour: 'numeric', minute: '2-digit', hour12: true };
            const inicioFormato = new Intl.DateTimeFormat('es-ES', formatoHora).format(inicioDate);
            const finFormato = new Intl.DateTimeFormat('es-ES', formatoHora).format(finDate);
            
            return `${inicioFormato} - ${finFormato}`;
        }).filter(Boolean);
    };

    // Efecto inicial para cargar datos
    useEffect(() => {
        fetchAllData();
    }, []);

    // Efecto para mantener datos sincronizados
    useEffect(() => {
        let refreshInterval;

        // Si hay un modal abierto o estamos cargando, no refrescar
        if (!showModal && !loading) {
            refreshInterval = setInterval(async () => {
                // Actualizar datos sin mostrar indicador de carga
                try {
                    const [allHorariosResponse, statsData] = await Promise.all([
                        getAllHorarios(),
                        getEstadisticasCitas()
                    ]);

                    // Actualizar solo si hay cambios
                    const newHorarios = Array.isArray(allHorariosResponse) ? 
                        allHorariosResponse : 
                        allHorariosResponse.eventosParaCalendario || [];

                    if (JSON.stringify(newHorarios) !== JSON.stringify(eventos)) {
                        await fetchAllData(selectedPro?.idProfesional);
                        
                        // Si hay una fecha seleccionada, actualizar los datos específicos
                        if (citaSeleccionada?.fecha) {
                            await Promise.all([
                                fetchHorariosByDate(citaSeleccionada.fecha),
                                fetchCitasByDate(citaSeleccionada.fecha)
                            ]);
                        }
                    }
                } catch (err) {
                    console.error('Error en actualización automática:', err);
                }
            }, 30000); // Actualizar cada 30 segundos
        }

        return () => {
            if (refreshInterval) {
                clearInterval(refreshInterval);
            }
        };
    }, [showModal, loading, selectedPro, citaSeleccionada]);

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
                const idProfesional = eventoFull.extendedProps?.idProfesional || '';
                setCitaSeleccionada({
                    ...eventoFull.extendedProps,
                    idProfesional,
                    nombreProfesional: eventoFull.extendedProps?.nombreProfesional || 'N/A',
                    fecha: fechaLocal,
                    hora: horaLocal,
                    fechaFormatted,
                    horaFormatted,
                    descripcion: title,
                    idHorario: eventoFull.id,
                    estado: eventoFull.extendedProps.estado,
                    hora_inicio: horaLocal,
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
        setFormData({
            idProfesional: '',
            fecha: '',
            hora_inicio: '',
            hora_fin: '',
            estado: 'activo',
            idHorario: null
        });
        setIsEditMode(false);
        setShowModal(true);
        setError(null);
    };

    const openEditModal = (horario) => {
        const idProfesional = horario.idProfesional ||
            profesionales.find(p => p.nombreProfesional === horario.nombreProfesional)?.idProfesional || '';

        let fecha = horario.fecha
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
        setIsEditMode(true);
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
            hora_inicio: formData.hora_inicio,
            hora_fin: formData.hora_fin
        };

        const validationError = validateForm();
        if (validationError) {
            setMensaje(validationError);
            setShowError(true);
            return;
        }

        try {
            setError(null);
            setLoading(true); // Indicar que está cargando

            // Si estamos editando, validar que no afecte citas existentes
            if (isEditMode && formData.idHorario) {
                // Obtener el horario original para comparar
                const horarioOriginal = eventos.find(e =>
                    e.id === formData.idHorario || e.extendedProps?.idHorario === formData.idHorario
                );

                if (horarioOriginal) {
                    const validacion = await validateHorarioModification(
                        {
                            fecha: formData.fecha,
                            hora_inicio: horarioOriginal.extendedProps?.hora_inicio || horarioOriginal.start?.split('T')[1]?.slice(0, 5),
                            hora_fin: horarioOriginal.extendedProps?.hora_fin || horarioOriginal.end?.split('T')[1]?.slice(0, 5),
                            idProfesional: formData.idProfesional,
                            estado: horarioOriginal.extendedProps?.estado || 'activo'
                        },
                        formData
                    );

                    if (!validacion.esValido) {
                        setMensaje(validacion.mensaje);
                        if (validacion.sugerencia) {
                            setMensaje(`${validacion.mensaje}\n\n${validacion.sugerencia.mensaje}`);
                        }
                        setShowError(true);
                        setLoading(false);
                        return;
                    }

                    // Si hay advertencia pero se puede continuar
                    if (validacion.advertencia) {
                        setMensaje(validacion.advertencia);
                        setShowError(true);
                    }
                }
            }

            let responseData;

            if (isEditMode && formData.idHorario) {
                responseData = await updateHorario(formData.idHorario, formData);
                setMensaje('Horario actualizado correctamente');
            } else {
                responseData = await createHorario(formData);
                setMensaje('Horario creado correctamente');
            }

            // Actualizar todos los datos necesarios
            await Promise.all([
                fetchAllData(selectedPro?.idProfesional),
                formData.fecha && fetchHorariosByDate(formData.fecha),
                formData.fecha && fetchCitasByDate(formData.fecha)
            ]);

            setShowModal(false);
            setShowSuccess(true);
            setLoading(false);
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
            setLoading(false);
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
        isEditMode,
        loading,
        error,
        handleSelectEvent,
        handleDateClick,
        openModal,
        openEditModal,
        handleGuardarHorario,
        setShowModal,
        fetchAllData,
        handleSelectPro,
        showSuccess,
        showError,
        mensaje,
        setShowSuccess,
        setShowError,
        setMensaje,
        checkCitasInHorario,
        validateHorarioModification,
        getSugerenciaHorario,
        formatCitasComListado
    };
};