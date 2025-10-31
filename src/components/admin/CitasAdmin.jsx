// IMPORTACIONES
import React, { useState } from "react";
// → React: la librería
// → useState: hook para crear estados locales (como "abrir/cerrar modal")

import "./CitasAdmin.css";
// → Archivo CSS con estilos específicos del componente
// → Controla colores, espaciado, botones, tabla, etc.

import SolicitarCitaCard from "../../pages/SolicitarCitaAdmin.jsx";
// → Componente que contiene el formulario de solicitud de cita
// → Lo usamos como un "modal" dentro de CitasAdmin

import { useCitasAdmin } from "../../hooks/CargarCitasAdmin.jsx";
// → Hook personalizado que:
//   - Hace una petición GET al backend
//   - Devuelve:
//     • citas: array con todas las citas
//     • loading: true mientras espera respuesta
//     • error: mensaje si falla
//     • fetchCitas(): función para recargar datos

import ModalCitaExitosa from "../layout/ModalCitaSolicitada.jsx";
// → Modal que aparece al crear una cita exitosamente
// → Muestra: cliente, fecha, hora, profesional, servicio, costo, referencia

import useModalCitaExitosa from "../../hooks/useModalCitaExitosa.jsx";
// → Hook que controla el modal de éxito:
//   • modalVisible: ¿se muestra?
//   • mostrarModal(datos): abre con datos
//   • cerrarModal(): cierra
//   • datosCita: objeto con info de la cita creada

// COMPONENTE PRINCIPAL
export default function CitasAdmin() {
    // ESTADO: ¿Se muestra el formulario de nueva cita?
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    // → false = oculto
    // → true = visible como overlay
    // → Cambia con el botón "+ Nueva Cita"

    // DATOS DE CITAS DESDE EL BACKEND
    const { citas, loading, error, fetchCitas } = useCitasAdmin();
    // → citas: [ { idCita: 1, nombreCliente: "Ana", ... }, ... ]
    // → loading: true mientras se hace fetch
    // → error: "No hay conexión" si falla
    // → fetchCitas(): vuelve a pedir datos al backend

    // CONTROL DEL MODAL DE ÉXITO
    const { modalVisible, mostrarModal, cerrarModal, datosCita } = useModalCitaExitosa();
    // → modalVisible: true = modal visible
    // → mostrarModal({ nombreCliente: "Ana", ... }): abre el modal
    // → cerrarModal(): cierra el modal
    // → datosCita: objeto que se pasa al modal

    // PAGINACIÓN: ESTADO
    const [paginaActual, setPaginaActual] = useState(1);
    // → Número de página que el usuario está viendo
    // → Empieza en 1 (no en 0, para UX más natural)

    const citasPorPagina = 10;
    // → Cuántas citas mostrar por página
    // → Fijo en 10 (puedes cambiarlo a 5, 20, etc.)

    // FUNCIÓN: Cerrar el modal del formulario
    const cerrarFormulario = () => {
        setMostrarFormulario(false);
    };
    // → Se llama al hacer clic en la "X" del modal

    // CALLBACK: Se ejecuta cuando se crea una cita
    const handleCitaCreada = (datos) => {
        fetchCitas();                    // Recargar lista actualizada
        setMostrarFormulario(false);     // Cerrar formulario
        mostrarModal(datos);             // Abrir modal de éxito
    };
    // → Recibe datos desde SolicitarCitaCard
    // → Coordina 3 acciones clave

    // FUNCIÓN: Devuelve clase CSS según estado de cita
    function getEstadoCitaClass(estado) {
        switch (estado?.toLowerCase()) {
            case "confirmada": return "confirmada";   // Verde
            case "cancelada": return "cancelada";     // Rojo
            case "pendiente": return "pendiente";     // Amarillo
            default: return "otroEstado";             // Gris
        }
    }
    // → estado?.toLowerCase(): evita error si estado es null
    // → Devuelve clase para aplicar color en CSS

    // FUNCIÓN: Devuelve clase CSS según estado de pago
    function getEstadoPagoClass(estado) {
        switch (estado?.toLowerCase()) {
            case "pagado": return "pagado";     // Verde
            case "pendiente": return "pendiente"; // Amarillo
            default: return "otroEstado";         // Gris
        }
    }

    // ESTADOS DE CARGA Y ERROR
    if (loading) return <p>Cargando citas...</p>;
    // → Muestra mensaje mientras se carga
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
    // → Muestra error si falla la API

    // CÁLCULOS DE PAGINACIÓN (EXPLICADO PASO A PASO)
    // -------------------------------------------------
    // Supongamos: paginaActual = 2, citasPorPagina = 10
    // → Queremos citas del 10 al 19 (índices 10 a 19)

    const indexUltimaCita = paginaActual * citasPorPagina;
    // → 2 * 10 = 20
    // → La última cita visible tiene índice 19 (porque slice no incluye el final)

    const indexPrimeraCita = indexUltimaCita - citasPorPagina;
    // → 20 - 10 = 10
    // → La primera cita visible tiene índice 10

    const citasPaginadas = citas.slice(indexPrimeraCita, indexUltimaCita);
    // → citas.slice(10, 20)
    // → Devuelve citas desde índice 10 hasta 19 (10 citas)

    const totalPaginas = Math.ceil(citas.length / citasPorPagina);
    // → Ej: 23 citas / 10 = 2.3 → Math.ceil(2.3) = 3
    // → Total de páginas: 3
    // -------------------------------------------------

    // RENDERIZADO FINAL
    return (
        <div className="citas-container">
            {/* ENCABEZADO */}
            <div className="citas-header">
                <h1>Citas</h1>
                <p>Gestión de citas y reservas</p>
                <button 
                    className="btn-nueva-cita" 
                    onClick={() => setMostrarFormulario(true)}
                >
                    + Nueva Cita
                </button>
                {/* → onClick cambia estado → abre modal */}
            </div>

            {/* FILTROS (aún sin funcionalidad) */}
            <div className="filtros">
                <input type="text" placeholder="Buscar por cliente..." />
                <select><option>Filtrar por profesional</option></select>
                <select><option>Estado de pago</option></select>
            </div>

            {/* LISTA DE CITAS */}
            <div className="lista-citas">
                {citas.length === 0 ? (
                    <p>No hay citas registradas.</p>
                ) : (
                    <>
                        {/* TABLA */}
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
                                        {/* key: React necesita ID único para optimizar */}
                                        <td>{cita.servNombre}</td>
                                        <td>{cita.nombreCliente}</td>
                                        <td>{cita.nombreProfesional}</td>
                                        <td>{new Date(cita.fechaCita).toLocaleDateString()}</td>
                                        {/* → Convierte "2025-10-24" → "24/10/2025" */}
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
                                            <button>Editar</button>
                                            <button>Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* PAGINACIÓN: BOTONES 1, 2, 3... */}
                        <div className="paginacion">
                            {[...Array(totalPaginas)].map((_, i) => (
                                // EXPLICACIÓN DETALLADA DE (_, i)
                                // -------------------------------------------------
                                // [...Array(3)] → crea: [undefined, undefined, undefined]
                                // .map((valorActual, índice) => ...)
                                // → valorActual = undefined → no lo usamos → se llama "_"
                                // → índice = 0, 1, 2 → lo usamos como número de página
                                // → i + 1 → página 1, 2, 3
                                // -------------------------------------------------
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

            {/* MODAL: FORMULARIO DE NUEVA CITA */}
            {mostrarFormulario && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button 
                            className="btn-cerrar-modal" 
                            onClick={cerrarFormulario}
                        >
                            X
                        </button>
                        <SolicitarCitaCard onCitaCreada={handleCitaCreada} />
                        {/* → Pasa función para manejar éxito */}
                    </div>
                </div>
            )}

            {/* MODAL: ÉXITO */}
            {modalVisible && (
                <ModalCitaExitosa 
                    datosCita={datosCita} 
                    onClose={cerrarModal} 
                />
            )}
        </div>
    );
}