import { useState, useEffect } from 'react';
import { getHorariosByProfesional, createHorario, updateHorario } from '../Services/horariosConexion';
import { getCitasByProfesional, getEstadisticasCitas } from '../Services/citasProfesionalConexion';
import { obtenerProfesionales } from '../services/profesionalesConexion';

// Alias para consistencia (llama tu función)
const getAllProfesionales = async () => obtenerProfesionales();

export const useGestionHoraria = (idProfesionalInicial = 1) => {
    const [eventos, setEventos] = useState([]);
    const [citaSeleccionada, setCitaSeleccionada] = useState(null);
    const [stats, setStats] = useState({ totalCitas: 0, citasPendientes: 0, citasConfirmadas: 0 });
    const [profesionales, setProfesionales] = useState([]); // Lista de pros de tu service
    const [selectedPro, setSelectedPro] = useState(null); // Pro seleccionado
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ idProfesional: idProfesionalInicial, fecha: '', hora_inicio: '', hora_fin: '', estado: 'activo' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    
    const fetchAllData = async (idPro = idProfesionalInicial) => {
        setLoading(true);
        setError(null);
        console.log('FETCH HORARIOS PARA ID:', idPro);
        try {
            const [horariosEvents, citasEvents, statsData, pros] = await Promise.all([
                getHorariosByProfesional(idPro),
                getCitasByProfesional(idPro),
                getEstadisticasCitas(),
                getAllProfesionales() // ← Usa tu función
            ]);
            const combinedEvents = [...horariosEvents, ...citasEvents];
            setEventos(combinedEvents);
            console.log('DEBUG Eventos cargados:', combinedEvents); // Debug: verifica citas con nombre pro
            setStats(statsData);
            setProfesionales(pros);
            const initialPro = pros.find(p => p.idProfesional === idPro) || pros[0];
            setSelectedPro(initialPro);
            setFormData(prev => ({ ...prev, idProfesional: initialPro?.idProfesional || idPro }));
        } catch (err) {
            setError(err.message || 'Error al cargar datos');
            console.error('Error en fetchAllData:', err); // Debug
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    // Update selectedPro cambia idPro para refetch
    const handleSelectPro = (newPro) => {
        setSelectedPro(newPro);
        setFormData(prev => ({ ...prev, idProfesional: newPro?.idProfesional }));
        fetchAllData(newPro?.idProfesional);
    };

    const handleSelectEvent = (info) => {
        const eventoFull = eventos.find(e => e.id === parseInt(info.event.id));
        if (eventoFull) {
            setCitaSeleccionada({
                nombreProfesional: eventoFull.title.includes('Disponible') || eventoFull.title.includes('Agenda Cerrada')
                    ? 'N/A (Horario)'
                    : eventoFull.title.split(' - ')[0],
                fecha: info.event.start.toISOString().split('T')[0],
                hora: info.event.start.toTimeString().slice(0, 5),
                descripcion: eventoFull.title.includes('Disponible') || eventoFull.title.includes('Agenda Cerrada')
                    ? eventoFull.title
                    : eventoFull.title.split(' - ')[1] || 'N/A'
            });
        }
    };

    const validateForm = () => {
        if (!formData.idProfesional || !formData.fecha || !formData.hora_inicio || !formData.hora_fin) return 'Faltan campos requeridos';
        if (new Date(`2000-01-01T${formData.hora_inicio}`) >= new Date(`2000-01-01T${formData.hora_fin}`)) {
            return 'Hora inicio debe ser menor que hora fin';
        }
        return null;
    };

    const handleGuardarHorario = async (isEdit = false) => {
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setError(null);
            if (isEdit) {
                await updateHorario(formData.idHorario, formData);
            } else {
                await createHorario(formData);
            }
            setShowModal(false);
            await fetchAllData(formData.idProfesional); // Refetch con pro actual
        } catch (err) {
            setError(err.message || 'Error al guardar horario');
        }
    };

    const openModal = (horarioEdit = null) => {
        if (horarioEdit) {
            setFormData({ ...horarioEdit, idProfesional: horarioEdit.idProfesional });
        } else {
            setFormData({ idProfesional: selectedPro?.idProfesional || idProfesionalInicial, fecha: '', hora_inicio: '', hora_fin: '', estado: 'activo' });
        }
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
        handleSelectPro
    };
};