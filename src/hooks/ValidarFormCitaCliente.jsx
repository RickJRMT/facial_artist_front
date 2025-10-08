import { useState } from 'react';

export const useValidacionFormulario = () => {
    const [formData, setFormData] = useState({
        nombreCliente: '',
        celularCliente: '',
        fechaNacCliente: '',
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'nombreCliente') {
            const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/;
            if (!regex.test(value)) return;
        }
        if (name === 'celularCliente') {
            const regex = /^[0-9]*$/;
            if (!regex.test(value)) return;
        }
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const limpiarFormulario = () => {
        setFormData({
            nombreCliente: '',
            celularCliente: '',
            fechaNacCliente: '',
        });
    };

    return {
        formData,
        handleInputChange,
        limpiarFormulario,
    };
};
