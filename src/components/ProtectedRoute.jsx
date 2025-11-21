import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute() {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn()) {
        // Redirige al home si no está autenticado
        return <Navigate to="/" replace />;
    }

    // Outlet renderiza las rutas hijas protegidas
    return <Outlet />;
}