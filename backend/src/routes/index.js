const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const studentRoutes = require('./studentRoutes');
const resumeRoutes = require('./resumeRoutes');
const jobRoutes = require('./jobRoutes');
const adminRoutes = require('./adminRoutes');
const recruiterRoutes = require('./recruiterRoutes');
const notificationRoutes = require('./notificationRoutes');

router.use('/auth', authRoutes);
router.use('/student', studentRoutes);
router.use('/students', studentRoutes);
router.use('/resume', resumeRoutes);
router.use('/resumes', resumeRoutes);
router.use('/jobs', jobRoutes);
router.use('/admin', adminRoutes);
router.use('/recruiter', recruiterRoutes);
router.use('/recruiters', recruiterRoutes);
router.use('/notifications', notificationRoutes);

// Health Check API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'SkillTrack REST API is healthy',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;

