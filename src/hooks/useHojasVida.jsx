import { useState, useEffect } from 'react';
import { obtenerHojasVidaCliente, eliminarHojaVida, actualizarHojaVida } from '../Services/hojasVidaConexion';

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

    const actualizarHoja = async (idHv, datosActualizados) => {
        try {
            // Preparar datos para la API - SOLO los campos editables
            const hojaVidaData = {
                hvDesc: datosActualizados.descripcion
            };

            // Agregar imágenes solo si fueron proporcionadas (ya convertidas a base64)
            if (datosActualizados.imagenAntes) {
                hojaVidaData.hvImagenAntes = datosActualizados.imagenAntes;
            }
            
            if (datosActualizados.imagenDespues) {
                hojaVidaData.hvImagenDespues = datosActualizados.imagenDespues;
            }

            console.log('Datos que se enviarán al backend:', {
                idHv,
                hvDesc: hojaVidaData.hvDesc,
                tieneImagenAntes: !!hojaVidaData.hvImagenAntes,
                tieneImagenDespues: !!hojaVidaData.hvImagenDespues
            });
            
            await actualizarHojaVida(idHv, hojaVidaData);
            
            // Actualizar la lista local
            await cargarHojasVida();
            
            return true;
        } catch (err) {
            setError('Error al actualizar la hoja de vida');
            console.error('Error completo:', err.response?.data || err);
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
        actualizarHoja,
        actualizarLista
    };
};