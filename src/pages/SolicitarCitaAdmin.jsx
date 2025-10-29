import React, { useState } from "react";
import "./SolicitarCitaAdmin.css";
import { crearCita } from "../Services/citasClientesConexion";
import ModalErrorEdad from "../components/layout/ModalErrorEdad.jsx";
import ModalErrorEdadMenor from "../components/layout/ModalEdadMenor.jsx";
import ModalErrorCaracteres from "../components/layout/ModalNombreIncompleto.jsx";
import ModalErrorTelefono from "../components/layout/ModalTelefonoIncompleto.jsx";
import { useValidacionFormulario } from "../hooks/ValidarFormCitaCliente.jsx";
import { useProfesionales } from "../hooks/CargarProfesionales.jsx";
import { UseServicios } from "../hooks/CargarServicios.jsx";
import { useHorariosDisponibles } from "../hooks/CargarHorarios.jsx";

const SolicitarCitaCard = ({ onCitaCreada }) => {
    const { formData, handleInputChange, limpiarFormulario } =
        useValidacionFormulario();

    const [idProfesional, setIdProfesional] = useState("");
    const [idServicio, setIdServicio] = useState("");

    const { profesionales } = useProfesionales();
    const { servicios } = UseServicios();
    const { horariosDisponibles } = useHorariosDisponibles(
        idProfesional,
        idServicio,
        formData.fechaCita
    );
    const [mostrarModalEdad, setMostrarModalEdad] = useState(false);
    const [mostrarModalEdadMenor, setMostrarModalEdadMenor] = useState(false);
    const [mostrarModalNombreIncompleto, setMostrarModalNombreIncompleto] =
        useState(false);
    const [mostrarModalTelefonoIncompleto, setMostrarModalTelefonoIncompleto] =
        useState(false);
    const handleProfesionalChange = (e) => {
        const id = e.target.value;
        setIdProfesional(id);
    };
    const handleServicioChange = (e) => {
        const id = e.target.value;
        setIdServicio(id);
    };

    const calcularEdad = (fechaNacimiento) => {
        const hoy = new Date();
        const fechaNac = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const mes = hoy.getMonth() - fechaNac.getMonth();

        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }

        return edad;
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();

        if (
            !formData.fechaCita ||
            !formData.horaCita ||
            !idProfesional ||
            !idServicio
        ) {
            alert("Por favor, completa todos los campos de la cita");
            return;
        }

        if (formData.nombreCliente.trim().length < 3) {
            setMostrarModalNombreIncompleto(true);
            return;
        }

        if (formData.celularCliente.trim().length < 10) {
            setMostrarModalTelefonoIncompleto(true);
            return;
        }

        const edadCliente = calcularEdad(formData.fechaNacCliente);
        const fechaNacimiento = new Date(formData.fechaNacCliente);
        const hoy = new Date();

        if (fechaNacimiento > hoy) {
            alert("La fecha de nacimiento no puede ser en el futuro.");
            return;
        }

        const serviciosProhibidos = [
            "Micropigmentación de cejas",
            "Micropigmentación de pestañas",
        ];

        const servicioSeleccionado = servicios.find(
            (s) => s.idServicios === parseInt(idServicio)
        )?.servNombre;

        if (
            edadCliente < 18 &&
            serviciosProhibidos.includes(servicioSeleccionado)
        ) {
            setMostrarModalEdad(true);
            return;
        }

        if (edadCliente < 13) {
            setMostrarModalEdadMenor(true);
            return;
        }

        const datosCita = {
            nombreCliente: formData.nombreCliente,
            celularCliente: formData.celularCliente,
            fechaNacCliente: formData.fechaNacCliente,
            idProfesional: parseInt(idProfesional),
            idServicios: parseInt(idServicio),
            fechaCita: formData.fechaCita,
            horaCita: formData.horaCita,
            numeroReferencia: Math.floor(Date.now() / 1000),
        };

        try {
await crearCita(datosCita);

            // Preparar datos para el modal de éxito
            const datosParaModal = {
                nombreCliente: datosCita.nombreCliente,
                fecha: datosCita.fechaCita,
                hora: datosCita.horaCita,
                profesional: profesionales.find(p => p.idProfesional === datosCita.idProfesional)?.nombreProfesional || "No asignado",
                servicio: servicioSeleccionado || "No disponible",
                costo: servicios.find(s => s.idServicios === datosCita.idServicios)?.servCosto || "No disponible",
                numeroReferencia: datosCita.numeroReferencia,
            };

            // Limpiar formulario
            limpiarFormulario();
            setIdProfesional("");
            setIdServicio("");

            // Llamar al padre
            if (onCitaCreada) {
                onCitaCreada(datosParaModal);
            }
        } catch (error) {
            console.error("Error al enviar cita:", error);
            alert(error.message || "Error al solicitar cita");
        }
    };

    return (
        <>
            <div className="solicitar-cita-card">
                <h1 className="solicitar-cita-card__title">Solicitud de Citas</h1>
                <p className="solicitar-cita-card__subtitle">
                    Completa los campos para solicitar tu cita
                </p>
                <form className="solicitar-cita-card__form" onSubmit={manejarEnvio}>
                    <div className="solicitar-cita-card__column">
                        <label htmlFor="nombreCliente">Nombre Completo</label>
                        <input
                            type="text"
                            id="nombreCliente"
                            name="nombreCliente"
                            value={formData.nombreCliente}
                            onChange={handleInputChange}
                            placeholder="Ingresa tu nombre completo"
                            required
                        />

                        <label htmlFor="fechaNacCliente">Fecha de Nacimiento</label>
                        <input
                            type="date"
                            id="fechaNacCliente"
                            name="fechaNacCliente"
                            value={formData.fechaNacCliente}
                            onChange={handleInputChange}
                            max={new Date().toISOString().split("T")[0]}
                            required
                        />

                        <label htmlFor="celularCliente">Teléfono</label>
                        <input
                            type="text"
                            id="celularCliente"
                            name="celularCliente"
                            value={formData.celularCliente}
                            onChange={handleInputChange}
                            placeholder="3224567687"
                            required
                        />

                        <label htmlFor="servicio">Servicio</label>
                        <select
                            id="servicio"
                            name="servicio"
                            onChange={handleServicioChange}
                            value={idServicio}
                            required
                        >
                            <option value="" disabled>
                                Seleccione el tipo de servicio
                            </option>
                            {servicios.map((servicio) => (
                                <option
                                    key={servicio.idServicios}
                                    value={servicio.idServicios}
                                >
                                    {servicio.servNombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="solicitar-cita-card__column">
                        <label htmlFor="profesional">Profesional Preferido</label>
                        <select
                            id="profesional"
                            name="profesional"
                            onChange={handleProfesionalChange}
                            value={idProfesional}
                            required
                        >
                            <option value="" disabled>
                                Por seleccionar
                            </option>
                            {profesionales.map((prof) => (
                                <option key={prof.idProfesional} value={prof.idProfesional}>
                                    {prof.nombreProfesional}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="fechaCita">Fecha para la cita</label>
                        <input
                            type="date"
                            id="fechaCita"
                            name="fechaCita"
                            value={formData.fechaCita || ""}
                            onChange={handleInputChange}
                            min={new Date().toISOString().split("T")[0]}
                            required
                        />

                        <label htmlFor="horaCita">Hora para la cita</label>
                        <select
                            id="horaCita"
                            name="horaCita"
                            onChange={handleInputChange}
                            value={formData.horaCita || ""}
                            required
                        >
                            <option value="" disabled>
                                Seleccione la hora
                            </option>
                            {horariosDisponibles.map((horario) => (
                                <option key={horario.horaInicio24} value={horario.horaInicio24}>
                                    {horario.horaInicio} - {horario.horaFin}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" >Agendar Cita</button>
                </form>
            </div>

        {mostrarModalEdad && (
            <ModalErrorEdad onClose={() => setMostrarModalEdad(false)} />
        )}
        {mostrarModalEdadMenor && (
            <ModalErrorEdadMenor onClose={() => setMostrarModalEdadMenor(false)} />
        )}
        {mostrarModalNombreIncompleto && (
            <ModalErrorCaracteres onClose={() => setMostrarModalNombreIncompleto(false)} />
        )}
        {mostrarModalTelefonoIncompleto && (
            <ModalErrorTelefono onClose={() => setMostrarModalTelefonoIncompleto(false)} />
        )}
    </>
);
}; 
export default SolicitarCitaCard;
