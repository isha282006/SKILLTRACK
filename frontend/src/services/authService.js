import api from './api';

export const authService = {
  login: async (email, password) => {
    return await api.post('/auth/login', { email, password });
  },

  demoLogin: async (role) => {
    return await api.get(`/auth/demo-login/${role}`);
  },

  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },

  getMe: async () => {
    return await api.get('/auth/me');
  },

  updatePassword: async (currentPassword, newPassword) => {
    return await api.post('/auth/update-password', { currentPassword, newPassword });
  }
};

export default authService;

