import api from './api';

export const studentService = {
  getDashboard: async () => {
    return await api.get('/student/dashboard');
  },

  getProfile: async () => {
    return await api.get('/student/profile');
  },

  updateProfile: async (profileData) => {
    return await api.put('/student/profile', profileData);
  },

  getSkills: async () => {
    return await api.get('/student/skills');
  },

  addSkill: async (skillData) => {
    return await api.post('/student/skills', skillData);
  },

  deleteSkill: async (studentSkillId) => {
    return await api.delete(`/student/skills/${studentSkillId}`);
  },

  getAssessments: async () => {
    return await api.get('/student/assessments');
  },

  getAssessmentById: async (assessmentId) => {
    return await api.get(`/student/assessments/${assessmentId}`);
  },

  takeAssessment: async (assessmentId, answers) => {
    return await api.post(`/student/assessments/${assessmentId}/take`, { answers });
  },

  getAssessmentResult: async (resultId) => {
    return await api.get(`/student/assessments/result/${resultId}`);
  },

  getReadiness: async () => {
    return await api.get('/student/readiness');
  },

  getApplications: async () => {
    return await api.get('/student/applications');
  }
};

export default studentService;

