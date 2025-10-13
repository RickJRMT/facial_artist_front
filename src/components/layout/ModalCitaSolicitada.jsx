import React from 'react';
import './ModalCitaSolicitada.css';
import nequiImg from '../../assets/img/metodospago/nequi.png';
import daviplataImg from '../../assets/img/metodospago/daviplata.png';
import daviviendaImg from '../../assets/img/metodospago/davivienda.png';
import bancolombiaImg from '../../assets/img/metodospago/bancolombia.png';
import transfiyaImg from '../../assets/img/metodospago/transfiya.png';

const ModalCitaExitosa = ({ datosCita = {}, onClose }) => {
    const { nombreCliente, fecha, hora, profesional, servicio, costo, numeroReferencia } = datosCita;

    return (
        <div className="modal-overlay">
            <div className="modal-contenido">
                <h2> ¡Cita solicitada con éxito!</h2>
                <p className="texto-importante">
                    Recuerda que debes pagar al menos el <strong>50%</strong> del valor del servicio para confirmar tu cita.
                </p>
                <div className="modal-secciones">
                    <div className="seccion-cita">
                        <h3> Detalles de la cita</h3>
                        <p><strong>Cliente:</strong> {nombreCliente}</p>
                        <p><strong>Fecha:</strong> {fecha}</p>
                        <p><strong>Hora:</strong> {hora}</p>
                        <p><strong>Profesional:</strong> {profesional}</p>
                        <p><strong>Servicio:</strong> {servicio}</p>
                        <p><strong>Costo del servicio:</strong> {costo}</p>
                        <p><strong>Número de referencia:</strong> {numeroReferencia}</p>
                    </div>

                    <div className="seccion-pagos">
                        <h3> Métodos de pago</h3>
                        <ul>
                            <li>
                                <img src={nequiImg} alt="Nequi" />
                                <span>300 123 4567</span>
                            </li>
                            <li>
                                <img src={daviplataImg} alt="Daviplata" />
                                <span>300 987 6543</span>
                            </li>
                            <li>
                                <img src={daviviendaImg} alt="Davivienda" />
                                <span>00123456789</span>
                            </li>
                            <li>
                                <img src={bancolombiaImg} alt="Bancolombia" />
                                <span>01234567890</span>
                            </li>
                            <li>
                                <img src={transfiyaImg} alt="Transfiya" />
                                <span>301 111 2233</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <button onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
};

export default ModalCitaExitosa;
