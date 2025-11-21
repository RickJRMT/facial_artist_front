import React from 'react';
import { Home, Users, Scissors, Calendar, GraduationCap, UserCircle, LogOut as LogOutIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Sidebar.css';

const Sidebar = ({ activeMenu, setActiveMenu, isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // ← Usamos el logout del contexto

  const menuItems = [
    { id: 'inicio', icon: Home, label: 'Inicio' },
    { id: 'clientes', icon: Users, label: 'Clientes' },
    { id: 'servicios', icon: Scissors, label: 'Servicios' },
    { id: 'citas', icon: Calendar, label: 'Citas' },
    { id: 'cursos', icon: GraduationCap, label: 'Cursos' },
    { id: 'profesionales', icon: UserCircle, label: 'Profesionales' },
    { id: 'agenda', icon: Calendar, label: 'Agenda' },
  ];

  const handleLogout = () => {
    logout();                    // Borra token y user de localStorage
    if (onClose) onClose();      // Cierra el sidebar (importante en móvil)
    navigate('/homecliente');    // Redirige al home público
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-circle">N</div>
        <span className="logo-text">Natalia Facial Artist</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeMenu === item.id ? 'nav-item-active' : ''}`}
            onClick={() => {
              setActiveMenu(item.id);
              onClose?.();
            }}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Botón Salir CORRECTO */}
      <button className="nav-item-logout" onClick={handleLogout}>
        <LogOutIcon size={20} />
        <span>Salir</span>
      </button>
    </div>
  );
};

export default Sidebar;