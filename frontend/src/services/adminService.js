import api from './api';

export const adminService = {
  getDashboard: async () => {
    return await api.get('/admin/dashboard');
  },

  getStudents: async () => {
    return await api.get('/admin/students');
  },

  getStudentDetail: async (id) => {
    return await api.get(`/admin/students/${id}`);
  },

  getSkills: async () => {
    return await api.get('/admin/skills');
  },

  createSkill: async (skillData) => {
    return await api.post('/admin/skills', skillData);
  },

  updateSkill: async (id, skillData) => {
    return await api.put(`/admin/skills/${id}`, skillData);
  },

  deleteSkill: async (id) => {
    return await api.delete(`/admin/skills/${id}`);
  },

  getAssessments: async () => {
    return await api.get('/admin/assessments');
  },

  createAssessment: async (data) => {
    return await api.post('/admin/assessments', data);
  },

  updateAssessment: async (id, data) => {
    return await api.put(`/admin/assessments/${id}`, data);
  },

  deleteAssessment: async (id) => {
    return await api.delete(`/admin/assessments/${id}`);
  },

  addQuestion: async (assessmentId, questionData) => {
    return await api.post(`/admin/assessments/${assessmentId}/questions`, questionData);
  },

  deleteQuestion: async (assessmentId, questionId) => {
    return await api.delete(`/admin/assessments/${assessmentId}/questions/${questionId}`);
  },

  getCompanies: async () => {
    return await api.get('/admin/companies');
  },

  createCompany: async (data) => {
    return await api.post('/admin/companies', data);
  },

  deleteCompany: async (id) => {
    return await api.delete(`/admin/companies/${id}`);
  },

  getRecruiters: async () => {
    return await api.get('/admin/recruiters');
  },

  createRecruiter: async (data) => {
    return await api.post('/admin/recruiters', data);
  },

  getJobs: async () => {
    return await api.get('/admin/jobs');
  },

  createJob: async (data) => {
    return await api.post('/admin/jobs', data);
  },

  getJobEligibleStudents: async (jobId) => {
    return await api.get(`/admin/jobs/${jobId}/eligible-students`);
  },

  getApplications: async () => {
    return await api.get('/admin/applications');
  },

  updateApplicationStatus: async (id, data) => {
    return await api.put(`/admin/applications/${id}/status`, data);
  },

  getPlacements: async () => {
    return await api.get('/admin/placements');
  },

  createPlacement: async (data) => {
    return await api.post('/admin/placements', data);
  },

  getReports: async () => {
    return await api.get('/admin/reports');
  }
};

export default adminService;

