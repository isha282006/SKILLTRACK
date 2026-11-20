import React from 'react';
import DashboardLayout from './DashboardLayout';
import ProtectedRoute from '../components/ProtectedRoute';

const AdminLayout = () => {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout />
    </ProtectedRoute>
  );
};

export default AdminLayout;

