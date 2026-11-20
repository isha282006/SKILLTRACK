// SkillTrack - Role-Based Authorization Middleware
const { roleRequired } = require('./authMiddleware');

module.exports = {
  roleRequired,
  requireStudent: roleRequired('student'),
  requireAdmin: roleRequired('admin'),
  requireRecruiter: roleRequired('recruiter')
};

