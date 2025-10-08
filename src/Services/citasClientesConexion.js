import axios from 'axios';

const API_URL = 'http://localhost:3000/api/Citas';

export const crearCita = async (datosCita) => {
    try {
        const response = await axios.post(API_URL, datosCita);
        return response.data;
    } catch (error) {
        throw error;
    }
};
