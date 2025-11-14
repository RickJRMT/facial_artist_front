import React, { useState } from 'react';
import { Search, Plus, Loader2 } from 'lucide-react';
import './CursosView.css';
import { UseCursos } from '../../../hooks/CargarCursos';
import { eliminarCurso, crearCurso } from '../../../Services/cursosConexion';
import CursoCard from '../CursoCard';
import ModalCrearCurso from '../modals/ModalCrearCurso';

const CursosView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const { cursos, loading, error, recargarCursos } = UseCursos();



  const filteredCursos = cursos.filter(curso =>
    (curso.nombre || curso.nombreCurso || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (curso.descripcion || curso.cursoDescripcion || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNuevoCurso = () => {
    setModalCrearOpen(true);
  };

  const handleCrearCurso = async (formData) => {
    try {
      // Preparar los datos para enviar al backend
      const cursoData = {
        nombreCurso: formData.nombre,
        cursoDescripcion: formData.descripcion,
        cursoDuracion: formData.duracion,
        cursoCosto: formData.costo, // Ya viene como número desde el modal
        cursoEstado: formData.estado || 'activo'
      };

      // Si hay imagen, ya viene como base64 desde el modal
      if (formData.imagen) {
        const base64String = formData.imagen.split(',')[1]; // Remover el prefijo data:image
        cursoData.cursoImagen = base64String;
      }

      await crearCurso(cursoData);
      recargarCursos();
      alert('Curso creado exitosamente');
    } catch (error) {
      console.error('Error al crear curso:', error);
      alert('Error al crear el curso. Inténtalo de nuevo.');
    }
  };

  const handleEditarCurso = (curso) => {
    alert(`Editar curso: ${curso.nombre}`);
  };

  const handleEliminarCurso = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este curso?')) {
      try {
        await eliminarCurso(id);
        // Recargar la lista de cursos después de eliminar
        recargarCursos();
        alert('Curso eliminado exitosamente');
      } catch (error) {
        if (error.code === 'ACTIVE_STUDENTS') {
          alert('No se puede eliminar el curso porque tiene estudiantes inscritos');
        } else {
          alert('Error al eliminar el curso. Inténtalo de nuevo.');
        }
        console.error('Error al eliminar curso:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-cursos-view-container">
        <div className="admin-cursos-view-loading">
          <Loader2 size={32} className="admin-cursos-view-loading-spinner" />
          <p>Cargando cursos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-cursos-view-container">
        <div className="admin-cursos-view-error">
          <p>Error al cargar los cursos. Por favor, inténtalo de nuevo.</p>
          <button 
            onClick={recargarCursos}
            className="admin-cursos-view-btn-reintentar"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-cursos-view-container">
      {/* Header */}
      <div className="admin-cursos-view-header-section">
        <div className="admin-cursos-view-title-container">
          <h1 className="admin-cursos-view-title">Cursos</h1>
          <p className="admin-cursos-view-subtitle">Gestión de cursos y formaciones ({cursos.length} cursos)</p>
        </div>
        <button className="admin-cursos-view-btn-nuevo-curso" onClick={handleNuevoCurso}>
          <Plus size={18} />
          <span>Nuevo Curso</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="admin-cursos-view-search-section">
        <div className="admin-cursos-view-search-bar">
          <Search size={18} className="admin-cursos-view-search-icon" />
          <input
            type="text"
            placeholder="Buscar cursos por nombre o descripción..."
            className="admin-cursos-view-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content Card with Scroll */}
      <div className="admin-cursos-view-card">
        <h3 className="admin-cursos-view-card-title">
          Lista de Cursos ({filteredCursos.length})
        </h3>
        
        <div className="admin-cursos-view-wrapper">
          {/* Cursos Grid */}
          <div className="admin-cursos-view-cursos-grid">
            {filteredCursos.map((curso) => (
              <CursoCard
                key={curso.id || curso.idCurso}
                curso={curso}
                onEditar={handleEditarCurso}
                onEliminar={handleEliminarCurso}
              />
            ))}

            {filteredCursos.length === 0 && (
              <div className="admin-cursos-view-empty-state">
                <p>No se encontraron cursos</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Crear Curso */}
      <ModalCrearCurso
        isOpen={modalCrearOpen}
        onClose={() => setModalCrearOpen(false)}
        onSave={handleCrearCurso}
      />
    </div>
  );
};

export default CursosView;