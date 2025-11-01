import { useState, useEffect } from 'react';

import { obtenerServicios } from '../Services/ServiciosConexion';

export function UseServicios() {
    const [servicios, setServicios] = useState([]);

    useEffect(() => {
        async function cargarServicios() {
            try {
                const data = await obtenerServicios();
                setServicios(data);
            } catch (error) {
                console.error('Error al cargar servicios:', error);
            }
        }
        cargarServicios();
    }, []);

    return { servicios };
}