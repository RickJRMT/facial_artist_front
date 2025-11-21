import axiosInstance from './axiosInstance';

const API_BASE = 'http://localhost:3000/api';

// Interceptor de errores (opcional, puedes dejarlo si quieres logs específicos)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Error en citas profesional API:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const getAllCitas = async () => {
    const response = await axiosInstance.get(`${API_BASE}/citas-profesional/all`);
    return response.data;
};

export const getCitasByProfesional = async (idProfesional) => {
    const response = await axiosInstance.get(`${API_BASE}/citas-profesional/profesional/${idProfesional}`);
    return response.data.eventosParaCalendario || [];
};

export const getCitasByDate = async (fecha) => {
    const response = await axiosInstance.get(`${API_BASE}/citas-profesional/date/${fecha}`);
    return response.data;
};

export const getEstadisticasCitas = async () => {
    const response = await axiosInstance.get(`${API_BASE}/citas-profesional/stats`);
    return response.data;
};