import Header from '../components/layout/Header_Cliente.jsx';
import Footer from '../components/layout/Footer_Cliente.jsx';
import fondo from '../assets/img/fondos/pruebaFondo.jpg';
import videoSrc from '../assets/videos/videoPresentacion.mp4';
import './homeCliente.css';
import botonImg from '../assets/img/stickers/compra.png';
import formularioImg from '../assets/img/stickers/formulario.png';
import pagoImg from '../assets/img/stickers/servicio-de-deuda.png';
import comprobanteImg from '../assets/img/stickers/factura.png';
import puntualidad from '../assets/img/stickers/negocio.png';
import deposito from '../assets/img/stickers/donacion.png';
import actualizar from '../assets/img/stickers/actualizar.png';
import devoluciones from '../assets/img/stickers/devoluciones-faciles.png';


const Homecliente = () => {
    return (
        <>
            <Header />
            <main>
                <div className="main_container">
                    <section className="seccion1">
                        <div className="overlay"></div>
                        <img
                            src={fondo}
                            alt="Imagen de fondo inicial"
                            className="imagenfondoinicial"
                        />
                        <div className="contenido">
                            <h1 className="titulo animar_entrada delay1">Natalia Salazar</h1>
                            <h2 className="subtitulo animar_entrada delay2">
                                Tratamientos profesionales de diseño de cejas, micropigmentación y labios perfectos.
                                Resultados armoniosos, personalizados y duraderos.
                            </h2>
                            <button className="btn_reservarcita animar_entrada delay3">Reservar cita</button>
                        </div>

                    </section>
                    <section className='seccion2'>
                        <div className='titulo2'> Sobre Nosotros</div>
                        <div className='seccion2_container'>
                            <div className='descripcion'> En Facial Artist nos especializamos en realzar tu belleza natural
                                a través de técnicas avanzadas y tratamientos personalizados. Ofrecemos servicios profesionales de micropigmentación de cejas,
                                perfilado de labios, lifting de pestañas y estética facial, combinando arte y precisión en cada detalle.
                            </div>
                            <div className='video'>
                                <video controls>
                                    <source src={videoSrc} type='video/mp4' />
                                </video>
                            </div>
                        </div>
                    </section>
                    <section className="seccion3">
                        <h1> aquí irán los servicios</h1>
                    </section>
                    <section className="seccion4">
                        <h1 className='titulo_seccion4'>Proceso de agendamiento</h1>
                        <div className="seccion4_container">
                            <div className="seccion4_item">
                                <div className="icono_circular">
                                    <img src={botonImg} alt="Reservar" />
                                </div>
                                <p>En el botón principal<br />de nuestra tienda haz clic en Reservar.</p>
                            </div>
                            <div className="seccion4_item">
                                <div className="icono_circular">
                                    <img src={formularioImg} alt="Formulario" />
                                </div>
                                <p>Llena nuestro<br />formulario para agendar tu cita.</p>
                            </div>
                            <div className="seccion4_item">
                                <div className="icono_circular">
                                    <img src={pagoImg} alt="Pago" />
                                </div>
                                <p>Paga al menos un<br />valor del 50% del costo del servicio.</p>
                            </div>
                            <div className="seccion4_item">
                                <div className="icono_circular">
                                    <img src={comprobanteImg} alt="Comprobante" />
                                </div>
                                <p>
                                    Envía el comprobante de pago<br />
                                    a nuestra línea&nbsp;
                                    <a
                                        href="https://wa.me/573001234567"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        WhatsApp
                                    </a> para confirmar tu cita.
                                </p>
                            </div>
                        </div>
                    </section>
                    <section className="seccion5">
                        <h1> Aquí irán los cursos</h1>
                    </section>
                    <section className="seccion6">
                        <h2 className="titulo_seccion6">Términos y condiciones</h2>
                        <div className="seccion6_container">
                            <div className="seccion6_item">
                                <div className="icono_circular">
                                    <img src={puntualidad} alt="Puntualidad" />
                                </div>
                                <p><strong>Puntualidad:</strong> Es fundamental que acudas puntualmente a tu cita. La puntualidad garantiza un excelente servicio. Si llegas más de 10 minutos tarde a la hora acordada, tu cita será cancelada automáticamente.</p>
                            </div>
                            <div className="seccion6_item">
                                <div className="icono_circular">
                                    <img src={deposito} alt="Depósito" />
                                </div>
                                <p><strong>Depósito:</strong> Para confirmar tu cita, debes realizar un depósito del 50% del valor total del servicio solicitado.</p>
                            </div>

                            <div className="seccion6_item">
                                <div className="icono_circular">
                                    <img src={actualizar} alt="Cancelaciones" />
                                </div>
                                <p><strong>Cancelaciones y Cambios:</strong> Debes notificar cualquier cambio o cancelación de tu cita con al menos 24 horas de anticipación. Esto nos permite reorganizar nuestro tiempo y ofrecer el espacio a otro cliente.</p>
                            </div>

                            <div className="seccion6_item">
                                <div className="icono_circular">
                                    <img src={devoluciones} alt="No Reembolsable" />
                                </div>
                                <p><strong>No Reembolsable:</strong> El depósito del 50% del servicio no es reembolsable si no asistes, llegas tarde o no cancelas con la debida anticipación (24 horas antes de la cita).</p>
                            </div>

                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Homecliente;