import { useState } from "react";
import { Link } from "react-router-dom";
import "../layout/Header.css";
import logo from "../../assets/img/logo_natalia.jpg";

const Header = () => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">
       <Link to ='/homecliente'> <img src={logo} alt="Logo Natalia"/> </Link>   
        </div>
        <nav className="header__nav">
          <a href="#cursos" className="main-nav-link">
            Cursos y Servicios
          </a>
          <div
            className="header__nav-item"
            onMouseEnter={() => setIsSubmenuOpen(true)}
            onMouseLeave={() => setIsSubmenuOpen(false)}
          >
            <a href="#gestion" className="main-nav-link">
              Gestión de Citas
            </a>
            {isSubmenuOpen && (
              <ul className="header__submenu">
                <li>
                  <a href="#">Consultar Cita</a>
                </li>
                <li>
                  <Link to="/cita">Solicitar Cita</Link>
                </li>
                <li>
                  <a href="#">Modificar Cita</a>
                </li>
                <li>
                  <a href="#">Cancelar Cita</a>
                </li>
              </ul>
            )}
          </div>
          <Link to="/admin" className="main-nav-link">
            {" "}
            iniciar sesión{" "}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
