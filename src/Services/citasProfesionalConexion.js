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

export const getAllCitas = async () => {
    const response = await citasProfesionalApi.get('/citas-profesional/all');
    return response.data.eventosParaCalendario || [];
};

export const getCitasByProfesional = async (idProfesional) => {
    const response = await citasProfesionalApi.get(`/citas-profesional/profesional/${idProfesional}`);
    return response.data.eventosParaCalendario || [];
};

export const getCitasByDate = async (fecha) => {
    const response = await citasProfesionalApi.get(`/citas-profesional/date/${fecha}`);
    return response.data;
};

export const getEstadisticasCitas = async () => {
    const response = await citasProfesionalApi.get('/citas-profesional/stats');
    return response.data;
};