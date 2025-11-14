import React from 'react';
import { Edit, Trash2, Clock, Users, Calendar, Hash } from 'lucide-react';
import './CursoCard.css';

const CursoCard = ({ curso, onEditar, onEliminar }) => {
  // Función para convertir imagen LONGBLOB a URL
  const getImageUrl = (cursoImagen) => {
    if (!cursoImagen) {
      // Imagen por defecto si no hay imagen
      return 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80';
    }
    
    // Si ya es una URL, la devolvemos tal como está
    if (typeof cursoImagen === 'string' && cursoImagen.startsWith('http')) {
      return cursoImagen;
    }
    
    // Si es datos binarios, los convertimos a base64
    if (cursoImagen instanceof Uint8Array || Array.isArray(cursoImagen)) {
      const base64String = btoa(String.fromCharCode.apply(null, cursoImagen));
      return `data:image/jpeg;base64,${base64String}`;
    }
    
    // Si ya es base64, agregamos el prefijo si no lo tiene
    if (typeof cursoImagen === 'string' && !cursoImagen.startsWith('data:')) {
      return `data:image/jpeg;base64,${cursoImagen}`;
    }
    
    return cursoImagen;
  };

  // Función para formatear la fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return 'No especificada';
    
    try {
      const fechaObj = new Date(fecha);
      return fechaObj.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const handleEditar = () => {
    if (onEditar) {
      onEditar(curso);
    }
  };

  const handleEliminar = () => {
    if (onEliminar) {
      onEliminar(curso.id || curso.idCurso);
    }
  };

  return (
    <div className="curso-card-container">
      {/* Imagen del curso */}
      <div className="curso-card-imagen-wrapper">
        <img 
          src={getImageUrl(curso.imagen || curso.cursoImagen)} 
          alt={curso.nombre || curso.nombreCurso}
          className="curso-card-imagen"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80';
          }}
        />
        
        {/* Badge de precio */}
        <div className="curso-card-badge-precio">
          ${curso.precio || curso.costo || curso.cursoCosto || 0}
        </div>
        
        {/* Badge de estado */}
        <div className={`curso-card-badge-estado ${
          (curso.estado || curso.cursoEstado) === 'activo' 
            ? 'curso-card-badge-activo' 
            : 'curso-card-badge-inactivo'
        }`}>
          {curso.estado || curso.cursoEstado || 'activo'}
        </div>

        {/* Badge de ID */}
        <div className="curso-card-badge-id">
          <Hash size={12} />
          {curso.id || curso.idCurso}
        </div>
      </div>

      {/* Contenido del curso */}
      <div className="curso-card-content">
        <h3 className="curso-card-titulo">
          {curso.nombre || curso.nombreCurso}
        </h3>
        <p className="curso-card-descripcion">
          {curso.descripcion || curso.cursoDescripcion || 'Sin descripción disponible'}
        </p>

        {/* Metadata */}
        <div className="curso-card-metadata">
          <div className="curso-card-metadata-item">
            <Clock size={15} className="curso-card-metadata-icon" />
            <span>{curso.duracion || curso.cursoDuracion || 'No especificado'}</span>
          </div>
          <div className="curso-card-metadata-item">
            <Users size={15} className="curso-card-metadata-icon" />
            <span>Curso disponible</span>
          </div>
        </div>

        {/* Fecha de creación */}
        <div className="curso-card-fecha-creacion">
          <Calendar size={14} className="curso-card-fecha-icon" />
          <span className="curso-card-fecha-text">
            Creado: {formatearFecha(curso.fechaCreacion)}
          </span>
        </div>

        {/* Botones de acción */}
        <div className="curso-card-action-container">
          <button 
            className="curso-card-btn-editar"
            onClick={handleEditar}
          >
            <Edit size={16} />
            <span>Editar</span>
          </button>
          <button 
            className="curso-card-btn-eliminar"
            onClick={handleEliminar}
            title="Eliminar"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CursoCard;