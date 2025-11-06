import axios from 'axios';
// las citas, la "c" iba en mayuscula, pero para consultar el numero de referencia, supuestamente lo debo colocar en minuscula
const API_URL = 'http://localhost:3000/api/citas';

export const crearCita = async (datosCita) => {
    const response = await axios.post(API_URL, datosCita);
    return response.data;
};

export const obtenerHorariosDisponibles = async (datos) => {
    const response = await axios.post(`${API_URL}/disponibilidad`, datos);
    return response.data;
};
export const obtenerFechaNacimientoPorCelular = async (celular) => {
  try {
    const response = await axios.get(`${API_URL}/fecha-nacimiento/${celular}`);
    return response.data.fechaNacCliente; // puede ser string o null
  } catch (error) {
    console.error('Error de red o servidor:', error);
    return null; // cualquier error → null
  }
  
};
export const consultarCita = async (celular, numeroReferencia) => {
    const response = await axios.post(`${API_URL}/consultar`, {
        celular,
        numeroReferencia
    });
    return response.data;
};