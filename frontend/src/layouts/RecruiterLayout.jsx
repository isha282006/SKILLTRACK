import React from 'react';
import DashboardLayout from './DashboardLayout';
import ProtectedRoute from '../components/ProtectedRoute';

const RecruiterLayout = () => {
  return (
    <ProtectedRoute allowedRoles={['recruiter']}>
      <DashboardLayout />
    </ProtectedRoute>
  );
};

export default RecruiterLayout;

