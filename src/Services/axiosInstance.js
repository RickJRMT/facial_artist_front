import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
});

// Agrega el token a TODAS las peticiones
axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Si da 401, desloguea automáticamente SOLO si hay un token presente
// Esto evita redirecciones en rutas públicas
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            const token = localStorage.getItem('token');
            // Solo redirige si había un token (usuario autenticado cuya sesión expiró)
            if (token) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/';
            }
            // Si no hay token, es una petición pública que falló, no redirigir
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;