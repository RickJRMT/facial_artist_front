import { useState, useEffect } from 'react';
import { obtenerClientes } from '../Services/clientesConexion';

/**
 * Hook personalizado para cargar y gestionar la lista de clientes
 * @returns {Object} Objeto con la lista de clientes, estado de carga y errores
 */
export function useClientes() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function cargarClientes() {
            setLoading(true);
            setError(null);
            try {
                const data = await obtenerClientes();
                setClientes(data);
            } catch (error) {
                console.error('Error al cargar clientes:', error);
                setError('Error al cargar los clientes');
            } finally {
                setLoading(false);
            }
        }
        cargarClientes();
    }, []);

    return { clientes, loading, error };
}
