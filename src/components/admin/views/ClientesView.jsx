import React, { useState } from 'react';
import { Search, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import './ClientesView.css';
import ModalHojasVida from '../modals/ModalHojasVida';

const ClientesView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [pageInputValue, setPageInputValue] = useState('1');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [clientes, setClientes] = useState([
    {
      id: 1,
      nombre: 'María González',
      telefono: '+34 612 345 678',
      email: 'maria.gonzalez@email.com',
      historias: 2,
      fechaNacimiento: '1985-03-15',
      foto: 'https://i.pravatar.cc/150?img=1'
    },
    {
      id: 2,
      nombre: 'Carmen López',
      telefono: '+34 623 456 789',
      email: 'carmen.lopez@email.com',
      historias: 0,
      fechaNacimiento: '1990-07-22',
      foto: 'https://i.pravatar.cc/150?img=5'
    },
    {
      id: 3,
      nombre: 'Ana Rodríguez',
      telefono: '+34 634 567 890',
      email: 'ana.rodriguez@email.com',
      historias: 0,
      fechaNacimiento: '1988-11-10',
      foto: 'https://i.pravatar.cc/150?img=9'
    },
    {
      id: 4,
      nombre: 'Laura Martín',
      telefono: '+34 645 678 901',
      email: 'laura.martin@email.com',
      historias: 0,
      fechaNacimiento: '1992-02-28',
      foto: 'https://i.pravatar.cc/150?img=10'
    }
  ]);

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.telefono.includes(searchTerm) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lógica de paginación
  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClientes.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setPageInputValue(pageNumber.toString());
    }
  };

  const handlePageInputChange = (e) => {
    const value = e.target.value;
    setPageInputValue(value);
    
    const pageNumber = parseInt(value);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleVerHistorias = (cliente) => {
    setSelectedCliente(cliente);
    setModalOpen(true);
  };

  const handleEditarCliente = (cliente) => {
    alert(`Editar cliente: ${cliente.nombre}`);
  };

  const handleEliminarCliente = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      setClientes(clientes.filter(c => c.id !== id));
    }
  };

  return (
    <div className="clientes-container">
      {/* Header */}
      <div className="clientes-header">
        <div>
          <h1 className="clientes-title">Clientes</h1>
          <p className="clientes-subtitle">Gestión de clientes e historias clínicas</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar clientes por nombre, teléfono o email..."
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
          <table className="clientes-table">
            <thead>
              <tr className="table-header">
                <th>ID</th>
                <th>Foto</th>
                <th>Cliente</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>H/V</th>
                <th>Fecha Nacimiento</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((cliente) => (
                <tr key={cliente.id} className="table-row">
                  <td className="table-cell">{cliente.id}</td>
                  <td className="table-cell">
                    <div className="avatar-wrapper">
                      <img 
                        src={cliente.foto} 
                        alt={cliente.nombre}
                        className="avatar"
                      />
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="cliente-name">{cliente.nombre}</span>
                  </td>
                  <td className="table-cell">{cliente.telefono}</td>
                  <td className="table-cell">{cliente.email}</td>
                  <td className="table-cell">
                    <button 
                      className="btn-historias"
                      onClick={() => handleVerHistorias(cliente)}
                    >
                      <Eye size={16} />
                      <span>Ver ({cliente.historias})</span>
                    </button>
                  </td>
                  <td className="table-cell">{cliente.fechaNacimiento}</td>
                  <td className="table-cell">
                    <div className="action-buttons">
                      <button 
                        className="btn-edit"
                        onClick={() => handleEditarCliente(cliente)}
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleEliminarCliente(cliente.id)}
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

          {filteredClientes.length === 0 && (
            <div className="empty-state">
              <p>No se encontraron clientes</p>
            </div>
          )}
        </div>

        {/* Paginación */}
        {filteredClientes.length > 0 && (
          <div className="pagination">
            <button
              className="pagination-button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="page-numbers">
              <span>Página</span>
              <input
                type="text"
                value={pageInputValue}
                onChange={handlePageInputChange}
                className="page-input"
                onBlur={() => {
                  const pageNumber = parseInt(pageInputValue);
                  if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
                    setPageInputValue(currentPage.toString());
                  }
                }}
              />
              <span>de {totalPages}</span>
            </div>

            <button
              className="pagination-button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Modal de Hojas de Vida */}
      <ModalHojasVida
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        cliente={selectedCliente}
      />
    </div>
  );
};

export default ClientesView;