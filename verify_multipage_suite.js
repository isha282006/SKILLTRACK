const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, data: body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== SKILLTRACK COMPLETE MULTI-PAGE APPLICATION VERIFICATION ===\n');
  let passed = 0;
  let failed = 0;

  function assert(desc, condition, details = '') {
    if (condition) {
      console.log(`[PASS] ${desc}`);
      passed++;
    } else {
      console.error(`[FAIL] ${desc} - ${details}`);
      failed++;
    }
  }

  try {
    // 1. PUBLIC JOBS PREVIEW
    const pubJobs = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/jobs/public-preview',
      method: 'GET'
    });
    assert('Public Jobs Preview (GET /api/jobs/public-preview)', pubJobs.status === 200 && pubJobs.data.success);

    // 2. AUTHENTICATION (STUDENT, ADMIN, RECRUITER)
    const stuLogin = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { email: 'rohit.sharma@skilltrack.com', password: 'Student@123' });
    assert('Student Login', stuLogin.status === 200 && stuLogin.data.success && stuLogin.data.data.role === 'student');
    const stuToken = stuLogin.data.data.token;

    const admLogin = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { email: 'admin@skilltrack.com', password: 'Admin@123' });
    assert('Admin Login', admLogin.status === 200 && admLogin.data.success && admLogin.data.data.role === 'admin');
    const admToken = admLogin.data.data.token;

    const recLogin = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { email: 'recruiter@google.com', password: 'Recruiter@123' });
    assert('Recruiter Login', recLogin.status === 200 && recLogin.data.success && recLogin.data.data.role === 'recruiter');
    const recToken = recLogin.data.data.token;

    // 3. STUDENT MODULES
    const stuProfile = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/student/profile',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${stuToken}` }
    });
    assert('Student Profile Retrieval', stuProfile.status === 200 && stuProfile.data.success);

    const stuSkills = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/student/skills',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${stuToken}` }
    });
    const skillsList = stuSkills.data.data?.skills || stuSkills.data.data;
    assert('Student Skills Matrix', stuSkills.status === 200 && stuSkills.data.success && Array.isArray(skillsList));

    // Batch Confirm Skills from Extracted Skills Review
    const confirmSkills = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/resume/confirm-skills',
      method: 'POST',
      headers: { 'Authorization': `Bearer ${stuToken}`, 'Content-Type': 'application/json' }
    }, {
      skills: [
        { name: 'TypeScript', category: 'Programming Languages', proficiency_level: 'Advanced', years_of_experience: 2 },
        { name: 'GraphQL', category: 'Backend Development', proficiency_level: 'Intermediate', years_of_experience: 1 }
      ]
    });
    assert('Extracted Skills Confirmation & Persistence', confirmSkills.status === 200 && confirmSkills.data.success);

    const stuReadiness = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/student/readiness',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${stuToken}` }
    });
    const readinessScore = stuReadiness.data.data?.readiness?.score || stuReadiness.data.data?.readiness?.totalScore || stuReadiness.data.data?.overall_score;
    assert('Student Readiness Score Calculation', stuReadiness.status === 200 && stuReadiness.data.success && typeof readinessScore === 'number');

    const stuNotifs = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/notifications',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${stuToken}` }
    });
    assert('Student Notifications Inbox', stuNotifs.status === 200 && stuNotifs.data.success && Array.isArray(stuNotifs.data.data.notifications));

    const markAllRead = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/notifications/read-all',
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${stuToken}` }
    });
    assert('Student Notifications Mark All Read', markAllRead.status === 200 && markAllRead.data.success);

    // 4. ADMIN MODULES
    const admDashboard = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/dashboard',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${admToken}` }
    });
    assert('Admin Dashboard Metrics', admDashboard.status === 200 && admDashboard.data.success);

    const admStudents = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/students',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${admToken}` }
    });
    assert('Admin Student Management', admStudents.status === 200 && admStudents.data.success);

    const admRecruiters = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/recruiters',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${admToken}` }
    });
    assert('Admin Recruiter Management (GET)', admRecruiters.status === 200 && admRecruiters.data.success);

    const createRecruiter = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/recruiters',
      method: 'POST',
      headers: { 'Authorization': `Bearer ${admToken}`, 'Content-Type': 'application/json' }
    }, {
      contact_person: 'Sarah Jenkins',
      email: `sarah.jenkins.${Date.now()}@microsoft.com`,
      company_id: 1,
      designation: 'Lead University Recruiter'
    });
    assert('Admin Create Recruiter (POST)', createRecruiter.status === 201 && createRecruiter.data.success);

    const admCompanies = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/companies',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${admToken}` }
    });
    assert('Admin Companies Management', admCompanies.status === 200 && admCompanies.data.success);

    const admPlacements = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/placements',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${admToken}` }
    });
    assert('Admin Placement Records', admPlacements.status === 200 && admPlacements.data.success);

    const admReports = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/reports',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${admToken}` }
    });
    assert('Admin Placement & Skill Analytics Reports', admReports.status === 200 && admReports.data.success);

    // 5. RECRUITER MODULES
    const recDashboard = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/recruiter/dashboard',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${recToken}` }
    });
    assert('Recruiter Dashboard Metrics', recDashboard.status === 200 && recDashboard.data.success);

    const createJob = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/recruiter/jobs',
      method: 'POST',
      headers: { 'Authorization': `Bearer ${recToken}`, 'Content-Type': 'application/json' }
    }, {
      title: 'Full Stack Cloud Engineer',
      description: 'Building next-generation distributed enterprise applications with React, Node.js and AWS.',
      job_type: 'Full-time',
      location: 'Bangalore / Hybrid',
      salary_package: 18.5,
      min_cgpa: 7.5,
      max_backlogs: 0,
      allowed_branches: ['Computer Science', 'Information Technology'],
      application_deadline: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      skills: ['React', 'Node.js', 'Docker', 'AWS']
    });
    assert('Recruiter Create Job Opening', createJob.status === 201 && createJob.data.success);

    const recApplicants = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/recruiter/applicants',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${recToken}` }
    });
    assert('Recruiter Applicants Pool Retrieval', recApplicants.status === 200 && recApplicants.data.success);

    if (recApplicants.data.data && recApplicants.data.data.length > 0) {
      const applicantId = recApplicants.data.data[0].id;
      const updateStatus = await request({
        hostname: 'localhost',
        port: 5000,
        path: `/api/recruiter/applicants/${applicantId}/status`,
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${recToken}`, 'Content-Type': 'application/json' }
      }, {
        status: 'Shortlisted',
        interview_date: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
        interview_notes: 'Technical Round 1 scheduled via Google Meet'
      });
      assert('Recruiter Shortlist & Schedule Interview', updateStatus.status === 200 && updateStatus.data.success);
    }

    // 6. ROLE-BASED ACCESS CONTROL (RBAC) SECURITY TESTS
    const stuToAdmin = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/dashboard',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${stuToken}` }
    });
    assert('RBAC: Student forbidden from Admin endpoint', stuToAdmin.status === 403);

    const recToAdmin = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/dashboard',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${recToken}` }
    });
    assert('RBAC: Recruiter forbidden from Admin endpoint', recToAdmin.status === 403);

    const stuToRecruiter = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/recruiter/dashboard',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${stuToken}` }
    });
    assert('RBAC: Student forbidden from Recruiter endpoint', stuToRecruiter.status === 403);

    console.log(`\nVerification Complete! Passed: ${passed}, Failed: ${failed}`);
  } catch (err) {
    console.error('Fatal error during test run:', err);
  }
}

runTests();
