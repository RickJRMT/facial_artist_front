import axios from 'axios';

/**
 * URL base para las operaciones con clientes
 */
const API_URL_CLIENTES = 'http://localhost:3000/api/cliente';

/**
 * Obtiene la lista de todos los clientes
 * @returns {Promise<Array>} Array de clientes
 * @throws {Error} Si hay un error en la petición
 */
export const obtenerClientes = async () => {
    try {
        const response = await axios.get(API_URL_CLIENTES);
        return response.data;
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        throw error;
    }
};

/**
 * Obtiene un cliente por su ID
 * @param {number} id - ID del cliente a obtener
 * @returns {Promise<Object>} Datos del cliente
 * @throws {Error} Si hay un error en la petición o el cliente no existe
 */
export const obtenerClientePorId = async (id) => {
    try {
        const response = await axios.get(`${API_URL_CLIENTES}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener cliente con ID ${id}:`, error);
        throw error;
    }
};
