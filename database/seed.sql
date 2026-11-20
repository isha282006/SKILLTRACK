-- ============================================================================
-- SkillTrack: Student Skill & Placement Management Platform
-- Complete MySQL Seed Data (BCrypt Hashed Demo Credentials)
-- Database: skilltrack_db
-- ============================================================================

USE `skilltrack_db`;

-- All passwords are encrypted with BCrypt (Cost Factor: 10):
-- Admin:     Admin@123     -> $2a$10$jIryZp4CP5w7gf0NHnhJkuriuL13oKFaO9fFn6WOOQe26rT2BpPAO
-- Recruiter: Recruiter@123 -> $2a$10$aiReQYOGyq1r/ko2rLRYsepF1IjiQe/YgaI33Zr1uyF/3iLiC0SUq
-- Student:   Student@123   -> $2a$10$sxfSBqnKoF3lG1vrsRqN5.63JamCrd1twsj.eZxO900UBm0533Xuu

-- 1. Users
INSERT INTO `users` (`id`, `email`, `password_hash`, `role`, `is_active`) VALUES
(1, 'admin@skilltrack.com', '$2a$10$jIryZp4CP5w7gf0NHnhJkuriuL13oKFaO9fFn6WOOQe26rT2BpPAO', 'admin', 1),
(2, 'recruiter@google.com', '$2a$10$aiReQYOGyq1r/ko2rLRYsepF1IjiQe/YgaI33Zr1uyF/3iLiC0SUq', 'recruiter', 1),
(3, 'recruiter@microsoft.com', '$2a$10$aiReQYOGyq1r/ko2rLRYsepF1IjiQe/YgaI33Zr1uyF/3iLiC0SUq', 'recruiter', 1),
(4, 'rohit.sharma@skilltrack.com', '$2a$10$sxfSBqnKoF3lG1vrsRqN5.63JamCrd1twsj.eZxO900UBm0533Xuu', 'student', 1),
(5, 'priya.patel@skilltrack.com', '$2a$10$sxfSBqnKoF3lG1vrsRqN5.63JamCrd1twsj.eZxO900UBm0533Xuu', 'student', 1),
(6, 'ananya.deshmukh@skilltrack.com', '$2a$10$sxfSBqnKoF3lG1vrsRqN5.63JamCrd1twsj.eZxO900UBm0533Xuu', 'student', 1);

-- 2. Companies
INSERT INTO `companies` (`id`, `name`, `industry`, `tier`, `website`, `location`, `contact_email`, `contact_phone`, `description`) VALUES
(1, 'Google India', 'Information Technology', 'Dream', 'https://careers.google.com', 'Bengaluru, Karnataka', 'campus-india@google.com', '+91-80-67218000', 'Global tech leader in cloud, artificial intelligence, and operating systems.'),
(2, 'Microsoft Corporation', 'Enterprise Software & Cloud', 'Dream', 'https://microsoft.com', 'Hyderabad, Telangana', 'university@microsoft.com', '+91-40-66950000', 'Pioneering cloud computing, productivity suites, and developer tools.'),
(3, 'Amazon Development Centre', 'E-commerce & Cloud Services', 'Tier 1', 'https://amazon.jobs', 'Bengaluru, Karnataka', 'in-campus-recruitment@amazon.com', '+91-80-41512000', 'Leading e-commerce marketplace and AWS cloud solutions provider.');

-- 3. Recruiters
INSERT INTO `recruiters` (`id`, `user_id`, `company_id`, `full_name`, `contact_person`, `designation`, `phone`) VALUES
(1, 2, 1, 'Siddharth Menon', 'Siddharth Menon', 'Lead University Talent Partner', '+91-9876543210'),
(2, 3, 2, 'Pooja Singhania', 'Pooja Singhania', 'Senior University Recruiter', '+91-9812345678');

-- 4. Students
INSERT INTO `students` (`id`, `user_id`, `full_name`, `roll_no`, `department`, `semester`, `cgpa`, `graduation_year`, `backlogs`, `phone`, `bio`, `placement_status`, `readiness_score`) VALUES
(1, 4, 'Rohit Sharma', '1RV21CS042', 'Computer Science & Engineering', 7, 8.85, 2026, 0, '+91-9876501122', 'Passionate full-stack developer and competitive programmer with a passion for building scalable web systems.', 'Placed', 87.20),
(2, 5, 'Priya Patel', '1RV21IS019', 'Information Science & Engineering', 7, 8.20, 2026, 0, '+91-9822334455', 'Frontend engineer with strong eye for UI/UX, responsive interfaces, and modern JavaScript frameworks.', 'Shortlisted', 76.50),
(3, 6, 'Ananya Deshmukh', '1RV21AI033', 'Artificial Intelligence & Machine Learning', 7, 9.25, 2026, 0, '+91-9988776655', 'AI researcher and cloud enthusiast with practical experience in neural networks and predictive modeling.', 'Placed', 92.40);

-- 5. Standard Skills Taxonomy
INSERT INTO `skills` (`id`, `name`, `category`, `description`) VALUES
(1, 'Python', 'Programming Languages', 'Backend APIs, machine learning pipelines, and scripting.'),
(2, 'JavaScript', 'Programming Languages', 'Modern ES6+ frontend and backend browser programming.'),
(3, 'React.js', 'Frameworks & Libraries', 'Frontend component architecture, state management, and virtual DOM.'),
(4, 'Node.js', 'Backend Development', 'Event-driven server runtime, microservices, and RESTful APIs.'),
(5, 'SQL', 'Databases', 'Relational database querying, joins, indexing, and schema design.'),
(6, 'Docker', 'Developer Tools & Cloud', 'Containerization platform for application packaging and deployments.'),
(7, 'Quantitative Aptitude', 'Aptitude', 'Arithmetic, percentages, ratios, permutations, and time-work problems.'),
(8, 'Logical Reasoning', 'Aptitude', 'Analytical reasoning, deduction puzzles, and pattern recognition.'),
(9, 'Technical Communication', 'Soft Skills', 'Clear architectural presentation, agile standups, and stakeholder writing.'),
(10, 'Problem Solving', 'Soft Skills', 'Root cause analysis, debugging discipline, and algorithmic thinking.');

-- 6. Student Confirmed Skills
INSERT INTO `student_skills` (`student_id`, `skill_id`, `proficiency_level`, `years_of_experience`, `source`, `verified`) VALUES
(1, 1, 'Expert', 2.5, 'Assessment Verified', 1),
(1, 2, 'Advanced', 2.0, 'Resume NLP Extracted', 1),
(1, 3, 'Advanced', 2.0, 'Assessment Verified', 1),
(1, 5, 'Advanced', 2.0, 'Assessment Verified', 1),
(1, 7, 'Advanced', 1.5, 'Assessment Verified', 1),
(1, 9, 'Advanced', 2.0, 'Assessment Verified', 1),
(2, 2, 'Advanced', 2.0, 'Resume NLP Extracted', 1),
(2, 3, 'Advanced', 2.0, 'Assessment Verified', 1),
(2, 9, 'Intermediate', 1.0, 'Manual Entry', 1);

-- 7. Assessments
INSERT INTO `assessments` (`id`, `title`, `category`, `description`, `time_limit_mins`, `passing_score`, `total_marks`, `created_by`) VALUES
(1, 'Core Computer Science & Web Engineering', 'Technical', 'Comprehensive evaluation of algorithms, REST services, SQL databases, and web protocols.', 15, 60, 50, 1),
(2, 'Quantitative Aptitude & Logical Reasoning', 'Aptitude', 'Arithmetic problem-solving, number series, ratios, and critical logical deductions.', 15, 60, 50, 1),
(3, 'Professional Communication & Team Dynamics', 'Communication', 'Workplace email etiquette, active listening, executive presentation, and standup messaging.', 10, 60, 50, 1);

-- 8. Assessment Questions
INSERT INTO `questions` (`id`, `assessment_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`, `marks`, `explanation`) VALUES
(1, 1, 'What is the average time complexity of searching in a hash table?', 'O(n)', 'O(log n)', 'O(1)', 'O(n^2)', 'C', 10, 'Hash tables offer average O(1) time complexity for lookup operations.'),
(2, 1, 'Which SQL clause filters records after a GROUP BY aggregation?', 'WHERE', 'HAVING', 'LIMIT', 'ORDER BY', 'B', 10, 'HAVING is evaluated after aggregate groupings, while WHERE filters pre-grouping rows.'),
(3, 1, 'Which HTTP method is idempotent and completely replaces an existing resource?', 'POST', 'PUT', 'PATCH', 'CONNECT', 'B', 10, 'PUT replaces the resource entirely and produces the same side-effect upon repeated invocation.'),
(4, 1, 'What data structure is used to implement Breadth-First Search (BFS)?', 'Stack (LIFO)', 'Queue (FIFO)', 'Binary Heap', 'Hash Map', 'B', 10, 'BFS visits vertices level by level using a FIFO queue.'),
(5, 1, 'In JavaScript, which method returns a shallow copy with elements passing a condition?', 'filter()', 'map()', 'reduce()', 'forEach()', 'A', 10, 'Array.prototype.filter() returns matched items in a new array.'),
(6, 2, 'A train running at 72 km/h crosses a 200m platform in 22 seconds. What is the train length?', '240 meters', '220 meters', '260 meters', '180 meters', 'A', 10, 'Speed = 72 * (5/18) = 20 m/s. Distance = 20 * 22 = 440m. Train length = 440 - 200 = 240m.'),
(7, 2, 'If 12 engineers build a module in 8 days, how many days will 16 engineers take at the same rate?', '4 days', '6 days', '7 days', '5 days', 'B', 10, 'Work = 12 * 8 = 96 dev-days. Days required by 16 = 96 / 16 = 6 days.'),
(8, 2, 'Find the next number in the series: 3, 7, 15, 31, 63, ?', '125', '126', '127', '128', 'C', 10, 'Pattern is 2n + 1. 63 * 2 + 1 = 127.'),
(9, 3, 'When writing an email to reschedule an executive interview, which subject line is most professional?', 'Reschedule ASAP', 'Request to Reschedule Interview - Rohit Sharma - Application #2041', 'Cannot make it today', 'Change my time slot please', 'B', 10, 'Descriptive subject lines allow recruiters to prioritize immediately.');

-- 9. Assessment Results
INSERT INTO `assessment_results` (`id`, `student_id`, `assessment_id`, `score`, `total_marks`, `percentage`, `is_passed`, `passed`, `time_taken_seconds`) VALUES
(1, 1, 1, 45.00, 50.00, 90.00, 1, 1, 540),
(2, 1, 2, 40.00, 50.00, 80.00, 1, 1, 610),
(3, 1, 3, 45.00, 50.00, 90.00, 1, 1, 420);

-- 10. Jobs
INSERT INTO `jobs` (`id`, `company_id`, `title`, `description`, `job_type`, `location`, `salary_package`, `salary_range`, `min_cgpa`, `max_backlogs`, `allowed_departments`, `openings`, `application_deadline`, `is_active`) VALUES
(1, 1, 'Software Engineer - Campus Drive 2026', 'Build hyper-scale distributed backends, developer infrastructure, and cloud systems.', 'Full-time', 'Bengaluru / Hyderabad', '26.0 LPA', '24.0 - 28.0 LPA', 8.00, 0, 'Computer Science & Engineering, Information Science & Engineering', 10, '2026-12-31', 1),
(2, 2, 'Cloud Solutions Engineer', 'Design and deploy modern resilient microservices on Azure enterprise cloud.', 'Full-time', 'Bengaluru, Karnataka', '20.0 LPA', '18.0 - 22.0 LPA', 7.50, 0, 'Computer Science & Engineering, Information Science & Engineering, Electronics & Communication', 8, '2026-12-15', 1),
(3, 3, 'Software Development Engineer - SDE 1', 'Develop high-throughput transaction engines, AWS integrations, and customer catalog services.', 'Full-time', 'Bengaluru, Karnataka', '22.0 LPA', '20.0 - 24.0 LPA', 7.00, 0, 'All', 12, '2026-12-20', 1);

-- 11. Job Required Skills
INSERT INTO `job_required_skills` (`job_id`, `skill_id`, `is_mandatory`) VALUES
(1, 1, 1),
(1, 2, 1),
(1, 3, 0),
(1, 5, 1),
(2, 1, 1),
(2, 5, 1),
(2, 6, 1),
(3, 1, 1),
(3, 2, 1),
(3, 5, 1);

-- 12. Applications
INSERT INTO `applications` (`id`, `job_id`, `student_id`, `status`, `notes`, `recruiter_notes`, `interview_date`) VALUES
(1, 1, 1, 'Selected', 'Cleared technical round with top score.', 'Exceptional system design and problem-solving skills.', '2026-11-20 10:00:00'),
(2, 2, 1, 'Interviewing', 'Final round scheduled with Engineering Manager.', 'Strong DSA foundation.', '2026-11-25 14:30:00');

-- 13. Interviews
INSERT INTO `interviews` (`id`, `application_id`, `round_name`, `scheduled_at`, `meeting_link`, `interviewer_name`, `status`, `feedback`) VALUES
(1, 1, 'Technical Round 1', '2026-11-20 10:00:00', 'https://meet.google.com/xyz-skilltrack-demo', 'Dr. Arun Kumar', 'Completed', 'Strong grasp of data structures and distributed databases.'),
(2, 2, 'Hiring Manager Round', '2026-11-25 14:30:00', 'https://teams.microsoft.com/l/meetup-join/skilltrack', 'Pooja Singhania', 'Scheduled', 'Review cloud microservices architecture design.');

-- 14. Placements
INSERT INTO `placements` (`id`, `student_id`, `company_id`, `job_id`, `package_lpa`, `placement_date`, `offer_letter_ref`, `status`) VALUES
(1, 1, 1, 1, 26.00, '2026-11-01', 'OFFER-GOOG-1RV21CS042', 'Accepted');

-- 15. Notifications
INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `is_read`) VALUES
(1, 4, 'Interview Scheduled: Google India', 'Your Technical Round 1 with Google India has been scheduled for Nov 20, 2026 at 10:00 AM.', 0),
(2, 4, 'Assessment Cleared: Core CS', 'Congratulations! You cleared Core Computer Science & Web Engineering with 90% score.', 1),
(3, 4, 'Dream Tier Status Unlocked', 'Your Placement Readiness Score is 87.2/100. You are eligible for Dream Tier opportunities (>=20 LPA).', 1);

-- 16. Activity Logs
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `details`, `ip_address`) VALUES
(1, 4, 'ASSESSMENT_COMPLETED', 'Completed Core Computer Science & Web Engineering with 90% score', '127.0.0.1'),
(2, 4, 'APPLICATION_SUBMITTED', 'Submitted application for Software Engineer at Google India', '127.0.0.1'),
(3, 4, 'RESUME_UPLOADED', 'Uploaded rohit_sharma_cv.pdf and confirmed 6 verified competencies', '127.0.0.1');

