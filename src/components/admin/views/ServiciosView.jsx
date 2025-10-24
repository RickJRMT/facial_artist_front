import React, { useState, useEffect } from 'react';
import { obtenerServicios } from '../../../Services/ServiciosConexion';
import { Search, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import './ServiciosView.css';

const ServiciosView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    alert('Abrir formulario para nuevo servicio');
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
                    <th>Estado</th>
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
                        <span className={`badge ${servicio.estado === 'Activo' ? 'badge-activo' : 'badge-inactivo'}`}>
                          {servicio.estado}
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