// Servicio para obtener las hojas de vida de un cliente específico
import axiosInstance from './axiosInstance';

const API_URL_HOJAS_VIDA = 'http://localhost:3000/api/hv';

// Obtener todas las hojas de vida de un cliente específico con información completa
export const obtenerHojasVidaCliente = async (idCliente) => {
    try {
        const response = await axiosInstance.get(`${API_URL_HOJAS_VIDA}/completa/cliente/${idCliente}`);
        return response.data.success ? response.data.data : [];
    } catch (error) {
        console.error('Error al obtener hojas de vida del cliente:', error);
        throw error;
    }
};

// Obtener todas las hojas de vida con información completa
export const obtenerTodasHojasVida = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL_HOJAS_VIDA}/completa/todas`);
        return response.data.success ? response.data.data : [];
    } catch (error) {
        console.error('Error al obtener todas las hojas de vida:', error);
        throw error;
    }
};

// Obtener una hoja de vida específica con información completa
export const obtenerHojaVidaPorId = async (idHv) => {
    try {
        const response = await axiosInstance.get(`${API_URL_HOJAS_VIDA}/completa/hv/${idHv}`);
        return response.data.success ? response.data.data : null;
    } catch (error) {
        console.error('Error al obtener hoja de vida por ID:', error);
        throw error;
    }
};

export const crearHojaVida = async (hojaVidaData) => {
    try {
        const response = await axiosInstance.post(API_URL_HOJAS_VIDA, hojaVidaData);
        return response.data.success ? response.data.data : null;
    } catch (error) {
        console.error('Error al crear hoja de vida:', error);
        throw error;
    }
};

export const actualizarHojaVida = async (idHv, hojaVidaData) => {
    try {
        const response = await axiosInstance.put(`${API_URL_HOJAS_VIDA}/${idHv}`, hojaVidaData);
        return response.data.success ? response.data.data : null;
    } catch (error) {
        console.error('Error al actualizar hoja de vida:', error);
        throw error;
    }
};

export const eliminarHojaVida = async (idHv) => {
    try {
        const response = await axiosInstance.delete(`${API_URL_HOJAS_VIDA}/${idHv}`);
        return response.data.success ? response.data : null;
    } catch (error) {
        console.error('Error al eliminar hoja de vida:', error);
        throw error;
    }
};