import api from './api';

export const dashboardService = {
  getStudentDashboard: async () => {
    const res = await api.get('/student/dashboard');
    return res.data;
  },

  getAdminDashboard: async () => {
    const res = await api.get('/admin/dashboard');
    return res.data;
  },

  getRecruiterDashboard: async () => {
    const res = await api.get('/recruiter/dashboard');
    return res.data;
  },

  getReadinessScore: async () => {
    const res = await api.get('/student/readiness');
    return res.data;
  }
};

export default dashboardService;

