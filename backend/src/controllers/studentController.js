const { Student, User, Skill, StudentSkill, Assessment, Question, AssessmentResult, Job, Company, Application, Notification } = require('../models');
const { calculateStudentReadiness } = require('../services/readinessService');
const { checkStudentJobEligibility } = require('../services/eligibilityService');

async function getFullStudentData(userId) {
  return await Student.findOne({
    where: { user_id: userId },
    include: [
      { model: User, as: 'user', attributes: ['email', 'role', 'is_active'] },
      { model: StudentSkill, as: 'skills', include: [{ model: Skill, as: 'skill' }] },
      { model: AssessmentResult, as: 'assessment_results', include: [{ model: Assessment, as: 'assessment' }] },
      { model: Application, as: 'applications', include: [{ model: Job, as: 'job', include: [{ model: Company, as: 'company' }] }] }
    ]
  });
}

// Student Dashboard Overview
async function getDashboard(req, res, next) {
  try {
    const student = await getFullStudentData(req.user.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    const readiness = calculateStudentReadiness(student);
    const totalSkills = student.skills ? student.skills.length : 0;
    const completedAssessments = student.assessment_results ? student.assessment_results.length : 0;
    const avgScore = completedAssessments > 0
      ? Math.round((student.assessment_results.reduce((acc, r) => acc + parseFloat(r.percentage || 0), 0) / completedAssessments) * 10) / 10
      : 0;

    const allActiveJobs = await Job.findAll({
      where: { is_active: true },
      include: [
        { model: Company, as: 'company' },
        { model: require('../models').JobRequiredSkill, as: 'required_skills', include: [{ model: Skill, as: 'skill' }] }
      ]
    });

    let eligibleJobsCount = 0;
    const allJobsWithEligibility = [];
    const recommendedJobs = [];

    allActiveJobs.forEach(job => {
      const eligibility = checkStudentJobEligibility(student, job);
      const entry = { job, eligibility };
      allJobsWithEligibility.push(entry);
      if (eligibility.isEligible) {
        eligibleJobsCount++;
        recommendedJobs.push(entry);
      }
    });

    res.json({
      success: true,
      data: {
        student,
        readiness,
        totalSkills,
        completedAssessments,
        avgScore,
        totalApplications: student.applications ? student.applications.length : 0,
        eligibleJobsCount,
        allJobsWithEligibility,
        applications: student.applications || [],
        recommendedJobs,
        recentAssessments: student.assessment_results || []
      }
    });
  } catch (error) {
    next(error);
  }
}

// Profile
async function getProfile(req, res, next) {
  try {
    const student = await getFullStudentData(req.user.id);
    const readiness = calculateStudentReadiness(student);
    res.json({ success: true, data: { student, readiness } });
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const student = await Student.findOne({ where: { user_id: req.user.id } });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    const { full_name, department, semester, cgpa, graduation_year, backlogs, phone, bio, linkedin_url, github_url } = req.body;

    if (full_name) student.full_name = full_name;
    if (department) student.department = department;
    if (semester !== undefined) student.semester = parseInt(semester, 10);
    if (cgpa !== undefined) student.cgpa = parseFloat(cgpa);
    if (graduation_year !== undefined) student.graduation_year = parseInt(graduation_year, 10);
    if (backlogs !== undefined) student.backlogs = parseInt(backlogs, 10);
    if (phone !== undefined) student.phone = phone;
    if (bio !== undefined) student.bio = bio;
    if (linkedin_url !== undefined) student.linkedin_url = linkedin_url;
    if (github_url !== undefined) student.github_url = github_url;

    await student.save();
    const updated = await getFullStudentData(req.user.id);
    const readiness = calculateStudentReadiness(updated);

    res.json({ success: true, message: 'Profile updated successfully.', data: { student: updated, readiness } });
  } catch (error) {
    next(error);
  }
}

// Skills Matrix
async function getSkills(req, res, next) {
  try {
    const student = await Student.findOne({
      where: { user_id: req.user.id },
      include: [{ model: StudentSkill, as: 'skills', include: [{ model: Skill, as: 'skill' }] }]
    });

    const allSkills = await Skill.findAll({ order: [['category', 'ASC'], ['name', 'ASC']] });
    const studentSkills = student ? (student.skills || []) : [];
    res.json({
      success: true,
      data: {
        skills: studentSkills,
        studentSkills: studentSkills,
        allSkills,
        availableSkills: allSkills
      }
    });
  } catch (error) {
    next(error);
  }
}

async function addSkill(req, res, next) {
  try {
    const student = await Student.findOne({ where: { user_id: req.user.id } });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    const skill_id = req.body.skill_id || req.body.skillId;
    const custom_skill_name = req.body.custom_skill_name || req.body.skillName;
    const category = req.body.category || 'Technical Skills';
    const proficiency = req.body.proficiency || req.body.proficiencyLevel || req.body.proficiency_level || 'Intermediate';
    const years_of_experience = req.body.years_of_experience || req.body.yearsOfExperience || 1.0;

    let targetSkillId = skill_id;
    if (!targetSkillId && custom_skill_name) {
      let [existingSkill] = await Skill.findOrCreate({
        where: { name: custom_skill_name.trim() },
        defaults: { category: category, description: 'Added by student' }
      });
      targetSkillId = existingSkill.id;
    }

    if (!targetSkillId) {
      return res.status(400).json({ success: false, message: 'Skill identification is required.' });
    }

    const [stSkill, created] = await StudentSkill.findOrCreate({
      where: { student_id: student.id, skill_id: targetSkillId },
      defaults: {
        proficiency: proficiency,
        proficiency_level: proficiency,
        years_of_experience: parseFloat(years_of_experience),
        verified: false
      }
    });

    stSkill.proficiency = proficiency;
    stSkill.proficiency_level = proficiency;
    stSkill.years_of_experience = parseFloat(years_of_experience);
    await stSkill.save();

    res.json({ success: true, message: created ? 'Skill added to matrix!' : 'Skill proficiency updated!' });
  } catch (error) {
    next(error);
  }
}

async function deleteSkill(req, res, next) {
  try {
    const student = await Student.findOne({ where: { user_id: req.user.id } });
    const { id } = req.params;

    const deleted = await StudentSkill.destroy({
      where: { id, student_id: student.id }
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Skill entry not found.' });
    }
    res.json({ success: true, message: 'Skill removed from matrix.' });
  } catch (error) {
    next(error);
  }
}

// Assessments
async function getAssessments(req, res, next) {
  try {
    const student = await Student.findOne({ where: { user_id: req.user.id } });
    const assessments = await Assessment.findAll({
      include: [{ model: Question, as: 'questions', attributes: ['id', 'marks'] }]
    });

    const results = await AssessmentResult.findAll({
      where: { student_id: student.id }
    });

    const resultsMap = {};
    results.forEach(r => {
      if (!resultsMap[r.assessment_id] || parseFloat(r.percentage) > parseFloat(resultsMap[r.assessment_id].percentage)) {
        resultsMap[r.assessment_id] = r;
      }
    });

    res.json({ success: true, data: { assessments, resultsMap } });
  } catch (error) {
    next(error);
  }
}

async function getAssessmentById(req, res, next) {
  try {
    const assessment = await Assessment.findByPk(req.params.id, {
      include: [{ model: Question, as: 'questions' }]
    });

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found.' });
    }
    res.json({ success: true, data: assessment });
  } catch (error) {
    next(error);
  }
}

async function takeAssessment(req, res, next) {
  try {
    const student = await Student.findOne({ where: { user_id: req.user.id } });
    const assessment = await Assessment.findByPk(req.params.id, {
      include: [{ model: Question, as: 'questions' }]
    });

    if (!assessment || !assessment.questions || assessment.questions.length === 0) {
      return res.status(400).json({ success: false, message: 'Assessment has no active questions.' });
    }

    const { answers, time_taken_seconds } = req.body; // { question_id: 'A' }
    let earnedScore = 0;
    let totalMarks = 0;

    assessment.questions.forEach(q => {
      totalMarks += q.marks;
      const userChoice = answers ? answers[q.id] : null;
      if (userChoice && String(userChoice).trim().toUpperCase() === String(q.correct_option).trim().toUpperCase()) {
        earnedScore += q.marks;
      }
    });

    const percentage = totalMarks > 0 ? Math.round((earnedScore / totalMarks) * 100 * 10) / 10 : 0;
    const passed = percentage >= assessment.passing_score;

    const result = await AssessmentResult.create({
      student_id: student.id,
      assessment_id: assessment.id,
      score: earnedScore,
      total_marks: totalMarks,
      percentage,
      passed,
      time_taken_seconds: parseInt(time_taken_seconds || 0, 10)
    });

    // Send in-app notification
    await Notification.create({
      user_id: req.user.id,
      title: `Assessment ${passed ? 'PASSED' : 'COMPLETED'}: ${assessment.title}`,
      message: `You scored ${earnedScore}/${totalMarks} (${percentage}%). Check your detailed scorecard.`,
      link: `/assessments/result/${result.id}`
    });

    res.status(201).json({
      success: true,
      message: 'Assessment evaluated successfully',
      resultId: result.id,
      result: {
        score: earnedScore,
        totalMarks,
        percentage,
        passed,
        timeTaken: time_taken_seconds
      }
    });
  } catch (error) {
    next(error);
  }
}

async function getAssessmentResult(req, res, next) {
  try {
    const student = await Student.findOne({ where: { user_id: req.user.id } });
    const result = await AssessmentResult.findOne({
      where: { id: req.params.resultId, student_id: student.id },
      include: [{ model: Assessment, as: 'assessment', include: [{ model: Question, as: 'questions' }] }]
    });

    if (!result) {
      return res.status(404).json({ success: false, message: 'Scorecard not found.' });
    }
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

// Readiness
async function getReadiness(req, res, next) {
  try {
    const student = await getFullStudentData(req.user.id);
    const readiness = calculateStudentReadiness(student);
    res.json({ success: true, data: { student, readiness } });
  } catch (error) {
    next(error);
  }
}

// Applications
async function getApplications(req, res, next) {
  try {
    const student = await Student.findOne({ where: { user_id: req.user.id } });
    const applications = await Application.findAll({
      where: { student_id: student.id },
      include: [{ model: Job, as: 'job', include: [{ model: Company, as: 'company' }] }],
      order: [['applied_at', 'DESC']]
    });
    res.json({ success: true, data: applications });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboard,
  getProfile,
  updateProfile,
  getSkills,
  addSkill,
  deleteSkill,
  getAssessments,
  getAssessmentById,
  takeAssessment,
  getAssessmentResult,
  getReadiness,
  getApplications
};

