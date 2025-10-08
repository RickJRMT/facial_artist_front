import axios from 'axios';

const API_URL_PROFESIONALES = 'http://localhost:3000/api/Profesional';

export const obtenerProfesionales = async () => {
    try {
        const response = await axios.get(API_URL_PROFESIONALES);
        return response.data;
    } catch (error) {
        throw error;
    }
};
