import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import './ClientesView.css';

/**
 * Componente principal para la gestión de clientes en el panel de administración
 * Permite listar y buscar clientes
 */
const ClientesView = () => {
  // Estados para el manejo de datos y UI
  const [searchTerm, setSearchTerm] = useState('');
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Datos de ejemplo basados en la estructura de la base de datos
  const [clientesData] = useState([
    {
      idCliente: 1,
      nombreCliente: 'María González',
      celularCliente: '+57 300 123 4567',
      fechaNacCliente: '1985-03-15',
      fechaRegistro: '2024-01-15 10:30:00'
    },
    {
      idCliente: 2,
      nombreCliente: 'Carmen López',
      celularCliente: '+57 301 234 5678',
      fechaNacCliente: '1990-07-22',
      fechaRegistro: '2024-01-20 14:15:00'
    },
    {
      idCliente: 3,
      nombreCliente: 'Ana Rodríguez',
      celularCliente: '+57 302 345 6789',
      fechaNacCliente: '1988-11-10',
      fechaRegistro: '2024-02-01 09:45:00'
    },
    {
      idCliente: 4,
      nombreCliente: 'Laura Martín',
      celularCliente: '+57 303 456 7890',
      fechaNacCliente: '1992-02-28',
      fechaRegistro: '2024-02-10 16:20:00'
    },
    {
      idCliente: 5,
      nombreCliente: 'Sofia García',
      celularCliente: '+57 304 567 8901',
      fechaNacCliente: '1995-05-12',
      fechaRegistro: '2024-02-15 11:30:00'
    },
    {
      idCliente: 6,
      nombreCliente: 'Isabella Torres',
      celularCliente: '+57 305 678 9012',
      fechaNacCliente: '1987-09-08',
      fechaRegistro: '2024-02-20 13:45:00'
    }
  ]);

  /**
   * Efecto para cargar la lista de clientes al montar el componente
   */
  useEffect(() => {
    const fetchClientes = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simular carga de datos
        await new Promise(resolve => setTimeout(resolve, 1000));
        setClientes(clientesData);
      } catch (err) {
        setError('Error al cargar los clientes');
      } finally {
        setLoading(false);
      }
    };
    fetchClientes();
  }, [clientesData]);

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombreCliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.celularCliente?.includes(searchTerm)
  );

  // Calcular la paginación
  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClientes = filteredClientes.slice(startIndex, endIndex);

  // Resetear página cuando cambia el filtro de búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Funciones de paginación
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Scroll hacia arriba de la tabla
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="pagination-btn"
        >
          1
        </button>
      );
      if (start > 2) {
        buttons.push(
          <span key="ellipsis-start" className="pagination-ellipsis">
            ...
          </span>
        );
      }
    }

    for (let i = start; i <= end; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        buttons.push(
          <span key="ellipsis-end" className="pagination-ellipsis">
            ...
          </span>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="pagination-btn"
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO');
  };

  // Función para formatear fecha y hora
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '-';
    const date = new Date(dateTimeString);
    return date.toLocaleString('es-CO');
  };

  return (
    <div className="clientes-container">
      {/* Header */}
      <div className="clientes-header">
        <div className="clientes-title-container">
          <h1 className="clientes-title">Clientes</h1>
          <p className="clientes-subtitle">Listado de clientes registrados</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="clientes-search-section">
        <div className="clientes-search-bar">
          <input
            type="text"
            placeholder="Buscar clientes por nombre o celular..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Clientes Table */}
      <div className="table-card">
        <h3 className="table-title">Lista de Clientes</h3>
        <div className="table-wrapper">
          {loading ? (
            <div className="empty-state">
              <p>Cargando clientes...</p>
            </div>
          ) : error ? (
            <div className="empty-state">
              <p>{error}</p>
            </div>
          ) : (
            <>
          <table className="clientes-table">
            <thead>
              <tr className="table-header">
                <th>ID</th>
                    <th>Nombre</th>
                    <th>Celular</th>
                <th>Fecha Nacimiento</th>
                    <th>Fecha Registro</th>
              </tr>
            </thead>
            <tbody>
                  {currentClientes.map((cliente) => (
                    <tr key={cliente.idCliente} className="table-row">
                      <td>{cliente.idCliente}</td>
                      <td>
                        <span className="cliente-nombre">{cliente.nombreCliente}</span>
                  </td>
                      <td>
                        <span className="celular">{cliente.celularCliente}</span>
                  </td>
                      <td>
                        <span className="fecha-nacimiento">
                          {formatDate(cliente.fechaNacCliente)}
                        </span>
                  </td>
                      <td>
                        <span className="fecha-registro">
                          {formatDateTime(cliente.fechaRegistro)}
                        </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredClientes.length === 0 && (
            <div className="empty-state">
              <p>No se encontraron clientes</p>
            </div>
          )}
            </>
          )}
        </div>
        </div>

        {/* Paginación */}
      {!loading && !error && filteredClientes.length > 0 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Mostrando {startIndex + 1} - {Math.min(endIndex, filteredClientes.length)} de {filteredClientes.length} clientes
          </div>
          <div className="pagination-controls">
            <button
              className="pagination-btn pagination-nav"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            {renderPaginationButtons()}
            <button
              className="pagination-btn pagination-nav"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
          </div>
        )}
    </div>
  );
};

export default ClientesView;