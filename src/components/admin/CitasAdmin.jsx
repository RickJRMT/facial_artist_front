import React, { useState, useEffect } from "react";
import "./CitasAdmin.css";
import SolicitarCitaAdmin from "../../pages/SolicitarCitaAdmin.jsx";
import { useCitasAdmin } from "../../hooks/CargarCitasAdmin.jsx";
import ModalCitaExitosa from "../layout/ModalCitaSolicitada.jsx";
import ModalCitaEditada from "../layout/ModalCitaEditada.jsx";
import ModalEliminarCita from "../layout/ModalEliminarCita.jsx";
import ModalMensaje from "../layout/ModalMensaje.jsx";
import useModalCitaExitosa from "../../hooks/useModalCitaExitosa.jsx";
import { eliminarCita } from "../../Services/citasClientesConexion";

export default function CitasAdmin() {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [mostrarEditar, setMostrarEditar] = useState(false);
    const [citaAEditar, setCitaAEditar] = useState(null);
    const [modalEditadaVisible, setModalEditadaVisible] = useState(false);
    const [datosEditados, setDatosEditados] = useState(null);
    const [modalEliminarVisible, setModalEliminarVisible] = useState(false);
    const [citaAEliminar, setCitaAEliminar] = useState(null);

    const [modalMensaje, setModalMensaje] = useState({
        visible: false,
        type: "success",
        mensaje: ""
    });

    const { citas, loading, error, fetchCitas } = useCitasAdmin();
    const { modalVisible, mostrarModal, cerrarModal, datosCita } = useModalCitaExitosa();

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProfesional, setSelectedProfesional] = useState("");
    const [selectedPago, setSelectedPago] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const citasPorPagina = 10;

    // Resetear página cuando cambia el filtro de búsqueda
    useEffect(() => {
        setPaginaActual(1);
    }, [searchTerm, selectedProfesional, selectedPago]);

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

    const handleEliminarCita = (cita) => {
        setCitaAEliminar(cita);
        setModalEliminarVisible(true);
    };

    const confirmarEliminarCita = async (idCita) => {
        try {
            const resultado = await eliminarCita(idCita);
            fetchCitas();
            setModalEliminarVisible(false);
            setCitaAEliminar(null);
            setModalMensaje({
                visible: true,
                type: "success",
                mensaje: resultado.message || "Cita eliminada exitosamente"
            });
        } catch (error) {
            setModalEliminarVisible(false);
            setCitaAEliminar(null);
            setModalMensaje({
                visible: true,
                type: "error",
                mensaje: error.message || "Error al eliminar cita"
            });
        }
    };

    const cerrarModalEliminar = () => {
        setModalEliminarVisible(false);
        setCitaAEliminar(null);
    };

    const cerrarModalMensaje = () => {
        setModalMensaje({ ...modalMensaje, visible: false });
    };

    const formatearHora = (horaStr) => {
        if (!horaStr) return 'N/A';
        try {
            // Convierte '08:00:00' → '8:00 a.m.' (formato elegante con punto y minúsculas)
            return new Date(`2025-01-01 ${horaStr}`).toLocaleTimeString('es-ES', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }).replace('.', '.').toLowerCase(); // Quita el punto y pone minúsculas
        } catch {
            return horaStr;
        }
    };

    const citasFiltradas = citas.filter((cita) => {
        const matchesSearch = cita.nombreCliente.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesProfesional = !selectedProfesional || cita.nombreProfesional === selectedProfesional;
        const matchesPago = !selectedPago || cita.estadoPago === selectedPago;
        return matchesSearch && matchesProfesional && matchesPago;
    });

    if (loading) return <div className="admincitas-loading">Cargando citas...</div>;
    if (error) return <div className="admincitas-error">Error: {error}</div>;

    const indexFinal = paginaActual * citasPorPagina;
    const indexInicial = indexFinal - citasPorPagina;
    const citasPaginadas = citasFiltradas.slice(indexInicial, indexFinal);
    const totalPaginas = Math.ceil(citasFiltradas.length / citasPorPagina);

    // Funciones de paginación avanzada
    const handlePageChange = (newPage) => {
        setPaginaActual(newPage);
        // Scroll hacia arriba de la tabla
        const scrollTarget = document.querySelector('.admincitas-table-card')?.offsetTop || 0;
        window.scrollTo({ top: scrollTarget - 20, behavior: 'smooth' });
    };

    const renderPaginationButtons = () => {
        const buttons = [];
        const maxVisible = 5;
        let start = Math.max(1, paginaActual - Math.floor(maxVisible / 2));
        let end = Math.min(totalPaginas, start + maxVisible - 1);

        if (end - start < maxVisible - 1) {
            start = Math.max(1, end - maxVisible + 1);
        }

        if (start > 1) {
            buttons.push(
                <button
                    key={1}
                    onClick={() => handlePageChange(1)}
                    className="admincitas-pagination-btn"
                >
                    1
                </button>
            );
            if (start > 2) {
                buttons.push(
                    <span key="ellipsis-start" className="admincitas-pagination-ellipsis">
                        ...
                    </span>
                );
            }
        }

        for (let i = start; i <= end; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`admincitas-pagination-btn ${paginaActual === i ? 'active' : ''}`}
                >
                    {i}
                </button>
            );
        }

        if (end < totalPaginas) {
            if (end < totalPaginas - 1) {
                buttons.push(
                    <span key="ellipsis-end" className="admincitas-pagination-ellipsis">
                        ...
                    </span>
                );
            }
            buttons.push(
                <button
                    key={totalPaginas}
                    onClick={() => handlePageChange(totalPaginas)}
                    className="admincitas-pagination-btn"
                >
                    {totalPaginas}
                </button>
            );
        }

        return buttons;
    };

    const profesionalesUnicos = [...new Set(citas.map(c => c.nombreProfesional))].sort();
    const estadosPagoUnicos = [...new Set(citas.map(c => c.estadoPago))].sort();

    return (
        <div className="admincitas-container">
            {/* Header */}
            <header className="admincitas-header">
                <div>
                    <h1>Citas</h1>
                    <p>Gestión de citas y reservas</p>
                </div>
                <button className="admincitas-btn-nueva" onClick={() => setMostrarFormulario(true)}>
                    + Nueva Cita
                </button>
            </header>

            {/* Filtros - Horizontal en escritorio, vertical en móvil */}
            <div className="admincitas-filtros">
                <input
                    type="text"
                    placeholder="Buscar cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select value={selectedProfesional} onChange={(e) => setSelectedProfesional(e.target.value)}>
                    <option value="">Todos los profesionales</option>
                    {profesionalesUnicos.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <select value={selectedPago} onChange={(e) => setSelectedPago(e.target.value)}>
                    <option value="">Todos los pagos</option>
                    {estadosPagoUnicos.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
                <button className="admincitas-btn-limpiar" onClick={() => {
                    setSearchTerm("");
                    setSelectedProfesional("");
                    setSelectedPago("");
                    setPaginaActual(1);
                }}>
                    Limpiar
                </button>
            </div>

            {/* Lista de citas */}
            <div className="admincitas-table-card">
                <h3 className="admincitas-table-title">Lista de Citas</h3>

                {citasFiltradas.length === 0 ? (
                    <div className="admincitas-empty-state">
                        <p>No hay citas que coincidan con los filtros.</p>
                    </div>
                ) : (
                    <>
                        {/* TABLA - Solo visible en escritorio */}
                        <div className="admincitas-table-wrapper">
                            <table className="admincitas-table">
                                <thead>
                                    <tr className="admincitas-table-header">
                                        <th>ID</th>
                                        <th>Servicio</th>
                                        <th>Cliente</th>
                                        <th>Profesional</th>
                                        <th>Fecha</th>
                                        <th>Hora</th>
                                        <th>Estado Cita</th>
                                        <th>Pago</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {citasPaginadas.map((cita) => (
                                        <tr key={cita.idCita} className="admincitas-table-row">
                                            <td>{cita.idCita}</td>
                                            <td>
                                                <span className="admincitas-servicio-nombre">{cita.servNombre}</span>
                                            </td>
                                            <td>
                                                <span className="admincitas-cliente-nombre">{cita.nombreCliente}</span>
                                            </td>
                                            <td>
                                                <span className="admincitas-profesional-nombre">{cita.nombreProfesional}</span>
                                            </td>
                                            <td>
                                                <span className="admincitas-fecha">{new Date(cita.fechaCita).toLocaleDateString('es-ES')}</span>
                                            </td>
                                            <td>
                                                <span className="admincitas-hora">{formatearHora(cita.horaCita)}</span>
                                            </td>
                                            <td>
                                                <span className={`admincitas-badge admincitas-badge-cita-${(cita.estadoCita || 'pendiente').toLowerCase()}`}>
                                                    {cita.estadoCita || 'Pendiente'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`admincitas-badge admincitas-badge-pago-${(cita.estadoPago || 'pendiente').toLowerCase()}`}>
                                                    {cita.estadoPago || 'Pendiente'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="admincitas-action-buttons">
                                                    <button
                                                        className="admincitas-btn-edit"
                                                        onClick={() => {
                                                            setCitaAEditar(cita);
                                                            setMostrarEditar(true);
                                                        }}
                                                        title="Editar cita"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        className="admincitas-btn-delete"
                                                        onClick={() => handleEliminarCita(cita)}
                                                        title="Eliminar cita"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* CARDS - Solo visible en móvil */}
                        <div className="admincitas-cards-mobile">
                            {citasPaginadas.map((cita) => (
                                <div key={cita.idCita} className="admincitas-card">
                                    <div className="admincitas-card-header">
                                        <div>
                                            <h3>{cita.nombreCliente}</h3>
                                            <p className="admincitas-card-servicio">{cita.servNombre}</p>
                                        </div>
                                        <span className={`admincitas-badge admincitas-badge-${cita.estadoCita?.toLowerCase() || 'pendiente'}`}>
                                            {cita.estadoCita || 'Pendiente'}
                                        </span>
                                    </div>
                                    <div className="admincitas-card-body">
                                        <p><strong>Profesional:</strong> {cita.nombreProfesional}</p>
                                        <p><strong>Fecha:</strong> {new Date(cita.fechaCita).toLocaleDateString('es-ES')}</p>
                                        <p><strong>Hora:</strong> {formatearHora(cita.horaCita)}</p>
                                        <p><strong>Pago:</strong>
                                            <span className={`admincitas-badge admincitas-badge-pago-${cita.estadoPago?.toLowerCase() || 'pendiente'}`}>
                                                {cita.estadoPago || 'Pendiente'}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="admincitas-card-acciones">
                                        <button className="admincitas-btn-editar" onClick={() => {
                                            setCitaAEditar(cita);
                                            setMostrarEditar(true);
                                        }}>Editar</button>
                                        <button className="admincitas-btn-eliminar" onClick={() => handleEliminarCita(cita)}>Eliminar</button>
                                    </div>
                                </div>
                            ))}
                        </div>


                    </>
                )}
            </div>

            {/* Paginación avanzada */}
            {!loading && !error && citasFiltradas.length > 0 && (
                <div className="admincitas-pagination-container">
                    <div className="admincitas-pagination-info">
                        Mostrando {indexInicial + 1} - {Math.min(indexFinal, citasFiltradas.length)} de {citasFiltradas.length} citas
                    </div>
                    <div className="admincitas-pagination-controls">
                        <button
                            className="admincitas-pagination-btn admincitas-pagination-nav"
                            onClick={() => handlePageChange(paginaActual - 1)}
                            disabled={paginaActual === 1}
                        >
                            Anterior
                        </button>
                        {renderPaginationButtons()}
                        <button
                            className="admincitas-pagination-btn admincitas-pagination-nav"
                            onClick={() => handlePageChange(paginaActual + 1)}
                            disabled={paginaActual === totalPaginas}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}

            {/* Modales */}
            {/* Modal creación */}
            {mostrarFormulario && (
                <SolicitarCitaAdmin onCitaCreada={handleCitaCreada} onClose={cerrarFormulario} />
            )}

            {/* Modal edición */}
            {mostrarEditar && citaAEditar && (
                <SolicitarCitaAdmin
                    initialData={citaAEditar}
                    esAdmin={true}
                    onSuccess={handleCitaEditada}
                    onClose={cerrarEditar}
                />
            )}

            {modalVisible && <ModalCitaExitosa datosCita={datosCita} onClose={cerrarModal} />}
            {modalEditadaVisible && <ModalCitaEditada datosCita={datosEditados} onClose={() => setModalEditadaVisible(false)} />}
            {modalEliminarVisible && (
                <ModalEliminarCita
                    cita={citaAEliminar}
                    onClose={cerrarModalEliminar}
                    onConfirm={confirmarEliminarCita}
                />
            )}
            {modalMensaje.visible && (
                <ModalMensaje
                    type={modalMensaje.type}
                    mensaje={modalMensaje.mensaje}
                    onClose={cerrarModalMensaje}
                />
            )}
        </div>
    );
}