const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticateToken, roleRequired } = require('../middleware/authMiddleware');

router.use(authenticateToken);

// Dashboard
router.get('/dashboard', roleRequired('student'), studentController.getDashboard);

// Profile
router.get('/profile', roleRequired('student'), studentController.getProfile);
router.put('/profile', roleRequired('student'), studentController.updateProfile);

// Skills Matrix
router.get('/skills', roleRequired('student'), studentController.getSkills);
router.post('/skills', roleRequired('student'), studentController.addSkill);
router.delete('/skills/:id', roleRequired('student'), studentController.deleteSkill);

// Assessments
router.get('/assessments', roleRequired('student'), studentController.getAssessments);
router.get('/assessments/:id', roleRequired('student'), studentController.getAssessmentById);
router.post('/assessments/:id/take', roleRequired('student'), studentController.takeAssessment);
router.get('/assessments/result/:resultId', roleRequired('student'), studentController.getAssessmentResult);

// Readiness
router.get('/readiness', roleRequired('student'), studentController.getReadiness);

// Applications
router.get('/applications', roleRequired('student'), studentController.getApplications);

module.exports = router;

