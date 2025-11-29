import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import AgentDashboardPage from './pages/agent/AgentDashboardPage';
import ClientsPage from './pages/clients/ClientsPage';
import ShipmentsPage from './pages/shipments/ShipmentsPage';
import TransportersPage from './pages/transporters/TransportersPage';
import PointsPage from './pages/points/PointsPage';
import UsersPage from './pages/users/UsersPage';
import SettingsPage from './pages/settings/SettingsPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('authToken');
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
  };

  // Composant pour gérer la redirection initiale
  const DefaultRoute = () => {
    const userRole = localStorage.getItem('userRole') || 'admin';
    const isAgent = userRole === 'agent';
    return <Navigate to={isAgent ? '/agent' : '/dashboard'} replace />;
  };

  return (
    <Router>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<DefaultRoute />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Layout onLogout={handleLogout}>
                    <DashboardPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
                    <Route
                      path="/clients"
                      element={
                        <ProtectedRoute requireAdmin={true}>
                          <Layout onLogout={handleLogout}>
                            <ClientsPage />
                          </Layout>
                        </ProtectedRoute>
                      }
                    />
            <Route
              path="/shipments"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Layout onLogout={handleLogout}>
                    <ShipmentsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/transporters"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Layout onLogout={handleLogout}>
                    <TransportersPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/points"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Layout onLogout={handleLogout}>
                    <PointsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Layout onLogout={handleLogout}>
                    <UsersPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Layout onLogout={handleLogout}>
                    <SettingsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/agent"
              element={
                <Layout onLogout={handleLogout}>
                  <AgentDashboardPage />
                </Layout>
              }
            />
            <Route path="*" element={<DefaultRoute />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
