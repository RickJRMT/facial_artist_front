// Importamos useState para manejar estado local dentro del hook
import { useState } from 'react';

// Definimos y exportamos un hook personalizado llamado useValidacionFormulario
export const useValidacionFormulario = () => {
    // Estado inicial que guarda los datos del formulario: nombre, celular y fecha de nacimiento
    // Se inicializa con campos vacíos
    const [formData, setFormData] = useState({
        nombreCliente: '',
        celularCliente: '',
        fechaNacCliente: '',
    });

    // Función que se ejecuta cada vez que un input del formulario cambia (evento onChange)
    // Recibe el evento y actualiza el estado formData con el valor nuevo
    const handleInputChange = (e) => {
        // Extraemos el nombre del campo y el valor que se ingresó
        const { name, value } = e.target;

        // Validación para el campo nombreCliente:
        // Solo permite letras (mayúsculas, minúsculas, tildes y espacios)
        if (name === 'nombreCliente') {
            const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/;
            if (!regex.test(value)) return;  // Si no cumple, no actualiza el estado
            if (value.length > 25) return;   // Limita la longitud máxima a 25 caracteres
        }

        // Validación para el campo celularCliente:
        // Solo permite números
        if (name === 'celularCliente') {
            const regex = /^[0-9]*$/;
            if (!regex.test(value)) return;  // Si no es número, no actualiza
            if (value.length > 11) return;   // Limita la longitud máxima a 11 dígitos
        }

        // Si pasa las validaciones, actualiza el estado formData
        // Usamos el callback para obtener el estado previo y actualizamos solo el campo que cambió
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Función para limpiar (resetear) el formulario, dejando todos los campos vacíos
    const limpiarFormulario = () => {
        setFormData({
            nombreCliente: '',
            celularCliente: '',
            fechaNacCliente: '',
        });
    };

    // Retornamos el estado actual, la función para actualizar datos y la función para limpiar formulario
    return {
        formData,
        handleInputChange,
        limpiarFormulario,
    };
};
