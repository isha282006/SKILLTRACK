import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * Guards routes by authenticated status and authorized user roles.
 */
const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="py-5 text-center font-mono">
        <div className="spinner-border text-dark" role="status"></div>
        <p className="mt-2 text-muted small">Verifying credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Redirect to correct dashboard based on actual role
    if (role === 'student') return <Navigate to="/student/dashboard" replace />;
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'recruiter') return <Navigate to="/recruiter/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;

