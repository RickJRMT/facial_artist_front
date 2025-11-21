// Importamos los hooks de React que nos permiten usar estado y efectos secundarios.
import { useState, useEffect } from 'react';

// Importamos la función que hace la llamada al backend para obtener los profesionales.
import { obtenerProfesionales } from '../Services/profesionalesConexion';

// Definimos un custom hook llamado useProfesionales.
// Los custom hooks son funciones que nos permiten encapsular lógica reutilizable relacionada con React (como manejo de estado o efectos).
export function useProfesionales() {
  
  // Creamos un estado local para almacenar la lista de profesionales.
  // Inicialmente está vacío.
  const [profesionales, setProfesionales] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect se ejecuta cuando el componente que usa este hook se monta (solo una vez por el array de dependencias vacío []).
  useEffect(() => {
    
    // Definimos una función asíncrona interna para obtener los profesionales desde el backend.
    async function cargarProfesionales() {
      try {
        // Llamamos a la función que consulta la API o base de datos y trae los profesionales.
        const data = await obtenerProfesionales();

        // Guardamos la lista de profesionales en el estado local.
        setProfesionales(data);

      } catch (error) {
        // Si ocurre un error al obtener los datos, lo mostramos en consola.
        console.error('Error al cargar profesionales:', error);
        // Mantener profesionales vacío para evitar crashes
        setProfesionales([]);
      } finally {
        setLoading(false);
      }
    }

    // Llamamos la función que carga los profesionales.
    cargarProfesionales();
  }, []); // El array vacío asegura que esto se ejecute solo una vez cuando se monta el componente.

  // Retornamos el estado `profesionales` para que quien use este hook pueda acceder a la lista.
  return { profesionales, loading };
}
