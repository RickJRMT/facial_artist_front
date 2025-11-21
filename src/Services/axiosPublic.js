import axios from 'axios';

// Instancia de axios para peticiones públicas (sin token)
const axiosPublic = axios.create({
    baseURL: 'http://localhost:3000',
});

// NO agregamos interceptores de autenticación
// Esta instancia es solo para endpoints públicos que no requieren token

export default axiosPublic;
