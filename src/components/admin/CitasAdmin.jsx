import React, { useState } from "react";
import "./CitasAdmin.css";
import SolicitarCitaAdmin from "../../pages/SolicitarCitaAdmin.jsx";
import { useCitasAdmin } from "../../hooks/CargarCitasAdmin.jsx";
import ModalCitaExitosa from "../layout/ModalCitaSolicitada.jsx";
import ModalCitaEditada from "../layout/ModalCitaEditada.jsx";
import useModalCitaExitosa from "../../hooks/useModalCitaExitosa.jsx";
import { eliminarCita } from "../../Services/citasClientesConexion";

export default function CitasAdmin() {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [mostrarEditar, setMostrarEditar] = useState(false);
    const [citaAEditar, setCitaAEditar] = useState(null);
    const [modalEditadaVisible, setModalEditadaVisible] = useState(false);
    const [datosEditados, setDatosEditados] = useState(null);

    const { citas, loading, error, fetchCitas } = useCitasAdmin();
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
            alert(error.message || "Error al eliminar cita");
        }
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
            <div className="admincitas-lista">
                {citasFiltradas.length === 0 ? (
                    <p className="admincitas-no-resultados">No hay citas que coincidan con los filtros.</p>
                ) : (
                    <>
                        {/* TABLA - Solo visible en escritorio */}
                        <div className="admincitas-tabla-desktop">
                            <div className="admincitas-tabla-scroll">
                                <table className="admincitas-tabla">
                                    <thead>
                                        <tr>
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
                                            <tr key={cita.idCita}>
                                                <td>{cita.servNombre}</td>
                                                <td>{cita.nombreCliente}</td>
                                                <td>{cita.nombreProfesional}</td>
                                                <td>{new Date(cita.fechaCita).toLocaleDateString('es-ES')}</td>
                                                <td>{formatearHora(cita.horaCita)}</td>
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
                                                <td className="admincitas-acciones">
                                                    <button className="admincitas-btn-editar" onClick={() => {
                                                        setCitaAEditar(cita);
                                                        setMostrarEditar(true);
                                                    }}>Editar</button>
                                                    <button className="admincitas-btn-eliminar" onClick={() => handleEliminarCita(cita.idCita)}>Eliminar</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
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
                                        <button className="admincitas-btn-eliminar" onClick={() => handleEliminarCita(cita.idCita)}>Eliminar</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Paginación */}
                        <div className="admincitas-paginacion">
                            <button onClick={() => setPaginaActual(p => Math.max(1, p - 1))} disabled={paginaActual === 1}>
                                ← Anterior
                            </button>
                            <span>Página {paginaActual} de {totalPaginas}</span>
                            <button onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))} disabled={paginaActual === totalPaginas}>
                                Siguiente →
                            </button>
                        </div>
                    </>
                )}
            </div>

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
        </div>
    );
}