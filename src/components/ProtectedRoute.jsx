import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // o el hook/context que estés usando

export default function ProtectedRoute({ children }) {
    const { isLoggedIn } = useAuth(); // o const user = useAuth().getUser(); si no tienes isLoggedIn

    if (!isLoggedIn()) {
        // Redirige al home y abre el modal (opcional)
        return <Navigate to="/" replace />;
    }

    return children;
}