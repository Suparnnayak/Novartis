import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ClinicDashboard from './pages/ClinicDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import { getUser } from './services/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const ProtectedRoute = ({ children, requiredRole }) => {
    if (loading) {
      return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    const currentUser = getUser();
    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }

    if (requiredRole && currentUser.role !== requiredRole) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/clinic"
          element={
            <ProtectedRoute requiredRole="clinic">
              <ClinicDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager"
          element={
            <ProtectedRoute requiredRole="manager">
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

