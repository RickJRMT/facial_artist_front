import "./ModalCitaEditada.css";
import React from "react";

const ModalCitaEditada = ({ datosCita, onClose }) => {
    if (!datosCita) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="btn-cerrar-modal" onClick={onClose}>X</button>
                <h2>{datosCita.tipo === "editada" ? "Cita Editada Exitosamente" : "Cita Creada Exitosamente"}</h2>
                <div className="modal-body">
                    <p><strong>Cliente:</strong> {datosCita.nombreCliente}</p>
                    <p><strong>Fecha:</strong> {new Date(datosCita.fecha).toLocaleDateString()}</p>
                    <p><strong>Hora:</strong> {datosCita.hora}</p>
                    <p><strong>Profesional:</strong> {datosCita.profesional}</p>
                    {datosCita.servicio && <p><strong>Servicio:</strong> {datosCita.servicio}</p>}
                    {datosCita.costo && <p><strong>Costo:</strong> ${datosCita.costo}</p>}
                    {datosCita.numeroReferencia && <p><strong>Referencia:</strong> {datosCita.numeroReferencia}</p>}
                    {datosCita.tipo === "editada" && (
                        <>
                            <p><strong>Nuevo Estado Cita:</strong> {datosCita.estadoCita}</p>
                            <p><strong>Nuevo Estado Pago:</strong> {datosCita.estadoPago}</p>
                        </>
                    )}
                </div>
                <button className="btn-cerrar" onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
};

export default ModalCitaEditada;