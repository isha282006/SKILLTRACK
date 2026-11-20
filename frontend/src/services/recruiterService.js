import api from './api';

export const recruiterService = {
  getDashboard: async () => {
    return await api.get('/recruiter/dashboard');
  },

  getCompanyProfile: async () => {
    return await api.get('/recruiter/company');
  },

  updateCompanyProfile: async (data) => {
    return await api.put('/recruiter/company', data);
  },

  getJobs: async () => {
    return await api.get('/recruiter/jobs');
  },

  createJob: async (data) => {
    return await api.post('/recruiter/jobs', data);
  },

  toggleJob: async (id) => {
    return await api.put(`/recruiter/jobs/${id}/toggle`);
  },

  getApplicants: async (params = {}) => {
    return await api.get('/recruiter/applicants', { params });
  },

  getApplicantDetail: async (id) => {
    return await api.get(`/recruiter/applicants/${id}`);
  },

  updateApplicantStatus: async (id, data) => {
    return await api.put(`/recruiter/applicants/${id}/status`, data);
  }
};

export default recruiterService;

