import api from './api';

export const resumeService = {
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    return await api.post('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  parsePreview: async (file = null) => {
    const formData = new FormData();
    if (file) {
      formData.append('resume', file);
    }
    return await api.post('/resumes/parse-preview', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  confirmSkills: async (skills, updateProfileData = null) => {
    return await api.post('/resumes/confirm-skills', {
      skills,
      approvedSkills: skills,
      updateProfileData
    });
  }
};

export default resumeService;

