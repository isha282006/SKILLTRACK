const jwt = require('jsonwebtoken');
const { User, Student, Recruiter, Company, Notification } = require('../models');
const { JWT_SECRET } = require('../middleware/authMiddleware');

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// Standard Login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({
      where: { email: email.trim().toLowerCase() },
      include: [
        { model: Student, as: 'student' },
        { model: Recruiter, as: 'recruiter', include: [{ model: Company, as: 'company' }] }
      ]
    });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Please verify your email and password.' });
    }

    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Please contact campus admin.' });
    }

    const token = generateToken(user);
    const userData = {
      id: user.id,
      email: user.email,
      role: user.role,
      student: user.student,
      recruiter: user.recruiter
    };
    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      data: {
        token,
        role: user.role,
        user: userData
      },
      user: userData
    });
  } catch (error) {
    next(error);
  }
}

// Instant 1-Click Demo Login
async function demoLogin(req, res, next) {
  try {
    const { role } = req.params;
    const roleEmailMap = {
      student: 'rohit.sharma@skilltrack.com',
      admin: 'admin@skilltrack.com',
      recruiter: 'recruiter@google.com'
    };

    const targetEmail = roleEmailMap[role ? role.toLowerCase() : ''];
    if (!targetEmail) {
      return res.status(400).json({ success: false, message: 'Invalid demo role requested.' });
    }

    const user = await User.findOne({
      where: { email: targetEmail },
      include: [
        { model: Student, as: 'student' },
        { model: Recruiter, as: 'recruiter', include: [{ model: Company, as: 'company' }] }
      ]
    });

    if (!user) {
      return res.status(404).json({ success: false, message: `Demo user for ${role} not found in database.` });
    }

    const token = generateToken(user);
    const userData = {
      id: user.id,
      email: user.email,
      role: user.role,
      student: user.student,
      recruiter: user.recruiter
    };
    res.json({
      success: true,
      message: `Authenticated as Demo ${role.toUpperCase()}`,
      token,
      data: {
        token,
        role: user.role,
        user: userData
      },
      user: userData
    });
  } catch (error) {
    next(error);
  }
}

// User Registration
async function register(req, res, next) {
  try {
    const { role, email, password, full_name, roll_no, department, semester, cgpa, graduation_year, phone, company_id, new_company_name, designation, industry } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ success: false, message: 'Email, password, and full name are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ where: { email: cleanEmail } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
    }

    const userRole = role === 'recruiter' ? 'recruiter' : 'student';
    const user = await User.create({
      email: cleanEmail,
      password,
      role: userRole
    });

    if (userRole === 'student') {
      const student = await Student.create({
        user_id: user.id,
        full_name,
        roll_no: (roll_no || `STU${Date.now()}`).toUpperCase(),
        department: department || 'Computer Science & Engineering',
        semester: parseInt(semester || 7, 10),
        cgpa: parseFloat(cgpa || 7.50),
        graduation_year: parseInt(graduation_year || 2026, 10),
        phone: phone || null
      });

      await Notification.create({
        user_id: user.id,
        title: 'Welcome to SkillTrack!',
        message: 'Your student profile is active. Add your skills and complete assessments to boost your Placement Readiness Score.',
        link: '/skills'
      });
    } else {
      let targetCompanyId = company_id;
      if (!targetCompanyId && new_company_name) {
        const comp = await Company.create({
          name: new_company_name,
          industry: industry || 'Technology'
        });
        targetCompanyId = comp.id;
      }

      await Recruiter.create({
        user_id: user.id,
        company_id: targetCompanyId || null,
        full_name,
        designation: designation || 'HR Talent Lead',
        phone: phone || null
      });

      await Notification.create({
        user_id: user.id,
        title: 'Recruiter Account Activated',
        message: 'Welcome to SkillTrack Recruiter Portal. You can now post vacancies and evaluate eligible student candidates.',
        link: '/recruiter/dashboard'
      });
    }

    const fullUser = await User.findByPk(user.id, {
      include: [
        { model: Student, as: 'student' },
        { model: Recruiter, as: 'recruiter', include: [{ model: Company, as: 'company' }] }
      ]
    });

    const token = generateToken(fullUser);
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: fullUser.id,
        email: fullUser.email,
        role: fullUser.role,
        student: fullUser.student,
        recruiter: fullUser.recruiter
      }
    });
  } catch (error) {
    next(error);
  }
}

// Get Current User Profile
async function getMe(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        { model: Student, as: 'student' },
        { model: Recruiter, as: 'recruiter', include: [{ model: Company, as: 'company' }] }
      ]
    });
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        student: user.student,
        recruiter: user.recruiter
      }
    });
  } catch (error) {
    next(error);
  }
}

// Update Password
async function updatePassword(req, res, next) {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) {
      return res.status(400).json({ success: false, message: 'Current and new passwords are required.' });
    }

    const user = await User.findByPk(req.user.id);
    if (!(await user.comparePassword(current_password))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }

    user.password = new_password;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
  demoLogin,
  register,
  getMe,
  updatePassword
};

