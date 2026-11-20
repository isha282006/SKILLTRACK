// SkillTrack - Dedicated Assessment Controller
const studentController = require('./studentController');
const adminController = require('./adminController');

module.exports = {
  getStudentAssessments: studentController.getAssessments,
  getAssessmentById: studentController.getAssessmentDetail,
  submitAssessment: studentController.submitAssessment,
  getQuizResult: studentController.getQuizResult,
  adminGetAssessments: adminController.getAssessments,
  adminCreateAssessment: adminController.createAssessment,
  adminUpdateAssessment: adminController.updateAssessment,
  adminDeleteAssessment: adminController.deleteAssessment,
  adminAddQuestion: adminController.addQuestion,
  adminDeleteQuestion: adminController.deleteQuestion
};

