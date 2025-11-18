import "./ModalCitaEditada.css";
import React from "react";

const ModalCitaEditada = ({ datosCita, onClose }) => {
    if (!datosCita) return null;

    return (
        <div className="editada-overlay">
            <div className="editada-modal">
                <button className="editada-btn-cerrar" onClick={onClose}>
                    ×
                </button>

                <h2 className="editada-titulo">
                    {datosCita.tipo === "editada"
                        ? "Cita Editada Exitosamente"
                        : "Cita Creada Exitosamente"}
                </h2>

                <div className="editada-body">
                    <p><strong>Cliente:</strong> {datosCita.nombreCliente}</p>
                    <p><strong>Fecha:</strong> {new Date(datosCita.fecha).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p><strong>Hora:</strong> {datosCita.hora}</p>
                    <p><strong>Profesional:</strong> {datosCita.profesional}</p>
                    {datosCita.servicio && <p><strong>Servicio:</strong> {datosCita.servicio}</p>}
                    {datosCita.costo && <p><strong>Costo:</strong> ${datosCita.costo}</p>}
                    {datosCita.numeroReferencia && <p><strong>Referencia:</strong> {datosCita.numeroReferencia}</p>}

                    {datosCita.tipo === "editada" && (
                        <div className="editada-estados">
                            <p className="editada-estado">
                                <strong>Nuevo Estado Cita:</strong>
                                <span className={`editada-badge ${datosCita.estadoCita?.toLowerCase()}`}>
                                    {datosCita.estadoCita}
                                </span>
                            </p>
                            <p className="editada-estado">
                                <strong>Nuevo Estado Pago:</strong>
                                <span className={`editada-badge ${datosCita.estadoPago?.toLowerCase()}`}>
                                    {datosCita.estadoPago}
                                </span>
                            </p>
                        </div>
                    )}
                </div>

                <button className="editada-btn-aceptar" onClick={onClose}>
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default ModalCitaEditada;