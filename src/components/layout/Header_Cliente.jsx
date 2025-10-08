import React from 'react';
import "../layout/Header.css"; 
import logo from '../../assets/img/logo_natalia.jpg'; 
const Header = () => {
    return (
        <header className="header">
            <div className="header__container">
                <div className="header__logo">
            <img src={logo} alt="Descripción de la imagen"/>
                </div>
                <nav className="header__nav">
                    <a href="#cursos">Cursos y Servicios</a>
                    <a href="#gestion">Gestión de Citas</a>
                    <a href="#admin">Iniciar Sesión Admin</a>
                </nav>
            </div>
        </header>
    );
};

export default Header;
