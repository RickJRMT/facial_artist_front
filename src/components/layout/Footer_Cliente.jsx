import React from 'react';
import './Footer_Cliente.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">

        {/* SOBRE NOSOTROS */}
        <div className="footer__column">
          <h3>Sobre Natalia</h3>
          <p>
            Artista profesional de maquillaje y cuidado estético. Te ayudamos a resaltar tu belleza natural con técnicas modernas y atención personalizada.
          </p>
        </div>

        {/* MENÚ */}
        <div className="footer__column">
          <h3>Enlaces</h3>
          <ul>
            <li><a href="#cursos">Cursos & Servicios</a></li>
            <li><a href="#galeria">¿Cómo agendar tu cita? </a></li>
            <li><a href="#citas">Agendar Cita</a></li>
            <li><a href="#citas">Modificar cita</a></li>
            <li><a href="#citas">Cancelar cita</a></li>
          </ul>
        </div>

        {/* CONTACTO Y REDES */}
        <div className="footer__column">
          <h3>Contacto</h3>
          <ul>
            <li><i className="fas fa-phone"></i> 316 8978439</li>
            <li><i className="fas fa-envelope"></i> contacto@nataliasalazar.com</li>
            <li><i className="fab fa-instagram"></i> @NataliaSalazar</li>
            <li><i className="fab fa-facebook-f"></i> NataliaSalazar</li>
          </ul>
        </div>

        {/* MAPA */}
        <div className="footer__column footer__mapa">
          <h3>Encuéntranos</h3>
          <iframe
            title="Mapa"
            src="https://www.google.com/maps/embed?pb=!4v1759887707801!6m8!1m7!1sY-2ODi86IAUPxzMbOgEaMA!2m2!1d3.529039843138057!2d-76.28172562113376!3f219.86907878266993!4f3.397343965338706!5f0.7820865974627469"
            width="100%"
            height="150"
            style={{ border: 0, borderRadius: '8px' }}
            allow="fullscreen"
            loading="lazy"
            referrerPolicy='no-referrer-when-downgrade'
          ></iframe>
        </div>

      </div>

      <div className="footer__bottom">
        © 2025 Natalia Salazar | Social Artist · Todos los derechos reservados
      </div>
    </footer>
  );
};

export default Footer;
