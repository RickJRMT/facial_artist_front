import Header from '../components/layout/Header_Cliente.jsx';
import Footer from '../components/layout/Footer_Cliente.jsx';
import fondo from '../assets/img/fondos/pruebaFondo.jpg';
import videoSrc from '../assets/videos/videoPresentacion.mp4';
import './homeCliente.css';

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
                            <h1 className="titulo">Natalia Salazar</h1>
                            <h2 className="subtitulo">
                                Tratamientos profesionales de diseño de cejas, micropigmentación y labios perfectos.
                                Resultados armoniosos, personalizados y duraderos.
                            </h2>
                            <button className="btn_reservarcita">Reservar cita</button>
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
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Homecliente;