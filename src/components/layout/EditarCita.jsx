import React, { useState, useEffect } from "react";
import "./EditarCita.css";
import { useProfesionales } from "../../hooks/CargarProfesionales.jsx";
import { useHorariosDisponibles } from "../../hooks/CargarHorarios.jsx";
import { UseServicios } from "../../hooks/CargarServicios.jsx";

const EditarCita = ({ cita, onCitaEditada }) => {
    const { profesionales } = useProfesionales();
    const { servicios } = UseServicios(false);

    const [formData, setFormData] = useState({
        idProfesional: cita.idProfesional ? cita.idProfesional.toString() : "",
        fechaCita: cita.fechaCita ? new Date(cita.fechaCita).toISOString().split('T')[0] : "",
        horaCita: cita.horaCita || "",
        estadoCita: cita.estadoCita || "pendiente",
        estadoPago: cita.estadoPago || "pendiente"
    });

    const [idServicio, setIdServicio] = useState(cita.idServicios ? cita.idServicios.toString() : "");

    const { horariosDisponibles } = useHorariosDisponibles(
        parseInt(formData.idProfesional) || 0,
        parseInt(idServicio) || 0,
        formData.fechaCita
    );

    const servicioSeleccionado = servicios.find(s => s.id === parseInt(idServicio))?.nombre || cita.servNombre;

    useEffect(() => {
        if (cita.idServicios) {
            setIdServicio(cita.idServicios.toString());
        }
    }, [cita.idServicios]);

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

    // Preparar opciones de hora similar a SolicitarCitaAdmin
    const originalHora = cita.horaCita; // Hora original de la cita
    const hasHorarios = horariosDisponibles && horariosDisponibles.length > 0;
    const isFieldsComplete = !!formData.idProfesional && !!idServicio && !!formData.fechaCita;

    // Crear mapa de horarios para evitar duplicados y agregar original si no está
    const horariosMap = new Map();
    if (hasHorarios) {
        horariosDisponibles.forEach((horario) => {
            if (horario.horaInicio24) {
                horariosMap.set(horario.horaInicio24, `${horario.horaInicio} - ${horario.horaFin}`);
            }
        });
    }

    // Agregar hora original si no está en los disponibles o si no hay disponibles
    if (originalHora && !horariosMap.has(originalHora)) {
        horariosMap.set(originalHora, `${originalHora} (hora original)`);
    }

    const opcionesHora = Array.from(horariosMap, ([value, label]) => ({ value, label }));

    // Mensaje para la opción placeholder
    let placeholderMessage = "Seleccione la hora";
    if (!isFieldsComplete) {
        placeholderMessage = "Complete los campos anteriores primero";
    } else if (!hasHorarios && originalHora) {
        placeholderMessage = "No hay horarios disponibles, hora original mantenida";
    } else if (!hasHorarios) {
        placeholderMessage = "No hay horarios disponibles";
    }

    const estadosCita = ["pendiente", "confirmada", "iniciada", "finalizada", "cancelada"];
    const estadosPago = ["pendiente", "pagado"];

    return (
        <div className="editar-cita-container">
            <h2>Editar Cita</h2>
            <div className="datos-visuales">
                <p><strong>Cliente:</strong> {cita.nombreCliente}</p>
                <p><strong>Servicio:</strong> {servicioSeleccionado}</p>
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
                    disabled={!isFieldsComplete || (!hasHorarios && !originalHora)}
                >
                    <option value="" disabled>
                        {placeholderMessage}
                    </option>
                    {opcionesHora.map((opcion) => (
                        <option key={opcion.value} value={opcion.value}>
                            {opcion.label}
                        </option>
                    ))}
                </select>

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