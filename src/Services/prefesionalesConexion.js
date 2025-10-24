import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

const profesionalesApi = axios.create({
    baseURL: API_BASE,
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