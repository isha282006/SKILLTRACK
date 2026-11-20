const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/login', authController.login);
router.get('/demo-login/:role', authController.demoLogin);
router.post('/register', authController.register);
router.get('/me', authenticateToken, authController.getMe);
router.post('/update-password', authenticateToken, authController.updatePassword);

module.exports = router;

