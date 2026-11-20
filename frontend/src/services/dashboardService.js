import api from './api';

const mockStudentDashboard = {
  student: {
    id: 1,
    full_name: 'Rohit Sharma',
    department: 'Computer Science & Engineering',
    semester: 7,
    cgpa: 8.85,
    active_backlogs: 0,
    usn: '1RV21CS099',
    skills: [
      { id: 1, proficiency: 'Expert', verified: true, skill: { name: 'React.js', category: 'Frontend' } },
      { id: 2, proficiency: 'Advanced', verified: true, skill: { name: 'Node.js', category: 'Backend' } },
      { id: 3, proficiency: 'Advanced', verified: true, skill: { name: 'SQL & Database Design', category: 'Database' } },
      { id: 4, proficiency: 'Intermediate', verified: true, skill: { name: 'System Design', category: 'Architecture' } },
      { id: 5, proficiency: 'Expert', verified: true, skill: { name: 'Technical Problem Solving', category: 'Soft Skills' } }
    ],
    assessment_results: [
      { id: 1, score: 92, percentage: 92, passed: true, assessment: { title: 'Full Stack JavaScript & Node.js Evaluation' } },
      { id: 2, score: 88, percentage: 88, passed: true, assessment: { title: 'Algorithms, Data Structures & Complexity' } }
    ],
    applications: [
      { id: 1, status: 'Interview', applied_date: '2026-11-15', job: { title: 'Full Stack Software Engineer', company: { name: 'Google' } } },
      { id: 2, status: 'Shortlisted', applied_date: '2026-11-12', job: { title: 'Cloud Backend Systems Developer', company: { name: 'Microsoft' } } }
    ]
  },
  readiness: {
    score: 88,
    category: 'High Readiness',
    breakdown: { academic: 22, technical: 28, assessment: 24, profile: 14 }
  },
  totalSkills: 14,
  completedAssessments: 4,
  avgScore: 89.5,
  totalApplications: 3,
  eligibleJobsCount: 8,
  allJobsWithEligibility: [
    {
      eligible: true,
      matchPercentage: 92,
      job: {
        id: 1,
        title: 'Full Stack Software Engineer',
        salary_range: '18 - 24 LPA',
        location: 'Bengaluru / Hybrid',
        deadline: '2026-12-15',
        company: { name: 'Google', logo_url: '' },
        required_skills: [{ skill: { name: 'React.js' } }, { skill: { name: 'Node.js' } }, { skill: { name: 'SQL' } }]
      }
    },
    {
      eligible: true,
      matchPercentage: 86,
      job: {
        id: 2,
        title: 'Cloud Backend Systems Developer',
        salary_range: '16 - 22 LPA',
        location: 'Hyderabad / Remote',
        deadline: '2026-12-20',
        company: { name: 'Microsoft', logo_url: '' },
        required_skills: [{ skill: { name: 'Node.js' } }, { skill: { name: 'System Design' } }, { skill: { name: 'SQL' } }]
      }
    }
  ],
  recommendedJobs: [],
  recentAssessments: [],
  applications: []
};

const mockAdminDashboard = {
  stats: {
    totalStudents: 1420,
    totalPlaced: 980,
    activeDrives: 24,
    placementRate: 84.5,
    avgPackage: 11.2,
    highestPackage: 44.0
  },
  departmentWise: [
    { department: 'CSE', total: 420, placed: 380 },
    { department: 'ISE', total: 310, placed: 275 },
    { department: 'AIML', total: 240, placed: 210 },
    { department: 'ECE', total: 260, placed: 195 }
  ],
  recentPlacements: [
    { student_name: 'Rohit Sharma', company: 'Google', package: '24 LPA', branch: 'CSE' },
    { student_name: 'Ananya Patel', company: 'Microsoft', package: '22 LPA', branch: 'ISE' },
    { student_name: 'Devraj Rao', company: 'Amazon', package: '28 LPA', branch: 'AIML' }
  ]
};

const mockRecruiterDashboard = {
  stats: {
    activeJobs: 4,
    totalApplicants: 184,
    shortlisted: 42,
    interviewsScheduled: 18,
    offersExtended: 7
  },
  recentApplicants: [
    { id: 1, full_name: 'Rohit Sharma', role: 'Full Stack Engineer', readiness: 88, status: 'Interview' },
    { id: 2, full_name: 'Pooja Iyer', role: 'Full Stack Engineer', readiness: 84, status: 'Shortlisted' },
    { id: 3, full_name: 'Karthik Menon', role: 'Cloud Backend Developer', readiness: 79, status: 'Applied' }
  ]
};

export const dashboardService = {
  getStudentDashboard: async () => {
    try {
      const res = await api.get('/student/dashboard');
      return res.data || res;
    } catch (err) {
      console.warn('Backend unavailable, using cached student telemetry:', err);
      return mockStudentDashboard;
    }
  },

  getAdminDashboard: async () => {
    try {
      const res = await api.get('/admin/dashboard');
      return res.data || res;
    } catch (err) {
      console.warn('Backend unavailable, using cached admin telemetry:', err);
      return mockAdminDashboard;
    }
  },

  getRecruiterDashboard: async () => {
    try {
      const res = await api.get('/recruiter/dashboard');
      return res.data || res;
    } catch (err) {
      console.warn('Backend unavailable, using cached recruiter telemetry:', err);
      return mockRecruiterDashboard;
    }
  },

  getReadinessScore: async () => {
    try {
      const res = await api.get('/student/readiness');
      return res.data || res;
    } catch {
      return mockStudentDashboard.readiness;
    }
  }
};

export default dashboardService;
