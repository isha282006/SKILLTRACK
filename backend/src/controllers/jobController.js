const { Job, Company, Skill, JobRequiredSkill, Application, Student, StudentSkill, Notification } = require('../models');
const { checkStudentJobEligibility } = require('../services/eligibilityService');

// Get All Jobs with dynamic student eligibility
async function getAllJobs(req, res, next) {
  try {
    const { type, eligible } = req.query;

    const whereClause = { is_active: true };
    if (type) {
      whereClause.job_type = type;
    }

    const jobs = await Job.findAll({
      where: whereClause,
      include: [
        { model: Company, as: 'company' },
        { model: JobRequiredSkill, as: 'required_skills', include: [{ model: Skill, as: 'skill' }] }
      ],
      order: [['created_at', 'DESC']]
    });

    let student = null;
    let appliedJobIds = new Set();
    if (req.user && req.user.role === 'student') {
      student = await Student.findOne({
        where: { user_id: req.user.id },
        include: [{ model: StudentSkill, as: 'skills' }]
      });

      if (student) {
        const apps = await Application.findAll({
          where: { student_id: student.id },
          attributes: ['job_id']
        });
        apps.forEach(a => appliedJobIds.add(a.job_id));
      }
    }

    let jobCards = jobs.map(job => {
      let eligibility = { isEligible: true, reasons: [] };
      if (student) {
        eligibility = checkStudentJobEligibility(student, job);
      }
      return {
        job,
        eligibility,
        hasApplied: appliedJobIds.has(job.id)
      };
    });

    if (eligible === 'true' || eligible === 'yes') {
      jobCards = jobCards.filter(j => j.eligibility.isEligible);
    }

    res.json({ success: true, data: jobCards });
  } catch (error) {
    next(error);
  }
}

// Get Public Jobs for Landing Page and Preview
async function getPublicJobsPreview(req, res, next) {
  try {
    const jobs = await Job.findAll({
      where: { is_active: true },
      include: [
        { model: Company, as: 'company' },
        { model: JobRequiredSkill, as: 'required_skills', include: [{ model: Skill, as: 'skill' }] }
      ],
      order: [['created_at', 'DESC']]
    });

    const demoStudent = await Student.findOne({
      where: { user_id: 3 },
      include: [{ model: StudentSkill, as: 'skills', include: [{ model: Skill, as: 'skill' }] }]
    });

    const jobPreviews = jobs.map(job => {
      const eligibility = demoStudent ? checkStudentJobEligibility(demoStudent, job) : { isEligible: true };

      const reqSkills = (job.required_skills || []).map(r => r.skill?.name || `Skill #${r.skill_id}`);
      const studentSkillNames = new Set((demoStudent?.skills || []).map(s => s.skill?.name?.toLowerCase()).filter(Boolean));

      const matched = [];
      const missing = [];
      reqSkills.forEach(sk => {
        if (studentSkillNames.has(sk.toLowerCase())) {
          matched.push(sk);
        } else {
          missing.push(sk);
        }
      });
      const matchScore = reqSkills.length > 0 ? Math.round((matched.length / reqSkills.length) * 100) : 100;

      return {
        job,
        eligibility,
        skillGap: {
          matched,
          missing,
          matchScore,
          totalRequired: reqSkills.length
        }
      };
    });

    res.json({ success: true, data: jobPreviews });
  } catch (error) {
    next(error);
  }
}

// Get Job Details
async function getJobDetail(req, res, next) {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [
        { model: Company, as: 'company' },
        { model: JobRequiredSkill, as: 'required_skills', include: [{ model: Skill, as: 'skill' }] }
      ]
    });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found.' });
    }

    let eligibility = { isEligible: true, passedCriteria: [], failedCriteria: [], reasons: [] };
    let application = null;

    if (req.user && req.user.role === 'student') {
      const student = await Student.findOne({
        where: { user_id: req.user.id },
        include: [{ model: StudentSkill, as: 'skills', include: [{ model: Skill, as: 'skill' }] }]
      });

      if (student) {
        eligibility = checkStudentJobEligibility(student, job);
        application = await Application.findOne({
          where: { job_id: job.id, student_id: student.id }
        });
      }
    }

    res.json({
      success: true,
      data: {
        job,
        eligibility,
        application
      }
    });
  } catch (error) {
    next(error);
  }
}

// Apply for Job
async function applyJob(req, res, next) {
  try {
    const student = await Student.findOne({
      where: { user_id: req.user.id },
      include: [{ model: StudentSkill, as: 'skills', include: [{ model: Skill, as: 'skill' }] }]
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    const job = await Job.findByPk(req.params.id, {
      include: [
        { model: Company, as: 'company', include: [{ model: require('../models').Recruiter, as: 'recruiters' }] },
        { model: JobRequiredSkill, as: 'required_skills', include: [{ model: Skill, as: 'skill' }] }
      ]
    });

    if (!job || !job.is_active) {
      return res.status(404).json({ success: false, message: 'Job opening is no longer active.' });
    }

    // Check if already applied
    const existing = await Application.findOne({
      where: { job_id: job.id, student_id: student.id }
    });
    if (existing) {
      return res.status(400).json({ success: false, message: `You have already applied for ${job.title}. Current Status: ${existing.status}` });
    }

    // Verify eligibility
    const eligibility = checkStudentJobEligibility(student, job);
    if (!eligibility.isEligible) {
      return res.status(403).json({
        success: false,
        message: 'You do not fulfill the eligibility criteria for this role.',
        reasons: eligibility.reasons
      });
    }

    const { notes } = req.body;
    const application = await Application.create({
      job_id: job.id,
      student_id: student.id,
      status: 'Applied',
      notes: notes || null
    });

    // Notify student
    await Notification.create({
      user_id: req.user.id,
      title: `Application Submitted: ${job.title}`,
      message: `Your application for ${job.title} at ${job.company.name} has been submitted successfully.`,
      link: '/applications'
    });

    // Notify company recruiters if any
    if (job.company && job.company.recruiters) {
      for (const rec of job.company.recruiters) {
        await Notification.create({
          user_id: rec.user_id,
          title: `New Candidate: ${job.title}`,
          message: `${student.full_name} (${student.department}, CGPA ${student.cgpa}) applied for ${job.title}.`,
          link: '/recruiter/applicants'
        });
      }
    }

    res.status(201).json({
      success: true,
      message: `Application submitted successfully for ${job.title} at ${job.company.name}!`,
      data: application
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllJobs,
  getPublicJobsPreview,
  getJobDetail,
  applyJob
};

