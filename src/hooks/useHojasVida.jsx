import { useState, useEffect } from 'react';
import { obtenerHojasVidaCliente, eliminarHojaVida } from '../Services/hojasVidaConexion';

export const useHojasVida = (idCliente) => {
    const [hojasVida, setHojasVida] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const cargarHojasVida = async () => {
        if (!idCliente) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const data = await obtenerHojasVidaCliente(idCliente);
            setHojasVida(data);
        } catch (err) {
            setError('Error al cargar las hojas de vida');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const eliminarHoja = async (idHv) => {
        try {
            await eliminarHojaVida(idHv);
            setHojasVida(prev => prev.filter(hoja => hoja.idHv !== idHv));
            return true;
        } catch (err) {
            setError('Error al eliminar la hoja de vida');
            console.error('Error:', err);
            return false;
        }
    };

    const actualizarLista = () => {
        cargarHojasVida();
    };

    useEffect(() => {
        if (idCliente) {
            cargarHojasVida();
        }
    }, [idCliente]);

    return {
        hojasVida,
        loading,
        error,
        cargarHojasVida,
        eliminarHoja,
        actualizarLista
    };
};