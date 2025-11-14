import React, { useState, useEffect } from "react";
import "./EditarCita.css";
import { useProfesionales } from "../../hooks/CargarProfesionales.jsx";
import { useHorariosDisponibles } from "../../hooks/CargarHorarios.jsx";
import { UseServicios } from "../../hooks/CargarServicios.jsx";

const EditarCita = ({ cita, onCitaEditada }) => {
    const { profesionales } = useProfesionales();
    const { servicios } = UseServicios(false);

    // Inicializar formData con datos de la cita
    const [formData, setFormData] = useState({
        idProfesional: cita.idProfesional ? cita.idProfesional.toString() : "", // Asegurar string para select
        fechaCita: cita.fechaCita ? new Date(cita.fechaCita).toISOString().split('T')[0] : "",
        horaCita: cita.horaCita || "",
        estadoCita: cita.estadoCita || "pendiente",
        estadoPago: cita.estadoPago || "pendiente"
    });

    const [idServicio, setIdServicio] = useState(cita.idServicios ? cita.idServicios.toString() : "");

    // Cargar horarios disponibles basados en selección actual
    const { horariosDisponibles } = useHorariosDisponibles(
        parseInt(formData.idProfesional) || 0,
        parseInt(idServicio) || 0,
        formData.fechaCita
    );

    // Obtener nombre del servicio para visualización
    const servicioSeleccionado = servicios.find(s => s.id === parseInt(idServicio))?.nombre || cita.servNombre;

    // Efecto para asegurar que idServicio se setee correctamente al montar
    useEffect(() => {
        if (cita.idServicios) {
            setIdServicio(cita.idServicios.toString());
        }
    }, [cita.idServicios]);

    // Efecto para recargar horarios cuando cambie profesional, servicio o fecha
    useEffect(() => {
        // No hacer nada si es la carga inicial, ya que horaCita original se mantiene
    }, [formData.idProfesional, idServicio, formData.fechaCita]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.fechaCita || !formData.horaCita || !formData.idProfesional) {
            alert("Completa los campos requeridos");
            return;
        }
        const datosActualizados = {
            idProfesional: parseInt(formData.idProfesional),
            fechaCita: formData.fechaCita,
            horaCita: formData.horaCita,
            estadoCita: formData.estadoCita,
            estadoPago: formData.estadoPago
        };
        onCitaEditada(datosActualizados);
    };

    // Preparar opciones de hora: disponibles + original si no está incluida
    const originalHora = formData.horaCita;
    const horariosUnicos = [...new Set(horariosDisponibles.map(h => h.horaInicio24))];
    const todasLasHoras = originalHora && !horariosUnicos.includes(originalHora)
        ? [...horariosUnicos, originalHora]
        : horariosUnicos;

    // Mapear para mostrar: si es original y no disponible, solo mostrar la hora; sino, el rango
    const opcionesHora = todasLasHoras.map(hora => {
        const horario = horariosDisponibles.find(h => h.horaInicio24 === hora);
        return horario ?
            { value: horario.horaInicio24, label: `${horario.horaInicio} - ${horario.horaFin}` }
            : { value: hora, label: hora };
    });

    const estadosCita = ["pendiente", "confirmada", "iniciada", "finalizada", "cancelada"];
    const estadosPago = ["pendiente", "pagado"];

    // Encontrar nombre del profesional actual para confirmación (opcional, pero para debug)
    const profesionalActual = profesionales.find(p => p.idProfesional === parseInt(formData.idProfesional));

    return (
        <div className="editar-cita-container">
            <h2>Editar Cita</h2>
            <div className="datos-visuales">
                <p><strong>Cliente:</strong> {cita.nombreCliente}</p>
                <p><strong>Servicio:</strong> {servicioSeleccionado}</p>
                {/* Debug temporal: remover en prod */}
                {profesionalActual && <p><strong>Profesional cargado:</strong> {profesionalActual.nombreProfesional}</p>}
            </div>
            <form onSubmit={handleSubmit} className="editar-cita-form">
                <label>Profesional</label>
                <select
                    name="idProfesional"
                    value={formData.idProfesional}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Selecciona profesional</option>
                    {profesionales.map((prof) => (
                        <option
                            key={prof.idProfesional}
                            value={prof.idProfesional.toString()}
                        >
                            {prof.nombreProfesional}
                        </option>
                    ))}
                </select>

                <label>Fecha</label>
                <input
                    type="date"
                    name="fechaCita"
                    value={formData.fechaCita}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                />

                <label>Hora</label>
                <select
                    name="horaCita"
                    value={formData.horaCita}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Selecciona hora</option>
                    {opcionesHora.map((opcion) => (
                        <option key={opcion.value} value={opcion.value}>
                            {opcion.label}
                        </option>
                    ))}
                </select>
                {/* Si no hay horarios, mostrar nota */}
                {(!formData.idProfesional || !idServicio || !formData.fechaCita || horariosDisponibles.length === 0) && formData.horaCita && (
                    <p className="nota-hora">Hora original mantenida: {formData.horaCita}</p>
                )}

                <label>Estado de Cita</label>
                <select name="estadoCita" value={formData.estadoCita} onChange={handleInputChange} required>
                    {estadosCita.map((estado) => (
                        <option key={estado} value={estado}>{estado.charAt(0).toUpperCase() + estado.slice(1)}</option>
                    ))}
                </select>

                <label>Estado de Pago</label>
                <select name="estadoPago" value={formData.estadoPago} onChange={handleInputChange} required>
                    {estadosPago.map((estado) => (
                        <option key={estado} value={estado}>{estado.charAt(0).toUpperCase() + estado.slice(1)}</option>
                    ))}
                </select>

                <button type="submit" className="btn-guardar">Guardar Cambios</button>
            </form>
        </div>
    );
};

export default EditarCita;