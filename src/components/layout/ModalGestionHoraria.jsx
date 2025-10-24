import React from 'react';

const ModalGestionHoraria = ({ formData, setFormData, profesionales, handleGuardarHorario, error, onClose }) => {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', width: '400px', maxHeight: '80vh', overflowY: 'auto' }}>
                <h3>{formData.idHorario ? 'Editar Horario' : 'Nuevo Horario'}</h3>
                {error && <p style={{ color: 'red', margin: '10px 0' }}>{error}</p>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label>
                        Profesional:
                        <select
                            value={formData.idProfesional || ''}
                            onChange={(e) => setFormData({ ...formData, idProfesional: Number(e.target.value) })}
                            required
                            style={{ width: '100%', marginLeft: '5px' }}
                        >
                            <option value="">Selecciona un profesional</option>
                            {profesionales.map(pro => (
                                <option key={pro.idProfesional} value={pro.idProfesional}>
                                    {pro.nombreProfesional}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Fecha:
                        <input
                            type="date"
                            value={formData.fecha}
                            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                            required
                            style={{ width: '100%', marginLeft: '5px' }}
                        />
                    </label>
                    <label>
                        Hora Inicio:
                        <input
                            type="time"
                            value={formData.hora_inicio}
                            onChange={(e) => setFormData({ ...formData, hora_inicio: e.target.value })}
                            required
                            style={{ width: '100%', marginLeft: '5px' }}
                        />
                    </label>
                    <label>
                        Hora Fin:
                        <input
                            type="time"
                            value={formData.hora_fin}
                            onChange={(e) => setFormData({ ...formData, hora_fin: e.target.value })}
                            required
                            style={{ width: '100%', marginLeft: '5px' }}
                        />
                    </label>
                    <label>
                        Estado:
                        <select
                            value={formData.estado}
                            onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                            required
                            style={{ width: '100%', marginLeft: '5px' }}
                        >
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                        </select>
                    </label>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={() => handleGuardarHorario(!!formData.idHorario)} style={{ padding: '8px 16px' }}>
                            Guardar
                        </button>
                        <button type="button" onClick={onClose} style={{ padding: '8px 16px' }}>Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalGestionHoraria;