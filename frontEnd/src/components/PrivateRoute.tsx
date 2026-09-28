import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';

function PrivateRoute() {
  const { isAuthenticated, isLoading, mustChangePassword } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#F9FAFB',
        }}
      >
        <p style={{ color: '#6b7280', fontSize: '16px' }}>Carregando...</p>
      </div>
    );
  }

  if (mustChangePassword) {
    return <Navigate to="/primeiro-acesso" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
}

export default PrivateRoute;
