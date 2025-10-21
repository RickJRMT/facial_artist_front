import { useEffect, useState } from 'react';
import { obtenerHorariosDisponibles } from '../Services/citasClientesConexion';

export function useHorariosDisponibles(idProfesional, idServicio, fecha) {
    const [horariosDisponibles, setHorariosDisponibles] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function cargarHorarios() {
            const datosCompletos =
                idProfesional &&
                idServicio &&
                idProfesional !== '' &&
                idServicio !== '' &&
                fecha &&
                fecha !== '' &&
                fecha !== 'No seleccionada';

            if (!datosCompletos) {
                setHorariosDisponibles([]);
                setError(null);
                return;
            }

            try {
                const horarios = await obtenerHorariosDisponibles({
                    idProfesional,
                    idServicios: idServicio,
                    fechaCita: fecha,
                });
                setHorariosDisponibles(horarios);
                setError(horarios.length === 0 ? 'No hay horarios disponibles para esta fecha' : null);
            } catch (error) {
                console.error('Error al cargar horarios:', error);
                setHorariosDisponibles([]);
                setError(error.message || 'Error al cargar horarios');
            }
        }

        cargarHorarios();
    }, [idProfesional, idServicio, fecha]);

    return { horariosDisponibles, error };
}