/**
 * Job Eligibility Verification Service
 */

function checkStudentJobEligibility(student, job) {
  const passedCriteria = [];
  const failedCriteria = [];

  // 1. CGPA Cutoff
  const studentCgpa = parseFloat(student.cgpa || 0.0);
  const minCgpa = parseFloat(job.min_cgpa || 0.0);
  if (studentCgpa >= minCgpa) {
    passedCriteria.push({
      name: 'Minimum CGPA',
      detail: `Required: >= ${minCgpa} (Your CGPA: ${studentCgpa.toFixed(2)})`,
      passed: true
    });
  } else {
    failedCriteria.push({
      name: 'Minimum CGPA',
      detail: `Required: >= ${minCgpa} (Your CGPA: ${studentCgpa.toFixed(2)} is below cutoff)`,
      passed: false
    });
  }

  // 2. Backlogs Allowance
  const studentBacklogs = parseInt(student.backlogs || 0, 10);
  const maxBacklogs = parseInt(job.max_backlogs !== undefined ? job.max_backlogs : 0, 10);
  if (studentBacklogs <= maxBacklogs) {
    passedCriteria.push({
      name: 'Backlog Allowance',
      detail: `Allowed: Max ${maxBacklogs} (You have: ${studentBacklogs})`,
      passed: true
    });
  } else {
    failedCriteria.push({
      name: 'Backlog Allowance',
      detail: `Allowed: Max ${maxBacklogs} (You currently have ${studentBacklogs} active backlogs)`,
      passed: false
    });
  }

  // 3. Department / Branch Check
  const allowedDepts = (job.allowed_departments || 'All').trim().toLowerCase();
  const studentDept = (student.department || '').trim().toLowerCase();
  if (allowedDepts === 'all' || allowedDepts === 'any' || allowedDepts === 'all branches') {
    passedCriteria.push({
      name: 'Eligible Branches',
      detail: 'Open to all academic branches',
      passed: true
    });
  } else {
    const allowedList = allowedDepts.split(',').map(d => d.trim().toLowerCase()).filter(Boolean);
    const matchesDept = allowedList.some(a => studentDept.includes(a) || a.includes(studentDept));
    if (matchesDept) {
      passedCriteria.push({
        name: 'Eligible Branches',
        detail: `Matches branch criteria (${student.department})`,
        passed: true
      });
    } else {
      failedCriteria.push({
        name: 'Eligible Branches',
        detail: `Allowed: ${job.allowed_departments} (Your branch: ${student.department})`,
        passed: false
      });
    }
  }

  // 4. Mandatory Skills Check
  const reqSkills = job.required_skills || [];
  const mandatoryReqs = reqSkills.filter(r => r.is_mandatory);
  if (mandatoryReqs.length === 0) {
    passedCriteria.push({
      name: 'Mandatory Skills',
      detail: 'No mandatory prerequisite skills enforced',
      passed: true
    });
  } else {
    const studentSkillIds = new Set((student.skills || []).map(s => s.skill_id));
    const missing = [];
    const matched = [];

    mandatoryReqs.forEach(req => {
      const skillName = req.skill ? req.skill.name : `Skill #${req.skill_id}`;
      if (studentSkillIds.has(req.skill_id)) {
        matched.push(skillName);
      } else {
        missing.push(skillName);
      }
    });

    if (missing.length === 0) {
      passedCriteria.push({
        name: 'Mandatory Skills',
        detail: `Satisfied required skills: ${matched.join(', ')}`,
        passed: true
      });
    } else {
      failedCriteria.push({
        name: 'Mandatory Skills',
        detail: `Missing required skills: ${missing.join(', ')}`,
        passed: false
      });
    }
  }

  // 5. Deadline Check
  if (job.deadline && new Date(job.deadline) < new Date()) {
    failedCriteria.push({
      name: 'Application Deadline',
      detail: `Deadline expired on ${new Date(job.deadline).toLocaleDateString()}`,
      passed: false
    });
  } else {
    passedCriteria.push({
      name: 'Application Deadline',
      detail: job.deadline ? `Open until ${new Date(job.deadline).toLocaleDateString()}` : 'Currently open',
      passed: true
    });
  }

  const isEligible = failedCriteria.length === 0 && job.is_active;

  return {
    isEligible,
    passedCriteria,
    failedCriteria,
    reasons: !isEligible ? failedCriteria.map(f => f.detail) : ['All eligibility conditions fulfilled.']
  };
}

module.exports = {
  checkStudentJobEligibility
};

