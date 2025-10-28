import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

const horariosApi = axios.create({
    baseURL: API_BASE,
    timeout: 5000,
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
    const response = await horariosApi.post('/horarios', data);
    return response.data;
};

export const updateHorario = async (id, data) => {
    const response = await horariosApi.put(`/horarios/${id}`, data);
    return response.data;
};