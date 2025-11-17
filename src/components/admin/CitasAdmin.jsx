import React, { useState } from "react";
import "./CitasAdmin.css";
import SolicitarCitaAdmin from "../../pages/SolicitarCitaAdmin.jsx"; // Ajusta path si es diferente
import { useCitasAdmin } from "../../hooks/CargarCitasAdmin.jsx";
import ModalCitaExitosa from "../layout/ModalCitaSolicitada.jsx";
import ModalCitaEditada from "../layout/ModalCitaEditada.jsx";
import useModalCitaExitosa from "../../hooks/useModalCitaExitosa.jsx";
import { useProfesionales } from "../../hooks/CargarProfesionales.jsx";
import { eliminarCita } from "../../Services/citasClientesConexion";

export default function CitasAdmin() {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [mostrarEditar, setMostrarEditar] = useState(false);
    const [citaAEditar, setCitaAEditar] = useState(null);

    const [modalEditadaVisible, setModalEditadaVisible] = useState(false);
    const [datosEditados, setDatosEditados] = useState(null);

    const { citas, loading, error, fetchCitas } = useCitasAdmin();
    const { profesionales } = useProfesionales();
    const { modalVisible, mostrarModal, cerrarModal, datosCita } = useModalCitaExitosa();

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

    const handleCitaEditada = (datosParaModal) => {
        fetchCitas();
        setDatosEditados(datosParaModal);
        setModalEditadaVisible(true);
    };

    const handleEliminarCita = async (idCita) => {
        if (!window.confirm("¿Estás seguro de eliminar esta cita? Esto también eliminará la HV asociada.")) return;
        try {
            const resultado = await eliminarCita(idCita);
            fetchCitas();
            alert(resultado.message || "Cita eliminada exitosamente");
        } catch (error) {
            console.error("Error al eliminar cita:", error);
            alert(error.message || "Error al eliminar cita. Detalles en consola del navegador.");
        }
    };

    // Función para formatear hora de 'hh:mm:ss' a 'hh:mm AM/PM' (sin cambios)
    const formatearHora = (horaStr) => {
        if (!horaStr || typeof horaStr !== 'string') return 'N/A';
        try {
            const [hora, min, seg] = horaStr.split(':');
            const fechaTemp = new Date();
            fechaTemp.setHours(parseInt(hora), parseInt(min), parseInt(seg));
            return fechaTemp.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit', 
                hour12: true 
            }).toLowerCase(); // Ej: '4:00 pm'
        } catch (err) {
            console.warn('Error formateando hora:', horaStr, err);
            return horaStr;
        }
    };

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
                                        {/* FIX: Todo en una línea para evitar whitespace text nodes entre <td> */}
                                        <td>{cita.servNombre}</td><td>{cita.nombreCliente}</td><td>{cita.nombreProfesional}</td><td>{new Date(cita.fechaCita).toLocaleDateString()}</td><td>{formatearHora(cita.horaCita)}</td><td><span className={getEstadoCitaClass(cita.estadoCita)}>{cita.estadoCita}</span></td><td><span className={getEstadoPagoClass(cita.estadoPago)}>{cita.estadoPago}</span></td><td><button className="btn-editar-cita" onClick={() => {console.log('Clic editar - Cita seleccionada:', cita);setCitaAEditar(cita);setMostrarEditar(true);console.log('Estados setados - mostrarEditar:', true, 'citaAEditar:', cita);}}>Editar</button><button className="btn-eliminar-cita" onClick={() => handleEliminarCita(cita.idCita)}>Eliminar</button></td>
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

            {/* Modal creación sin cambios */}
            {mostrarFormulario && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="btn-cerrar-modal" onClick={cerrarFormulario}>X</button>
                        <SolicitarCitaAdmin onCitaCreada={handleCitaCreada} />
                    </div>
                </div>
            )}

            {/* Modal edición sin cambios */}
            {mostrarEditar && citaAEditar && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="btn-cerrar-modal" onClick={cerrarEditar}>X</button>
                        <SolicitarCitaAdmin
                            initialData={citaAEditar}
                            esAdmin={true}
                            onSuccess={handleCitaEditada}
                            onClose={cerrarEditar}
                        />
                    </div>
                </div>
            )}

            {modalVisible && <ModalCitaExitosa datosCita={datosCita} onClose={cerrarModal} />}

            {modalEditadaVisible && (
                <ModalCitaEditada
                    datosCita={datosEditados}
                    onClose={() => setModalEditadaVisible(false)}
                />
            )}
        </div>
    );
}