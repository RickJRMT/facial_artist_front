// Importamos el hook useState desde React para poder manejar el estado en este custom hook
import { useState } from 'react';

// Creamos un custom hook llamado useResumenCita. 
// Este hook puede ser reutilizado en cualquier componente que necesite manejar el resumen de una cita.
export const useResumenCita = () => {

    // Definimos un estado llamado "resumen" con la función "setResumen" para actualizarlo.
    // Este estado guarda los datos que el usuario selecciona en el formulario de citas.
    // Inicialmente, se establecen valores predeterminados que indican que aún no se ha seleccionado nada.
    const [resumen, setResumen] = useState({
        fecha: 'No seleccionada',
        hora: 'No seleccionada',
        servicio: 'Por seleccionar',
        profesional: 'Por seleccionar',
    });

    // Esta función se encarga de actualizar el estado "resumen" cuando el usuario cambia un campo del formulario.
    // Se obtiene el "name" y el "value" del input o select que disparó el evento.
    const actualizarResumen = (e) => {
        const { name, value } = e.target;

        // Usamos la función de actualización del estado con el valor anterior (...prev),
        // y reemplazamos únicamente el campo correspondiente.
        // Si el valor está vacío, se utiliza un valor por defecto.
        setResumen((prev) => ({
            ...prev,
            [name]: value || valorPorDefecto(name),
        }));
    };

    // Esta función devuelve un valor por defecto en caso de que el campo quede vacío.
    // Es útil para mantener un mensaje claro en el resumen.
    const valorPorDefecto = (campo) => {
        const valores = {
            fecha: 'No seleccionada',
            hora: 'No seleccionada',
            servicio: 'Por seleccionar',
            profesional: 'Por seleccionar',
        };
        return valores[campo] || ''; // Si no se encuentra el campo, se retorna una cadena vacía
    };

    // El hook devuelve un objeto con:
    // - el estado "resumen" para acceder a los valores actuales,
    // - y la función "actualizarResumen" para poder actualizar los datos desde el componente.
    return {
        resumen,
        actualizarResumen
    };
};
