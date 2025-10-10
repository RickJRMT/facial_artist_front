import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Ajusta según tu backend

export const getCitas = async () => {
  const response = await axios.get(`${API_URL}/citas`);
  return response.data;
};

export const getProfesionales = async () => {
  const response = await axios.get(`${API_URL}/profesional`);
  return response.data;
};

export const getServicios = async () => {
  const response = await axios.get(`${API_URL}/servicios`);
  return response.data;
};

// export const getHorarios = async () => {
//   const response = await axios.get(`${API_URL}/horarios`);
//   return response.data;
// };

export const crearCita = async (cita) => {
  const response = await axios.post(`${API_URL}/citas`, cita);
  return response.data;
};