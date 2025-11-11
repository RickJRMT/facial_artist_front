import React, { useState } from 'react';
import { useGestionHoraria } from '../../hooks/useGestionHoraria';
import ModalGestionHoraria from '../layout/ModalGestionHoraria';
import ModalMensaje from '../layout/ModalMensaje';
import CalendarioGestionHoraria from '../layout/CalendarioGestionHoraria';
import './Agenda.css';
import moment from 'moment';

const Agenda = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [citasEnHorario, setCitasEnHorario] = useState([]);

    const {
        eventos, citaSeleccionada, selectedDateCitas, selectedDateHorarios, profesionales, showModal, formData, setFormData, loading, error,
        handleSelectEvent, handleDateClick, openModal, openEditModal, handleGuardarHorario, setShowModal, isEditMode,
        showSuccess, showError, mensaje, setShowSuccess, setShowError, setMensaje, checkCitasInHorario, formatCitasComListado
    } = useGestionHoraria();

    const handleDatesSet = (arg) => {
        setCurrentDate(new Date(arg.start));
    };

    // HANDLER DE EDITAR CON VALIDACIÓN INTELIGENTE
    const handleEditHorario = async (horario) => {
        // Siempre permitir abrir el modal, pero con validaciones inteligentes
        openEditModal(horario);

        // Cargar información sobre citas existentes para mostrar al usuario
        const { hasCitas, citas, citasEnConflicto } = await checkCitasInHorario(
            horario.fecha,
            horario.hora_inicio,
            horario.hora_fin,
            horario.idProfesional
        );

        // Guardar las citas detectadas para usarlas en el modal
        if (hasCitas && citas.length > 0) {
            setCitasEnHorario(citas);
            const citasFormateadas = formatCitasComListado(citas);
            const listadoCitas = citasFormateadas.join('\n');
            setMensaje(`Atención: Hay citas agendadas:\n${listadoCitas}\nAsegúrate de que el nuevo horario las cubra.`);
            setShowError(true);
        } else {
            setCitasEnHorario([]);
        }
    };

    if (loading) return <div className="gh-carga-calendario">Cargando calendario...</div>;
    if (error) return <div className="gh-error-calendario">Error: {error}</div>;

    const isBloque = !!citaSeleccionada;
    let citasItems = [];
    let horariosItems = [];
    if (isBloque) {
        const item = citaSeleccionada;
        if (item.estado && (item.estado === 'activo' || item.estado === 'inactivo')) {
            horariosItems = [item];
        } else {
            citasItems = [item];
        }
    } else {
        const allCitas = selectedDateCitas || [];
        const allHorarios = selectedDateHorarios || [];
        citasItems = allCitas.filter((item, index, self) =>
            index === self.findIndex((t) => t.idCita === item.idCita)
        );
        horariosItems = allHorarios.filter((item, index, self) =>
            index === self.findIndex((t) => t.idHorario === item.idHorario)
        );
    }
    const hasHorarioInDay = horariosItems.length > 0;

    const formatFecha = (item) => {
        if (item.fechaFormatted || item.fechaLocal) {
            return item.fechaFormatted || item.fechaLocal;
        }
        const fechaRaw = item.fecha || item.fechaCita || item.start;
        if (!fechaRaw) return 'N/A';
        try {
            return moment(fechaRaw).local().format('DD/MM/YYYY');
        } catch {
            return 'N/A';
        }
    };

    const formatHora = (item, isRango = false) => {
        if (item.horaFormatted) {
            return item.horaFormatted;
        }
        let horaInicio = item.hora || item.horaCita || item.hora_inicio || (item.start ? moment(item.start).local().format('HH:mm') : null);
        if (isRango && item.hora_fin) {
            const horaFin = moment(`${item.fecha || '2000-01-01'}T${item.hora_fin}`).local().format('h:mm A');
            const inicioFormatted = new Intl.DateTimeFormat('es-ES', { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(`2000-01-01T${horaInicio}:00`));
            return `${inicioFormatted} - ${horaFin}`;
        }
        if (!horaInicio) return 'N/A';
        try {
            const horaStr = typeof horaInicio === 'string' ? horaInicio.split('T')[1]?.split(':').slice(0, 2).join(':') :
                moment(horaInicio).local().format('HH:mm');
            if (!horaStr) return 'N/A';
            return new Intl.DateTimeFormat('es-ES', { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(`2000-01-01T${horaStr}:00`));
        } catch {
            return 'N/A';
        }
    };

    const formatHoraRango = (horaInicio, duracionMin = 60) => {
        try {
            const inicio = new Date(`2000-01-01T${horaInicio}`);
            const fin = new Date(inicio.getTime() + duracionMin * 60000);
            const formatoHora = { hour: 'numeric', minute: '2-digit', hour12: true };
            
            const horaInicioStr = new Intl.DateTimeFormat('es-ES', formatoHora).format(inicio);
            const horaFinStr = new Intl.DateTimeFormat('es-ES', formatoHora).format(fin);
            
            return `${horaInicioStr} - ${horaFinStr}`;
        } catch {
            return 'N/A';
        }
    };

    const renderCitaCard = (item, index) => (
        <div key={item.idCita || index} className="gh-card-evento gh-card-cita">
            <div className="gh-card-header">
                <span className="gh-estado-icon">👤</span>
                <h4>{item.nombreCliente || `${item.nombreCliente || ''} ${item.apellidoCliente || ''}`.trim() || 'Cliente no especificado'}</h4>
            </div>
            <div className="gh-card-body">
                <p><strong>Profesional:</strong> {item.nombreProfesional || 'N/A'}</p>
                <p><strong>Fecha:</strong> {formatFecha(item)}</p>
                <p><strong>Horario:</strong> {formatHoraRango(item.horaCita, item.servDuracion || 60)}</p>
                <p><strong>Servicio:</strong> {item.descripcion || item.descripcionServicio || item.nombreServicio || 'N/A'}</p>
                <p><strong>Estado:</strong> {item.estadoCita || 'N/A'}</p>
            </div>
        </div>
    );

    const renderHorarioCard = (item, index) => {
        const estadoText = item.estado === 'activo' ? 'Activo' : 'Inactivo (No reservable)';
        const estadoIcon = item.estado === 'activo' ? '🟢' : '🔴';

        let idProfesional = item.idProfesional;
        if (!idProfesional) {
            const pro = profesionales.find(p => p.nombreProfesional === item.nombreProfesional);
            idProfesional = pro ? pro.idProfesional : '';
        }
        if (!idProfesional) {
            console.warn('No se pudo obtener idProfesional para:', item);
            return null;
        }

        let fecha = item.fecha;
        if (!fecha && item.fechaFormatted) {
            const [dd, mm, yyyy] = item.fechaFormatted.split('/');
            fecha = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
        }
        if (fecha && fecha.includes('T')) {
            fecha = fecha.split('T')[0];
        }

        const horaInicio24 = item.hora_inicio || item.hora || '';
        const horaFin24 = item.hora_fin || '';

        const horarioNormalizado = {
            idHorario: item.idHorario || item.id,
            idProfesional: idProfesional,
            fecha: fecha || '',
            hora_inicio: horaInicio24,
            hora_fin: horaFin24,
            estado: item.estado,
            nombreProfesional: item.nombreProfesional
        };

        return (
            <div key={item.idHorario || index} className="gh-card-evento gh-card-horario">
                <div className="gh-card-header">
                    <span className="gh-estado-icon">{estadoIcon}</span>
                    <h4>{item.nombreProfesional || 'N/A'}</h4>
                </div>
                <div className="gh-card-body">
                    <p><strong>Fecha:</strong> {formatFecha(item)}</p>
                    <p><strong>Horario del Profesional:</strong> {(() => {
                        const formatoHora = { hour: 'numeric', minute: '2-digit', hour12: true };
                        const inicio = new Date(`2000-01-01T${horaInicio24}`);
                        const fin = new Date(`2000-01-01T${horaFin24}`);
                        const horaInicioStr = new Intl.DateTimeFormat('es-ES', formatoHora).format(inicio);
                        const horaFinStr = new Intl.DateTimeFormat('es-ES', formatoHora).format(fin);
                        return `${horaInicioStr} - ${horaFinStr}`;
                    })()}</p>
                    <p><strong>Estado:</strong> {estadoText}</p>
                    <div className="gh-card-actions">
                        <button
                            className="gh-boton-editar-horario-card"
                            onClick={() => handleEditHorario(horarioNormalizado)}
                        >
                            ✏️ Editar
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="gh-contenedor-agenda">
            <header className="gh-encabezado-agenda">
                <h1>Gestión Horaria</h1>
                <small>Para visualizar las citas agendadas, selecciona un día específico que contenga el horario del profesional.</small>
            </header>

            <div className="gh-principal-agenda">
                <div className="gh-panel-calendario">
                    <CalendarioGestionHoraria
                        eventos={eventos}
                        onEventClick={handleSelectEvent}
                        onDateClick={handleDateClick}
                        currentView={currentDate}
                        onDatesSet={handleDatesSet}
                    />
                </div>

                <div className="gh-panel-descripción">
                    <h3 className="gh-título-panel">Descripción del Evento</h3>
                    {(citasItems.length > 0 || horariosItems.length > 0) ? (
                        <div className="gh-secciones-cards">
                            {citasItems.length > 0 && (
                                <div className="gh-sección-agendamientos">
                                    <h4 className="gh-sección-título">Agendamientos</h4>
                                    <div className="gh-contenedor-cards">
                                        {citasItems.map((item, index) => renderCitaCard(item, index))}
                                    </div>
                                </div>
                            )}
                            {horariosItems.length > 0 && (
                                <div className="gh-sección-estados">
                                    <h4 className="gh-sección-título">Estados de Agenda</h4>
                                    <div className="gh-contenedor-cards">
                                        {horariosItems.map((item, index) => renderHorarioCard(item, index)).filter(Boolean)}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="gh-placeholder-panel">Selecciona un evento o día en el calendario para ver detalles.</p>
                    )}
                    <button
                        className="gh-boton-gestión-horaria"
                        onClick={openModal}
                    >
                        Gestión Horaria
                    </button>
                </div>
            </div>

            {showModal && (
                <ModalGestionHoraria
                    formData={formData}
                    setFormData={setFormData}
                    profesionales={profesionales}
                    handleGuardarHorario={handleGuardarHorario}
                    onClose={() => setShowModal(false)}
                    isEditMode={isEditMode}
                    citasEnHorario={citasEnHorario}
                />
            )}
            {showSuccess && (
                <ModalMensaje
                    type="success"
                    mensaje={mensaje}
                    onClose={() => {
                        setShowSuccess(false);
                        setMensaje('');
                    }}
                />
            )}
            {showError && (
                <ModalMensaje
                    type="error"
                    mensaje={mensaje}
                    onClose={() => {
                        setShowError(false);
                        setMensaje('');
                    }}
                />
            )}
        </div>
    );
};

export default Agenda;