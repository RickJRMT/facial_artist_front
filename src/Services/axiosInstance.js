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

// Si da 401, desloguea automáticamente
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;