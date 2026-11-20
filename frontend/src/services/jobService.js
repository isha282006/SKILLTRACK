import api from './api';

export const jobService = {
  getAllJobs: async (params = {}) => {
    return await api.get('/jobs', { params });
  },

  getJobDetail: async (id) => {
    return await api.get(`/jobs/${id}`);
  },

  applyJob: async (id) => {
    return await api.post(`/jobs/${id}/apply`);
  }
};

export default jobService;

