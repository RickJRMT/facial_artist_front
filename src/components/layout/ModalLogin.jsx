import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './ModalLogin.css';

export default function ModalLogin({ isOpen, onClose }) {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, error } = useAuth();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(correo.trim(), password);

        if (result.success) {
            onClose();
            window.location.href = '/admin';
        }
    };

    return (
        <div className="natalia-modal-overlay" onClick={onClose}>
            <div className="natalia-modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Botón cerrar */}
                <button className="natalia-modal-close" onClick={onClose} aria-label="Cerrar">
                    ×
                </button>

                {/* Título */}
                <h2 className="natalia-modal-title">
                    <span className="natalia-title-gold">Natalia</span> Facial Artist
                </h2>
                <p className="natalia-modal-subtitle">Acceso Administrador</p>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="natalia-modal-form">
                    <div className="natalia-modal-field">
                        <label htmlFor="natalia-correo">Correo electrónico</label>
                        <input
                            id="natalia-correo"
                            type="email"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            placeholder="Correo electrónico admin"
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="natalia-modal-field">
                        <label htmlFor="natalia-password">Contraseña</label>
                        <input
                            id="natalia-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    {error && <p className="natalia-modal-error">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading || !correo || !password}
                        className="natalia-modal-submit"
                    >
                        {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                    </button>
                </form>

                {/* Footer decorativo */}
                <div className="natalia-modal-footer">
                    <span className="natalia-gold-line"></span>
                </div>
            </div>
        </div>
    );
}