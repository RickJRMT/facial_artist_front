import { useState } from 'react';
import {Link} from 'react-router-dom';
import "../layout/Header.css";
import logo from '../../assets/img/logo_natalia.jpg';

const Header = () => {
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

    return (
        <header className="header">
            <div className="header__container">
                <div className="header__logo">
                    <img src={logo} alt="Logo Natalia" />
                </div>
                <nav className="header__nav">
                    <a href="#cursos" className="main-nav-link">Cursos y Servicios</a>
                    <div
                        className="header__nav-item"
                        onMouseEnter={() => setIsSubmenuOpen(true)}
                        onMouseLeave={() => setIsSubmenuOpen(false)}
                    >
                        <a href="#gestion" className="main-nav-link">Gestión de Citas</a>
                        {isSubmenuOpen && (
                            <ul className="header__submenu">
                                <li><a href="/consultar-cita">Consultar Cita</a></li>
                            <li><Link to="/cita">Solicitar Cita</Link></li>
                                <li><a href="/modificar-cita">Modificar Cita</a></li>
                                <li><a href="/cancelar-cita">Cancelar Cita</a></li>
                            </ul>
                        )}
                    </div>
                    <a href="#admin" className="main-nav-link">Iniciar Sesión Admin</a>
                </nav>
            </div>
        </header>
    );
};

export default Header;
