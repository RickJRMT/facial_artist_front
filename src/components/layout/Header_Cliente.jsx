// Importa hooks y utilidades necesarias
import { useState } from "react";                 // useState permite manejar estados locales dentro del componente
import { Link } from "react-router-dom";          // Link se usa para navegar entre rutas sin recargar la página
import { consultarCita } from "../../Services/citasClientesConexion"; // Función que consulta citas en el backend
import axios from "axios";                        // Librería para hacer solicitudes HTTP
import "../layout/Header.css";                    // Archivo CSS con los estilos del header
import logo from "../../assets/img/logo_natalia.jpg"; // Logo de la empresa o marca
import ModalLogin from './ModalLogin.jsx';         // Componente modal para login de administrador

// Componente principal del encabezado
const Header = () => {

  // === Declaración de estados ===
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false); // Controla si el submenú "Gestión de Citas" está visible
  const [isModalOpen, setIsModalOpen] = useState(false);     // Controla si el modal de "Consultar Cita" está abierto
  const [isDetalleOpen, setIsDetalleOpen] = useState(false); // Controla si el modal de detalles de cita está abierto
  const [celular, setCelular] = useState("");                // Guarda el número de teléfono ingresado por el usuario
  const [referencia, setReferencia] = useState("");          // Guarda el número de referencia de la cita
  const [error, setError] = useState("");                    // Muestra mensajes de error al usuario si algo falla
  const [loading, setLoading] = useState(false);             // Indica si la aplicación está procesando la búsqueda
  const [cita, setCita] = useState(null);                    // Guarda los datos completos de la cita encontrada
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // Controla si el modal de login está abierto
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Controla el responsivo para dispositivos mobiles

  // === Función para manejar la consulta de una cita ===
  const handleConsultar = async (e) => {
    e.preventDefault();          // Evita que el formulario recargue la página al enviarse
    setLoading(true);            // Activa el estado de "cargando"
    setError("");                // Limpia cualquier error previo

    try {
      // Llama al servicio que consulta la cita según celular y referencia
      const citaData = await consultarCita(celular, referencia);

      // Si no se encontró la cita, muestra un mensaje de error y detiene la carga
      if (!citaData) {
        setError("No se encontró ninguna cita con esos datos.");
        setLoading(false);
        return;
      }

      // Si sí existe, se obtiene la información completa desde el backend usando axios
      const res = await axios.get(
        `http://localhost:3000/api/citas/referencia/${citaData.numeroReferencia}`
      );

      // Guarda los datos de la cita en el estado
      setCita(res.data);

      // Cierra el modal de consulta y abre el modal con los detalles
      setIsModalOpen(false);
      setIsDetalleOpen(true);

    } catch (err) {
      // Si ocurre un error (por ejemplo, el servidor no responde)
      setError("Error al consultar. Verifica los datos.");
      console.error(err);
    } finally {
      // En todos los casos, detiene el estado de carga
      setLoading(false);
    }
  };

  // === Función para cerrar el modal de detalle ===
  const closeDetalle = () => {
    setIsDetalleOpen(false); // Cierra el modal
    setCita(null);           // Limpia la información de la cita
    setCelular("");          // Limpia los campos del formulario
    setReferencia("");
  };
  const handleCelularChange = (e) => {
    const valor = e.target.value;

    // Elimina cualquier carácter que no sea número
    const soloNumeros = valor.replace(/\D/g, "");

    // Limita a 10 dígitos
    if (soloNumeros.length <= 10) {
      setCelular(soloNumeros);
    }
  };
  const handleReferenciaChange = (e) => {
    const valor = e.target.value;

    // Elimina cualquier carácter que no sea número
    const soloNumeros = valor.replace(/\D/g, "");

    // Limita a 10 dígitos
    if (soloNumeros.length <= 10) {
      setReferencia(soloNumeros);
    }
  };
  // Función para cerrar el modal de consulta y limpiar datos
  const closeModal = () => {
    setIsModalOpen(false);  // Cierra el modal
    setCelular("");          // Limpia el campo de celular
    setReferencia("");       // Limpia el campo de referencia
    setError("");            // Limpia cualquier mensaje de error
    setLoading(false);       // Asegura que loading esté en false
  };

  return (
    <header className="header">
      {/* Contenedor principal del encabezado */}
      <div className="header__container">
        {/* Logo que redirige al home del cliente */}
        <div className="header__logo">
          <Link to="/homecliente">
            <img src={logo} alt="Logo Natalia" />
          </Link>
        </div>

        {/* Botón hamburguesa visible solo en móvil */}
        <button
          className={`header__mobile-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Menú de navegación principal */}
        <nav className={`header__nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>

          {/* 1. Cursos y Servicios */}
          <a
            href="#cursos"
            className="main-nav-link"
            onClick={() => setIsMobileMenuOpen(false)}   // ← Cierra menú al hacer clic
          >
            Cursos y Servicios
          </a>

          {/* 2. Gestión de Citas (con submenú) */}
          <div className="header__nav-item">
            <a
              href="#gestion"
              className="main-nav-link"
              onClick={(e) => e.preventDefault()}   // Evita scroll innecesario
            >
              Gestión de Citas
            </a>

            {/* Submenú */}
            <ul className="header__submenu">
              <li>
                {/* Opción 1: Abrir modal de Consultar Cita */}
                <button
                  className="submenu-link"
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsMobileMenuOpen(false);   // ← Cierra menú móvil
                  }}
                >
                  Consultar Cita
                </button>
              </li>

              <li>
                {/* Opción 2: Ir a Solicitar Cita */}
                <Link
                  to="/cita"
                  className="submenu-link"
                  onClick={() => setIsMobileMenuOpen(false)}   // ← Cierra menú
                >
                  Solicitar Cita
                </Link>
              </li>

              <li>
                {/* Futuras opciones (puedes convertir a Link o button después) */}
                <a href="#" className="submenu-link" onClick={() => setIsMobileMenuOpen(false)}>
                  Modificar Cita
                </a>
              </li>
              <li>
                <a href="#" className="submenu-link" onClick={() => setIsMobileMenuOpen(false)}>
                  Cancelar Cita
                </a>
              </li>
            </ul>
          </div>

          {/* 3. Iniciar sesión Administrador */}
          <Link
            to="#"
            className="main-nav-link btn-admin-login"
            onClick={(e) => {
              e.preventDefault();
              setIsLoginModalOpen(true);
              setIsMobileMenuOpen(false);   // ← Cierra menú móvil
            }}
          >
            Iniciar sesión Administrador
          </Link>
        </nav>

        {/* Menú de navegación principal */}
        <nav className="header__nav">
          {/* Enlace simple a la sección de cursos */}
          <a href="#cursos" className="main-nav-link">
            Cursos y Servicios
          </a>

          {/* Menú desplegable para gestión de citas */}
          <div
            className="header__nav-item"
            onMouseEnter={() => setIsSubmenuOpen(true)}   // Abre el submenú al pasar el mouse
            onMouseLeave={() => setIsSubmenuOpen(false)}  // Lo cierra al salir
          >
            <a href="#gestion" className="main-nav-link">
              Gestión de Citas
            </a>

            {/* Submenú visible solo si isSubmenuOpen = true */}
            {isSubmenuOpen && (
              <ul className="header__submenu">
                <li>
                  {/* Botón que abre el modal de consulta */}
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="submenu-link"
                  >
                    Consultar Cita
                  </button>
                </li>
                <li>
                  {/* Enlace a la página de solicitud de cita */}
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

          {/* Botón que abre el modal de login en lugar de ir directo a /admin */}
          <Link
            to="#"   // o to="/admin" (da igual, lo vamos a prevenir)
            className="main-nav-link btn-admin-login"
            onClick={(e) => {
              e.preventDefault();               // Evita que navegue
              setIsLoginModalOpen(true);        // Abre el modal
            }}
          >
            Iniciar sesión Administrador
          </Link>
        </nav>
      </div>

      {/* Overlay cuando el menú móvil está abierto */}
      {isMobileMenuOpen && (
        <div
          className="header__mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* === Modal de consulta de cita === */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div
            className="modal-content-header"
            onClick={(e) => e.stopPropagation()} // Mantén esto para prevenir propagación
          >
            <h2>Consultar Cita</h2>

            {/* Formulario de búsqueda */}

            <form onSubmit={handleConsultar}>
              {/* Campo de teléfono con validación */}
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="text"
                  inputMode="numeric" // Muestra teclado numérico en móviles
                  value={celular}
                  onChange={handleCelularChange}
                  placeholder="Ej: 3001234567"
                  maxLength="10" // Evita más de 10 caracteres
                  required
                />
              </div>

              {/* === Campo para número de referencia === */}
              <div className="form-group">
                <label>Número de Referencia</label>
                <input
                  type="text"
                  inputMode="numeric" // Muestra teclado numérico en móviles
                  value={referencia}
                  onChange={handleReferenciaChange} // Usa nueva función que valida solo 10 dígitos
                  placeholder="Ej: 1762436837"
                  maxLength="10"
                  required
                />
              </div>

              {/* Mensaje de error si existe */}
              {error && <p className="error">{error}</p>}

              {/* Botones del modal */}
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-cancel"
                >
                  Cancelar
                </button>
                {/* Botón que envía el formulario (consulta la cita) */}
                <button
                  type="submit"
                  disabled={celular.length !== 10 || referencia.length !== 10 || loading}// Deshabilitado si faltan datos o está cargando
                  className="btn-consultar"
                >
                  {loading ? "Buscando..." : "Consultar"} {/* Muestra texto dinámico */}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* === Modal que muestra los detalles de la cita === */}
      {isDetalleOpen && cita && (
        <div className="modal-overlay" onClick={closeDetalle}>
          <div
            className="modal-content-header detalle-modal"
            onClick={(e) => e.stopPropagation()} // Evita cierre accidental al hacer clic dentro
          >
            <h2>Detalles de tu Cita</h2>

            {/* Tarjeta con la información completa de la cita */}
            <div className="cita-card">
              <p><strong>Cliente:</strong> {cita.nombreCliente}</p>
              <p><strong>Teléfono:</strong> {cita.celularCliente}</p>
              <p><strong>Servicio:</strong> {cita.servNombre} ({cita.servDuracion} min)</p>
              <p><strong>Profesional:</strong> {cita.nombreProfesional}</p>
              <p><strong>Fecha:</strong> {cita.fechaCitaFormateada}</p>
              <p><strong>Hora:</strong> {cita.horaCita} - {cita.fin_cita}</p>
              <p><strong>Referencia:</strong> {cita.numeroReferencia}</p>
            </div>

            {/* Botón para cerrar el modal de detalles */}
            <div className="modal-actions">
              <button onClick={closeDetalle} className="btn-cancel">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de Login Administrador */}
      <ModalLogin
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </header>
  );
};


export default Header;
