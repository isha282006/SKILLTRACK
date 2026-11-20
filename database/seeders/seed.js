let bcrypt;
try {
  bcrypt = require('bcryptjs');
} catch (e) {
  bcrypt = require('../../backend/node_modules/bcryptjs');
}
const {
  sequelize,
  User,
  Student,
  Recruiter,
  Company,
  Skill,
  StudentSkill,
  Assessment,
  Question,
  AssessmentResult,
  Job,
  JobRequiredSkill,
  Application,
  Placement,
  Notification
} = require('../../backend/src/models');

async function seedDatabase() {
  try {
    console.log('➜ Syncing database models...');
    await sequelize.sync({ force: false });

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ where: { email: 'admin@skilltrack.com' } });
    if (existingAdmin) {
      console.log('✓ Database already seeded. Skipping initial data injection.');
      return;
    }

    console.log('➜ Injecting seed records for SkillTrack...');

    // 1. Admin
    const adminUser = await User.create({
      email: 'admin@skilltrack.com',
      password: 'Admin@123',
      role: 'admin'
    });

    // 2. Companies
    const google = await Company.create({
      name: 'Google India',
      industry: 'Technology / Cloud / AI',
      website: 'https://careers.google.com',
      location: 'Bengaluru, Karnataka',
      contact_email: 'campus-india@google.com',
      contact_phone: '+91-80-67218000',
      description: 'Google focuses on online search, cloud platforms, computer software, and AI intelligence.'
    });

    const microsoft = await Company.create({
      name: 'Microsoft Corporation',
      industry: 'Enterprise Software & Cloud',
      website: 'https://careers.microsoft.com',
      location: 'Hyderabad, Telangana',
      contact_email: 'university-hiring@microsoft.com',
      contact_phone: '+91-40-66950000',
      description: 'Microsoft enables digital transformation for the era of an intelligent cloud and edge.'
    });

    const amazon = await Company.create({
      name: 'Amazon Development Centre',
      industry: 'E-commerce & Cloud Services',
      website: 'https://amazon.jobs',
      location: 'Bengaluru, Karnataka',
      contact_email: 'in-campus-recruitment@amazon.com',
      contact_phone: '+91-80-41512000',
      description: 'Customer obsession, passion for invention, commitment to operational excellence.'
    });

    const tcs = await Company.create({
      name: 'Tata Consultancy Services',
      industry: 'IT Consulting & Global Services',
      website: 'https://www.tcs.com/careers',
      location: 'Mumbai, Maharashtra',
      contact_email: 'campus.recruitment@tcs.com',
      contact_phone: '+91-22-67789999',
      description: 'A part of the Tata group, TCS is an IT services and consulting organization.'
    });

    const infosys = await Company.create({
      name: 'Infosys Limited',
      industry: 'Digital Services & Consulting',
      website: 'https://www.infosys.com/careers',
      location: 'Bengaluru, Karnataka',
      contact_email: 'talent.acquisition@infosys.com',
      contact_phone: '+91-80-28520261',
      description: 'Global leader in next-generation digital services and consulting.'
    });

    // 3. Recruiters
    const recGoogleUser = await User.create({
      email: 'recruiter@google.com',
      password: 'Recruiter@123',
      role: 'recruiter'
    });
    await Recruiter.create({
      user_id: recGoogleUser.id,
      company_id: google.id,
      full_name: 'Siddharth Menon',
      designation: 'Lead University Talent Partner',
      phone: '+91-9876543210'
    });

    const recMsUser = await User.create({
      email: 'recruiter@microsoft.com',
      password: 'Recruiter@123',
      role: 'recruiter'
    });
    await Recruiter.create({
      user_id: recMsUser.id,
      company_id: microsoft.id,
      full_name: 'Pooja Singhania',
      designation: 'Senior University Recruiter',
      phone: '+91-9812345678'
    });

    // 4. Skills
    const skillsData = [
      { name: 'Python', category: 'Technical', description: 'Web development, data science, and scripting' },
      { name: 'Data Structures & Algorithms', category: 'Technical', description: 'Core CS fundamentals: Arrays, Trees, Graphs, Sorting' },
      { name: 'SQL', category: 'Technical', description: 'Relational database querying, joins, indexing' },
      { name: 'React.js', category: 'Technical', description: 'Frontend JavaScript library for UI components' },
      { name: 'JavaScript', category: 'Technical', description: 'Modern ES6+ frontend and backend browser programming' },
      { name: 'Java', category: 'Technical', description: 'Object-oriented programming language for enterprise systems' },
      { name: 'Docker', category: 'Technical', description: 'Containerization platform for application packaging' },
      { name: 'Git & GitHub', category: 'Technical', description: 'Distributed version control and collaboration' },
      { name: 'Machine Learning', category: 'Technical', description: 'Supervised and unsupervised models' },
      { name: 'Quantitative Aptitude', category: 'Aptitude', description: 'Arithmetic, percentages, ratios, permutations' },
      { name: 'Logical Reasoning', category: 'Aptitude', description: 'Analytical reasoning, puzzles, pattern recognition' },
      { name: 'Data Interpretation', category: 'Aptitude', description: 'Charts, graphs, statistical tables analysis' },
      { name: 'Technical Communication', category: 'Soft Skill', description: 'Explaining complex concepts clearly to stakeholders' },
      { name: 'Problem Solving', category: 'Soft Skill', description: 'Structured thinking and root cause analysis' },
      { name: 'Agile Collaboration', category: 'Soft Skill', description: 'Scrum ceremonies, team collaboration' },
      { name: 'Public Speaking', category: 'Soft Skill', description: 'Presenting projects and product demos' }
    ];

    const skillMap = {};
    for (const item of skillsData) {
      const s = await Skill.create(item);
      skillMap[item.name] = s;
    }

    // 5. Assessments & Questions
    const techAssessment = await Assessment.create({
      title: 'Core Computer Science & Web Engineering',
      category: 'Technical',
      description: 'Test your grasp on core data structures, Python programming, SQL databases, and web protocols.',
      time_limit_mins: 15,
      passing_score: 60,
      total_marks: 50,
      created_by: adminUser.id
    });

    const techQuestions = [
      {
        question_text: 'What is the average time complexity of searching for an element in a hash map?',
        option_a: 'O(n)', option_b: 'O(log n)', option_c: 'O(1)', option_d: 'O(n^2)',
        correct_option: 'C', marks: 10, explanation: 'Hash tables give average O(1) time complexity for lookup operations.'
      },
      {
        question_text: 'Which SQL clause is used to filter records resulting from a GROUP BY aggregation?',
        option_a: 'WHERE', option_b: 'HAVING', option_c: 'FILTER', option_d: 'LIMIT',
        correct_option: 'B', marks: 10, explanation: 'The HAVING clause filters aggregated result sets.'
      },
      {
        question_text: 'In RESTful API design, which HTTP method is typically used to create a new resource and is NOT idempotent?',
        option_a: 'GET', option_b: 'PUT', option_c: 'POST', option_d: 'DELETE',
        correct_option: 'C', marks: 10, explanation: 'POST creates new resources and repeating it produces multiple instances.'
      },
      {
        question_text: 'What data structure is typically used to implement Breadth-First Search (BFS)?',
        option_a: 'Stack (LIFO)', option_b: 'Queue (FIFO)', option_c: 'Priority Queue', option_d: 'Binary Search Tree',
        correct_option: 'B', marks: 10, explanation: 'BFS explores neighbor nodes layer by layer using a FIFO queue.'
      },
      {
        question_text: 'In JavaScript, which array method returns a new array with all elements that pass a test?',
        option_a: 'filter()', option_b: 'forEach()', option_c: 'map()', option_d: 'reduce()',
        correct_option: 'A', marks: 10, explanation: 'The filter() method shallow copies portions of an array matching a predicate.'
      }
    ];

    for (const q of techQuestions) {
      await Question.create({ assessment_id: techAssessment.id, ...q });
    }

    const aptAssessment = await Assessment.create({
      title: 'Quantitative Aptitude & Logical Reasoning',
      category: 'Aptitude',
      description: 'Evaluate quantitative problem-solving speed, numeric reasoning, and logical deductions.',
      time_limit_mins: 15,
      passing_score: 60,
      total_marks: 50,
      created_by: adminUser.id
    });

    const aptQuestions = [
      {
        question_text: 'A train running at 72 km/h crosses a 200m long platform in 22 seconds. What is the length of the train?',
        option_a: '240 meters', option_b: '220 meters', option_c: '260 meters', option_d: '180 meters',
        correct_option: 'A', marks: 10, explanation: 'Speed = 20 m/s. Total distance = 440m. Train length = 440 - 200 = 240m.'
      },
      {
        question_text: 'If 12 men can complete a project in 8 days, how many days will 16 men take at the same rate?',
        option_a: '4 days', option_b: '6 days', option_c: '7 days', option_d: '5 days',
        correct_option: 'B', marks: 10, explanation: 'Man-days = 96. Days for 16 men = 96 / 16 = 6 days.'
      },
      {
        question_text: 'Find the next number in the series: 3, 7, 15, 31, 63, ?',
        option_a: '125', option_b: '126', option_c: '127', option_d: '128',
        correct_option: 'C', marks: 10, explanation: 'Pattern: (previous * 2) + 1. (63 * 2) + 1 = 127.'
      },
      {
        question_text: 'A product marked at $1000 is sold at two successive discounts of 20% and 10%. What is the final price?',
        option_a: '$700', option_b: '$720', option_c: '$750', option_d: '$680',
        correct_option: 'B', marks: 10, explanation: 'After 20%: $800. After 10% on $800: $800 - 80 = $720.'
      },
      {
        question_text: 'Statements: All engineers are problem solvers. Some problem solvers are designers. Are some engineers designers?',
        option_a: 'Definitely True', option_b: 'Definitely False', option_c: 'Cannot be determined with certainty', option_d: 'None of the above',
        correct_option: 'C', marks: 10, explanation: 'The designer subset may or may not intersect with engineers.'
      }
    ];

    for (const q of aptQuestions) {
      await Question.create({ assessment_id: aptAssessment.id, ...q });
    }

    const commAssessment = await Assessment.create({
      title: 'Professional Communication & Workplace Dynamics',
      category: 'Communication',
      description: 'Assess corporate communication clarity, active listening, client presentation, and team collaboration.',
      time_limit_mins: 10,
      passing_score: 60,
      total_marks: 50,
      created_by: adminUser.id
    });

    const commQuestions = [
      {
        question_text: 'When writing an email to reschedule an executive interview, which subject line is most professional?',
        option_a: 'Reschedule meeting ASAP', option_b: 'Request to Reschedule Interview - [Your Name] - Application #2041', option_c: 'Cannot make it today', option_d: 'Change my time slot please',
        correct_option: 'B', marks: 10, explanation: 'Descriptive subject lines allow recruiters to prioritize immediately.'
      },
      {
        question_text: 'What is the primary characteristic of "Active Listening" in technical team standups?',
        option_a: 'Thinking about your next reply while others speak', option_b: 'Paraphrasing and confirming key requirements before acting', option_c: 'Staying completely silent without notes', option_d: 'Interrupting immediately if you know the solution',
        correct_option: 'B', marks: 10, explanation: 'Active listening validates comprehension by summarizing key points.'
      },
      {
        question_text: 'Which framework is widely recommended for answering behavioral interview questions?',
        option_a: 'SWOT framework', option_b: 'STAR technique (Situation, Task, Action, Result)', option_c: 'PESTLE analysis', option_d: 'Waterfall model',
        correct_option: 'B', marks: 10, explanation: 'STAR technique provides structured answers with measurable outcomes.'
      },
      {
        question_text: 'During a code review, a teammate suggests major refactoring. How should you constructively respond?',
        option_a: 'Reject the pull request immediately', option_b: 'Ask them to explain architectural trade-offs and suggest a collaborative call', option_c: 'Accept everything blindly', option_d: 'Ignore their comments',
        correct_option: 'B', marks: 10, explanation: 'Constructive code reviews encourage open inquiry into technical merits.'
      },
      {
        question_text: 'What tone is most effective when reporting a critical production incident to non-technical leadership?',
        option_a: 'Highly technical jargon and defensive justifications', option_b: 'Calm, objective, highlighting impact, immediate mitigation, and next update ETA', option_c: 'Casual and humorous', option_d: 'Blaming upstream third-party APIs',
        correct_option: 'B', marks: 10, explanation: 'Incident management requires calm, business-impact focused communication.'
      }
    ];

    for (const q of commQuestions) {
      await Question.create({ assessment_id: commAssessment.id, ...q });
    }

    // 6. Students
    const studentUsers = [
      {
        email: 'rohit.sharma@skilltrack.com',
        name: 'Rohit Sharma',
        roll: 'CS20220101',
        dept: 'Computer Science & Engineering',
        cgpa: 8.85,
        sem: 7,
        backlogs: 0,
        phone: '+91-9876501122',
        bio: 'Passionate full-stack developer and competitive programmer with a passion for building scalable web systems.',
        status: 'Placed',
        skills: [
          ['Python', 'Expert', 2.5],
          ['Data Structures & Algorithms', 'Advanced', 2.0],
          ['SQL', 'Advanced', 2.0],
          ['React.js', 'Intermediate', 1.5],
          ['Git & GitHub', 'Advanced', 2.0],
          ['Technical Communication', 'Advanced', 2.0],
          ['Quantitative Aptitude', 'Advanced', 2.0]
        ],
        results: [
          [techAssessment.id, 45, 50, 90.0, true, 540],
          [aptAssessment.id, 40, 50, 80.0, true, 610],
          [commAssessment.id, 45, 50, 90.0, true, 420]
        ]
      },
      {
        email: 'priya.patel@skilltrack.com',
        name: 'Priya Patel',
        roll: 'IT20220205',
        dept: 'Information Technology',
        cgpa: 8.20,
        sem: 7,
        backlogs: 0,
        phone: '+91-9822334455',
        bio: 'Frontend engineer with strong eye for UI/UX, responsive interfaces, and modern JavaScript frameworks.',
        status: 'Shortlisted',
        skills: [
          ['React.js', 'Advanced', 2.0],
          ['JavaScript', 'Advanced', 2.0],
          ['Python', 'Intermediate', 1.5],
          ['Git & GitHub', 'Intermediate', 1.0],
          ['Agile Collaboration', 'Advanced', 2.0]
        ],
        results: [
          [techAssessment.id, 40, 50, 80.0, true, 600],
          [aptAssessment.id, 35, 50, 70.0, true, 650]
        ]
      },
      {
        email: 'ananya.deshmukh@skilltrack.com',
        name: 'Ananya Deshmukh',
        roll: 'AI20220310',
        dept: 'Artificial Intelligence & Data Science',
        cgpa: 9.25,
        sem: 7,
        backlogs: 0,
        phone: '+91-9988776655',
        bio: 'AI researcher and cloud enthusiast with practical experience in neural networks and predictive data modeling.',
        status: 'Placed',
        skills: [
          ['Python', 'Expert', 3.0],
          ['Machine Learning', 'Expert', 2.5],
          ['SQL', 'Advanced', 2.0],
          ['Docker', 'Intermediate', 1.5],
          ['Problem Solving', 'Expert', 2.5]
        ],
        results: [
          [techAssessment.id, 50, 50, 100.0, true, 480],
          [aptAssessment.id, 45, 50, 90.0, true, 510],
          [commAssessment.id, 45, 50, 90.0, true, 390]
        ]
      },
      {
        email: 'vikram.singh@skilltrack.com',
        name: 'Vikram Singh',
        roll: 'CS20220555',
        dept: 'Computer Science & Engineering',
        cgpa: 6.40,
        sem: 7,
        backlogs: 1,
        phone: '+91-9654321098',
        bio: 'Aspiring software developer currently strengthening algorithms and core computer science fundamentals.',
        status: 'Not Placed',
        skills: [
          ['Java', 'Beginner', 0.5],
          ['SQL', 'Beginner', 0.5]
        ],
        results: [
          [techAssessment.id, 20, 50, 40.0, false, 800]
        ]
      }
    ];

    const studentMap = {};
    for (const item of studentUsers) {
      const u = await User.create({ email: item.email, password: 'Student@123', role: 'student' });
      const st = await Student.create({
        user_id: u.id,
        full_name: item.name,
        roll_no: item.roll,
        department: item.dept,
        semester: item.sem,
        cgpa: item.cgpa,
        graduation_year: 2026,
        backlogs: item.backlogs,
        phone: item.phone,
        bio: item.bio,
        placement_status: item.status
      });
      studentMap[item.email] = st;

      for (const [skName, prof, yoe] of item.skills) {
        if (skillMap[skName]) {
          await StudentSkill.create({
            student_id: st.id,
            skill_id: skillMap[skName].id,
            proficiency: prof,
            years_of_experience: yoe,
            verified: true
          });
        }
      }

      for (const [assId, score, tot, pct, passed, time] of item.results) {
        await AssessmentResult.create({
          student_id: st.id,
          assessment_id: assId,
          score,
          total_marks: tot,
          percentage: pct,
          passed,
          time_taken_seconds: time
        });
      }
    }

    // 7. Jobs
    const jobGoogle = await Job.create({
      company_id: google.id,
      title: 'Software Engineer - Campus Graduate (2026)',
      description: 'Join Google as a Software Engineer and contribute to massive-scale distributed infrastructure, search rankings, or Android.',
      job_type: 'Full-time',
      location: 'Bengaluru / Hyderabad',
      salary_package: '24 - 28 LPA',
      min_cgpa: 8.0,
      max_backlogs: 0,
      allowed_departments: 'Computer Science & Engineering, Information Technology, Artificial Intelligence & Data Science',
      openings: 10,
      deadline: new Date(Date.now() + 25 * 86400000)
    });

    const jobMs = await Job.create({
      company_id: microsoft.id,
      title: 'Software Engineer - Azure Cloud Engineering',
      description: 'Build hyper-scale resilient microservices, distributed storage, and AI developer services powering Microsoft Cloud.',
      job_type: 'Full-time',
      location: 'Hyderabad / Bengaluru',
      salary_package: '18 - 22 LPA',
      min_cgpa: 7.5,
      max_backlogs: 0,
      allowed_departments: 'All',
      openings: 8,
      deadline: new Date(Date.now() + 20 * 86400000)
    });

    const jobAmazon = await Job.create({
      company_id: amazon.id,
      title: 'SDE-1 - Frontend / Full Stack Services',
      description: 'Build customer-facing e-commerce experiences and high-throughput transactional APIs serving hundreds of millions of shoppers worldwide.',
      job_type: 'Full-time',
      location: 'Bengaluru',
      salary_package: '16 - 20 LPA',
      min_cgpa: 7.0,
      max_backlogs: 1,
      allowed_departments: 'All',
      openings: 15,
      deadline: new Date(Date.now() + 15 * 86400000)
    });

    const jobTcs = await Job.create({
      company_id: tcs.id,
      title: 'Systems Engineer (Digital & Prime Cadre)',
      description: 'Work on next-generation cloud architectures, automation, and full-stack solutions for global enterprises.',
      job_type: 'Full-time',
      location: 'Pan India',
      salary_package: '7.5 - 9.0 LPA',
      min_cgpa: 6.5,
      max_backlogs: 1,
      allowed_departments: 'All',
      openings: 40,
      deadline: new Date(Date.now() + 30 * 86400000)
    });

    // Required Skills
    for (const sk of ['Python', 'Data Structures & Algorithms', 'SQL']) {
      if (skillMap[sk]) await JobRequiredSkill.create({ job_id: jobGoogle.id, skill_id: skillMap[sk].id, is_mandatory: true });
    }
    for (const sk of ['Python', 'Docker', 'Git & GitHub']) {
      if (skillMap[sk]) await JobRequiredSkill.create({ job_id: jobMs.id, skill_id: skillMap[sk].id, is_mandatory: true });
    }
    for (const sk of ['React.js', 'JavaScript', 'Problem Solving']) {
      if (skillMap[sk]) await JobRequiredSkill.create({ job_id: jobAmazon.id, skill_id: skillMap[sk].id, is_mandatory: true });
    }

    // 8. Applications & Placements
    const rohit = studentMap['rohit.sharma@skilltrack.com'];
    const priya = studentMap['priya.patel@skilltrack.com'];
    const ananya = studentMap['ananya.deshmukh@skilltrack.com'];

    await Application.create({
      job_id: jobGoogle.id,
      student_id: rohit.id,
      status: 'Shortlisted',
      notes: 'Passed technical screening with 90% score.'
    });

    await Application.create({
      job_id: jobAmazon.id,
      student_id: rohit.id,
      status: 'Placed',
      notes: 'Offer extended for 16.0 LPA.'
    });

    await Application.create({
      job_id: jobMs.id,
      student_id: ananya.id,
      status: 'Placed',
      notes: 'Ranked #1 in Cloud & AI assessment. Offer letter issued for 18.5 LPA.'
    });

    await Application.create({
      job_id: jobAmazon.id,
      student_id: priya.id,
      status: 'Interview Scheduled',
      interview_date: new Date(Date.now() + 3 * 86400000),
      notes: 'Virtual technical interview scheduled.'
    });

    // Placements
    await Placement.create({
      student_id: rohit.id,
      company_id: amazon.id,
      job_id: jobAmazon.id,
      package_lpa: 16.0,
      placement_date: new Date(),
      offer_letter_ref: 'OFFER-AMZN-CS20220101',
      status: 'Accepted'
    });

    await Placement.create({
      student_id: ananya.id,
      company_id: microsoft.id,
      job_id: jobMs.id,
      package_lpa: 18.5,
      placement_date: new Date(),
      offer_letter_ref: 'OFFER-MSFT-AI20220310',
      status: 'Accepted'
    });

    // 9. Notifications
    await Notification.create({
      user_id: rohit.user_id,
      title: 'Interview Shortlist: Google India',
      message: 'Congratulations! Your profile has been shortlisted for Software Engineer (2026).',
      link: '/applications'
    });

    await Notification.create({
      user_id: rohit.user_id,
      title: 'Placement Confirmed: Amazon Development Centre',
      message: 'You have been officially placed as SDE-1 at Amazon with 16.0 LPA.',
      link: '/dashboard'
    });

    console.log('✓ SkillTrack database seeded successfully!');
  } catch (error) {
    console.error('Seed Error:', error);
  }
}

if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}

module.exports = seedDatabase;

