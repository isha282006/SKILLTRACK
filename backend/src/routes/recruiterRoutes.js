const express = require('express');
const router = express.Router();
const recruiterController = require('../controllers/recruiterController');
const { authenticateToken, roleRequired } = require('../middleware/authMiddleware');

router.use(authenticateToken);
router.use(roleRequired('recruiter'));

// Dashboard
router.get('/dashboard', recruiterController.getDashboard);

// Company Profile
router.get('/company', recruiterController.getCompanyProfile);
router.put('/company', recruiterController.updateCompanyProfile);

// Vacancies
router.get('/jobs', recruiterController.getJobs);
router.post('/jobs', recruiterController.createJob);
router.put('/jobs/:id/toggle', recruiterController.toggleJob);

// Applicants
router.get('/applicants', recruiterController.getApplicants);
router.get('/applicants/:id', recruiterController.getApplicantDetail);
router.put('/applicants/:id/status', recruiterController.updateApplicantStatus);

module.exports = router;

