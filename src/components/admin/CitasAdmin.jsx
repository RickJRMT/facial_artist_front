// CitasAdmin.jsx (versión completa actualizada)
import React, { useState } from "react";
import "./CitasAdmin.css";
import SolicitarCitaCard from "../../pages/SolicitarCitaAdmin.jsx";
import EditarCita from "../layout/EditarCita.jsx";
import { useCitasAdmin } from "../../hooks/CargarCitasAdmin.jsx";
import ModalCitaExitosa from "../layout/ModalCitaSolicitada.jsx";
import ModalCitaEditada from "../layout/ModalCitaEditada.jsx";
import useModalCitaExitosa from "../../hooks/useModalCitaExitosa.jsx";
import { useProfesionales } from "../../hooks/CargarProfesionales.jsx"; // Agregado para obtener profesionales
import { actualizarCita, eliminarCita } from "../../Services/citasClientesConexion";

export default function CitasAdmin() {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [mostrarEditar, setMostrarEditar] = useState(false);
    const [citaAEditar, setCitaAEditar] = useState(null);

    // Estado para modal de edición
    const [modalEditadaVisible, setModalEditadaVisible] = useState(false);
    const [datosEditados, setDatosEditados] = useState(null);

    const { citas, loading, error, fetchCitas } = useCitasAdmin();
    const { profesionales } = useProfesionales(); // Agregado para usar en modal
    const { modalVisible, mostrarModal, cerrarModal, datosCita } = useModalCitaExitosa();

    // Estados para filtros
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProfesional, setSelectedProfesional] = useState("");
    const [selectedPago, setSelectedPago] = useState("");

    const [paginaActual, setPaginaActual] = useState(1);
    const citasPorPagina = 10;

    const cerrarFormulario = () => setMostrarFormulario(false);
    const cerrarEditar = () => {
        setMostrarEditar(false);
        setCitaAEditar(null);
    };

    const handleCitaCreada = (datos) => {
        fetchCitas();
        setMostrarFormulario(false);
        mostrarModal(datos);
    };

    const handleCitaEditada = async (datosActualizados) => {
        try {
            await actualizarCita(citaAEditar.idCita, datosActualizados);
            fetchCitas();
            cerrarEditar();
            // Preparar datos para modal de edición
            const nombreProfesionalNuevo = profesionales.find(p => p.idProfesional === datosActualizados.idProfesional)?.nombreProfesional || citaAEditar.nombreProfesional;
            const datosParaModal = {
                nombreCliente: citaAEditar.nombreCliente,
                fecha: datosActualizados.fechaCita,
                hora: datosActualizados.horaCita,
                profesional: nombreProfesionalNuevo,
                servicio: citaAEditar.servNombre,
                estadoCita: datosActualizados.estadoCita,
                estadoPago: datosActualizados.estadoPago
            };
            setDatosEditados(datosParaModal);
            setModalEditadaVisible(true);
        } catch (error) {
            console.error("Error al editar cita:", error);
            alert(error.message || "Error al editar cita");
        }
    };

    const handleEliminarCita = async (idCita) => {
        if (!window.confirm("¿Estás seguro de eliminar esta cita?")) return;
        try {
            await eliminarCita(idCita);
            fetchCitas();
        } catch (error) {
            console.error("Error al eliminar cita:", error);
            alert(error.message || "Error al eliminar cita");
        }
    };

    // Función para filtrar citas
    const citasFiltradas = citas.filter((cita) => {
        const matchesSearch = cita.nombreCliente.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesProfesional = !selectedProfesional || cita.nombreProfesional === selectedProfesional;
        const matchesPago = !selectedPago || cita.estadoPago === selectedPago;
        return matchesSearch && matchesProfesional && matchesPago;
    });

    function getEstadoCitaClass(estado) {
        switch (estado?.toLowerCase()) {
            case "confirmada": return "confirmada";
            case "cancelada": return "cancelada";
            case "pendiente": return "pendiente";
            case "iniciada": return "iniciada";
            case "finalizada": return "finalizada";
            default: return "otroEstado";
        }
    }

    function getEstadoPagoClass(estado) {
        switch (estado?.toLowerCase()) {
            case "pagado": return "pagado";
            case "pendiente": return "pendiente";
            default: return "otroEstado";
        }
    }

    if (loading) return <p>Cargando citas...</p>;
    if (error) return <p style={{ color: "var(--color-texto)" }}>Error: {error}</p>;

    const indexUltimaCita = paginaActual * citasPorPagina;
    const indexPrimeraCita = indexUltimaCita - citasPorPagina;
    const citasPaginadas = citasFiltradas.slice(indexPrimeraCita, indexUltimaCita);
    const totalPaginas = Math.ceil(citasFiltradas.length / citasPorPagina);

    // Opciones para filtros
    const profesionalesUnicos = [...new Set(citas.map(c => c.nombreProfesional))].sort();
    const estadosPagoUnicos = [...new Set(citas.map(c => c.estadoPago))].sort();

    return (
        <div className="citas-container">
            <div className="citas-header">
                <h1>Citas</h1>
                <p>Gestión de citas y reservas</p>
                <button className="btn-nueva-cita" onClick={() => setMostrarFormulario(true)}>
                    + Nueva Cita
                </button>
            </div>

            {/* Filtros funcionales */}
            <div className="filtros">
                <input
                    type="text"
                    placeholder="Buscar por cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    value={selectedProfesional}
                    onChange={(e) => setSelectedProfesional(e.target.value)}
                >
                    <option value="">Todos los profesionales</option>
                    {profesionalesUnicos.map((prof) => (
                        <option key={prof} value={prof}>{prof}</option>
                    ))}
                </select>
                <select
                    value={selectedPago}
                    onChange={(e) => setSelectedPago(e.target.value)}
                >
                    <option value="">Todos los estados de pago</option>
                    {estadosPagoUnicos.map((estado) => (
                        <option key={estado} value={estado}>{estado}</option>
                    ))}
                </select>
                <button
                    className="btn-limpiar-filtros"
                    onClick={() => {
                        setSearchTerm("");
                        setSelectedProfesional("");
                        setSelectedPago("");
                        setPaginaActual(1);
                    }}
                >
                    Limpiar
                </button>
            </div>

            <div className="lista-citas">
                {citasFiltradas.length === 0 ? (
                    <p>No hay citas que coincidan con los filtros.</p>
                ) : (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Servicio</th>
                                    <th>Cliente</th>
                                    <th>Profesional</th>
                                    <th>Fecha</th>
                                    <th>Hora</th>
                                    <th>Estado Cita</th>
                                    <th>Estado Pago</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {citasPaginadas.map((cita) => (
                                    <tr key={cita.idCita}>
                                        <td>{cita.servNombre}</td>
                                        <td>{cita.nombreCliente}</td>
                                        <td>{cita.nombreProfesional}</td>
                                        <td>{new Date(cita.fechaCita).toLocaleDateString()}</td>
                                        <td>{cita.horaCita}</td>
                                        <td>
                                            <span className={getEstadoCitaClass(cita.estadoCita)}>
                                                {cita.estadoCita}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={getEstadoPagoClass(cita.estadoPago)}>
                                                {cita.estadoPago}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn-editar-cita"
                                                onClick={() => {
                                                    setCitaAEditar(cita);
                                                    setMostrarEditar(true);
                                                }}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn-eliminar-cita"
                                                onClick={() => handleEliminarCita(cita.idCita)}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="paginacion">
                            {[...Array(totalPaginas)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setPaginaActual(i + 1)}
                                    className={paginaActual === i + 1 ? "activo" : ""}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Modal Nueva Cita */}
            {mostrarFormulario && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="btn-cerrar-modal" onClick={cerrarFormulario}>X</button>
                        <SolicitarCitaCard onCitaCreada={handleCitaCreada} />
                    </div>
                </div>
            )}

            {/* Modal Edición */}
            {mostrarEditar && citaAEditar && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="btn-cerrar-modal" onClick={cerrarEditar}>X</button>
                        <EditarCita cita={citaAEditar} onCitaEditada={handleCitaEditada} />
                    </div>
                </div>
            )}

            {/* Modal Éxito Creación */}
            {modalVisible && <ModalCitaExitosa datosCita={datosCita} onClose={cerrarModal} />}

            {/* Modal Éxito Edición */}
            {modalEditadaVisible && (
                <ModalCitaEditada
                    datosCita={datosEditados}
                    onClose={() => setModalEditadaVisible(false)}
                />
            )}
        </div>
    );
}