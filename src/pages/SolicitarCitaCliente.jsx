// Importamos React y algunos hooks necesarios para manejar estado y efectos secundarios
import React, { useState, useEffect } from 'react';

// Importamos el archivo CSS para estilos específicos de esta página
import './SolicitarCitaCliente.css';

// Componentes de cabecera y pie de página para mantener consistencia visual
import Header from '../components/layout/Header_Cliente.jsx';
import Footer from '../components/layout/Footer_Cliente.jsx';

// Hook personalizado que maneja el resumen de la cita, para mostrar información actualizada
import { useResumenCita } from '../hooks/Solicitar_Cita_Cliente.jsx';

// Componente que renderiza un calendario para seleccionar fechas
import CalendarioCitas from '../components/layout/calendarioCitas.jsx';

// Función que se conecta con el backend para crear una cita
import { crearCita } from '../Services/citasClientesConexion';

// Hooks personalizados que manejan la validación de formulario y carga de datos necesarios para la cita
import { useValidacionFormulario } from '../hooks/ValidarFormCitaCliente.jsx';
import { useProfesionales } from '../hooks/CargarProfesionales.jsx';
import { UseServicios } from '../hooks/CargarServicios.jsx';
import { useHorariosDisponibles } from '../hooks/CargarHorarios.jsx';

const SolicitarCitaPage = () => {
  // Hook para manejar los datos del formulario y su validación (nombre, teléfono, etc.)
  const { formData, handleInputChange, limpiarFormulario } = useValidacionFormulario();

  // Hook para manejar y actualizar un resumen visible de la cita que se va configurando
  const { resumen, actualizarResumen } = useResumenCita();

  // Estado local para almacenar el profesional y servicio seleccionados (solo el id)
  const [idProfesional, setIdProfesional] = useState('');
  const [idServicio, setIdServicio] = useState('');

  // Obtenemos listas de profesionales, servicios y horarios disponibles (según selección)
  const { profesionales } = useProfesionales();
  const { servicios } = UseServicios();
  const { horariosDisponibles } = useHorariosDisponibles(
    idProfesional,
    idServicio,
    resumen.fecha
  );

  // Función que se ejecuta cuando cambia la selección del profesional en el formulario
  // Actualiza el id en el estado local y también actualiza el resumen con el nombre del profesional
  const handleProfesionalChange = (e) => {
    const id = e.target.value;
    setIdProfesional(id);
    // Buscamos el nombre del profesional seleccionado para actualizar el resumen
    const nombre = profesionales.find((p) => p.idProfesional === parseInt(id))?.nombreProfesional || '';
    actualizarResumen({ target: { name: 'profesional', value: nombre } });
  };

  // Similar a la función anterior, pero para el servicio seleccionado
  const handleServicioChange = (e) => {
    const id = e.target.value;
    setIdServicio(id);
    // Buscamos el nombre del servicio para actualizar el resumen
    const nombre = servicios.find((s) => s.idServicios === parseInt(id))?.servNombre || '';
    actualizarResumen({ target: { name: 'servicio', value: nombre } });
  };

  // Función para limpiar todos los campos del formulario y resetear estados a valores iniciales
  const limpiarTodoFormulario = () => {
    limpiarFormulario(); // limpia los campos básicos (nombre, teléfono, etc.)
    setIdProfesional(''); // resetea selección de profesional
    setIdServicio(''); // resetea selección de servicio
    // Resetea valores del resumen para que no quede información antigua visible
    actualizarResumen({ target: { name: 'fecha', value: 'No seleccionada' } });
    actualizarResumen({ target: { name: 'hora', value: 'No seleccionada' } });
    actualizarResumen({ target: { name: 'servicio', value: 'Por seleccionar' } });
    actualizarResumen({ target: { name: 'profesional', value: 'Por seleccionar' } });
  };

  // Función que se ejecuta al enviar el formulario (al solicitar la cita)
  const manejarEnvio = async (e) => {
    e.preventDefault(); // Evita que el formulario recargue la página al enviar

    // Validamos que todos los campos obligatorios estén completos
    if (
      resumen.fecha === 'No seleccionada' ||
      resumen.hora === 'No seleccionada' ||
      resumen.servicio === 'Por seleccionar' ||
      resumen.profesional === 'Por seleccionar' ||
      !idProfesional ||
      !idServicio
    ) {
      alert('Por favor, completa todos los campos de la cita');
      return; // No continúa si faltan campos
    }

    // Creamos un objeto con todos los datos que se enviarán al backend para crear la cita
    const datosCita = {
      nombreCliente: formData.nombreCliente,
      celularCliente: formData.celularCliente,
      fechaNacCliente: formData.fechaNacCliente,
      idProfesional: parseInt(idProfesional),
      idServicios: parseInt(idServicio),
      fechaCita: resumen.fecha,
      // Convertimos la hora seleccionada en formato 24h para el backend
      horaCita: horariosDisponibles.find((h) => h.horaInicio === resumen.hora)?.horaInicio24,
    };

    try {
      // Llamamos a la función que envía la cita al backend
      await crearCita(datosCita);
      alert('Cita solicitada con éxito');
      limpiarTodoFormulario(); 
    } catch (error) {
      // En caso de error mostramos un mensaje y lo registramos en consola para depuración
      console.error('Error al enviar cita:', error);
      alert(error.message || 'Error al solicitar cita');
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
              {/* Campo para nombre del cliente */}
              <label htmlFor="nombreCliente">Nombre Completo</label>
              <input
                type="text"
                id="nombreCliente"
                name="nombreCliente"
                value={formData.nombreCliente}
                onChange={handleInputChange} // Actualiza estado con cada cambio
                placeholder="Ingresa tu nombre completo"
                required
              />
              {/* Campo para fecha de nacimiento */}
              <label htmlFor="fechaNacCliente">Fecha de Nacimiento</label>
              <input
                type="date"
                id="fechaNacCliente"
                name="fechaNacCliente"
                value={formData.fechaNacCliente}
                onChange={handleInputChange}
                required
              />
              {/* Campo para teléfono */}
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
              {/* Selector de servicio */}
              <label htmlFor="servicio">Servicio</label>
              <select
                id="servicio"
                name="servicio"
                onChange={handleServicioChange} // Actualiza servicio seleccionado
                value={idServicio}
                required
              >
                <option value="" disabled>Seleccione el tipo de servicio</option>
                {/* Renderizamos todas las opciones de servicios disponibles */}
                {servicios.map((servicio) => (
                  <option key={servicio.idServicios} value={servicio.idServicios}>
                    {servicio.servNombre}
                  </option>
                ))}
              </select>

              {/* Selector de profesional */}
              <label htmlFor="profesional">Profesional Preferido</label>
              <select
                id="profesional"
                name="profesional"
                onChange={handleProfesionalChange} // Actualiza profesional seleccionado
                value={idProfesional}
                required
              >
                <option value="" disabled>Por seleccionar</option>
                {/* Renderizamos todas las opciones de profesionales disponibles */}
                {profesionales.map((prof) => (
                  <option key={prof.idProfesional} value={prof.idProfesional}>
                    {prof.nombreProfesional}
                  </option>
                ))}
              </select>

              {/* Selector de fecha para la cita */}
              <label htmlFor="fecha">Selecciona la fecha para la cita</label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                // Si no se ha seleccionado fecha, el input queda vacío
                value={resumen.fecha !== 'No seleccionada' ? resumen.fecha : ''}
                onChange={actualizarResumen} // Actualiza el resumen con la fecha seleccionada
                min={new Date().toISOString().split('T')[0]} // Fecha mínima es hoy para evitar fechas pasadas
                required
              />

              {/* Selector de hora para la cita */}
              <label htmlFor="hora">Selecciona la hora para la cita</label>
              <select
                id="hora"
                name="hora"
                onChange={actualizarResumen} // Actualiza el resumen con la hora seleccionada
                value={resumen.hora}
                required
              >
                <option value="No seleccionada" disabled>Selecciona la hora</option>
                {/* Renderizamos todas las horas disponibles para la selección */}
                {horariosDisponibles.map((horario) => (
                  <option key={horario.horaInicio} value={horario.horaInicio}>
                    {horario.horaInicio} - {horario.horaFin}
                  </option>
                ))}
              </select>

              {/* Sección que muestra un resumen con los datos de la cita que se están configurando */}
              <div className="resumen-cita" style={{ marginTop: '1rem' }}>
                <strong>Resumen del agendamiento de cita:</strong><br />
                Fecha: <span>{resumen.fecha || 'No seleccionada'}</span><br />
                Hora: <span>{resumen.hora}</span><br />
                Servicio: <span>{resumen.servicio}</span><br />
                Profesional: <span>{resumen.profesional}</span>
              </div>

              {/* Botón para enviar la solicitud de cita */}
              <button type="submit" style={{ marginTop: '1rem' }}>
                Solicitar Cita
              </button>
            </form>
          </div>

          {/* Sección que muestra el calendario visual para la selección de fechas */}
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
