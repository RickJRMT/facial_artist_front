import React, { useState, useEffect } from 'react';
import { obtenerServicios, crearServicio } from '../../../Services/ServiciosConexion';
import { Search, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import CrearServicioModal from '../modals/CrearServicioModal';
import './ServiciosView.css';

/**
 * Componente principal para la gestión de servicios en el panel de administración
 * Permite listar, buscar, crear, editar y eliminar servicios
 */
const ServiciosView = () => {
  // Estados para el manejo de datos y UI
  const [searchTerm, setSearchTerm] = useState('');
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  /**
   * Efecto para cargar la lista de servicios al montar el componente
   */
  useEffect(() => {
    const fetchServicios = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await obtenerServicios();
        setServicios(data);
      } catch (err) {
        setError('Error al cargar los servicios');
      } finally {
        setLoading(false);
      }
    };
    fetchServicios();
  }, []);

  const filteredServicios = servicios.filter(servicio =>
    servicio.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    servicio.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNuevoServicio = () => {
    setModalOpen(true);
  };

  const handleSubmitServicio = async (formData) => {
    try {
      // Convertir los valores numéricos
      const servCosto = parseFloat(formData.precio);
      const servDuracion = parseInt(formData.duracion);

      // Validar que los valores numéricos sean válidos
      if (isNaN(servCosto) || isNaN(servDuracion)) {
        throw new Error('El costo y la duración deben ser valores numéricos válidos');
      }

      let servicioData = new FormData();

      // Agregar los campos básicos
      servicioData.append('servNombre', formData.nombre);
      servicioData.append('servDescripcion', formData.descripcion);
      servicioData.append('servCosto', servCosto);
      servicioData.append('servDuracion', servDuracion);

      // Si hay una imagen, procesarla
      if (formData.imagen) {
        servicioData.append('servImagen', formData.imagen);
      }

      // Convertir FormData a objeto regular
      const plainData = {};
      for (let [key, value] of servicioData.entries()) {
        plainData[key] = value;
      }

      // Si hay imagen, convertirla a base64
      if (formData.imagen) {
        const base64Image = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
          };
          reader.readAsDataURL(formData.imagen);
        });
        plainData.servImagen = base64Image;
      }

      
      await crearServicio(plainData);
      // Actualizar la lista de servicios
      const nuevosServicios = await obtenerServicios();
      setServicios(nuevosServicios);
      setModalOpen(false);
    } catch (error) {
      console.error('Error al crear el servicio:', error);
      alert('Error al crear el servicio. Por favor, intente nuevamente.');
    }
  };

  const handleVisualizar = (servicio) => {
    alert(`Visualizar servicio: ${servicio.nombre}`);
  };

  const handleEditarServicio = (servicio) => {
    alert(`Editar servicio: ${servicio.nombre}`);
  };

  const handleEliminarServicio = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      setServicios(servicios.filter(s => s.id !== id));
    }
  };

  return (
    <div className="servicios-container">
      {/* Header */}
      <div className="servicios-header">
        <div className="servicios-title-container">
          <h1 className="servicios-title">Servicios</h1>
          <p className="servicios-subtitle">Gestión de servicios y tratamientos</p>
        </div>
        <button className="btn-nuevo-servicio" onClick={handleNuevoServicio}>
          <Plus size={16} />
          <span>Nuevo Servicio</span>
        </button>
      </div>

      {/* Modal de Crear Servicio */}
      <CrearServicioModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitServicio}
      />

      {/* Search Bar */}
      <div className="servicios-search-section">
        <div className="servicios-search-bar">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar servicios..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Servicios Table */}
      <div className="table-card">
        <h3 className="table-title">Lista de Servicios</h3>
        <div className="table-wrapper">
          {loading ? (
            <div className="empty-state">
              <p>Cargando servicios...</p>
            </div>
          ) : error ? (
            <div className="empty-state">
              <p>{error}</p>
            </div>
          ) : (
            <>
              <table className="servicios-table">
                <thead>
                  <tr className="table-header">
                    <th>ID</th>
                    <th>Servicio</th>
                    <th>Descripción</th>
                    <th>Imagen</th>
                    <th>Costo (€)</th>
                    <th>Duración (min)</th>
                    <th>Opciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServicios.map((servicio) => (
                    <tr key={servicio.id} className="table-row">
                      <td>{servicio.id}</td>
                      <td>
                        <span className="servicio-nombre">{servicio.nombre}</span>
                      </td>
                      <td>
                        <span className="descripcion">{servicio.descripcion}</span>
                      </td>
                      <td>
                        <button 
                          className="btn-visualizar"
                          onClick={() => handleVisualizar(servicio)}
                        >
                          <Eye size={16} />
                          <span>Visualizar</span>
                        </button>
                      </td>
                      <td>
                        <span className="costo">€{servicio.costo}</span>
                      </td>
                      <td>
                        <span className="duracion">
                          {servicio.servDuracion}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-edit"
                            onClick={() => handleEditarServicio(servicio)}
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="btn-delete"
                            onClick={() => handleEliminarServicio(servicio.id)}
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredServicios.length === 0 && (
                <div className="empty-state">
                  <p>No se encontraron servicios</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiciosView;