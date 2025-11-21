// esta conexión permite que, desde el modulo de admin, en el apartado de "citas" traiga todo el listado de citas
import axiosInstance from './axiosInstance.js';

const API_URL_ADMIN_CITAS = 'http://localhost:3000/api/adminCitas'; // Ajusta URL si es diferente

export const obtenerCitasAdmin = async (includeCliente = false) => {
    try {
        // NUEVO: Construye params para query string (solo si includeCliente=true)
        const params = new URLSearchParams();
        if (includeCliente) {
            params.append('includeCliente', 'true'); // Activa JOIN en backend para fechaNacCliente
        }

        // CAMBIO: GET con params en URL (ej. /api/adminCitas?includeCliente=true)
        const response = await axiosInstance.get(`${API_URL_ADMIN_CITAS}?${params.toString()}`);

        // Opcional: Mapea respuesta para aplanar si backend devuelve anidado (ej. {..., Cliente: {fechaNacCliente: '...'}})
        const citasEnriquecidas = response.data.map(cita => ({
            ...cita,
            fechaNacCliente: cita.fechaNacCliente || cita.Cliente?.fechaNacCliente || null, // Fallback plano/anidado
            celularCliente: cita.celularCliente || cita.Cliente?.celularCliente || null, // Opcional
            // Limpia anidado para JSON ligero
            ...(cita.Cliente && { Cliente: undefined })
        }));

        return citasEnriquecidas; // Devuelve array con fechaNacCliente listo para prefill
    } catch (error) {
        console.error('Error en obtenerCitasAdmin:', error); // LOG para debug (borra en prod)
        throw new Error(error.response?.data?.error || error.message || 'Error al cargar citas admin');
    }
};