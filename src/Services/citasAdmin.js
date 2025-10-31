// esta conexión permite que, desde el modulo de admin, en el apartado de "citas" traiga todo el listado de citas
import axios from 'axios';

const API_URL_ADMIN_CITAS = 'http://localhost:3000/api/adminCitas';

export const obtenerCitasAdmin = async () => {
    try {
        const response = await axios.get(API_URL_ADMIN_CITAS);
        return response.data;
    } catch (error) {
        throw error;
    }
};
