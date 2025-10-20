// src/components/layout/ModalErrorEdad.jsx
import "./Modaledad.css";
import restriccionImg from '../../assets/img/stickers/restriccion.png';


const ModalErrorTelefono= ({ onClose }) => {
    return (
        <div className="modal-edad-overlay">
            <div className="modal-edad-contenido">
                <h2 className="modal-edad-titulo">Error</h2>
                <div className="modal-edad-img">
                    <img src={restriccionImg} alt="Imagen de restricción" className="modal-edad-img-tag" />
                </div>
                <p className="modal-edad-texto">El Telefono debe tener al menos 10 caracteres.</p>
                <button className="modal-edad-boton" onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
};

export default ModalErrorTelefono;