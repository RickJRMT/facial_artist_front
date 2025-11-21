import axios from 'axios';
// Nota: Este archivo usa axios directamente sin autenticación
// Si el backend requiere autenticación, estos endpoints deben ser públicos

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