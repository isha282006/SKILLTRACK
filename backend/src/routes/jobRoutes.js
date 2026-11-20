const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authenticateToken, roleRequired } = require('../middleware/authMiddleware');

// Public demonstration drives for Landing Page & Preview
router.get('/public-preview', jobController.getPublicJobsPreview);

// Protected student browsable jobs
router.get('/', authenticateToken, jobController.getAllJobs);
router.get('/:id', authenticateToken, jobController.getJobDetail);
router.post('/:id/apply', authenticateToken, roleRequired('student'), jobController.applyJob);

module.exports = router;

