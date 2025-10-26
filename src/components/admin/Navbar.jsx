import React from 'react';
import { UserCircle, Menu } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ onMenuClick }) => {
  return (
    <div className="navbar">
      <button className="menu-toggle" onClick={onMenuClick}>
        <Menu size={20} />
      </button>
      <div className="user-profile">
        <div className="user-avatar">
          <UserCircle size={24} />
        </div>
        <span className="user-name">Usuario administrador</span>
      </div>
    </div>
  );
};

export default Navbar;
