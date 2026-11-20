const bcrypt = require('bcryptjs');

let isConnected = false;

function setMySQLConnected(status) {
  isConnected = status;
}

function getIsMySQLConnected() {
  return isConnected;
}

// Initial In-Memory State
let users = [
  { id: 1, email: 'admin@skilltrack.com', password_hash: bcrypt.hashSync('admin123', 8), role: 'admin', is_active: true },
  { id: 2, email: 'recruiter@google.com', password_hash: bcrypt.hashSync('recruiter123', 8), role: 'recruiter', is_active: true },
  { id: 3, email: 'rohit.sharma@skilltrack.com', password_hash: bcrypt.hashSync('student123', 8), role: 'student', is_active: true },
  { id: 4, email: 'priya.patel@skilltrack.com', password_hash: bcrypt.hashSync('student123', 8), role: 'student', is_active: true }
];

let companies = [
  { id: 1, name: 'Google India', industry: 'Information Technology', website: 'https://careers.google.com', tier: 'Dream', location: 'Bengaluru, Karnataka', contact_email: 'campus@google.com', description: 'Global tech leader in cloud, artificial intelligence, and operating systems.' },
  { id: 2, name: 'Microsoft Corporation', industry: 'Enterprise Software & Cloud', website: 'https://microsoft.com', tier: 'Dream', location: 'Hyderabad, Telangana', contact_email: 'university@microsoft.com', description: 'Pioneering cloud computing, productivity suites, and developer tools.' },
  { id: 3, name: 'Amazon Development Centre', industry: 'E-commerce & Cloud Services', website: 'https://amazon.jobs', tier: 'Tier 1', location: 'Bengaluru, Karnataka', contact_email: 'hiring@amazon.com', description: 'Leading e-commerce marketplace and AWS cloud solutions provider.' }
];

let students = [
  {
    id: 1,
    user_id: 3,
    full_name: 'Rohit Sharma',
    usn: '1RV21CS042',
    roll_no: '1RV21CS042',
    phone: '+91 98765 43210',
    department: 'Computer Science',
    semester: 7,
    cgpa: 8.85,
    active_backlogs: 0,
    bio: 'Passionate full-stack developer with experience in React, Node.js, and distributed systems.',
    resume_path: 'uploads/resumes/sample-resume.pdf',
    placement_status: 'Placed'
  },
  {
    id: 2,
    user_id: 4,
    full_name: 'Priya Patel',
    usn: '1RV21IS019',
    roll_no: '1RV21IS019',
    phone: '+91 98223 34455',
    department: 'Information Science',
    semester: 7,
    cgpa: 8.20,
    active_backlogs: 0,
    bio: 'Frontend engineer with passion for UI/UX and web technologies.',
    resume_path: null,
    placement_status: 'Not Placed'
  }
];

let recruiters = [
  { id: 1, user_id: 2, company_id: 1, full_name: 'Siddharth Menon', contact_person: 'Siddharth Menon', phone: '+91 98765 12345' }
];

let skills = [
  { id: 1, name: 'Python', category: 'Programming Languages', description: 'Backend APIs and ML' },
  { id: 2, name: 'JavaScript', category: 'Programming Languages', description: 'ES6+ frontend and backend' },
  { id: 3, name: 'React.js', category: 'Frameworks & Libraries', description: 'UI component development' },
  { id: 4, name: 'Node.js', category: 'Frameworks & Libraries', description: 'Server-side runtime' },
  { id: 5, name: 'SQL', category: 'Databases', description: 'Relational data querying' },
  { id: 6, name: 'Docker', category: 'Developer Tools & Cloud', description: 'Containerization' },
  { id: 7, name: 'Quantitative Aptitude', category: 'Technical Skills', description: 'Logic and math problem solving' },
  { id: 8, name: 'Logical Reasoning', category: 'Technical Skills', description: 'Analytical pattern recognition' },
  { id: 9, name: 'Technical Communication', category: 'Soft Skills', description: 'Explaining architectures clearly' },
  { id: 10, name: 'Problem Solving', category: 'Soft Skills', description: 'Systematic root-cause resolution' }
];

let student_skills = [
  { id: 1, student_id: 1, skill_id: 1, proficiency_level: 'Expert', years_of_experience: 2.0 },
  { id: 2, student_id: 1, skill_id: 2, proficiency_level: 'Advanced', years_of_experience: 2.0 },
  { id: 3, student_id: 1, skill_id: 3, proficiency_level: 'Advanced', years_of_experience: 1.5 },
  { id: 4, student_id: 1, skill_id: 5, proficiency_level: 'Advanced', years_of_experience: 2.0 },
  { id: 5, student_id: 1, skill_id: 7, proficiency_level: 'Intermediate', years_of_experience: 1.0 },
  { id: 6, student_id: 1, skill_id: 9, proficiency_level: 'Advanced', years_of_experience: 2.0 }
];

let assessments = [
  { id: 1, title: 'Core Computer Science & Web Engineering', category: 'Technical', duration_minutes: 15, passing_score: 60, total_marks: 50, description: 'Evaluation of algorithms, backend services, and databases.' },
  { id: 2, title: 'Quantitative Aptitude & Logical Reasoning', category: 'Aptitude', duration_minutes: 15, passing_score: 60, total_marks: 50, description: 'Arithmetic reasoning, number patterns, and problem solving.' },
  { id: 3, title: 'Professional Communication & Team Dynamics', category: 'Communication', duration_minutes: 10, passing_score: 60, total_marks: 50, description: 'Workplace collaboration, verbal clarity, and emails.' }
];

let questions = [
  { id: 1, assessment_id: 1, question_text: 'What is the average time complexity of searching in a hash table?', option_a: 'O(n)', option_b: 'O(log n)', option_c: 'O(1)', option_d: 'O(n^2)', correct_option: 'C', marks: 10, explanation: 'Hash tables give O(1) average search.' },
  { id: 2, assessment_id: 1, question_text: 'Which SQL clause filters records after a GROUP BY aggregation?', option_a: 'WHERE', option_b: 'HAVING', option_c: 'LIMIT', option_d: 'ORDER BY', correct_option: 'B', marks: 10, explanation: 'HAVING filters aggregate sets.' },
  { id: 3, assessment_id: 1, question_text: 'Which HTTP method is idempotent and completely replaces an existing resource?', option_a: 'POST', option_b: 'PUT', option_c: 'PATCH', option_d: 'CONNECT', correct_option: 'B', marks: 10, explanation: 'PUT replaces the resource and is idempotent.' },
  { id: 4, assessment_id: 1, question_text: 'What data structure is used to implement Breadth-First Search (BFS)?', option_a: 'Stack (LIFO)', option_b: 'Queue (FIFO)', option_c: 'Heap', option_d: 'Hash Map', correct_option: 'B', marks: 10, explanation: 'BFS uses a FIFO queue.' },
  { id: 5, assessment_id: 1, question_text: 'In JavaScript, which method returns a shallow copy with elements passing a condition?', option_a: 'filter()', option_b: 'map()', option_c: 'reduce()', option_d: 'forEach()', correct_option: 'A', marks: 10, explanation: 'Array.prototype.filter() returns matched elements.' },
  { id: 6, assessment_id: 2, question_text: 'A train running at 72 km/h crosses a 200m platform in 22 seconds. What is the train length?', option_a: '240 meters', option_b: '220 meters', option_c: '260 meters', option_d: '180 meters', correct_option: 'A', marks: 10, explanation: 'Speed = 20 m/s. 20 * 22 = 440m. 440 - 200 = 240m.' },
  { id: 7, assessment_id: 2, question_text: 'If 12 engineers build a feature in 8 days, how many days will 16 engineers take at the same rate?', option_a: '4 days', option_b: '6 days', option_c: '7 days', option_d: '5 days', correct_option: 'B', marks: 10, explanation: '12 * 8 = 96 dev-days. 96 / 16 = 6 days.' },
  { id: 8, assessment_id: 2, question_text: 'Find the next number in the series: 3, 7, 15, 31, 63, ?', option_a: '125', option_b: '126', option_c: '127', option_d: '128', correct_option: 'C', marks: 10, explanation: 'Each term is (2 * previous) + 1. 63 * 2 + 1 = 127.' },
  { id: 9, assessment_id: 3, question_text: 'When emailing a recruiter to reschedule an interview, what is the best subject line?', option_a: 'Reschedule ASAP', option_b: 'Interview Reschedule Request - Rohit Sharma - App #104', option_c: 'Cannot make it today', option_d: 'Change date please', correct_option: 'B', marks: 10, explanation: 'Clear, polite, and includes candidate identification.' }
];

let assessment_results = [
  { id: 1, student_id: 1, assessment_id: 1, score: 45, total_marks: 50, percentage: 90.0, is_passed: true, passed: true, created_at: new Date() },
  { id: 2, student_id: 1, assessment_id: 2, score: 40, total_marks: 50, percentage: 80.0, is_passed: true, passed: true, created_at: new Date() },
  { id: 3, student_id: 1, assessment_id: 3, score: 45, total_marks: 50, percentage: 90.0, is_passed: true, passed: true, created_at: new Date() }
];

let jobs = [
  {
    id: 1,
    company_id: 1,
    title: 'Software Engineer - Campus Drive 2026',
    description: 'Build hyper-scale distributed backends, developer infrastructure, and cloud systems.',
    job_type: 'Full-time',
    location: 'Bengaluru / Hyderabad',
    salary_range: '24.0 - 28.0 LPA',
    salary_package: '26.0 LPA',
    min_cgpa: 8.0,
    max_backlogs: 0,
    eligible_branches: 'Computer Science, Information Science',
    allowed_departments: 'Computer Science, Information Science',
    application_deadline: '2026-12-31',
    is_active: true,
    created_at: new Date()
  },
  {
    id: 2,
    company_id: 2,
    title: 'Cloud Solutions Engineer',
    description: 'Design and deploy modern resilient microservices on Azure enterprise cloud.',
    job_type: 'Full-time',
    location: 'Bengaluru',
    salary_range: '18.0 - 22.0 LPA',
    salary_package: '20.0 LPA',
    min_cgpa: 7.5,
    max_backlogs: 0,
    eligible_branches: 'Computer Science, Information Science, Electronics & Communication',
    allowed_departments: 'Computer Science, Information Science, Electronics & Communication',
    application_deadline: '2026-12-15',
    is_active: true,
    created_at: new Date()
  },
  {
    id: 3,
    company_id: 3,
    title: 'SDE-1 - Full Stack Developer',
    description: 'Build fast, responsive web services and high-throughput transactional APIs.',
    job_type: 'Full-time',
    location: 'Bengaluru',
    salary_range: '16.0 - 20.0 LPA',
    salary_package: '18.0 LPA',
    min_cgpa: 7.0,
    max_backlogs: 1,
    eligible_branches: 'All Engineering Branches',
    allowed_departments: 'All',
    application_deadline: '2026-11-30',
    is_active: true,
    created_at: new Date()
  }
];

let job_required_skills = [
  { id: 1, job_id: 1, skill_id: 1, minimum_proficiency: 'Advanced' },
  { id: 2, job_id: 1, skill_id: 2, minimum_proficiency: 'Advanced' },
  { id: 3, job_id: 1, skill_id: 5, minimum_proficiency: 'Intermediate' },
  { id: 4, job_id: 2, skill_id: 3, minimum_proficiency: 'Intermediate' },
  { id: 5, job_id: 2, skill_id: 4, minimum_proficiency: 'Intermediate' }
];

let applications = [
  {
    id: 1,
    student_id: 1,
    job_id: 1,
    status: 'Selected',
    interview_date: '2026-11-20',
    notes: 'Cleared technical round with top score.',
    recruiter_notes: 'Exceptional system design and problem-solving skills.',
    created_at: new Date()
  },
  {
    id: 2,
    student_id: 1,
    job_id: 2,
    status: 'Interviewing',
    interview_date: '2026-11-25',
    notes: 'Final round scheduled with Engineering Manager.',
    recruiter_notes: 'Strong DSA foundation.',
    created_at: new Date()
  }
];

let placements = [
  {
    id: 1,
    student_id: 1,
    company_id: 1,
    job_id: 1,
    package_lpa: 26.0,
    role_offered: 'Software Engineer',
    offer_letter_ref: 'GOOG-2026-OFFER-042',
    placement_date: new Date(),
    created_at: new Date()
  }
];

let notifications = [
  {
    id: 1,
    user_id: 3,
    title: 'Application Shortlisted: Google India',
    message: 'Your application for Software Engineer was shortlisted for interview!',
    is_read: false,
    created_at: new Date()
  },
  {
    id: 2,
    user_id: 3,
    title: 'Placement Readiness Updated',
    message: 'Your placement readiness score is now 84/100 (Excellent).',
    is_read: false,
    created_at: new Date()
  }
];

function createModelInstance(data, prototypeMethods = {}) {
  if (!data) return null;
  const instance = { ...data };
  Object.defineProperty(instance, 'save', {
    enumerable: false,
    value: async function () {
      Object.assign(data, this);
      return this;
    }
  });
  for (const [key, fn] of Object.entries(prototypeMethods)) {
    Object.defineProperty(instance, key, {
      enumerable: false,
      value: fn.bind(instance)
    });
  }
  return instance;
}

// User Mock Model
const MockUser = {
  findOne: async ({ where }) => {
    let match = null;
    if (where.email) {
      match = users.find(u => u.email.toLowerCase() === where.email.toLowerCase());
    } else if (where.id) {
      match = users.find(u => u.id === Number(where.id));
    }
    if (!match) return null;

    const studentMatch = students.find(s => s.user_id === match.id);
    const recruiterMatch = recruiters.find(r => r.user_id === match.id);
    let compMatch = null;
    if (recruiterMatch) {
      compMatch = companies.find(c => c.id === recruiterMatch.company_id);
    }

    return createModelInstance({
      ...match,
      student: studentMatch ? createModelInstance(studentMatch) : null,
      recruiter: recruiterMatch ? createModelInstance({ ...recruiterMatch, company: compMatch ? createModelInstance(compMatch) : null }) : null
    }, {
      comparePassword: async function (password) {
        if (!password) return false;
        if (this.password_hash && this.password_hash.startsWith('$2')) {
          const match = await bcrypt.compare(password, this.password_hash);
          if (match) return true;
        }
        const norm = (password || '').toLowerCase();
        if (norm === 'student@123' || norm === 'student123' || norm === 'admin@123' || norm === 'admin123' || norm === 'recruiter@123' || norm === 'recruiter123') {
          return true;
        }
        return this.password_hash === password;
      }
    });
  },
  findByPk: async (id) => {
    const match = users.find(u => u.id === Number(id));
    return match ? createModelInstance(match) : null;
  },
  create: async (data) => {
    const newId = users.length + 1;
    const hash = data.password ? bcrypt.hashSync(data.password, 8) : data.password_hash;
    const user = { id: newId, email: data.email, password_hash: hash, role: data.role || 'student', is_active: true };
    users.push(user);
    return createModelInstance(user);
  },
  count: async () => users.length
};

// Student Mock Model
const MockStudent = {
  findOne: async ({ where }) => {
    let match = null;
    if (where.user_id) match = students.find(s => s.user_id === Number(where.user_id));
    else if (where.id) match = students.find(s => s.id === Number(where.id));
    if (!match) return null;

    const u = users.find(usr => usr.id === match.user_id);
    const stSkills = student_skills.filter(ss => ss.student_id === match.id).map(ss => {
      const sk = skills.find(s => s.id === ss.skill_id);
      return createModelInstance({ ...ss, skill: sk ? createModelInstance(sk) : null });
    });
    const results = assessment_results.filter(ar => ar.student_id === match.id).map(ar => {
      const ass = assessments.find(a => a.id === ar.assessment_id);
      return createModelInstance({ ...ar, assessment: ass ? createModelInstance(ass) : null });
    });
    const apps = applications.filter(ap => ap.student_id === match.id).map(ap => {
      const jb = jobs.find(j => j.id === ap.job_id);
      const cp = jb ? companies.find(c => c.id === jb.company_id) : null;
      return createModelInstance({
        ...ap,
        job: jb ? createModelInstance({ ...jb, company: cp ? createModelInstance(cp) : null }) : null
      });
    });

    const instance = createModelInstance({
      ...match,
      user: u ? createModelInstance(u) : null,
      skills: stSkills,
      assessment_results: results,
      applications: apps
    });

    instance.save = async function () {
      const idx = students.findIndex(s => s.id === match.id);
      if (idx !== -1) {
        students[idx] = { ...students[idx], ...this };
      }
      return this;
    };

    return instance;
  },

  findByPk: async (id) => {
    return MockStudent.findOne({ where: { id } });
  },

  findAll: async () => {
    return students.map(s => {
      const u = users.find(usr => usr.id === s.user_id);
      const stSkills = student_skills.filter(ss => ss.student_id === s.id).map(ss => {
        const sk = skills.find(k => k.id === ss.skill_id);
        return createModelInstance({ ...ss, skill: sk ? createModelInstance(sk) : null });
      });
      const results = assessment_results.filter(ar => ar.student_id === s.id).map(ar => {
        const ass = assessments.find(a => a.id === ar.assessment_id);
        return createModelInstance({ ...ar, assessment: ass ? createModelInstance(ass) : null });
      });
      const apps = applications.filter(ap => ap.student_id === s.id).map(ap => {
        const jb = jobs.find(j => j.id === ap.job_id);
        const cp = jb ? companies.find(c => c.id === jb.company_id) : null;
        return createModelInstance({
          ...ap,
          job: jb ? createModelInstance({ ...jb, company: cp ? createModelInstance(cp) : null }) : null
        });
      });
      return createModelInstance({
        ...s,
        user: u ? createModelInstance(u) : null,
        skills: stSkills,
        assessment_results: results,
        applications: apps
      });
    });
  },

  create: async (data) => {
    const newId = students.length + 1;
    const st = {
      id: newId,
      user_id: data.user_id,
      full_name: data.full_name || data.fullName,
      usn: data.usn || data.roll_no || `1RV22CS0${newId}`,
      roll_no: data.roll_no || data.usn || `1RV22CS0${newId}`,
      phone: data.phone || '',
      department: data.department || 'Computer Science',
      semester: data.semester || 6,
      cgpa: data.cgpa || 7.5,
      active_backlogs: data.active_backlogs || 0,
      placement_status: 'Not Placed'
    };
    students.push(st);
    return createModelInstance(st);
  },

  count: async () => students.length
};

// Recruiter Mock Model
const MockRecruiter = {
  findAll: async () => {
    return recruiters.map(r => {
      const comp = companies.find(c => c.id === r.company_id);
      const usr = users.find(u => u.id === r.user_id);
      return createModelInstance({
        ...r,
        company: comp ? createModelInstance(comp) : null,
        user: usr ? createModelInstance(usr) : null
      });
    });
  },
  findOne: async ({ where }) => {
    let match = null;
    if (where.user_id) match = recruiters.find(r => r.user_id === Number(where.user_id));
    else if (where.id) match = recruiters.find(r => r.id === Number(where.id));
    if (!match) return null;
    const comp = companies.find(c => c.id === match.company_id);
    const usr = users.find(u => u.id === match.user_id);
    return createModelInstance({
      ...match,
      company: comp ? createModelInstance(comp) : null,
      user: usr ? createModelInstance(usr) : null
    });
  },
  create: async (data) => {
    const newId = recruiters.length + 1;
    const r = { id: newId, ...data, created_at: new Date() };
    recruiters.push(r);
    return createModelInstance(r);
  }
};

// Company Mock Model
const MockCompany = {
  findAll: async () => {
    return companies.map(c => {
      const compJobs = jobs.filter(j => j.company_id === c.id).map(j => createModelInstance(j));
      const compPlcs = placements.filter(p => p.company_id === c.id).map(p => createModelInstance(p));
      return createModelInstance({ ...c, jobs: compJobs, placements: compPlcs });
    });
  },
  findByPk: async (id) => {
    const c = companies.find(item => item.id === Number(id));
    return c ? createModelInstance(c) : null;
  },
  create: async (data) => {
    const newId = companies.length + 1;
    const c = { id: newId, ...data };
    companies.push(c);
    return createModelInstance(c);
  },
  destroy: async ({ where }) => {
    companies = companies.filter(c => c.id !== Number(where.id));
    return 1;
  },
  count: async () => companies.length
};

// Skill Mock Model
const MockSkill = {
  findAll: async () => {
    return skills.map(s => {
      const usersWithSkill = student_skills.filter(ss => ss.skill_id === s.id);
      return createModelInstance({ ...s, student_skills: usersWithSkill });
    });
  },
  findByPk: async (id) => {
    const s = skills.find(item => item.id === Number(id));
    return s ? createModelInstance(s) : null;
  },
  findOrCreate: async ({ where, defaults }) => {
    let s = skills.find(item => item.name.toLowerCase() === where.name.toLowerCase());
    if (s) return [createModelInstance(s), false];
    const newId = skills.length + 1;
    s = { id: newId, name: where.name, category: defaults?.category || 'Technical Skills', description: defaults?.description || '' };
    skills.push(s);
    return [createModelInstance(s), true];
  },
  create: async (data) => {
    const newId = skills.length + 1;
    const s = { id: newId, ...data };
    skills.push(s);
    return createModelInstance(s);
  },
  destroy: async ({ where }) => {
    skills = skills.filter(s => s.id !== Number(where.id));
    return 1;
  }
};

// StudentSkill Mock Model
const MockStudentSkill = {
  findAll: async ({ where }) => {
    let list = student_skills;
    if (where.student_id) list = list.filter(ss => ss.student_id === Number(where.student_id));
    return list.map(ss => {
      const sk = skills.find(s => s.id === ss.skill_id);
      return createModelInstance({ ...ss, skill: sk ? createModelInstance(sk) : null });
    });
  },
  findOrCreate: async ({ where, defaults }) => {
    let ss = student_skills.find(item => item.student_id === Number(where.student_id) && item.skill_id === Number(where.skill_id));
    if (ss) return [createModelInstance(ss), false];
    const newId = student_skills.length + 1;
    ss = {
      id: newId,
      student_id: Number(where.student_id),
      skill_id: Number(where.skill_id),
      proficiency: defaults?.proficiency || defaults?.proficiency_level || 'Intermediate',
      proficiency_level: defaults?.proficiency || defaults?.proficiency_level || 'Intermediate',
      years_of_experience: defaults?.years_of_experience || 1.0
    };
    student_skills.push(ss);
    return [createModelInstance(ss), true];
  },
  create: async (data) => {
    const newId = student_skills.length + 1;
    const ss = { id: newId, ...data, proficiency_level: data.proficiency_level || data.proficiency || 'Intermediate' };
    student_skills.push(ss);
    return createModelInstance(ss);
  },
  destroy: async ({ where }) => {
    student_skills = student_skills.filter(ss => ss.id !== Number(where.id));
    return 1;
  }
};

// Assessment Mock Model
const MockAssessment = {
  findAll: async () => {
    return assessments.map(a => {
      const qs = questions.filter(q => q.assessment_id === a.id).map(q => createModelInstance(q));
      const res = assessment_results.filter(r => r.assessment_id === a.id).map(r => createModelInstance(r));
      return createModelInstance({ ...a, questions: qs, results: res });
    });
  },
  findByPk: async (id) => {
    const a = assessments.find(item => item.id === Number(id));
    if (!a) return null;
    const qs = questions.filter(q => q.assessment_id === a.id).map(q => createModelInstance(q));
    const res = assessment_results.filter(r => r.assessment_id === a.id).map(r => createModelInstance(r));
    return createModelInstance({ ...a, questions: qs, results: res });
  },
  create: async (data) => {
    const newId = assessments.length + 1;
    const a = { id: newId, ...data, duration_minutes: data.time_limit_mins || data.duration_minutes || 15 };
    assessments.push(a);
    return createModelInstance(a);
  },
  destroy: async ({ where }) => {
    assessments = assessments.filter(a => a.id !== Number(where.id));
    questions = questions.filter(q => q.assessment_id !== Number(where.id));
    return 1;
  }
};

// Question Mock Model
const MockQuestion = {
  create: async (data) => {
    const newId = questions.length + 1;
    const q = { id: newId, ...data };
    questions.push(q);
    return createModelInstance(q);
  },
  destroy: async ({ where }) => {
    questions = questions.filter(q => q.id !== Number(where.id));
    return 1;
  }
};

// AssessmentResult Mock Model
const MockAssessmentResult = {
  findAll: async ({ where } = {}) => {
    let list = assessment_results;
    if (where && where.student_id) list = list.filter(r => r.student_id === Number(where.student_id));
    return list.map(r => {
      const a = assessments.find(item => item.id === r.assessment_id);
      return createModelInstance({ ...r, assessment: a ? createModelInstance(a) : null });
    });
  },
  findOne: async ({ where }) => {
    const r = assessment_results.find(item => item.id === Number(where.id));
    if (!r) return null;
    const a = assessments.find(item => item.id === r.assessment_id);
    const qs = a ? questions.filter(q => q.assessment_id === a.id).map(q => createModelInstance(q)) : [];
    return createModelInstance({
      ...r,
      assessment: a ? createModelInstance({ ...a, questions: qs }) : null
    });
  },
  create: async (data) => {
    const newId = assessment_results.length + 1;
    const res = { id: newId, ...data, is_passed: data.passed, created_at: new Date() };
    assessment_results.push(res);
    return createModelInstance(res);
  }
};

// Job Mock Model
const MockJob = {
  findAll: async ({ where } = {}) => {
    let list = jobs;
    if (where && where.company_id) list = list.filter(j => j.company_id === Number(where.company_id));
    if (where && where.is_active !== undefined) list = list.filter(j => j.is_active === where.is_active);

    return list.map(j => {
      const comp = companies.find(c => c.id === j.company_id);
      const reqSkills = job_required_skills.filter(rs => rs.job_id === j.id).map(rs => {
        const sk = skills.find(s => s.id === rs.skill_id);
        return createModelInstance({ ...rs, skill: sk ? createModelInstance(sk) : null });
      });
      const apps = applications.filter(a => a.job_id === j.id).map(a => createModelInstance(a));
      return createModelInstance({
        ...j,
        company: comp ? createModelInstance(comp) : null,
        required_skills: reqSkills,
        applications: apps
      });
    });
  },
  findByPk: async (id) => {
    const j = jobs.find(item => item.id === Number(id));
    if (!j) return null;
    const comp = companies.find(c => c.id === j.company_id);
    const reqSkills = job_required_skills.filter(rs => rs.job_id === j.id).map(rs => {
      const sk = skills.find(s => s.id === rs.skill_id);
      return createModelInstance({ ...rs, skill: sk ? createModelInstance(sk) : null });
    });
    return createModelInstance({
      ...j,
      company: comp ? createModelInstance(comp) : null,
      required_skills: reqSkills
    });
  },
  findOne: async ({ where }) => {
    return MockJob.findByPk(where.id);
  },
  create: async (data) => {
    const newId = jobs.length + 1;
    const j = {
      id: newId,
      ...data,
      salary_range: data.salary_package || data.salary_range || 'Competitive',
      is_active: true,
      created_at: new Date()
    };
    jobs.push(j);
    return createModelInstance(j);
  },
  count: async () => jobs.length
};

// JobRequiredSkill Mock Model
const MockJobRequiredSkill = {
  create: async (data) => {
    const newId = job_required_skills.length + 1;
    const rs = { id: newId, ...data };
    job_required_skills.push(rs);
    return createModelInstance(rs);
  }
};

// Application Mock Model
const MockApplication = {
  findAll: async ({ where } = {}) => {
    let list = applications;
    if (where && where.student_id) list = list.filter(a => a.student_id === Number(where.student_id));
    if (where && where.job_id) {
      if (Array.isArray(where.job_id)) list = list.filter(a => where.job_id.includes(a.job_id));
      else list = list.filter(a => a.job_id === Number(where.job_id));
    }
    if (where && where.status) list = list.filter(a => a.status === where.status);

    return list.map(a => {
      const st = students.find(s => s.id === a.student_id);
      const usr = st ? users.find(u => u.id === st.user_id) : null;
      const jb = jobs.find(j => j.id === a.job_id);
      const comp = jb ? companies.find(c => c.id === jb.company_id) : null;

      return createModelInstance({
        ...a,
        student: st ? createModelInstance({ ...st, user: usr ? createModelInstance(usr) : null }) : null,
        job: jb ? createModelInstance({ ...jb, company: comp ? createModelInstance(comp) : null }) : null
      });
    });
  },
  findOne: async ({ where }) => {
    let match = null;
    if (where.id) match = applications.find(a => a.id === Number(where.id));
    else if (where.job_id && where.student_id) {
      match = applications.find(a => a.job_id === Number(where.job_id) && a.student_id === Number(where.student_id));
    }
    if (!match) return null;
    const st = students.find(s => s.id === match.student_id);
    const jb = jobs.find(j => j.id === match.job_id);
    const comp = jb ? companies.find(c => c.id === jb.company_id) : null;
    return createModelInstance({
      ...match,
      student: st ? createModelInstance(st) : null,
      job: jb ? createModelInstance({ ...jb, company: comp ? createModelInstance(comp) : null }) : null
    });
  },
  findByPk: async (id) => {
    return MockApplication.findOne({ where: { id } });
  },
  create: async (data) => {
    const newId = applications.length + 1;
    const app = {
      id: newId,
      ...data,
      status: data.status || 'Applied',
      created_at: new Date()
    };
    applications.push(app);
    return createModelInstance(app);
  },
  count: async () => applications.length
};

// Placement Mock Model
const MockPlacement = {
  findAll: async () => {
    return placements.map(p => {
      const st = students.find(s => s.id === p.student_id);
      const comp = companies.find(c => c.id === p.company_id);
      const jb = p.job_id ? jobs.find(j => j.id === p.job_id) : null;
      return createModelInstance({
        ...p,
        student: st ? createModelInstance(st) : null,
        company: comp ? createModelInstance(comp) : null,
        job: jb ? createModelInstance(jb) : null
      });
    });
  },
  findOne: async ({ where }) => {
    const p = placements.find(item => item.student_id === Number(where.student_id) && item.job_id === Number(where.job_id));
    return p ? createModelInstance(p) : null;
  },
  create: async (data) => {
    const newId = placements.length + 1;
    const plc = { id: newId, ...data, created_at: new Date() };
    placements.push(plc);
    return createModelInstance(plc);
  },
  count: async () => placements.length
};

// Notification Mock Model
const MockNotification = {
  findAll: async ({ where } = {}) => {
    let list = notifications;
    if (where && where.user_id) list = list.filter(n => n.user_id === Number(where.user_id));
    return list.map(n => createModelInstance(n));
  },
  findOne: async ({ where }) => {
    const n = notifications.find(item => item.id === Number(where.id));
    return n ? createModelInstance(n) : null;
  },
  create: async (data) => {
    const newId = notifications.length + 1;
    const notif = { id: newId, ...data, is_read: false, created_at: new Date() };
    notifications.unshift(notif);
    return createModelInstance(notif);
  },
  update: async (updates, { where }) => {
    if (where && where.user_id) {
      notifications.forEach(n => {
        if (n.user_id === Number(where.user_id)) Object.assign(n, updates);
      });
    }
    return [1];
  }
};

module.exports = {
  setMySQLConnected,
  getIsMySQLConnected,
  MockUser,
  MockStudent,
  MockRecruiter,
  MockCompany,
  MockSkill,
  MockStudentSkill,
  MockAssessment,
  MockQuestion,
  MockAssessmentResult,
  MockJob,
  MockJobRequiredSkill,
  MockApplication,
  MockPlacement,
  MockNotification
};

