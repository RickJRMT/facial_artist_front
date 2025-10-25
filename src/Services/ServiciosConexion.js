import axios from 'axios';

/**
 * URL base para las operaciones con servicios
 */
const API_URL_SERVICIOS = 'http://localhost:3000/api/servicios';

/**
 * Obtiene la lista de todos los servicios disponibles
 * @returns {Promise<Array>} Array de servicios transformados para el frontend
 * @throws {Error} Si hay un error en la petición
 */
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
                imagen: s.servImagen,
                servDuracion: s.servDuracion
            }))
            : [];
        return servicios;
    } catch (error) {
        console.error('Error al obtener servicios:', error);
        throw error;
    }
};

/**
 * Crea un nuevo servicio en el sistema
 * @param {Object} servicioData - Datos del servicio a crear
 * @param {string} servicioData.servNombre - Nombre del servicio
 * @param {string} servicioData.servDescripcion - Descripción del servicio
 * @param {number} servicioData.servCosto - Costo del servicio
 * @param {number} servicioData.servDuracion - Duración en minutos
 * @param {string} [servicioData.servImagen] - Imagen en base64 (opcional)
 * @returns {Promise<Object>} Datos del servicio creado
 * @throws {Error} Si hay un error en la creación
 */
export const crearServicio = async (servicioData) => {
    try {
        const response = await axios.post(API_URL_SERVICIOS, servicioData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear servicio:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Actualiza un servicio existente
 * @param {number} id - ID del servicio a actualizar
 * @param {Object} servicioData - Datos actualizados del servicio
 * @returns {Promise<Object>} Datos del servicio actualizado
 * @throws {Error} Si hay un error en la actualización
 */
export const actualizarServicio = async (id, servicioData) => {
    try {
        const response = await axios.put(`${API_URL_SERVICIOS}/${id}`, servicioData);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar servicio:', error);
        throw error;
    }
};

/**
 * Elimina un servicio del sistema
 * @param {number} id - ID del servicio a eliminar
 * @returns {Promise<Object>} Resultado de la eliminación
 * @throws {Error} Si hay un error en la eliminación
 */
export const eliminarServicio = async (id) => {
    try {
        const response = await axios.delete(`${API_URL_SERVICIOS}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar servicio:', error);
        throw error;
    }
};
