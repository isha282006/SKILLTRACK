const { Op } = require('sequelize');
const { Student, User, Recruiter, Company, Job, Application, Placement, Skill, StudentSkill, Assessment, Question, AssessmentResult, Notification, JobRequiredSkill } = require('../models');
const { calculateStudentReadiness } = require('../services/readinessService');
const { checkStudentJobEligibility } = require('../services/eligibilityService');

// Admin Dashboard
async function getDashboard(req, res, next) {
  try {
    const totalStudents = await Student.count();
    const totalCompanies = await Company.count();
    const totalJobs = await Job.count();
    const totalApplications = await Application.count();
    const totalPlacements = await Placement.count();

    const placementRate = totalStudents > 0
      ? Math.round((totalPlacements / totalStudents) * 100 * 10) / 10
      : 0;

    const recentApplications = await Application.findAll({
      limit: 6,
      order: [['applied_at', 'DESC']],
      include: [
        { model: Student, as: 'student' },
        { model: Job, as: 'job', include: [{ model: Company, as: 'company' }] }
      ]
    });

    const recentPlacements = await Placement.findAll({
      limit: 5,
      order: [['created_at', 'DESC']],
      include: [
        { model: Student, as: 'student' },
        { model: Company, as: 'company' }
      ]
    });

    // Department Stats
    const allStudents = await Student.findAll();
    const deptMap = {};
    allStudents.forEach(s => {
      const d = s.department || 'Other';
      if (!deptMap[d]) deptMap[d] = { total: 0, placed: 0 };
      deptMap[d].total++;
      if (s.placement_status === 'Placed') deptMap[d].placed++;
    });

    const deptLabels = Object.keys(deptMap);
    const deptTotals = deptLabels.map(d => deptMap[d].total);
    const deptPlaced = deptLabels.map(d => deptMap[d].placed);

    // Application Statuses
    const allApps = await Application.findAll({ attributes: ['status'] });
    const statusCounts = {};
    allApps.forEach(a => {
      statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        totalStudents,
        totalCompanies,
        totalJobs,
        totalApplications,
        totalPlacements,
        placementRate,
        recentApplications,
        recentPlacements,
        departments: {
          labels: deptLabels,
          totals: deptTotals,
          placed: deptPlaced
        },
        applicationStatuses: {
          labels: Object.keys(statusCounts),
          counts: Object.values(statusCounts)
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

// Students Management
async function getStudents(req, res, next) {
  try {
    const { search, department, status } = req.query;
    const where = {};

    if (search) {
      where[Op.or] = [
        { full_name: { [Op.like]: `%${search}%` } },
        { roll_no: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } }
      ];
    }
    if (department) where.department = department;
    if (status) where.placement_status = status;

    const students = await Student.findAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['email', 'role'] },
        { model: StudentSkill, as: 'skills', include: [{ model: Skill, as: 'skill' }] },
        { model: AssessmentResult, as: 'assessment_results', include: [{ model: Assessment, as: 'assessment' }] }
      ],
      order: [['full_name', 'ASC']]
    });

    const studentRecords = students.map(s => ({
      student: s,
      readiness: calculateStudentReadiness(s)
    }));

    res.json({ success: true, data: studentRecords });
  } catch (error) {
    next(error);
  }
}

async function getStudentDetail(req, res, next) {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user' },
        { model: StudentSkill, as: 'skills', include: [{ model: Skill, as: 'skill' }] },
        { model: AssessmentResult, as: 'assessment_results', include: [{ model: Assessment, as: 'assessment' }] },
        { model: Application, as: 'applications', include: [{ model: Job, as: 'job', include: [{ model: Company, as: 'company' }] }] }
      ]
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found.' });
    }

    const readiness = calculateStudentReadiness(student);
    res.json({ success: true, data: { student, readiness } });
  } catch (error) {
    next(error);
  }
}

// Skills Taxonomy
async function getSkills(req, res, next) {
  try {
    const skills = await Skill.findAll({
      include: [{ model: StudentSkill, as: 'student_skills', attributes: ['id'] }],
      order: [['category', 'ASC'], ['name', 'ASC']]
    });
    res.json({ success: true, data: skills });
  } catch (error) {
    next(error);
  }
}

async function createSkill(req, res, next) {
  try {
    const { name, category, description } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Skill name is required.' });

    const [skill, created] = await Skill.findOrCreate({
      where: { name: name.trim() },
      defaults: { category: category || 'Technical', description }
    });

    res.status(201).json({ success: true, message: created ? 'Skill created!' : 'Skill already exists.', data: skill });
  } catch (error) {
    next(error);
  }
}

async function updateSkill(req, res, next) {
  try {
    const skill = await Skill.findByPk(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found.' });

    const { name, category, description } = req.body;
    if (name) skill.name = name;
    if (category) skill.category = category;
    if (description !== undefined) skill.description = description;
    await skill.save();

    res.json({ success: true, message: 'Skill updated successfully.', data: skill });
  } catch (error) {
    next(error);
  }
}

async function deleteSkill(req, res, next) {
  try {
    const deleted = await Skill.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ success: false, message: 'Skill not found.' });
    res.json({ success: true, message: 'Skill removed from taxonomy.' });
  } catch (error) {
    next(error);
  }
}

// Assessments
async function getAssessments(req, res, next) {
  try {
    const assessments = await Assessment.findAll({
      include: [
        { model: Question, as: 'questions' },
        { model: AssessmentResult, as: 'results' }
      ]
    });
    res.json({ success: true, data: assessments });
  } catch (error) {
    next(error);
  }
}

async function createAssessment(req, res, next) {
  try {
    const { title, category, description, time_limit_mins, passing_score, total_marks } = req.body;
    if (!title || !category) {
      return res.status(400).json({ success: false, message: 'Assessment title and category are required.' });
    }

    const assessment = await Assessment.create({
      title,
      category,
      description,
      time_limit_mins: parseInt(time_limit_mins || 15, 10),
      passing_score: parseInt(passing_score || 60, 10),
      total_marks: parseInt(total_marks || 100, 10),
      created_by: req.user.id
    });

    res.status(201).json({ success: true, message: 'Assessment created! Now configure questions.', data: assessment });
  } catch (error) {
    next(error);
  }
}

async function updateAssessment(req, res, next) {
  try {
    const assessment = await Assessment.findByPk(req.params.id);
    if (!assessment) return res.status(404).json({ success: false, message: 'Assessment not found.' });

    const { title, category, description, time_limit_mins, passing_score } = req.body;
    if (title) assessment.title = title;
    if (category) assessment.category = category;
    if (description !== undefined) assessment.description = description;
    if (time_limit_mins) assessment.time_limit_mins = parseInt(time_limit_mins, 10);
    if (passing_score) assessment.passing_score = parseInt(passing_score, 10);
    await assessment.save();

    res.json({ success: true, message: 'Assessment details updated.', data: assessment });
  } catch (error) {
    next(error);
  }
}

async function deleteAssessment(req, res, next) {
  try {
    await Assessment.destroy({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Assessment deleted.' });
  } catch (error) {
    next(error);
  }
}

async function addQuestion(req, res, next) {
  try {
    const { question_text, option_a, option_b, option_c, option_d, correct_option, marks, explanation } = req.body;
    const question = await Question.create({
      assessment_id: req.params.id,
      question_text,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_option: (correct_option || 'A').toUpperCase(),
      marks: parseInt(marks || 10, 10),
      explanation
    });

    res.status(201).json({ success: true, message: 'Question added to assessment!', data: question });
  } catch (error) {
    next(error);
  }
}

async function deleteQuestion(req, res, next) {
  try {
    await Question.destroy({ where: { id: req.params.questionId } });
    res.json({ success: true, message: 'Question deleted.' });
  } catch (error) {
    next(error);
  }
}

// Companies
async function getCompanies(req, res, next) {
  try {
    const companies = await Company.findAll({
      include: [
        { model: Job, as: 'jobs' },
        { model: Placement, as: 'placements' }
      ]
    });
    res.json({ success: true, data: companies });
  } catch (error) {
    next(error);
  }
}

async function createCompany(req, res, next) {
  try {
    const { name, industry, website, location, contact_email, contact_phone, description } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Company name is required.' });

    const company = await Company.create({
      name, industry, website, location, contact_email, contact_phone, description
    });
    res.status(201).json({ success: true, message: 'Company added successfully.', data: company });
  } catch (error) {
    next(error);
  }
}

async function deleteCompany(req, res, next) {
  try {
    await Company.destroy({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Company removed.' });
  } catch (error) {
    next(error);
  }
}

// Jobs Management
async function getJobs(req, res, next) {
  try {
    const jobs = await Job.findAll({
      include: [
        { model: Company, as: 'company' },
        { model: JobRequiredSkill, as: 'required_skills', include: [{ model: Skill, as: 'skill' }] },
        { model: Application, as: 'applications' }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json({ success: true, data: jobs });
  } catch (error) {
    next(error);
  }
}

async function createJob(req, res, next) {
  try {
    const { company_id, title, description, job_type, location, salary_package, min_cgpa, max_backlogs, allowed_departments, openings, deadline, skill_ids } = req.body;

    const job = await Job.create({
      company_id: parseInt(company_id, 10),
      title,
      description,
      job_type: job_type || 'Full-time',
      location: location || 'Bengaluru',
      salary_package,
      min_cgpa: parseFloat(min_cgpa || 6.5),
      max_backlogs: parseInt(max_backlogs || 0, 10),
      allowed_departments: allowed_departments || 'All',
      openings: parseInt(openings || 5, 10),
      deadline: deadline || null
    });

    if (Array.isArray(skill_ids)) {
      for (const sId of skill_ids) {
        await JobRequiredSkill.create({ job_id: job.id, skill_id: parseInt(sId, 10), is_mandatory: true });
      }
    }

    res.status(201).json({ success: true, message: 'Job posting published!', data: job });
  } catch (error) {
    next(error);
  }
}

async function getJobEligibleStudents(req, res, next) {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [
        { model: Company, as: 'company' },
        { model: JobRequiredSkill, as: 'required_skills', include: [{ model: Skill, as: 'skill' }] }
      ]
    });

    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

    const allStudents = await Student.findAll({
      include: [
        { model: User, as: 'user' },
        { model: StudentSkill, as: 'skills', include: [{ model: Skill, as: 'skill' }] },
        { model: AssessmentResult, as: 'assessment_results' }
      ]
    });

    const eligible = [];
    allStudents.forEach(s => {
      const status = checkStudentJobEligibility(s, job);
      if (status.isEligible) {
        eligible.push({
          student: s,
          readiness: calculateStudentReadiness(s),
          eligibility: status
        });
      }
    });

    res.json({ success: true, data: { job, eligibleStudents: eligible } });
  } catch (error) {
    next(error);
  }
}

// Applications Pipeline
async function getApplications(req, res, next) {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;

    const applications = await Application.findAll({
      where,
      include: [
        { model: Student, as: 'student', include: [{ model: User, as: 'user' }] },
        { model: Job, as: 'job', include: [{ model: Company, as: 'company' }] }
      ],
      order: [['applied_at', 'DESC']]
    });

    res.json({ success: true, data: applications });
  } catch (error) {
    next(error);
  }
}

async function updateApplicationStatus(req, res, next) {
  try {
    const application = await Application.findByPk(req.params.id, {
      include: [
        { model: Student, as: 'student' },
        { model: Job, as: 'job', include: [{ model: Company, as: 'company' }] }
      ]
    });

    if (!application) return res.status(404).json({ success: false, message: 'Application not found.' });

    const { status, notes, interview_date, package_lpa } = req.body;
    application.status = status || application.status;
    if (notes !== undefined) application.notes = notes;
    if (interview_date !== undefined) application.interview_date = interview_date || null;
    await application.save();

    // If marked Placed, update student status and record placement
    if (status === 'Placed') {
      const student = application.student;
      student.placement_status = 'Placed';
      await student.save();

      const existingPlc = await Placement.findOne({
        where: { student_id: application.student_id, job_id: application.job_id }
      });

      if (!existingPlc) {
        let pkg = parseFloat(package_lpa || 12.0);
        await Placement.create({
          student_id: application.student_id,
          company_id: application.job.company_id,
          job_id: application.job.id,
          package_lpa: pkg,
          status: 'Accepted',
          offer_letter_ref: `OFFER-${application.job.company.name.slice(0, 3).toUpperCase()}-${application.student.roll_no}`
        });
      }
    }

    // Notify student
    await Notification.create({
      user_id: application.student.user_id,
      title: `Application Update: ${application.job.title}`,
      message: `Your application at ${application.job.company.name} was updated to: ${status}. ${notes || ''}`,
      link: '/applications'
    });

    res.json({ success: true, message: `Application status updated to ${status}.`, data: application });
  } catch (error) {
    next(error);
  }
}

// Placements
async function getPlacements(req, res, next) {
  try {
    const placements = await Placement.findAll({
      include: [
        { model: Student, as: 'student' },
        { model: Company, as: 'company' },
        { model: Job, as: 'job' }
      ],
      order: [['placement_date', 'DESC']]
    });
    res.json({ success: true, data: placements });
  } catch (error) {
    next(error);
  }
}

async function createPlacement(req, res, next) {
  try {
    const { student_id, company_id, job_id, package_lpa, offer_letter_ref } = req.body;
    const placement = await Placement.create({
      student_id: parseInt(student_id, 10),
      company_id: parseInt(company_id, 10),
      job_id: job_id ? parseInt(job_id, 10) : null,
      package_lpa: parseFloat(package_lpa),
      offer_letter_ref: offer_letter_ref || null,
      status: 'Accepted'
    });

    const student = await Student.findByPk(student_id);
    if (student) {
      student.placement_status = 'Placed';
      await student.save();

      await Notification.create({
        user_id: student.user_id,
        title: 'Congratulations on your Placement!',
        message: `You have been officially placed with package ${package_lpa} LPA!`,
        link: '/dashboard'
      });
    }

    res.status(201).json({ success: true, message: 'Placement recorded in official registry.', data: placement });
  } catch (error) {
    next(error);
  }
}

// Institutional Reports
async function getReports(req, res, next) {
  try {
    const totalStudents = await Student.count();
    const placedCount = await Student.count({ where: { placement_status: 'Placed' } });
    const overallRate = totalStudents > 0 ? Math.round((placedCount / totalStudents) * 100 * 10) / 10 : 0;

    const allStudents = await Student.findAll();
    const deptMap = {};
    allStudents.forEach(s => {
      const d = s.department || 'Other';
      if (!deptMap[d]) deptMap[d] = { total: 0, placed: 0 };
      deptMap[d].total++;
      if (s.placement_status === 'Placed') deptMap[d].placed++;
    });

    const branchStats = Object.keys(deptMap).map(d => ({
      department: d,
      total: deptMap[d].total,
      placed: deptMap[d].placed,
      rate: Math.round((deptMap[d].placed / deptMap[d].total) * 100 * 10) / 10
    }));

    const placements = await Placement.findAll({ attributes: ['package_lpa'] });
    const packages = placements.map(p => parseFloat(p.package_lpa || 0));
    const highestCtc = packages.length > 0 ? Math.max(...packages) : 0;
    const avgCtc = packages.length > 0 ? Math.round((packages.reduce((a, b) => a + b, 0) / packages.length) * 10) / 10 : 0;

    res.json({
      success: true,
      data: {
        totalStudents,
        placedCount,
        overallRate,
        branchStats,
        highestCtc,
        avgCtc
      }
    });
  } catch (error) {
    next(error);
  }
}

// Recruiter Management
async function getRecruiters(req, res, next) {
  try {
    const recruiters = await Recruiter.findAll({
      include: [
        { model: User, as: 'user' },
        { model: Company, as: 'company' }
      ]
    });
    const companies = await Company.findAll({ order: [['name', 'ASC']] });
    res.json({ success: true, data: { recruiters, companies } });
  } catch (error) {
    next(error);
  }
}

async function createRecruiter(req, res, next) {
  try {
    const { full_name, contact_person, email, password, company_id, phone, designation } = req.body;
    if (!email || !company_id) {
      return res.status(400).json({ success: false, message: 'Email and company are required.' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const personName = contact_person || full_name || email.split('@')[0];
    const user = await User.create({
      email,
      password: password || 'Recruiter@123',
      role: 'recruiter'
    });

    const recruiter = await Recruiter.create({
      user_id: user.id,
      company_id: parseInt(company_id, 10),
      full_name: personName,
      contact_person: personName,
      designation: designation || 'Talent Acquisition Partner',
      phone: phone || ''
    });

    res.status(201).json({
      success: true,
      message: 'Recruiter account registered successfully!',
      data: { recruiter, user }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboard,
  getStudents,
  getStudentDetail,
  getRecruiters,
  createRecruiter,
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  getAssessments,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  addQuestion,
  deleteQuestion,
  getCompanies,
  createCompany,
  deleteCompany,
  getJobs,
  createJob,
  getJobEligibleStudents,
  getApplications,
  updateApplicationStatus,
  getPlacements,
  createPlacement,
  getReports
};

