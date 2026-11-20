import React from 'react';
import DashboardLayout from './DashboardLayout';
import ProtectedRoute from '../components/ProtectedRoute';

const StudentLayout = () => {
  return (
    <ProtectedRoute allowedRoles={['student']}>
      <DashboardLayout />
    </ProtectedRoute>
  );
};

export default StudentLayout;

