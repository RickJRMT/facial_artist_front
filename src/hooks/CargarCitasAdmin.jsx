import { useState, useEffect } from "react";
import { obtenerCitasAdmin } from "../Services/citasAdmin";

export function useCitasAdmin() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCitas = async () => {
    setLoading(true);
    try {
      // CAMBIO: Llama con true para activar JOIN en backend (trae fechaNacCliente)
      const data = await obtenerCitasAdmin(true);

      // NUEVO: Mapea para aplanar datos del JOIN (si backend devuelve anidado como {..., Cliente: {fechaNacCliente: '...'}}, únelo plano)
      const citasEnriquecidas = data.map(cita => ({
        ...cita,
        fechaNacCliente: cita.fechaNacCliente || cita.Cliente?.fechaNacCliente || null, // Fallback: plano o anidado
        celularCliente: cita.celularCliente || cita.Cliente?.celularCliente || null, // Opcional, para prefill teléfono
        // Limpia anidado si existe (opcional, para no inflar JSON)
        ...(cita.Cliente && { Cliente: undefined })
      }));

      setCitas(citasEnriquecidas);
      setError(null);
    } catch (err) {
      console.error('Error cargando citas:', err); // LOG para debug (borra en prod si quieres)
      setError(err.message || "Error desconocido");
      setCitas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitas();
  }, []);

  return { citas, loading, error, fetchCitas };
}