import React from 'react';
import { Home, Users, Scissors, Calendar, GraduationCap, UserCircle, LogOut as LogOutIcon } from 'lucide-react';
import './Sidebar.css';
import { Link } from "react-router-dom";

const Sidebar = ({ activeMenu, setActiveMenu, isOpen, onClose }) => {
  const menuItems = [
    { id: 'inicio', icon: Home, label: 'Inicio' },
    { id: 'clientes', icon: Users, label: 'Clientes' },
    { id: 'servicios', icon: Scissors, label: 'Servicios' },
    { id: 'citas', icon: Calendar, label: 'Citas' },
    { id: 'cursos', icon: GraduationCap, label: 'Cursos' },
    { id: 'profesionales', icon: UserCircle, label: 'Profesionales' },
    { id: 'agenda', icon: Calendar, label: 'Agenda' },
  ];

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
              onClose && onClose();
            }}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <button className="nav-item-logout" onClick={onClose}>
        <LogOutIcon size={20} />
      <Link to='/homecliente'><span>Salir</span></Link>  
      </button>
    </div>
  );
};

export default Sidebar;
