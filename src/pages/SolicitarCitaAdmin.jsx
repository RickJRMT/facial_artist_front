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
    const [horariosListos, setHorariosListos] = useState(false);

    const { profesionales } = useProfesionales();
    const { servicios } = UseServicios(false);
    const { horariosDisponibles } = useHorariosDisponibles(idProfesional, idServicio, formData.fechaCita);

    const [mostrarModalEdad, setMostrarModalEdad] = useState(false);
    const [mostrarModalEdadMenor, setMostrarModalEdadMenor] = useState(false);
    const [mostrarModalNombreIncompleto, setMostrarModalNombreIncompleto] = useState(false);
    const [mostrarModalTelefonoIncompleto, setMostrarModalTelefonoIncompleto] = useState(false);

    // Prefill (igual que antes)
    useEffect(() => {
        if (esEdicion && initialData) {
            setLoading(true);
            const formatearFecha = (fechaISO) => (!fechaISO ? '' : new Date(fechaISO).toISOString().split('T')[0]);

            handleInputChange({ target: { name: 'nombreCliente', value: initialData.nombreCliente || '' } });
            handleInputChange({ target: { name: 'celularCliente', value: initialData.celularCliente || '' } });
            handleInputChange({ target: { name: 'fechaNacCliente', value: formatearFecha(initialData.fechaNacCliente) } });
            handleInputChange({ target: { name: 'fechaCita', value: formatearFecha(initialData.fechaCita) } });
            handleInputChange({ target: { name: 'horaCita', value: initialData.horaCita || '' } });

            const prof = profesionales.find(p => p.nombreProfesional === initialData.nombreProfesional);
            setIdProfesional(prof?.idProfesional?.toString() || '');

            const serv = servicios.find(s => s.nombre === initialData.servNombre);
            setIdServicio(serv?.id?.toString() || '');

            setEstadoCita(initialData.estadoCita?.trim() || 'Pendiente');
            setEstadoPago(initialData.estadoPago?.trim() || 'Pendiente');

            setTimeout(() => setHorariosListos(true), 100);
            setLoading(false);
        }
    }, [initialData, esEdicion, profesionales, servicios, handleInputChange]);

    // Ajuste automático de hora
    useEffect(() => {
        if (esEdicion && horariosListos && idProfesional && idServicio && formData.fechaCita && formData.horaCita) {
            const existe = horariosDisponibles.some(h => h.horaInicio24 === formData.horaCita);
            if (!existe && horariosDisponibles.length > 0) {
                handleInputChange({ target: { name: 'horaCita', value: horariosDisponibles[0].horaInicio24 } });
            }
        }
    }, [horariosListos, idProfesional, idServicio, formData.fechaCita, horariosDisponibles]);

    const handleProfesionalChange = (e) => {
        setIdProfesional(e.target.value);
        handleInputChange({ target: { name: 'horaCita', value: '' } });
    };

    const handleServicioChange = (e) => {
        setIdServicio(e.target.value);
        handleInputChange({ target: { name: 'horaCita', value: '' } });
    };

    const calcularEdad = (fechaNacimiento) => {
        const hoy = new Date();
        const nac = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nac.getFullYear();
        const m = hoy.getMonth() - nac.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
        return edad;
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.fechaCita || !formData.horaCita || !idProfesional || !idServicio) {
            alert("Completa todos los campos obligatorios");
            setLoading(false);
            return;
        }

        if (!esAdmin && !esEdicion) {
            if (formData.nombreCliente.trim().length < 3) return setMostrarModalNombreIncompleto(true);
            if (formData.celularCliente.trim().length < 10) return setMostrarModalTelefonoIncompleto(true);
            const edad = calcularEdad(formData.fechaNacCliente);
            if (new Date(formData.fechaNacCliente) > new Date()) return alert("Fecha de nacimiento inválida");
            const prohibidos = ["Micropigmentación de cejas", "Micropigmentación de pestañas"];
            const serv = servicios.find(s => s.id === parseInt(idServicio))?.nombre;
            if (edad < 18 && prohibidos.includes(serv)) return setMostrarModalEdad(true);
            if (edad < 13) return setMostrarModalEdadMenor(true);
        }

        const datosCita = {
            nombreCliente: formData.nombreCliente,
            celularCliente: formData.celularCliente,
            fechaNacCliente: formData.fechaNacCliente,
            idProfesional: parseInt(idProfesional),
            idServicios: parseInt(idServicio),
            fechaCita: formData.fechaCita,
            horaCita: formData.horaCita,
            numeroReferencia: esEdicion ? initialData.numeroReferencia : Math.floor(Date.now() / 1000),
            estadoCita,
            estadoPago
        };

        try {
            const servicioSeleccionado = servicios.find(s => s.id === parseInt(idServicio))?.nombre || "No disponible";

            if (esEdicion) {
                await actualizarCita(initialData.idCita, datosCita);
                onSuccess({
                    tipo: "editada",
                    nombreCliente: datosCita.nombreCliente,
                    fecha: datosCita.fechaCita,
                    hora: datosCita.horaCita,
                    profesional: profesionales.find(p => p.idProfesional === datosCita.idProfesional)?.nombreProfesional || "No asignado",
                    servicio: servicioSeleccionado,
                    costo: servicios.find(s => s.id === datosCita.idServicios)?.servCosto || "No disponible",
                    numeroReferencia: datosCita.numeroReferencia,
                    estadoCita,
                    estadoPago
                });
            } else {
                const resultado = await crearCita(datosCita);
                onCitaCreada?.({
                    nombreCliente: datosCita.nombreCliente,
                    fecha: datosCita.fechaCita,
                    hora: datosCita.horaCita,
                    profesional: profesionales.find(p => p.idProfesional === datosCita.idProfesional)?.nombreProfesional || "No asignado",
                    servicio: servicioSeleccionado,
                    costo: servicios.find(s => s.id === datosCita.idServicios)?.servCosto || "No disponible",
                    numeroReferencia: resultado.numeroReferencia || datosCita.numeroReferencia
                });
            }

            if (!esEdicion) {
                limpiarFormulario();
                setIdProfesional("");
                setIdServicio("");
                setEstadoCita("Pendiente");
                setEstadoPago("Pendiente");
            }

            onClose?.();
        } catch (error) {
            console.error("Error:", error);
            alert(error.message || "Ocurrió un error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="solicitar-overlay">
            <div className="solicitar-card">
                <button className="solicitar-btn-cerrar" onClick={onClose}>×</button>

                <h2 className="solicitar-titulo">
                    {esEdicion ? 'Editar Cita' : 'Nueva Cita'}
                </h2>

                <p className="solicitar-subtitulo">
                    {esEdicion ? 'Modifica los datos de la cita' : 'Completa los campos para agendar'}
                </p>

                {loading && esEdicion && <p className="solicitar-loading">Cargando datos...</p>}

                <form className="solicitar-form" onSubmit={manejarEnvio}>
                    <div className="solicitar-grid">
                        {/* COLUMNA IZQUIERDA */}
                        <div className="solicitar-column">
                            <label className="solicitar-label">Nombre Completo</label>
                            <input className="solicitar-input"
                                type="text" name="nombreCliente"
                                placeholder="Ingresa el nombre completo"
                                value={formData.nombreCliente}
                                onChange={handleInputChange}
                                required
                                disabled={esEdicion && esAdmin} />

                            <label className="solicitar-label">Teléfono</label>
                            <input className="solicitar-input"
                                type="text" name="celularCliente"
                                placeholder="Ingresa el número de teléfono"
                                value={formData.celularCliente}
                                onChange={handleInputChange}
                                required
                                disabled={esEdicion && esAdmin} />

                            <label className="solicitar-label">Fecha de Nacimiento</label>
                            <input className="solicitar-input"
                                type="date" name="fechaNacCliente"
                                value={formData.fechaNacCliente}
                                onChange={handleInputChange}
                                max={new Date().toISOString().split("T")[0]}
                                required
                                disabled={esEdicion && esAdmin} />

                            <label className="solicitar-label">Servicio</label>
                            <select className="solicitar-select" value={idServicio} onChange={handleServicioChange} required disabled={esEdicion}>
                                <option value="" disabled>Seleccione servicio</option>
                                {servicios?.map(s => s?.id && <option key={s.id} value={s.id}>{s.nombre}</option>)}
                            </select>
                        </div>

                        {/* COLUMNA DERECHA */}
                        <div className="solicitar-column">
                            <label className="solicitar-label">Profesional Preferido</label>
                            <select className="solicitar-select" value={idProfesional} onChange={handleProfesionalChange} required>
                                <option value="" disabled>Seleccione profesional</option>
                                {profesionales?.map(p => p?.idProfesional && <option key={p.idProfesional} value={p.idProfesional}>{p.nombreProfesional}</option>)}
                            </select>

                            <label className="solicitar-label">Fecha de la cita</label>
                            <input className="solicitar-input" type="date" name="fechaCita" value={formData.fechaCita || ""} onChange={handleInputChange} min={new Date().toISOString().split("T")[0]} required />

                            <label className="solicitar-label">Hora de la cita</label>
                            <select className="solicitar-select" name="horaCita" value={formData.horaCita || ""} onChange={handleInputChange} required disabled={!idProfesional || !idServicio || !formData.fechaCita || (horariosDisponibles.length === 0 && !esEdicion)}>
                                <option value="" disabled>
                                    {horariosDisponibles.length === 0 ? "No hay horarios disponibles" : "Seleccione hora"}
                                </option>
                                {horariosDisponibles?.map((h, i) => (
                                    <option key={i} value={h.horaInicio24}>{h.horaInicio} - {h.horaFin}</option>
                                ))}
                            </select>

                            {esEdicion && (
                                <>
                                    <label className="solicitar-label">Estado de la Cita</label>
                                    <select className="solicitar-select" value={estadoCita} onChange={(e) => setEstadoCita(e.target.value)} required>
                                        <option value="pendiente">Pendiente</option>
                                        <option value="confirmada">Confirmada</option>
                                        <option value="iniciada">Iniciada</option>
                                        <option value="finalizada">Finalizada</option>
                                        <option value="cancelada">Cancelada</option>
                                    </select>

                                    <label className="solicitar-label">Estado de Pago</label>
                                    <select className="solicitar-select" value={estadoPago} onChange={(e) => setEstadoPago(e.target.value)} required>
                                        <option value="pendiente">Pendiente</option>
                                        <option value="pagado">Pagado</option>
                                    </select>
                                </>
                            )}
                        </div>
                    </div>

                    <button type="submit" className="solicitar-btn-submit" disabled={loading}>
                        {loading ? 'Procesando...' : esEdicion ? 'Actualizar Cita' : 'Agendar Cita'}
                    </button>
                </form>
            </div>

            {/* Modales de error */}
            {mostrarModalEdad && <ModalErrorEdad onClose={() => setMostrarModalEdad(false)} />}
            {mostrarModalEdadMenor && <ModalErrorEdadMenor onClose={() => setMostrarModalEdadMenor(false)} />}
            {mostrarModalNombreIncompleto && <ModalErrorCaracteres onClose={() => setMostrarModalNombreIncompleto(false)} />}
            {mostrarModalTelefonoIncompleto && <ModalErrorTelefono onClose={() => setMostrarModalTelefonoIncompleto(false)} />}
        </div>
    );
};

export default SolicitarCitaAdmin;