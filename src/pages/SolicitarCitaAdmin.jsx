import React, { useState, useEffect } from "react";
import "./SolicitarCitaAdmin.css";
import { crearCita, actualizarCita } from "../Services/citasClientesConexion";
import ModalErrorEdad from "../components/layout/ModalErrorEdad.jsx";
import ModalErrorEdadMenor from "../components/layout/ModalEdadMenor.jsx";
import ModalErrorCaracteres from "../components/layout/ModalNombreIncompleto.jsx";
import ModalErrorTelefono from "../components/layout/ModalTelefonoIncompleto.jsx";
import { useValidacionFormulario } from "../hooks/ValidarFormCitaCliente.jsx";
import { useProfesionales } from "../hooks/CargarProfesionales.jsx";
import { UseServicios } from "../hooks/CargarServicios.jsx";
import { useHorariosDisponibles } from "../hooks/CargarHorarios.jsx";
import { useAutoCompletarFechaNacimiento } from "../hooks/CompletarFechaNacimiento.jsx";

const SolicitarCitaAdmin = ({ initialData = null, esAdmin = false, onCitaCreada, onSuccess, onClose }) => {
    const { formData, handleInputChange, limpiarFormulario } = useValidacionFormulario();
    useAutoCompletarFechaNacimiento(formData.celularCliente, handleInputChange);
    const [idProfesional, setIdProfesional] = useState("");
    const [idServicio, setIdServicio] = useState("");
    const [estadoCita, setEstadoCita] = useState("Pendiente");
    const [estadoPago, setEstadoPago] = useState("Pendiente");
    const [loading, setLoading] = useState(false);
    const [esEdicion] = useState(!!initialData);
    const [horariosListos, setHorariosListos] = useState(false); // Para trigger de regeneración de slots

    const { profesionales } = useProfesionales();
    const { servicios } = UseServicios(false);
    const { horariosDisponibles } = useHorariosDisponibles(idProfesional, idServicio, formData.fechaCita);

    // Estados modales
    const [mostrarModalEdad, setMostrarModalEdad] = useState(false);
    const [mostrarModalEdadMenor, setMostrarModalEdadMenor] = useState(false);
    const [mostrarModalNombreIncompleto, setMostrarModalNombreIncompleto] = useState(false);
    const [mostrarModalTelefonoIncompleto, setMostrarModalTelefonoIncompleto] = useState(false);

    // useEffect para prefilar (sin logs, con prefill de fechaNacCliente)
    useEffect(() => {
        if (esEdicion && initialData) {
            setLoading(true);

            const formatearFecha = (fechaISO) => {
                if (!fechaISO) return '';
                try {
                    return new Date(fechaISO).toISOString().split('T')[0];
                } catch (err) {
                    console.warn('Error formateando fecha:', fechaISO, err);
                    return '';
                }
            };

            // Prefill campos (incluye fechaNacCliente formateada)
            handleInputChange({ target: { name: 'nombreCliente', value: initialData.nombreCliente || '' } });
            handleInputChange({ target: { name: 'celularCliente', value: initialData.celularCliente || '' } });
            handleInputChange({ target: { name: 'fechaNacCliente', value: formatearFecha(initialData.fechaNacCliente) } }); // Prefill de fecha de nacimiento
            handleInputChange({ target: { name: 'fechaCita', value: formatearFecha(initialData.fechaCita) } });
            handleInputChange({ target: { name: 'horaCita', value: initialData.horaCita || '' } });

            if (initialData.numeroReferencia) {
                handleInputChange({ target: { name: 'numeroReferencia', value: initialData.numeroReferencia.toString() } });
            }

            // Mapeo IDs por nombre
            const profSeleccionado = profesionales.find(p => p.nombreProfesional === initialData.nombreProfesional);
            setIdProfesional(profSeleccionado?.idProfesional?.toString() || '');

            const servSeleccionado = servicios.find(s => s.nombre === initialData.servNombre);
            setIdServicio(servSeleccionado?.id?.toString() || '');

            setEstadoCita(initialData.estadoCita || 'Pendiente');
            setEstadoPago(initialData.estadoPago || 'Pendiente');

            // Trigger para horarios
            setTimeout(() => setHorariosListos(true), 100);

            setLoading(false);
        }
    }, [initialData, esEdicion, profesionales, servicios, handleInputChange]);

    // useEffect para ajustar hora si no matches slots
    useEffect(() => {
        if (esEdicion && horariosListos && idProfesional && idServicio && formData.fechaCita && formData.horaCita) {
            const slotMatching = horariosDisponibles.find(h => h.horaInicio24 === formData.horaCita);
            if (!slotMatching) {
                const primerSlot = horariosDisponibles[0]?.horaInicio24;
                if (primerSlot) {
                    handleInputChange({ target: { name: 'horaCita', value: primerSlot } });
                }
            }
        }
    }, [horariosListos, idProfesional, idServicio, formData.fechaCita, horariosDisponibles, handleInputChange]);

    const handleProfesionalChange = (e) => {
        const id = e.target.value;
        setIdProfesional(id);
        if (esEdicion) handleInputChange({ target: { name: 'horaCita', value: '' } });
    };

    const handleServicioChange = (e) => {
        const id = e.target.value;
        setIdServicio(id);
        if (esEdicion) handleInputChange({ target: { name: 'horaCita', value: '' } });
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
        setLoading(true);

        if (!formData.fechaCita || !formData.horaCita || !idProfesional || !idServicio) {
            alert("Por favor, completa todos los campos de la cita");
            setLoading(false);
            return;
        }

        if (!esAdmin && !esEdicion) {
            if (formData.nombreCliente.trim().length < 3) {
                setMostrarModalNombreIncompleto(true);
                setLoading(false);
                return;
            }
            if (formData.celularCliente.trim().length < 10) {
                setMostrarModalTelefonoIncompleto(true);
                setLoading(false);
                return;
            }
            const edadCliente = calcularEdad(formData.fechaNacCliente);
            const fechaNacimiento = new Date(formData.fechaNacCliente);
            const hoy = new Date();
            if (fechaNacimiento > hoy) {
                alert("La fecha de nacimiento no puede ser en el futuro.");
                setLoading(false);
                return;
            }
            const serviciosProhibidos = ["Micropigmentación de cejas", "Micropigmentación de pestañas"];
            const servicioSeleccionado = servicios.find(s => s.id === parseInt(idServicio))?.nombre;
            if (edadCliente < 18 && serviciosProhibidos.includes(servicioSeleccionado)) {
                setMostrarModalEdad(true);
                setLoading(false);
                return;
            }
            if (edadCliente < 13) {
                setMostrarModalEdadMenor(true);
                setLoading(false);
                return;
            }
        }

        const datosCita = {
            nombreCliente: formData.nombreCliente,
            celularCliente: formData.celularCliente,
            fechaNacCliente: formData.fechaNacCliente,
            idProfesional: parseInt(idProfesional),
            idServicios: parseInt(idServicio),
            fechaCita: formData.fechaCita,
            horaCita: formData.horaCita,
            numeroReferencia: esEdicion ? (initialData.numeroReferencia || Math.floor(Date.now() / 1000)) : Math.floor(Date.now() / 1000),
            estadoCita,
            estadoPago,
        };

        try {
            let resultado;
            const servicioSeleccionado = servicios.find(s => s.id === parseInt(idServicio))?.nombre;
            if (esEdicion) {
                resultado = await actualizarCita(initialData.idCita, datosCita);
                const datosParaModal = {
                    nombreCliente: datosCita.nombreCliente,
                    fecha: datosCita.fechaCita,
                    hora: datosCita.horaCita,
                    profesional: profesionales.find(p => p.idProfesional === datosCita.idProfesional)?.nombreProfesional || "No asignado",
                    servicio: servicioSeleccionado || "No disponible",
                    costo: servicios.find(s => s.id === datosCita.idServicios)?.servCosto || "No disponible",
                    numeroReferencia: datosCita.numeroReferencia,
                    estadoCita: datosCita.estadoCita,
                    estadoPago: datosCita.estadoPago,
                };
                if (onSuccess) onSuccess(datosParaModal);
            } else {
                resultado = await crearCita(datosCita);
                const datosParaModal = {
                    nombreCliente: datosCita.nombreCliente,
                    fecha: datosCita.fechaCita,
                    hora: datosCita.horaCita,
                    profesional: profesionales.find(p => p.idProfesional === datosCita.idProfesional)?.nombreProfesional || "No asignado",
                    servicio: servicioSeleccionado || "No disponible",
                    costo: servicios.find(s => s.id === datosCita.idServicios)?.servCosto || "No disponible",
                    numeroReferencia: datosCita.numeroReferencia,
                };
                if (onCitaCreada) onCitaCreada(datosParaModal);
            }

            if (!esEdicion) {
                limpiarFormulario();
                setIdProfesional("");
                setIdServicio("");
                setEstadoCita("Pendiente");
                setEstadoPago("Pendiente");
            }

            alert(esEdicion ? 'Cita actualizada exitosamente' : 'Cita solicitada exitosamente');
            onClose?.();
        } catch (error) {
            console.error(esEdicion ? "Error al actualizar cita:" : "Error al enviar cita:", error);
            alert(error.message || (esEdicion ? "Error al actualizar cita" : "Error al solicitar cita"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="solicitar-cita-card">
                <h1 className="solicitar-cita-card__title">
                    {esEdicion ? 'Editar Cita' : 'Solicitud de Citas'}
                </h1>
                <p className="solicitar-cita-card__subtitle">
                    {esEdicion ? 'Modifica los campos de la cita' : 'Completa los campos para solicitar tu cita'}
                </p>
                {loading && esEdicion && <p>Cargando datos de la cita...</p>}
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
                            disabled={esEdicion && esAdmin}
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
                            disabled={esEdicion && esAdmin}
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
                            disabled={esEdicion && esAdmin}
                        />
                        <label htmlFor="servicio">Servicio</label>
                        <select
                            id="servicio"
                            onChange={handleServicioChange}
                            value={idServicio}
                            required
                            disabled={esEdicion}
                        >
                            <option value="" disabled>
                                Seleccione el tipo de servicio
                            </option>
                            {servicios && servicios.length > 0 && servicios.map((servicio) => (
                                servicio && servicio.id && (
                                    <option key={servicio.id} value={servicio.id}>
                                        {servicio.nombre}
                                    </option>
                                )
                            ))}
                        </select>
                    </div>

                    <div className="solicitar-cita-card__column">
                        <label htmlFor="profesional">Profesional Preferido</label>
                        <select
                            id="profesional"
                            onChange={handleProfesionalChange}
                            value={idProfesional}
                            required
                        >
                            <option value="" disabled>
                                Por seleccionar
                            </option>
                            {profesionales && profesionales.length > 0 && profesionales.map((prof) => (
                                prof && prof.idProfesional && (
                                    <option key={prof.idProfesional} value={prof.idProfesional}>
                                        {prof.nombreProfesional}
                                    </option>
                                )
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
                            disabled={(!idProfesional || !idServicio || !formData.fechaCita) || (horariosDisponibles.length === 0 && !esEdicion)}
                        >
                            <option value="" disabled>
                                {!idProfesional || !idServicio || !formData.fechaCita
                                    ? "Complete los campos anteriores primero"
                                    : (horariosDisponibles.length === 0 ? "No hay horarios disponibles" : "Seleccione la hora")}
                            </option>
                            {horariosDisponibles && horariosDisponibles.length > 0 && horariosDisponibles.map((horario, index) => (
                                horario && horario.horaInicio24 && (
                                    <option key={`${horario.horaInicio24}-${index}`} value={horario.horaInicio24}>
                                        {horario.horaInicio} - {horario.horaFin}
                                    </option>
                                )
                            ))}
                        </select>
                        {(!idProfesional || !idServicio || !formData.fechaCita) && esEdicion && <p style={{ color: 'orange' }}>Selecciona profesional y servicio para ver horarios.</p>}

                        {esEdicion && (
                            <>
                                <label htmlFor="estadoCita">Estado de la Cita</label>
                                <select
                                    id="estadoCita"
                                    value={estadoCita}
                                    onChange={(e) => setEstadoCita(e.target.value)}
                                    required
                                >
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="Confirmada">Confirmada</option>
                                    <option value="Cancelada">Cancelada</option>
                                    <option value="Iniciada">Iniciada</option>
                                    <option value="Finalizada">Finalizada</option>
                                </select>

                                <label htmlFor="estadoPago">Estado de Pago</label>
                                <select
                                    id="estadoPago"
                                    value={estadoPago}
                                    onChange={(e) => setEstadoPago(e.target.value)}
                                    required
                                >
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="Pagado">Pagado</option>
                                    <option value="Reembolsado">Reembolsado</option>
                                </select>
                            </>
                        )}
                    </div>

                    <button type="submit" className="formButton" disabled={loading}>
                        {loading ? 'Procesando...' : (esEdicion ? 'Actualizar Cita' : 'Agendar Cita')}
                    </button>
                </form>
            </div>

            {mostrarModalEdad && <ModalErrorEdad onClose={() => setMostrarModalEdad(false)} />}
            {mostrarModalEdadMenor && <ModalErrorEdadMenor onClose={() => setMostrarModalEdadMenor(false)} />}
            {mostrarModalNombreIncompleto && <ModalErrorCaracteres onClose={() => setMostrarModalNombreIncompleto(false)} />}
            {mostrarModalTelefonoIncompleto && <ModalErrorTelefono onClose={() => setMostrarModalTelefonoIncompleto(false)} />}
        </>
    );
};

export default SolicitarCitaAdmin;