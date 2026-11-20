const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, roleRequired } = require('../middleware/authMiddleware');

router.use(authenticateToken);
router.use(roleRequired('admin'));

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// Students
router.get('/students', adminController.getStudents);
router.get('/students/:id', adminController.getStudentDetail);

// Skills Taxonomy
router.get('/skills', adminController.getSkills);
router.post('/skills', adminController.createSkill);
router.put('/skills/:id', adminController.updateSkill);
router.delete('/skills/:id', adminController.deleteSkill);

// Assessments
router.get('/assessments', adminController.getAssessments);
router.post('/assessments', adminController.createAssessment);
router.put('/assessments/:id', adminController.updateAssessment);
router.delete('/assessments/:id', adminController.deleteAssessment);
router.post('/assessments/:id/questions', adminController.addQuestion);
router.delete('/assessments/:id/questions/:questionId', adminController.deleteQuestion);

// Companies
router.get('/companies', adminController.getCompanies);
router.post('/companies', adminController.createCompany);
router.delete('/companies/:id', adminController.deleteCompany);

// Recruiters
router.get('/recruiters', adminController.getRecruiters);
router.post('/recruiters', adminController.createRecruiter);

// Jobs
router.get('/jobs', adminController.getJobs);
router.post('/jobs', adminController.createJob);
router.get('/jobs/:id/eligible-students', adminController.getJobEligibleStudents);

// Applications Pipeline
router.get('/applications', adminController.getApplications);
router.put('/applications/:id/status', adminController.updateApplicationStatus);

// Placements
router.get('/placements', adminController.getPlacements);
router.post('/placements', adminController.createPlacement);

// Reports
router.get('/reports', adminController.getReports);

module.exports = router;

