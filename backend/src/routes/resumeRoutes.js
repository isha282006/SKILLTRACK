const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const { authenticateToken, roleRequired } = require('../middleware/authMiddleware');
const { uploadResume } = require('../middleware/uploadMiddleware');

// Public / Interactive Demonstration parser (open for visitors or sample inspection)
router.post(
  '/parse-preview',
  uploadResume.single('resume'),
  resumeController.parseResumePreview
);

router.use(authenticateToken);

// Upload and Parse Resume
router.post(
  '/upload',
  roleRequired('student'),
  uploadResume.single('resume'),
  resumeController.uploadAndParseResume
);

// Confirm Extracted Skills & Save to Skills Matrix
router.post(
  '/confirm-skills',
  roleRequired('student'),
  resumeController.confirmAndSaveParsedSkills
);

module.exports = router;

