// Importamos React y algunos hooks necesarios para manejar estado y efectos secundarios
import React, { useState, useEffect } from "react";

// Importamos el archivo CSS para estilos específicos de esta página
import "./SolicitarCitaCliente.css";

// Componentes de cabecera y pie de página para mantener consistencia visual
import Header from "../components/layout/Header_Cliente.jsx";
import Footer from "../components/layout/Footer_Cliente.jsx";

// Hook personalizado que maneja el resumen de la cita, para mostrar información actualizada
import { useResumenCita } from "../hooks/Solicitar_Cita_Cliente.jsx";

// Componente que renderiza un calendario para seleccionar fechas
import CalendarioCitas from "../components/layout/calendarioCitas.jsx";

// Modales de error
import ModalErrorEdad from "../components/layout/ModalErrorEdad.jsx";
import ModalErrorEdadMenor from "../components/layout/ModalEdadMenor.jsx";
import ModalErrorCaracteres from "../components/layout/ModalNombreIncompleto.jsx";
import ModalErrorTelefono from "../components/layout/ModalTelefonoIncompleto.jsx";
import ModalCitaExitosa from "../components/layout/ModalCitaSolicitada.jsx";

// Hooks personalizados que manejan la validación de formulario y carga de datos necesarios para la cita
import { useValidacionFormulario } from "../hooks/ValidarFormCitaCliente.jsx";
import { useProfesionales } from "../hooks/CargarProfesionales.jsx";
import { UseServicios } from "../hooks/CargarServicios.jsx";
import { useHorariosDisponibles } from "../hooks/CargarHorarios.jsx";
import useModalCitaExitosa from "../hooks/useModalCitaExitosa";
// Función que se conecta con el backend para crear una cita
import { crearCita } from "../Services/citasClientesConexion";
import { useAutoCompletarFechaNacimiento } from "../hooks/CompletarFechaNacimiento.jsx";

const SolicitarCitaPage = () => {
  // Hook para manejar los datos del formulario y su validación (nombre, teléfono, etc.)
  const { formData, handleInputChange, limpiarFormulario } =
    useValidacionFormulario();
  useAutoCompletarFechaNacimiento(formData.celularCliente, handleInputChange);
  // Hook para manejar y actualizar un resumen visible de la cita que se va configurando
  const { resumen, actualizarResumen } = useResumenCita();

  // Estado local para almacenar el profesional y servicio seleccionados (solo el id)
  const [idProfesional, setIdProfesional] = useState("");
  const [idServicio, setIdServicio] = useState("");

  // Obtenemos listas de profesionales, servicios y horarios disponibles (según selección)
  const { profesionales, loading: loadingProfesionales } = useProfesionales();
  const { servicios, loading: loadingServicios } = UseServicios();
  const { horariosDisponibles } = useHorariosDisponibles(
    idProfesional,
    idServicio,
    resumen.fecha
  );

  // Advertencia si no hay datos DESPUÉS de cargar (no durante la carga)
  useEffect(() => {
    // Solo mostrar advertencia si ya terminó de cargar y no hay datos
    if (!loadingProfesionales && !loadingServicios && (profesionales.length === 0 || servicios.length === 0)) {
      console.warn(
        '⚠️ ADVERTENCIA: No se pudieron cargar profesionales o servicios.\n' +
        'Verifica que el backend esté funcionando correctamente.'
      );
    }
  }, [profesionales, servicios, loadingProfesionales, loadingServicios]);
  // es para determinar el estado visible o no visible del modal:
  const { modalVisible, mostrarModal, cerrarModal, datosCita } =
    useModalCitaExitosa();
  // este es para el modal de edad de servicio de micropigmentación
  const [mostrarModalEdad, setMostrarModalEdad] = useState(false);
  const [mostrarModalEdadMenor, setMostrarModalEdadMenor] = useState(false);
  const [mostrarModalNombreIncompleto, setmostrarModalNombreIncompleto] = useState(false);
  const [mostrarModalTelefonoIncompleto, setmostrarModalTelefonoIncompleto] = useState(false);


  // Función que se ejecuta cuando cambia la selección del profesional en el formulario
  // Actualiza el id en el estado local y también actualiza el resumen con el nombre del profesional
  const handleProfesionalChange = (e) => {
    const id = e.target.value;
    setIdProfesional(id);
    // Buscamos el nombre del profesional seleccionado para actualizar el resumen
    // el fin busca el primer elemento de un array que cumpla con una condición especificada.
    const nombre =
      profesionales.find((p) => p.idProfesional === parseInt(id))
        ?.nombreProfesional || "";
    actualizarResumen({ target: { name: "profesional", value: nombre } });
  };

  const handleServicioChange = (e) => {
    const id = e.target.value;
    setIdServicio(id);
    // Buscamos el nombre del servicio para actualizar el resumen
    const servicioSeleccionado = servicios.find(
      (s) => s.id === parseInt(id)
    );
    const nombre = servicioSeleccionado?.nombre || "";
    const precio = servicioSeleccionado?.costo || "No disponible";

    // Comprobamos si el precio no es igual a 'No disponible'
    // Si el precio es un valor válido, lo formateamos; si no, lo dejamos como 'No disponible'
    const precioFormateado =
      precio !== "No disponible"
        ? // Si el precio está disponible, usamos Intl.NumberFormat para darle el formato adecuado
        // 'es-ES' indica que usaremos el formato de número español, con puntos como separadores de miles.
        // minimumFractionDigits: 2 asegura que siempre se muestren dos decimales.
        new Intl.NumberFormat("es-ES", {
          style: "decimal",
          minimumFractionDigits: precio % 1 === 0 ? 0 : 2, // Si es entero, no muestra decimales, si tiene decimales muestra 2
          maximumFractionDigits: 2, // Limita el número de decimales a 2
        }).format(precio)
        : precio; // Si el precio es "No disponible", lo dejamos tal cual
    actualizarResumen({ target: { name: "servicio", value: nombre } });
    actualizarResumen({ target: { name: "precio", value: precioFormateado } });
  };
  // Función para limpiar todos los campos del formulario y resetear estados a valores iniciales
  const limpiarTodoFormulario = () => {
    limpiarFormulario(); // limpia los campos básicos (nombre, teléfono, etc.)
    setIdProfesional(""); // resetea selección de profesional
    setIdServicio(""); // resetea selección de servicio
    // Resetea valores del resumen para que no quede información antigua visible
    actualizarResumen({ target: { name: "fecha", value: "No seleccionada" } });
    actualizarResumen({ target: { name: "hora", value: "No seleccionada" } });
    actualizarResumen({
      target: { name: "servicio", value: "Por seleccionar" },
    });
    actualizarResumen({
      target: { name: "profesional", value: "Por seleccionar" },
    });
  };

  // función para calcular la edad:
  const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }

    return edad;
  };

  // Función que se ejecuta al enviar el formulario (al solicitar la cita)
  const manejarEnvio = async (e) => {
    e.preventDefault(); // Evita que el formulario recargue la página al enviar

    // Validamos que todos los campos obligatorios estén completos
    if (
      resumen.fecha === "No seleccionada" ||
      resumen.hora === "No seleccionada" ||
      resumen.servicio === "Por seleccionar" ||
      resumen.profesional === "Por seleccionar" ||
      !idProfesional ||
      !idServicio
    ) {
      alert("Por favor, completa todos los campos de la cita");
      return;
    }
    if (formData.nombreCliente.trim().length < 3) {
      setmostrarModalNombreIncompleto(true);
      return;
    }
    if (formData.celularCliente.trim().length < 10) {
      setmostrarModalTelefonoIncompleto(true);
      return;
    }

    const edadCliente = calcularEdad(formData.fechaNacCliente);
    const fechaNacimiento = new Date(formData.fechaNacCliente);
    const hoy = new Date();

    // Validar si la fecha de nacimiento es en el futuro
    if (fechaNacimiento > hoy) {
      alert("La fecha de nacimiento no puede ser en el futuro.");
      return;
    }

    // Listado de servicios de micropigmentación
    const serviciosProhibidos = [
      "Micropigmentación de cejas",
      "Micropigmentación de pestañas",
    ];

    // Verificar si el servicio seleccionado es uno de los prohibidos
    const servicioSeleccionado = servicios.find(
      (s) => s.id === parseInt(idServicio)
    )?.nombre;

    if (
      edadCliente < 18 &&
      serviciosProhibidos.includes(servicioSeleccionado)
    ) {
      setMostrarModalEdad(true);
      return; // No continuar si la validación falla
    }

    // Validar edad mínima general
    if (edadCliente < 13) {
      setMostrarModalEdadMenor(true);
      return;
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
      horaCita: horariosDisponibles.find((h) => h.horaInicio === resumen.hora)
        ?.horaInicio24,
        // Se generará un numero de referencia de 10 digitos
         // 🔢 Generamos un número de referencia único basado en la fecha y hora actual
  // Date.now() devuelve los milisegundos desde 1970 (por ejemplo, 1762438000000 en 2025)
  // Dividimos entre 1000 para obtener segundos (por ejemplo, 1762438000)
  // Math.floor() elimina los decimales y deja un número entero de aproximadamente 10 dígitos
  // Este número cambia cada segundo, por lo que garantiza unicidad en cada cita creada
      numeroReferencia: Math.floor(Date.now() / 1000),
    };

    try {
      // Llamamos a la función que envía la cita al backend
      await crearCita(datosCita);
      mostrarModal({
        nombreCliente: datosCita.nombreCliente,
        fecha: resumen.fecha,
        hora: resumen.hora,
        profesional: resumen.profesional,
        servicio: resumen.servicio,
        costo: resumen.precio,
        numeroReferencia: Math.floor(Date.now() / 1000),
      });
      limpiarTodoFormulario();
    } catch (error) {
      // En caso de error mostramos un mensaje y lo registramos en consola para depuración
      console.error("Error al enviar cita:", error);
      alert(error.message || "Error al solicitar cita");
    }
  };

  return (
    <>
      <Header />
      <div className="contenedor-principal">
        <div className="texto-centrado">
          <h1 className="titulo-principal">Solicitud de Citas</h1>
          <p className="descripcion-principal">
            Selecciona tu fecha y horario a tu comodidad
          </p>
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
              {/* Campo para teléfono */}
              <label htmlFor="celularCliente">Teléfono</label>
              <input
                type="text"
                id="celularCliente"
                name="celularCliente"
                value={formData.celularCliente}
                onChange={handleInputChange}
                placeholder="3224567687"
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
                max={new Date().toISOString().split("T")[0]}
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
                <option value="" disabled>
                  Seleccione el tipo de servicio
                </option>
                {/* Renderizamos todas las opciones de servicios disponibles */}
                {servicios.map((servicio) => (
                  <option
                    key={servicio.id}
                    value={servicio.id}
                  >
                    {servicio.nombre}
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
                <option value="" disabled>
                  Por seleccionar
                </option>
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
                value={resumen.fecha !== "No seleccionada" ? resumen.fecha : ""}
                onChange={actualizarResumen} // Actualiza el resumen con la fecha seleccionada
                //   1. `new Date()` - Crea un objeto de fecha con la fecha y hora actual.
                // 2. `toISOString()` - Convierte la fecha a una cadena en formato ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ).
                //    Ejemplo: "2025-10-13T14:30:00.000Z"
                // 3. `split('T')` - Divide la cadena en dos partes, separando la fecha y la hora con el carácter 'T'.
                //    Ejemplo: ["2025-10-13", "14:30:00.000Z"]
                // 4. `[0]` - Toma solo la primera parte del array (la fecha) para obtener solo el valor "2025-10-13".
                // 5. `min={...}` - Establece la fecha mínima seleccionable en el campo de entrada como la fecha de hoy, evitando así que el usuario elija fechas pasadas.
                min={new Date().toISOString().split("T")[0]} // Fecha mínima es hoy para evitar fechas pasadas
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
                <option value="No seleccionada" disabled>
                  Selecciona la hora
                </option>
                {/* Renderizamos todas las horas disponibles para la selección */}
                {horariosDisponibles.map((horario) => (
                  <option key={horario.horaInicio} value={horario.horaInicio}>
                    {horario.horaInicio} - {horario.horaFin}
                  </option>
                ))}
              </select>

              {/* Sección que muestra un resumen con los datos de la cita que se están configurando */}
              <div className="resumen-cita" style={{ marginTop: "1rem" }}>
                <strong>Resumen del agendamiento de cita:</strong>
                <br />
                <br />
                Cliente: <span>{formData.nombreCliente || "No ingresado"}</span>
                <br />
                Fecha: <span>{resumen.fecha || "No seleccionada"}</span>
                <br />
                Hora: <span>{resumen.hora}</span>
                <br />
                Servicio: <span>{resumen.servicio}</span>
                <br />
                Precio: <span>{resumen.precio || "No disponible"}</span> <br />
                Profesional: <span>{resumen.profesional}</span>
              </div>

              {/* Botón para enviar la solicitud de cita */}
              <button className="btn_solicitar_cita_cliente" type="submit" style={{ marginTop: "1rem" }}>
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

      {/* Renderizamos el modal si modalVisible es true */}
      {modalVisible && (
        <ModalCitaExitosa
          datosCita={datosCita}
          onClose={cerrarModal} // Cerramos el modal al hacer clic en "Cerrar"
        />
      )}
      {mostrarModalEdad && (
        <ModalErrorEdad onClose={() => setMostrarModalEdad(false)}
        />
      )}
      {mostrarModalEdadMenor && (
        <ModalErrorEdadMenor onClose={() => setMostrarModalEdadMenor(false)}
        />
      )}
      {mostrarModalNombreIncompleto && (
        <ModalErrorCaracteres onClose={() => setmostrarModalNombreIncompleto(false)}
        />
      )}
      {mostrarModalTelefonoIncompleto && (
        <ModalErrorTelefono onClose={() => setmostrarModalTelefonoIncompleto(false)}
        />
      )}
    </>
  );
};

export default SolicitarCitaPage;
