import { useState } from 'react';
import axios from 'axios';

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const login = async (correo, password) => {
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', {
                correo,
                password,
            });

            const { token, user } = response.data;

            // Guardamos token y usuario
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Configuramos axios para todas las futuras peticiones
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            return { success: true, user };
        } catch (err) {
            const mensaje = err.response?.data?.message || 'Error al iniciar sesión';
            setError(mensaje);
            return { success: false, message: mensaje };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        window.location.href = '/';
    };

    const isLoggedIn = () => {
        return !!localStorage.getItem('token');
    };

    const getUser = () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    };

    return { login, logout, loading, error, isLoggedIn, getUser };
};