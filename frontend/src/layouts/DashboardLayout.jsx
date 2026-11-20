import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const { isAuthenticated, loading, role } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted fw-medium">Initializing SkillTrack Workspace...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role-based route guard: enforce separate permissions for Student, Admin, Recruiter
  const path = location.pathname;
  if (role === 'student' && (path.startsWith('/admin') || path.startsWith('/recruiter'))) {
    return <Navigate to="/student/dashboard" replace />;
  }
  if (role === 'admin' && (path.startsWith('/student') || path.startsWith('/recruiter'))) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  if (role === 'recruiter' && (path.startsWith('/student') || path.startsWith('/admin'))) {
    return <Navigate to="/recruiter/dashboard" replace />;
  }

  return (
    <div className="app-layout d-flex min-vh-100" style={{ backgroundColor: 'var(--lab-ivory, #F4F0E8)', color: 'var(--lab-navy, #111827)' }}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div
        className="app-main flex-grow-1 d-flex flex-column"
        style={{
          marginLeft: '270px',
          minWidth: 0,
          minHeight: '100vh',
          backgroundColor: 'var(--lab-ivory, #F4F0E8)',
          transition: 'margin-left 0.25s ease'
        }}
      >
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-grow-1 p-3 p-md-4" style={{ backgroundColor: 'var(--lab-ivory, #F4F0E8)' }}>
          <div className="container-fluid p-0">
            <Outlet />
          </div>
        </main>

        <Footer />
      </div>

      <style>{`
        @media (max-width: 991.98px) {
          .app-main {
            margin-left: 0 !important;
          }
          .app-sidebar {
            transform: translateX(-100%);
          }
          .app-sidebar.show {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;

