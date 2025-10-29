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
                const datosEnvio = {
                    idProfesional,
                    idServicios: idServicio,
                    fechaCita: fecha,
                };
                console.log('Enviando datos para horarios:', datosEnvio);
                const horarios = await obtenerHorariosDisponibles(datosEnvio);
                console.log('Horarios disponibles cargados:', horarios);
                console.log('Tipo de datos recibidos:', typeof horarios);
                console.log('Es array?:', Array.isArray(horarios));
                
                // Verificar si los horarios vienen en un formato diferente
                const horariosArray = Array.isArray(horarios) ? horarios : (horarios?.horarios || []);
                console.log('Horarios procesados:', horariosArray);
                
                setHorariosDisponibles(horariosArray);
                setError(horariosArray.length === 0 ? 'No hay horarios disponibles para esta fecha' : null);
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