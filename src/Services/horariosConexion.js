import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

const horariosApi = axios.create({
    baseURL: API_BASE,
    // timeout: 5000,
});

horariosApi.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Error en horarios API:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const getAllHorarios = async () => {
    const response = await horariosApi.get('/horarios/all');
    return response.data.eventosParaCalendario || [];
};

export const getHorariosByDate = async (fecha) => {
    const response = await horariosApi.get(`/horarios/date/${fecha}`);
    return response.data; // Raw para prefill
};

export const getHorariosByProfesional = async (idProfesional) => {
    const response = await horariosApi.get(`/horarios/profesional/${idProfesional}`);
    return response.data.eventosParaCalendario || [];
};

export const createHorario = async (data) => {
    // Asegurar formato de hora correcto (HH:MM:SS)
    const formatearHora = (hora) => {
        if (!hora) return null;
        // Si ya tiene los segundos, retornar tal cual
        if (hora.split(':').length === 3) return hora;
        // Si solo tiene horas y minutos, agregar segundos
        return `${hora}:00`;
    };

    const horarioFormateado = {
        ...data,
        hora_inicio: formatearHora(data.hora_inicio),
        hora_fin: formatearHora(data.hora_fin)
    };

    const response = await horariosApi.post('/horarios', horarioFormateado);
    return response.data;
};

export const updateHorario = async (id, data) => {
    // Asegurar formato de hora correcto (HH:MM:SS)
    const formatearHora = (hora) => {
        if (!hora) return null;
        // Si ya tiene los segundos, retornar tal cual
        if (hora.split(':').length === 3) return hora;
        // Si solo tiene horas y minutos, agregar segundos
        return `${hora}:00`;
    };

    const horarioFormateado = {
        ...data,
        hora_inicio: formatearHora(data.hora_inicio),
        hora_fin: formatearHora(data.hora_fin)
    };

    const response = await horariosApi.put(`/horarios/${id}`, horarioFormateado);
    return response.data;
};