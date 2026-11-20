/**
 * In-Memory Fallback Seed Store
 * Active only when MySQL server daemon is offline on localhost
 */

const mockData = {
  users: [
    { id: 1, email: 'admin@skilltrack.com', password: 'Admin@123', role: 'admin', is_active: true },
    { id: 2, email: 'recruiter@google.com', password: 'Recruiter@123', role: 'recruiter', is_active: true },
    { id: 3, email: 'recruiter@microsoft.com', password: 'Recruiter@123', role: 'recruiter', is_active: true },
    { id: 4, email: 'rohit.sharma@skilltrack.com', password: 'Student@123', role: 'student', is_active: true },
    { id: 5, email: 'priya.patel@skilltrack.com', password: 'Student@123', role: 'student', is_active: true },
    { id: 6, email: 'ananya.deshmukh@skilltrack.com', password: 'Student@123', role: 'student', is_active: true }
  ],
  companies: [
    { id: 1, name: 'Google India', industry: 'Technology / Cloud / AI', website: 'https://careers.google.com', location: 'Bengaluru, Karnataka', contact_email: 'campus-india@google.com', contact_phone: '+91-80-67218000', description: 'Global technology leader in AI, cloud systems, and web computing.' },
    { id: 2, name: 'Microsoft Corporation', industry: 'Enterprise Software & Cloud', website: 'https://careers.microsoft.com', location: 'Hyderabad, Telangana', contact_email: 'university-hiring@microsoft.com', contact_phone: '+91-40-66950000', description: 'Global cloud computing, OS, and productivity applications platform.' },
    { id: 3, name: 'Amazon Development Centre', industry: 'E-commerce & Cloud Services', website: 'https://amazon.jobs', location: 'Bengaluru, Karnataka', contact_email: 'in-campus-recruitment@amazon.com', contact_phone: '+91-80-41512000', description: 'Pioneering cloud computing (AWS) and digital marketplace solutions.' },
    { id: 4, name: 'Tata Consultancy Services', industry: 'IT Consulting & Global Services', website: 'https://www.tcs.com/careers', location: 'Mumbai, Maharashtra', contact_email: 'campus.recruitment@tcs.com', contact_phone: '+91-22-67789999', description: 'Global IT services, consulting and business solutions.' }
  ],
  students: [
    {
      id: 1, user_id: 4, full_name: 'Rohit Sharma', roll_no: 'CS20220101', department: 'Computer Science & Engineering', semester: 7, cgpa: 8.85, graduation_year: 2026, backlogs: 0, phone: '+91-9876501122', bio: 'Passionate full-stack developer and competitive programmer.', placement_status: 'Placed', resume_path: 'sample-resume.pdf'
    },
    {
      id: 2, user_id: 5, full_name: 'Priya Patel', roll_no: 'IT20220205', department: 'Information Technology', semester: 7, cgpa: 8.20, graduation_year: 2026, backlogs: 0, phone: '+91-9822334455', bio: 'Frontend engineer with strong eye for UI/UX.', placement_status: 'Shortlisted'
    },
    {
      id: 3, user_id: 6, full_name: 'Ananya Deshmukh', roll_no: 'AI20220310', department: 'Artificial Intelligence & Data Science', semester: 7, cgpa: 9.25, graduation_year: 2026, backlogs: 0, phone: '+91-9988776655', bio: 'AI researcher and cloud enthusiast.', placement_status: 'Placed'
    }
  ],
  recruiters: [
    { id: 1, user_id: 2, company_id: 1, full_name: 'Siddharth Menon', designation: 'Lead University Talent Partner', phone: '+91-9876543210' },
    { id: 2, user_id: 3, company_id: 2, full_name: 'Pooja Singhania', designation: 'Senior University Recruiter', phone: '+91-9812345678' }
  ],
  skills: [
    { id: 1, name: 'Python', category: 'Technical', description: 'High-level language for web and data science' },
    { id: 2, name: 'Data Structures & Algorithms', category: 'Technical', description: 'Core CS fundamentals' },
    { id: 3, name: 'SQL', category: 'Technical', description: 'Relational database querying and schema design' },
    { id: 4, name: 'React.js', category: 'Technical', description: 'Frontend JavaScript library for UI components' },
    { id: 5, name: 'JavaScript', category: 'Technical', description: 'Modern ES6+ frontend and backend browser programming' },
    { id: 6, name: 'Docker', category: 'Technical', description: 'Containerization platform' },
    { id: 7, name: 'Quantitative Aptitude', category: 'Aptitude', description: 'Arithmetic, percentages, ratios, permutations' },
    { id: 8, name: 'Logical Reasoning', category: 'Aptitude', description: 'Analytical reasoning, puzzles, pattern recognition' },
    { id: 9, name: 'Technical Communication', category: 'Soft Skill', description: 'Explaining complex concepts clearly to peers' },
    { id: 10, name: 'Problem Solving', category: 'Soft Skill', description: 'Structured thinking and root cause analysis' }
  ],
  student_skills: [
    { id: 1, student_id: 1, skill_id: 1, proficiency: 'Expert', years_of_experience: 2.5, verified: true },
    { id: 2, student_id: 1, skill_id: 2, proficiency: 'Advanced', years_of_experience: 2.0, verified: true },
    { id: 3, student_id: 1, skill_id: 3, proficiency: 'Advanced', years_of_experience: 2.0, verified: true },
    { id: 4, student_id: 1, skill_id: 4, proficiency: 'Intermediate', years_of_experience: 1.5, verified: true },
    { id: 5, student_id: 1, skill_id: 7, proficiency: 'Advanced', years_of_experience: 2.0, verified: true },
    { id: 6, student_id: 1, skill_id: 9, proficiency: 'Advanced', years_of_experience: 2.0, verified: true }
  ],
  assessments: [
    { id: 1, title: 'Core Computer Science & Web Engineering', category: 'Technical', description: 'Test your grasp on data structures, Python, and SQL.', time_limit_mins: 15, passing_score: 60, total_marks: 50 },
    { id: 2, title: 'Quantitative Aptitude & Logical Reasoning', category: 'Aptitude', description: 'Evaluate quantitative problem-solving speed and reasoning.', time_limit_mins: 15, passing_score: 60, total_marks: 50 },
    { id: 3, title: 'Professional Communication & Workplace Dynamics', category: 'Communication', description: 'Assess corporate communication clarity and teamwork.', time_limit_mins: 10, passing_score: 60, total_marks: 50 }
  ],
  questions: [
    { id: 1, assessment_id: 1, question_text: 'What is the average time complexity of searching for an element in a hash map?', option_a: 'O(n)', option_b: 'O(log n)', option_c: 'O(1)', option_d: 'O(n^2)', correct_option: 'C', marks: 10, explanation: 'Hash tables give average O(1) time complexity.' },
    { id: 2, assessment_id: 1, question_text: 'Which SQL clause is used to filter records resulting from a GROUP BY aggregation?', option_a: 'WHERE', option_b: 'HAVING', option_c: 'FILTER', option_d: 'LIMIT', correct_option: 'B', marks: 10, explanation: 'The HAVING clause filters aggregated result sets.' },
    { id: 3, assessment_id: 1, question_text: 'In RESTful API design, which HTTP method creates a new resource and is NOT idempotent?', option_a: 'GET', option_b: 'PUT', option_c: 'POST', option_d: 'DELETE', correct_option: 'C', marks: 10, explanation: 'POST creates subordinate resources and is non-idempotent.' },
    { id: 4, assessment_id: 1, question_text: 'What data structure is typically used to implement Breadth-First Search (BFS)?', option_a: 'Stack (LIFO)', option_b: 'Queue (FIFO)', option_c: 'Priority Queue', option_d: 'Binary Search Tree', correct_option: 'B', marks: 10, explanation: 'BFS explores neighbor nodes layer by layer using a FIFO queue.' },
    { id: 5, assessment_id: 1, question_text: 'In JavaScript, which array method returns a new array with elements that pass a test?', option_a: 'filter()', option_b: 'forEach()', option_c: 'map()', option_d: 'reduce()', correct_option: 'A', marks: 10, explanation: 'The filter() method shallow copies portions of an array matching a predicate.' },
    { id: 6, assessment_id: 2, question_text: 'A train running at 72 km/h crosses a 200m long platform in 22 seconds. What is the length of the train?', option_a: '240 meters', option_b: '220 meters', option_c: '260 meters', option_d: '180 meters', correct_option: 'A', marks: 10, explanation: 'Speed = 20 m/s. Total distance = 440m. Train = 440 - 200 = 240m.' },
    { id: 7, assessment_id: 2, question_text: 'If 12 men complete a project in 8 days, how many days will 16 men take at the same rate?', option_a: '4 days', option_b: '6 days', option_c: '7 days', option_d: '5 days', correct_option: 'B', marks: 10, explanation: 'Man-days = 96. Days for 16 men = 96 / 16 = 6 days.' },
    { id: 8, assessment_id: 2, question_text: 'Find the next number in the series: 3, 7, 15, 31, 63, ?', option_a: '125', option_b: '126', option_c: '127', option_d: '128', correct_option: 'C', marks: 10, explanation: 'Pattern: (previous * 2) + 1. (63 * 2) + 1 = 127.' },
    { id: 9, assessment_id: 3, question_text: 'When writing an email to reschedule an executive interview, which subject line is most professional?', option_a: 'Reschedule ASAP', option_b: 'Request to Reschedule Interview - Rohit Sharma - Application #2041', option_c: 'Cannot make it today', option_d: 'Change slot please', correct_option: 'B', marks: 10, explanation: 'Clear descriptive subject line with candidate name and context.' }
  ],
  assessment_results: [
    { id: 1, student_id: 1, assessment_id: 1, score: 45, total_marks: 50, percentage: 90.0, passed: true, time_taken_seconds: 540, completed_at: new Date() },
    { id: 2, student_id: 1, assessment_id: 2, score: 40, total_marks: 50, percentage: 80.0, passed: true, time_taken_seconds: 610, completed_at: new Date() },
    { id: 3, student_id: 1, assessment_id: 3, score: 45, total_marks: 50, percentage: 90.0, passed: true, time_taken_seconds: 420, completed_at: new Date() }
  ],
  jobs: [
    {
      id: 1, company_id: 1, title: 'Software Engineer - Campus Graduate (2026)', description: 'Join Google as a Software Engineer and contribute to distributed systems, search, or Android.', job_type: 'Full-time', location: 'Bengaluru / Hyderabad', salary_package: '24 - 28 LPA', min_cgpa: 8.0, max_backlogs: 0, allowed_departments: 'Computer Science & Engineering, Information Technology, Artificial Intelligence & Data Science', openings: 10, is_active: true
    },
    {
      id: 2, company_id: 2, title: 'Software Engineer - Azure Cloud Engineering', description: 'Build hyper-scale resilient microservices and distributed storage for Microsoft Cloud.', job_type: 'Full-time', location: 'Hyderabad / Bengaluru', salary_package: '18 - 22 LPA', min_cgpa: 7.5, max_backlogs: 0, allowed_departments: 'All', openings: 8, is_active: true
    },
    {
      id: 3, company_id: 3, title: 'SDE-1 - Frontend / Full Stack Services', description: 'Build customer-facing e-commerce experiences and high-throughput transactional APIs.', job_type: 'Full-time', location: 'Bengaluru', salary_package: '16 - 20 LPA', min_cgpa: 7.0, max_backlogs: 1, allowed_departments: 'All', openings: 15, is_active: true
    },
    {
      id: 4, company_id: 4, title: 'Systems Engineer (Digital & Prime Cadre)', description: 'Work on next-generation cloud architectures and full-stack solutions for global enterprises.', job_type: 'Full-time', location: 'Pan India', salary_package: '7.5 - 9.0 LPA', min_cgpa: 6.5, max_backlogs: 1, allowed_departments: 'All', openings: 40, is_active: true
    }
  ],
  job_required_skills: [
    { id: 1, job_id: 1, skill_id: 1, is_mandatory: true },
    { id: 2, job_id: 1, skill_id: 2, is_mandatory: true },
    { id: 3, job_id: 1, skill_id: 3, is_mandatory: true },
    { id: 4, job_id: 2, skill_id: 1, is_mandatory: true },
    { id: 5, job_id: 2, skill_id: 6, is_mandatory: true },
    { id: 6, job_id: 3, skill_id: 4, is_mandatory: true },
    { id: 7, job_id: 3, skill_id: 5, is_mandatory: true }
  ],
  applications: [
    { id: 1, job_id: 1, student_id: 1, status: 'Shortlisted', notes: 'Passed technical screening with 90% score.', applied_at: new Date() },
    { id: 2, job_id: 3, student_id: 1, status: 'Placed', notes: 'Offer extended for 16.0 LPA.', applied_at: new Date() },
    { id: 3, job_id: 3, student_id: 2, status: 'Interview Scheduled', interview_date: new Date(Date.now() + 3 * 86400000), notes: 'Virtual technical interview.', applied_at: new Date() }
  ],
  placements: [
    { id: 1, student_id: 1, company_id: 3, job_id: 3, package_lpa: 16.0, placement_date: new Date(), offer_letter_ref: 'OFFER-AMZN-CS20220101', status: 'Accepted' },
    { id: 2, student_id: 3, company_id: 2, job_id: 2, package_lpa: 18.5, placement_date: new Date(), offer_letter_ref: 'OFFER-MSFT-AI20220310', status: 'Accepted' }
  ],
  notifications: [
    { id: 1, user_id: 4, title: 'Interview Shortlist: Google India', message: 'Congratulations! Your profile has been shortlisted for Software Engineer (2026).', link: '/applications', is_read: false, created_at: new Date() },
    { id: 2, user_id: 4, title: 'Placement Confirmed: Amazon Development Centre', message: 'You have been officially placed as SDE-1 at Amazon with 16.0 LPA.', link: '/dashboard', is_read: true, created_at: new Date() }
  ]
};

module.exports = mockData;

