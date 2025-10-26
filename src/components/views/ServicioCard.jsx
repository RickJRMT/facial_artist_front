import React, { useState } from 'react';
import { UseServicios } from '../../hooks/CargarServicios';
import './ServicioCard.css';

const ServicioCard = ({ servicio }) => {
    // Formatear el costo como moneda colombiana
    const formatearCosto = (costo) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(costo);
    };

    // Manejar la imagen si viene en base64
    const obtenerUrlImagen = (imagen) => {
        if (!imagen) return null;
        if (imagen.startsWith('data:image')) {
            return imagen;
        }
        return `data:image/jpeg;base64,${imagen}`;
    };

    const urlImagen = obtenerUrlImagen(servicio.imagen);

    return (
        <div className="servicio-card">
            {urlImagen && (
                <div className="servicio-card-imagen">
                    <img src={urlImagen} alt={servicio.nombre} />
                </div>
            )}
            <div className="servicio-card-contenido">
                <h3 className="servicio-card-titulo">{servicio.nombre}</h3>
                <p className="servicio-card-descripcion">{servicio.descripcion}</p>
                <div className="servicio-card-datos">
                    <div className="servicio-card-info">
                        <span className="servicio-card-label">Duración:</span>
                        <span className="servicio-card-valor">{servicio.servDuracion} min</span>
                    </div>
                    <div className="servicio-card-info">
                        <span className="servicio-card-label">Precio:</span>
                        <span className="servicio-card-precio">{formatearCosto(servicio.costo)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ServicioCardGrid = () => {
    const { servicios } = UseServicios();
    const [mostrarTodos, setMostrarTodos] = useState(false);
    const LIMITE_INICIAL = 6;

    if (!servicios || servicios.length === 0) {
        return (
            <div className="servicios-vacio">
                <p>No hay servicios disponibles en este momento.</p>
            </div>
        );
    }

    // Determinar qué servicios mostrar
    const serviciosAMostrar = mostrarTodos ? servicios : servicios.slice(0, LIMITE_INICIAL);
    const hayMasServicios = servicios.length > LIMITE_INICIAL;

    return (
        <>
            <div className="servicios-grid">
                {serviciosAMostrar.map((servicio) => (
                    <ServicioCard key={servicio.id} servicio={servicio} />
                ))}
            </div>
            {hayMasServicios && !mostrarTodos && (
                <div className="servicios-ver-mas">
                    <button 
                        className="btn-ver-mas"
                        onClick={() => setMostrarTodos(true)}
                    >
                        Ver Todos los Servicios ({servicios.length - LIMITE_INICIAL} más)
                    </button>
                </div>
            )}
            {mostrarTodos && hayMasServicios && (
                <div className="servicios-ver-mas">
                    <button 
                        className="btn-ver-mas"
                        onClick={() => setMostrarTodos(false)}
                    >
                        Ver Menos
                    </button>
                </div>
            )}
        </>
    );
};

export default ServicioCardGrid;
export { ServicioCard };
