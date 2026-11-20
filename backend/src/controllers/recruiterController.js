const { Recruiter, Company, Job, Application, Student, User, StudentSkill, Skill, Placement, Notification } = require('../models');
const { calculateStudentReadiness } = require('../services/readinessService');

async function getRecruiterWithCompany(userId) {
  return await Recruiter.findOne({
    where: { user_id: userId },
    include: [{ model: Company, as: 'company' }]
  });
}

// Recruiter Dashboard
async function getDashboard(req, res, next) {
  try {
    const recruiter = await getRecruiterWithCompany(req.user.id);
    if (!recruiter || !recruiter.company) {
      return res.status(404).json({ success: false, message: 'Recruiter or company profile not found.' });
    }

    const companyId = recruiter.company_id;
    const companyJobs = await Job.findAll({ where: { company_id: companyId } });
    const jobIds = companyJobs.map(j => j.id);

    const activeJobsCount = companyJobs.filter(j => j.is_active).length;
    const allApps = jobIds.length > 0 ? await Application.findAll({
      where: { job_id: jobIds },
      include: [
        { model: Student, as: 'student' },
        { model: Job, as: 'job' }
      ],
      order: [['applied_at', 'DESC']]
    }) : [];

    const totalApplicants = allApps.length;
    const shortlistedCount = allApps.filter(a => a.status === 'Shortlisted').length;
    const hiredCount = allApps.filter(a => a.status === 'Placed').length;

    res.json({
      success: true,
      data: {
        recruiter,
        company: recruiter.company,
        activeJobsCount,
        totalApplicants,
        shortlistedCount,
        hiredCount,
        recentApplications: allApps.slice(0, 6),
        jobs: companyJobs
      }
    });
  } catch (error) {
    next(error);
  }
}

// Company Profile
async function getCompanyProfile(req, res, next) {
  try {
    const recruiter = await getRecruiterWithCompany(req.user.id);
    res.json({ success: true, data: { recruiter, company: recruiter.company } });
  } catch (error) {
    next(error);
  }
}

async function updateCompanyProfile(req, res, next) {
  try {
    const recruiter = await getRecruiterWithCompany(req.user.id);
    let company = recruiter.company;

    const { name, industry, website, location, contact_email, contact_phone, description } = req.body;

    if (!company) {
      company = await Company.create({ name: name || 'Company Name' });
      recruiter.company_id = company.id;
      await recruiter.save();
    }

    if (name) company.name = name;
    if (industry) company.industry = industry;
    if (website !== undefined) company.website = website;
    if (location !== undefined) company.location = location;
    if (contact_email !== undefined) company.contact_email = contact_email;
    if (contact_phone !== undefined) company.contact_phone = contact_phone;
    if (description !== undefined) company.description = description;
    await company.save();

    res.json({ success: true, message: 'Company profile updated.', data: company });
  } catch (error) {
    next(error);
  }
}

// Jobs Management
async function getJobs(req, res, next) {
  try {
    const recruiter = await getRecruiterWithCompany(req.user.id);
    const jobs = await Job.findAll({
      where: { company_id: recruiter.company_id },
      include: [
        { model: require('../models').JobRequiredSkill, as: 'required_skills', include: [{ model: Skill, as: 'skill' }] },
        { model: Application, as: 'applications', attributes: ['id'] }
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
    const recruiter = await getRecruiterWithCompany(req.user.id);
    const { title, description, job_type, location, salary_package, min_cgpa, max_backlogs, allowed_departments, openings, deadline, skill_ids } = req.body;

    const job = await Job.create({
      company_id: recruiter.company_id,
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
        await require('../models').JobRequiredSkill.create({ job_id: job.id, skill_id: parseInt(sId, 10), is_mandatory: true });
      }
    }

    res.status(201).json({ success: true, message: 'Campus vacancy posted successfully!', data: job });
  } catch (error) {
    next(error);
  }
}

async function toggleJob(req, res, next) {
  try {
    const recruiter = await getRecruiterWithCompany(req.user.id);
    const job = await Job.findOne({ where: { id: req.params.id, company_id: recruiter.company_id } });
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

    job.is_active = !job.is_active;
    await job.save();
    res.json({ success: true, message: `Job ${job.is_active ? 'Activated' : 'Closed'}.`, data: job });
  } catch (error) {
    next(error);
  }
}

// Applicants
async function getApplicants(req, res, next) {
  try {
    const recruiter = await getRecruiterWithCompany(req.user.id);
    const { job_id, status } = req.query;

    const companyJobs = await Job.findAll({ where: { company_id: recruiter.company_id } });
    const jobIds = companyJobs.map(j => j.id);

    const where = { job_id: job_id ? parseInt(job_id, 10) : jobIds };
    if (status) where.status = status;

    const applications = await Application.findAll({
      where,
      include: [
        { model: Student, as: 'student', include: [{ model: User, as: 'user' }] },
        { model: Job, as: 'job' }
      ],
      order: [['applied_at', 'DESC']]
    });

    const applicantData = applications.map(app => ({
      application: app,
      readiness: calculateStudentReadiness(app.student)
    }));

    res.json({ success: true, data: { applicantData, jobs: companyJobs } });
  } catch (error) {
    next(error);
  }
}

async function getApplicantDetail(req, res, next) {
  try {
    const recruiter = await getRecruiterWithCompany(req.user.id);
    const application = await Application.findByPk(req.params.id, {
      include: [
        { model: Job, as: 'job', include: [{ model: Company, as: 'company' }] },
        {
          model: Student, as: 'student',
          include: [
            { model: User, as: 'user' },
            { model: StudentSkill, as: 'skills', include: [{ model: Skill, as: 'skill' }] },
            { model: require('../models').AssessmentResult, as: 'assessment_results' }
          ]
        }
      ]
    });

    if (!application || application.job.company_id !== recruiter.company_id) {
      return res.status(404).json({ success: false, message: 'Application not found for your company.' });
    }

    const readiness = calculateStudentReadiness(application.student);
    res.json({ success: true, data: { application, readiness } });
  } catch (error) {
    next(error);
  }
}

async function updateApplicantStatus(req, res, next) {
  try {
    const recruiter = await getRecruiterWithCompany(req.user.id);
    const application = await Application.findByPk(req.params.id, {
      include: [
        { model: Job, as: 'job', include: [{ model: Company, as: 'company' }] },
        { model: Student, as: 'student' }
      ]
    });

    if (!application || application.job.company_id !== recruiter.company_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    const { status, notes, interview_date, package_lpa } = req.body;
    application.status = status || application.status;
    if (notes !== undefined) application.notes = notes;
    if (interview_date !== undefined) application.interview_date = interview_date || null;
    await application.save();

    if (status === 'Placed') {
      const student = application.student;
      student.placement_status = 'Placed';
      await student.save();

      const existingPlc = await Placement.findOne({
        where: { student_id: application.student_id, job_id: application.job_id }
      });

      if (!existingPlc) {
        const pkg = parseFloat(package_lpa || 12.0);
        await Placement.create({
          student_id: application.student_id,
          company_id: application.job.company_id,
          job_id: application.job.id,
          package_lpa: pkg,
          status: 'Accepted',
          offer_letter_ref: `OFFER-${recruiter.company.name.slice(0, 3).toUpperCase()}-${student.roll_no}`
        });
      }
    }

    // Notify candidate
    await Notification.create({
      user_id: application.student.user_id,
      title: `Application Update: ${application.job.title}`,
      message: `${recruiter.company.name} updated your application stage to: ${status}. ${notes || ''}`,
      link: '/applications'
    });

    res.json({ success: true, message: `Applicant status updated to '${status}'.`, data: application });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboard,
  getCompanyProfile,
  updateCompanyProfile,
  getJobs,
  createJob,
  toggleJob,
  getApplicants,
  getApplicantDetail,
  updateApplicantStatus
};

