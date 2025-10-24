import axios from 'axios';

const API_URL_SERVICIOS = 'http://localhost:3000/api/servicios';

export const obtenerServicios = async () => {
    try {
        const response = await axios.get(API_URL_SERVICIOS);
        // Transformar los datos para que el frontend use los nombres esperados
        const servicios = Array.isArray(response.data)
            ? response.data.map(s => ({
                id: s.idServicios,
                nombre: s.servNombre,
                descripcion: s.servDescripcion,
                costo: s.servCosto,
                imagen: s.servImagen
            }))
            : [];
        return servicios;
    } catch (error) {
        throw error;
    }
};

// Crear un nuevo servicio
export const crearServicio = async (servicioData) => {
    try {
        const response = await axios.post(API_URL_SERVICIOS, servicioData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Actualizar un servicio existente
export const actualizarServicio = async (id, servicioData) => {
    try {
        const response = await axios.put(`${API_URL_SERVICIOS}/${id}`, servicioData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Eliminar un servicio
export const eliminarServicio = async (id) => {
    try {
        const response = await axios.delete(`${API_URL_SERVICIOS}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
