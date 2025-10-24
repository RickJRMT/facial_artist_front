import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

const citasProfesionalApi = axios.create({
    baseURL: API_BASE,
    timeout: 5000,
});

citasProfesionalApi.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Error en citas profesional API:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const getCitasByProfesional = async (idProfesional) => {
    const response = await citasProfesionalApi.get(`/citas-profesional/profesional/${idProfesional}`);
    return response.data.eventosParaCalendario; // Eventos formateados
};

export const getEstadisticasCitas = async () => {
    const response = await citasProfesionalApi.get('/citas-profesional/stats');
    return response.data;
};