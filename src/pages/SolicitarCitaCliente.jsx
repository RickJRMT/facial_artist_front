import React, { useState, useEffect } from 'react';
import './SolicitarCitaCliente.css';
import Header from '../components/layout/Header_Cliente.jsx';
import Footer from '../components/layout/Footer_Cliente.jsx';
import { useResumenCita } from '../hooks/Solicitar_Cita_Cliente.jsx';
import { crearCita } from '../services/citasClientesConexion';
import { obtenerProfesionales } from '../Services/profesionalesConexion.js';
import { obtenerServicios } from '../Services/ServiciosConexion.js';
import CalendarioCitas from '../components/layout/calendarioCitas.jsx';
import { useValidacionFormulario } from '../hooks/ValidarFormCitaCliente.jsx';

const SolicitarCitaPage = () => {
  const { formData, handleInputChange, limpiarFormulario } = useValidacionFormulario();
  const { resumen, actualizarResumen } = useResumenCita();
  const [profesionales, setProfesionales] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [idProfesional, setIdProfesional] = useState('');
  const [idServicio, setIdServicio] = useState('');

  // Cargar profesionales
  useEffect(() => {
    async function cargarProfesionales() {
      try {
        const data = await obtenerProfesionales();
        setProfesionales(data);
      } catch (error) {
        console.error('Error al cargar profesionales:', error);
      }
    }
    cargarProfesionales();
  }, []);

  // Cargar servicios
  useEffect(() => {
    async function cargarServicios() {
      try {
        const data = await obtenerServicios();
        setServicios(data);
      } catch (error) {
        console.error('Error al cargar servicios:', error);
      }
    }
    cargarServicios();
  }, []);

  // Cambiar el profesional seleccionado
  const handleProfesionalChange = (e) => {
    const id = e.target.value;
    setIdProfesional(id);
    const nombre = profesionales.find((p) => p.idProfesional === parseInt(id))?.nombreProfesional || '';
    actualizarResumen({ target: { name: 'profesional', value: nombre } });
  };

  // Cambiar el servicio seleccionado
  const handleServicioChange = (e) => {
    const id = e.target.value;
    setIdServicio(id);
    const nombre = servicios.find((s) => s.idServicios === parseInt(id))?.servNombre || '';
    actualizarResumen({ target: { name: 'servicio', value: nombre } });
  };

  // Obtener el id de la hora seleccionada
  const obtenerIdHorario = (hora) => {
    switch (hora) {
      case '9:00 AM': return 1;
      case '10:30 AM': return 2;
      case '12:00 PM': return 3;
      case '2:00 PM': return 4;
      case '3:30 PM': return 5;
      case '5:00 PM': return 6;
      default: return null;
    }
  };

  // Convertir hora de 12h a 24h
  const convertirHora12a24 = (hora12) => {
    if (!hora12) return null;
    const [time, modifier] = hora12.split(' ');
    let [hours, minutes] = time.split(':');
    if (modifier === 'PM' && hours !== '12') {
      hours = (parseInt(hours, 10) + 12).toString().padStart(2, '0');
    }
    if (modifier === 'AM' && hours === '12') {
      hours = '00';
    }
    return `${hours}:${minutes}:00`;
  };

  // Limpiar todos los campos del formulario
  const limpiarTodoFormulario = () => {
    limpiarFormulario();
    setIdProfesional('');
    setIdServicio('');
    actualizarResumen({ target: { name: 'fecha', value: 'No seleccionada' } });
    actualizarResumen({ target: { name: 'hora', value: 'No seleccionada' } });
    actualizarResumen({ target: { name: 'servicio', value: 'Por seleccionar' } });
    actualizarResumen({ target: { name: 'profesional', value: 'Por seleccionar' } });
  };

  // Manejar el envío del formulario
  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (
      resumen.fecha === 'No seleccionada' ||
      resumen.hora === 'No seleccionada' ||
      resumen.servicio === 'Por seleccionar' ||
      resumen.profesional === 'Por seleccionar' ||
      !idProfesional ||
      !idServicio
    ) {
      alert('Por favor, completa todos los campos de la cita');
      return;
    }

    const datosCita = {
      nombreCliente: formData.nombreCliente,
      celularCliente: formData.celularCliente,
      fechaNacCliente: formData.fechaNacCliente,
      idProfesional: parseInt(idProfesional),
      idServicio: parseInt(idServicio),
      idHorario: obtenerIdHorario(resumen.hora),
      fechaCita: resumen.fecha,
      horaCita: convertirHora12a24(resumen.hora),
    };

    try {
      await crearCita(datosCita);
      alert('Cita solicitada con éxito');
      limpiarTodoFormulario();
    } catch (error) {
      console.error('Error al enviar cita:', error);
      alert('Error al solicitar cita');
    }
  };

  return (
    <>
      <Header />
      <div className="contenedor-principal">
        <div className="texto-centrado">
          <h1 className="titulo-principal">Solicitud de Citas</h1>
          <p className="descripcion-principal">Selecciona tu fecha y horario a tu comodidad</p>
        </div>
        <div className="contenedor-citas">
          <div className="seccion-formulario">
            <form onSubmit={manejarEnvio}>
              <label htmlFor="nombreCliente">Nombre Completo</label>
              <input
                type="text"
                id="nombreCliente"
                name="nombreCliente"
                value={formData.nombreCliente}
                onChange={handleInputChange}
                placeholder="Ingresa tu nombre completo"
                required
              />
              <label htmlFor="fechaNacCliente">Fecha de Nacimiento</label>
              <input
                type="date"
                id="fechaNacCliente"
                name="fechaNacCliente"
                value={formData.fechaNacCliente}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="celularCliente">Teléfono</label>
              <input
                type="text"
                id="celularCliente"
                name="celularCliente"
                value={formData.celularCliente}
                onChange={handleInputChange}
                placeholder="322 456 7687"
                required
              />
              <label htmlFor="servicio">Servicio</label>
              <select
                id="servicio"
                name="servicio"
                onChange={handleServicioChange}
                value={idServicio}
                required
              >
                <option value="" disabled>Seleccione el tipo de servicio</option>
                {servicios.map((servicio) => (
                  <option key={servicio.idServicios} value={servicio.idServicios}>
                    {servicio.servNombre}
                  </option>
                ))}
              </select>

              <label htmlFor="profesional">Profesional Preferido</label>
              <select
                id="profesional"
                name="profesional"
                onChange={handleProfesionalChange}
                value={idProfesional}
                required
              >
                <option value="" disabled>Por seleccionar</option>
                {profesionales.map((prof) => (
                  <option key={prof.idProfesional} value={prof.idProfesional}>
                    {prof.nombreProfesional}
                  </option>
                ))}
              </select>

              <label htmlFor="fecha">Selecciona la fecha para la cita</label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                onChange={actualizarResumen}
                min={new Date().toISOString().split('T')[0]}
                required
              />

              <label htmlFor="hora">Selecciona la hora para la cita</label>
              <select
                id="hora"
                name="hora"
                onChange={actualizarResumen}
                value={resumen.hora}  // Cambiar a value controlado
                required
              >
                <option value="No seleccionada" disabled>Selecciona la hora</option>
                <option value="9:00 AM">9:00 AM</option>
                <option value="10:30 AM">10:30 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="2:00 PM">2:00 PM</option>
                <option value="3:30 PM">3:30 PM</option>
                <option value="5:00 PM">5:00 PM</option>
              </select>

              <div className="resumen-cita" style={{ marginTop: '1rem' }}>
                <strong>Resumen del agendamiento de cita:</strong><br />
                Fecha: <span>{resumen.fecha}</span><br />
                Hora: <span>{resumen.hora}</span><br />
                Servicio: <span>{resumen.servicio}</span><br />
                Profesional: <span>{resumen.profesional}</span>
              </div>

              <button type="submit" style={{ marginTop: '1rem' }}>
                Solicitar Cita
              </button>
            </form>
          </div>
          <div className="seccion-calendario">
            <CalendarioCitas />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SolicitarCitaPage;
