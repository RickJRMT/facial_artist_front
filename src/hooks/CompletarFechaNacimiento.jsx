// hooks/CompletarFechaNacimiento.jsx
import { useEffect } from "react";
import { obtenerFechaNacimientoPorCelular } from "../Services/citasClientesConexion";

export const useAutoCompletarFechaNacimiento = (celularCliente, handleInputChange) => {
  useEffect(() => {
    const buscarFechaNacimiento = async () => {
      if (celularCliente && celularCliente.length === 10) {
        const fecha = await obtenerFechaNacimientoPorCelular(celularCliente);
        if (fecha) {
          handleInputChange({ target: { name: "fechaNacCliente", value: fecha } });
        }
      }
    };

    buscarFechaNacimiento();
  }, [celularCliente, handleInputChange]); 
};