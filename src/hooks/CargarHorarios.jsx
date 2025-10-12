import { useEffect, useState } from 'react';
import { obtenerHorariosDisponibles } from '../Services/citasClientesConexion';

export function useHorariosDisponibles(idProfesional, idServicio, fecha) {
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);

  useEffect(() => {
    async function cargarHorarios() {
      const datosCompletos =
        idProfesional && idServicio &&
        idProfesional !== '' &&
        idServicio !== '' &&
        fecha && fecha !== '' && fecha !== 'No seleccionada';

      if (!datosCompletos) {
        setHorariosDisponibles([]);
        return;
      }

      try {
        const horarios = await obtenerHorariosDisponibles({
          idProfesional,
          idServicios: idServicio,
          fechaCita: fecha,
        });
        setHorariosDisponibles(horarios);
      } catch (error) {
        console.error('Error al cargar horarios:', error);
        setHorariosDisponibles([]);
      }
    }

    cargarHorarios();
  }, [idProfesional, idServicio, fecha]);

  return { horariosDisponibles };
}
