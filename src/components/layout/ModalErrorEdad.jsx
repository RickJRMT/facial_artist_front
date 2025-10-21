// src/components/layout/ModalErrorEdad.jsx
import "./Modaledad.css"; 
import restriccionImg from '../../assets/img/stickers/restriccion.png';


const ModalErrorEdad = ({ onClose }) => {
  return (
   <div className="modal-edad-overlay">
  <div className="modal-edad-contenido">
    <h2 className="modal-edad-titulo">Error</h2>
    <div className="modal-edad-img">
      <img src={restriccionImg} alt="Imagen de restricción" className="modal-edad-img-tag" />
    </div>
    <p className="modal-edad-texto">Lo siento, debes tener al menos 18 años para solicitar este servicio.</p>
    <button className="modal-edad-boton" onClick={onClose}>Cerrar</button>
  </div>
</div>

  );
};

export default ModalErrorEdad;
