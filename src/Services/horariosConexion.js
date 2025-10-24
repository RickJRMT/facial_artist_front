import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

const horariosApi = axios.create({
    baseURL: API_BASE,
    timeout: 5000,
});

// Opcional: Interceptor para errors globales
horariosApi.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Error en horarios API:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const getHorariosByProfesional = async (idProfesional) => {
    const response = await horariosApi.get(`/horarios/profesional/${idProfesional}`);
    return response.data.eventosParaCalendario; // Retorna solo eventos formateados
};

export const createHorario = async (data) => {
    const response = await horariosApi.post('/horarios', data);
    return response.data;
};

export const updateHorario = async (id, data) => {
    const response = await horariosApi.put(`/horarios/${id}`, data);
    return response.data;
};