import { useState, useEffect } from "react"; 

import { obtenerCitasAdmin } from "../Services/citasAdmin";

export function useCitasAdmin() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCitas = async () => {
    setLoading(true);
    try {
      const data = await obtenerCitasAdmin();
      setCitas(data);
    } catch (err) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitas();
  }, []);

  return { citas, loading, error, fetchCitas };
}
