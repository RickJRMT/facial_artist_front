import axiosInstance from './axiosInstance';
import axiosPublic from './axiosPublic';

const API_URL_PROFESIONALES = 'http://localhost:3000/api/Profesional';

// Usa axiosPublic para peticiones públicas (sin token)
export const obtenerProfesionales = async () => {
    try {
        const response = await axiosPublic.get(API_URL_PROFESIONALES);
        return response.data;
    } catch (error) {
        console.error('Error al obtener profesionales:', error.message);
        throw error;
    }
};

const profesionalesApi = axiosInstance.create({
    baseURL: API_URL_PROFESIONALES,
    timeout: 5000,
});

profesionalesApi.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Error en profesionales API:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const getAllProfesionales = async () => {
    const response = await profesionalesApi.get('/profesionales');
    return response.data; // Array de pros
};