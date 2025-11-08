import React, { useState, useEffect } from 'react';
import { Search, FileText } from 'lucide-react';
import './ClientesView.css';
import { useClientes } from '../../../hooks/CargarClientes';
import ModalHojasVida from '../modals/ModalHojasVida';

/**
 * Componente principal para la gestión de clientes en el panel de administración
 * Permite listar y buscar clientes
 */
const ClientesView = () => {
  // Custom hook para cargar clientes
  const { clientes, loading, error } = useClientes();
  
  // Estados para el manejo de UI
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalHVOpen, setModalHVOpen] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const itemsPerPage = 10;

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

  // Función para calcular la edad
  const calculateAge = (birthDate) => {
    if (!birthDate) return '-';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Función para manejar el cambio en el campo de búsqueda con validación
  const handleSearchChange = (e) => {
    const value = e.target.value;
    // Solo permitir letras, números y espacios
    const searchRegex = /^[a-zA-Z0-9\s]*$/;
    if (searchRegex.test(value)) {
      setSearchTerm(value);
    }
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
            onChange={handleSearchChange}
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
                    <th>Edad</th>
                    <th>Fecha Registro</th>
                    <th>Acciones</th>
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
                        <span className="edad">
                          {calculateAge(cliente.fechaNacCliente)} años
                        </span>
                  </td>
                      <td>
                        <span className="fecha-registro">
                          {formatDateTime(cliente.fechaRegistro)}
                        </span>
                  </td>
                      <td>
                        <button
                          className="btn-acciones-hv"
                          onClick={() => {
                            setClienteSeleccionado(cliente);
                            setModalHVOpen(true);
                          }}
                          title="Ver hojas de vida"
                        >
                          <FileText size={16} />
                          <span>Ver H/V</span>
                        </button>
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

      {/* Modal Hojas de Vida */}
      <ModalHojasVida
        isOpen={modalHVOpen}
        onClose={() => {
          setModalHVOpen(false);
          setClienteSeleccionado(null);
        }}
        cliente={clienteSeleccionado}
      />
    </div>
  );
};

export default ClientesView;