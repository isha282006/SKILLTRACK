const BASE_URL = 'http://localhost:3000/api';

async function req(url, options = {}) {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const data = await res.json();
  if (!res.ok && !data.success) {
    throw new Error(data.message || `HTTP ${res.status}`);
  }
  return data;
}

async function runTestSuite() {
  console.log('=================================================================');
  console.log('🧪 SkillTrack Full-Stack Verification Suite (Node.js + React API)');
  console.log('=================================================================\n');

  try {
    // 1. Health Check
    console.log('1. Testing System Health...');
    const health = await req('/health');
    console.log('   ✓ Health check status:', health.message);

    // 2. Student Authentication
    console.log('\n2. Testing Student 1-Click Demo Login...');
    const stuAuth = await req('/auth/demo-login/student');
    const studentToken = stuAuth.token;
    console.log('   ✓ Student token acquired for:', stuAuth.user.email);
    const stuHeaders = { Authorization: `Bearer ${studentToken}` };

    // 3. Student Dashboard & Readiness Score
    console.log('\n3. Testing Student Dashboard & Placement Readiness...');
    const stuDash = await req('/student/dashboard', { headers: stuHeaders });
    const readiness = stuDash.data.readiness;
    console.log(`   ✓ Placement Readiness Score: ${readiness.score}/100 (${readiness.category})`);
    console.log(`   ✓ Formula Breakdown: Tech: ${readiness.breakdown.technical.earned}/35, Apt: ${readiness.breakdown.aptitude.earned}/25, Comm: ${readiness.breakdown.communication.earned}/20, Acad: ${readiness.breakdown.academic.earned}/20`);
    console.log(`   ✓ Verified Skills Count: ${stuDash.data.totalSkills}`);
    console.log(`   ✓ Eligible Jobs Matching: ${stuDash.data.eligibleJobsCount}`);

    // 4. Skills Matrix & Dynamic Addition
    console.log('\n4. Testing Skills Matrix...');
    const skillsRes = await req('/student/skills', { headers: stuHeaders });
    console.log(`   ✓ Current skills in matrix: ${skillsRes.data.studentSkills.length}`);
    const addSkillRes = await req('/student/skills', {
      method: 'POST',
      headers: stuHeaders,
      body: JSON.stringify({
        custom_skill_name: 'TypeScript',
        category: 'Programming Languages',
        proficiency: 'Advanced'
      })
    });
    console.log('   ✓ Dynamically added skill:', addSkillRes.message);

    // 5. Online Proctored Assessments
    console.log('\n5. Testing Online Assessment & Auto-Scoring Engine...');
    const assessmentsRes = await req('/student/assessments', { headers: stuHeaders });
    const quiz1 = assessmentsRes.data.assessments[0];
    console.log(`   ✓ Available Quizzes: ${assessmentsRes.data.assessments.length} (Testing "${quiz1.title}")`);

    // Submit Quiz Answers
    const quizSubmitRes = await req(`/student/assessments/${quiz1.id}/take`, {
      method: 'POST',
      headers: stuHeaders,
      body: JSON.stringify({
        answers: { 1: 'C', 2: 'B', 3: 'C', 4: 'B', 5: 'A' },
        time_taken_seconds: 180
      })
    });
    console.log(`   ✓ Quiz Evaluated! Score: ${quizSubmitRes.result.score}/${quizSubmitRes.result.totalMarks} (${quizSubmitRes.result.percentage}%) - Passed: ${quizSubmitRes.result.passed}`);

    // 6. Placement Drives & Real-Time Eligibility Checking
    console.log('\n6. Testing Placement Opportunities & Eligibility Audit...');
    const jobsRes = await req('/jobs', { headers: stuHeaders });
    console.log(`   ✓ Total Placement Drives: ${jobsRes.data.length}`);
    jobsRes.data.forEach(item => {
      console.log(`     - [${item.eligibility.isEligible ? 'ELIGIBLE' : 'INELIGIBLE'}] ${item.job.title} at ${item.job.company.name} (${item.job.salary_range || item.job.salary_package})`);
    });

    // 7. Campus Admin Management
    console.log('\n7. Testing Campus Admin Portal...');
    const adminAuth = await req('/auth/demo-login/admin');
    const adminToken = adminAuth.token;
    const adminHeaders = { Authorization: `Bearer ${adminToken}` };
    const adminDash = await req('/admin/dashboard', { headers: adminHeaders });
    console.log(`   ✓ Admin Metrics: ${adminDash.data.totalStudents} Students, ${adminDash.data.totalCompanies} Companies, ${adminDash.data.totalJobs} Drives, Placement Rate: ${adminDash.data.placementRate}%`);

    // Admin Reports
    const reportsRes = await req('/admin/reports', { headers: adminHeaders });
    console.log(`   ✓ Institutional Report: Highest CTC: ₹ ${reportsRes.data.highestCtc} LPA, Average CTC: ₹ ${reportsRes.data.avgCtc} LPA`);

    // 8. Recruiter Hiring Pipeline
    console.log('\n8. Testing Recruiter Portal (Google)...');
    const recAuth = await req('/auth/demo-login/recruiter');
    const recToken = recAuth.token;
    const recHeaders = { Authorization: `Bearer ${recToken}` };
    const recDash = await req('/recruiter/dashboard', { headers: recHeaders });
    console.log(`   ✓ Recruiter Workspace: Company: ${recDash.data.company.name}, Active Openings: ${recDash.data.activeJobsCount}, Total Applicants: ${recDash.data.totalApplicants}`);

    const applicantsRes = await req('/recruiter/applicants', { headers: recHeaders });
    console.log(`   ✓ Candidate Pool Loaded: ${applicantsRes.data.applicantData.length} submissions with live readiness scores.`);

    console.log('\n=================================================================');
    console.log('🎉 ALL FULL-STACK SYSTEM TESTS PASSED SUCCESSFULLY! (100% OPERATIONAL)');
    console.log('=================================================================\n');
  } catch (err) {
    console.error('❌ Verification Error:', err.message);
    process.exit(1);
  }
}

runTestSuite();
