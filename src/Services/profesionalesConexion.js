import axiosInstance from './axiosInstance';

const API_URL_PROFESIONALES = 'http://localhost:3000/api/Profesional';

export const obtenerProfesionales = async () => {
    try {
        const response = await axiosInstance.get(API_URL_PROFESIONALES);
        return response.data;
    } catch (error) {
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