import React, { useState } from "react";
import "./CitasAdmin.css";
import SolicitarCitaCard from "../../pages/SolicitarCitaAdmin.jsx";

export default function CitasAdmin() {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const cerrarFormulario = () => {
        setMostrarFormulario(false);
    };

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
                <input type="text" placeholder="Buscar por cliente..." />
                <select>
                    <option>Filtrar por profesional</option>
                </select>
                <select>
                    <option>Estado de pago</option>
                </select>
            </div>
            {mostrarFormulario && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="btn-cerrar-modal" onClick={cerrarFormulario}>
                            ✕
                        </button>
                        <SolicitarCitaCard />
                    </div>
                </div>
            )}
        </div>
    );
}
