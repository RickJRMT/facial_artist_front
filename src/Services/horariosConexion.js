// horariosConexion.js → VERSIÓN CORRECTA
import axiosInstance from './axiosInstance';

const API_BASE = 'http://localhost:3000/api';

export const getAllHorarios = async () => {
    const response = await axiosInstance.get(`${API_BASE}/horarios/all`);
    return response.data.eventosParaCalendario || [];
};

export const getHorariosByDate = async (fecha) => {
    const response = await axiosInstance.get(`${API_BASE}/horarios/date/${fecha}`);
    return response.data;
};

export const getHorariosByProfesional = async (idProfesional) => {
    const response = await axiosInstance.get(`${API_BASE}/horarios/profesional/${idProfesional}`);
    return response.data.eventosParaCalendario || [];
};

export const createHorario = async (data) => {
    const formatearHora = (hora) => {
        if (!hora) return null;
        return hora.split(':').length === 3 ? hora : `${hora}:00`;
    };

    const horarioFormateado = {
        ...data,
        hora_inicio: formatearHora(data.hora_inicio),
        hora_fin: formatearHora(data.hora_fin)
    };

    const response = await axiosInstance.post(`${API_BASE}/horarios`, horarioFormateado);
    return response.data;
};

export const updateHorario = async (id, data) => {
    const formatearHora = (hora) => {
        if (!hora) return null;
        return hora.split(':').length === 3 ? hora : `${hora}:00`;
    };

    const horarioFormateado = {
        ...data,
        hora_inicio: formatearHora(data.hora_inicio),
        hora_fin: formatearHora(data.hora_fin)
    };

    const response = await axiosInstance.put(`${API_BASE}/horarios/${id}`, horarioFormateado);
    return response.data;
};