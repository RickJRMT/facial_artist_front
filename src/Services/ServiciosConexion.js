import axios from 'axios';

const API_URL_SERVICIOS = 'http://localhost:3000/api/Servicios';

export const obtenerServicios = async () => {
    try {
        const response = await axios.get(API_URL_SERVICIOS);
        return response.data;
    } catch (error) {
        throw error;
    }
};
