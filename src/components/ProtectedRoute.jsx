import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const userRole = localStorage.getItem('userRole') || 'admin';
  const isAgent = userRole === 'agent';

  // Si la route requiert admin et l'utilisateur est agent, rediriger
  if (requireAdmin && isAgent) {
    return <Navigate to="/agent" replace />;
  }

  // Si l'utilisateur est agent et essaie d'accéder à autre chose que /agent
  if (isAgent && window.location.pathname !== '/agent') {
    return <Navigate to="/agent" replace />;
  }

  return children;
}

