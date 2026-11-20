const jwt = require('jsonwebtoken');
const { User, Student, Recruiter, Company } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'skilltrack-super-secure-jwt-secret-key-2026';

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      include: [
        { model: Student, as: 'student' },
        { model: Recruiter, as: 'recruiter', include: [{ model: Company, as: 'company' }] }
      ]
    });

    if (!user || !user.is_active) {
      return res.status(401).json({ success: false, message: 'Account not found or has been deactivated.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid or expired session token.' });
  }
}

function roleRequired(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: `Access restricted to ${allowedRoles.join(' / ')} accounts.` });
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  roleRequired,
  JWT_SECRET
};

