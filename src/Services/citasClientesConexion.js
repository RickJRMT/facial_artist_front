import axios from 'axios';

const API_URL = 'http://localhost:3000/api/Citas';

export const crearCita = async (datosCita) => {
    const response = await axios.post(API_URL, datosCita);
    return response.data;
};

export const obtenerHorariosDisponibles = async (datos) => {
    const response = await axios.post(`${API_URL}/disponibilidad`, datos);
    return response.data;
};