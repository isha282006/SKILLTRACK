-- SkillTrack: Sample Data Seed Script for MySQL
USE `skilltrack_db`;

-- Passwords are all hashed with Werkzeug pbkdf2:sha256 (or scrypt)
-- Default password for all seed accounts is:
-- Admin: Admin@123
-- Recruiters: Recruiter@123
-- Students: Student@123

-- 1. Users
INSERT INTO `users` (`id`, `email`, `password_hash`, `role`, `is_active`) VALUES
(1, 'admin@skilltrack.com', 'scrypt:32768:8:1$Y3ZpGfR3L7kE8W0M$8c52086fc2424fa7ea970f592d3f6d7abac1a94165ea9d6fc573ae104616e01a07bb5c06518174526d15a133f39385bfba4443efecae43e06a38bc6f236a2818', 'admin', 1),
(2, 'recruiter@google.com', 'scrypt:32768:8:1$pG7dK3mR2tL9vW1X$a651f8dc9baecff773b4eeb753f2c5f1c984ee24ef6e8a4a581457198d0ceab003975a6c382103f67a216d7d74dbbe48f57fbe1376332ecdb96cbfcf16d4128f', 'recruiter', 1),
(3, 'recruiter@microsoft.com', 'scrypt:32768:8:1$pG7dK3mR2tL9vW1X$a651f8dc9baecff773b4eeb753f2c5f1c984ee24ef6e8a4a581457198d0ceab003975a6c382103f67a216d7d74dbbe48f57fbe1376332ecdb96cbfcf16d4128f', 'recruiter', 1),
(4, 'rohit.sharma@skilltrack.com', 'scrypt:32768:8:1$bC9dL5xP3vM8tW2Q$f4b505ff64bfca2be75daef6447814b7e800315998dfc385f0962ae4a3f3a02bbab7e0c451675a89df89be572e411f5d6ff732890ae15b369ecdb00313dfaa22', 'student', 1),
(5, 'priya.patel@skilltrack.com', 'scrypt:32768:8:1$bC9dL5xP3vM8tW2Q$f4b505ff64bfca2be75daef6447814b7e800315998dfc385f0962ae4a3f3a02bbab7e0c451675a89df89be572e411f5d6ff732890ae15b369ecdb00313dfaa22', 'student', 1),
(6, 'ananya.deshmukh@skilltrack.com', 'scrypt:32768:8:1$bC9dL5xP3vM8tW2Q$f4b505ff64bfca2be75daef6447814b7e800315998dfc385f0962ae4a3f3a02bbab7e0c451675a89df89be572e411f5d6ff732890ae15b369ecdb00313dfaa22', 'student', 1);

-- 2. Companies
INSERT INTO `companies` (`id`, `name`, `industry`, `website`, `location`, `contact_email`, `contact_phone`, `description`) VALUES
(1, 'Google India', 'Technology / AI / Cloud', 'https://careers.google.com', 'Bengaluru, Karnataka', 'campus-india@google.com', '+91-80-67218000', 'Global technology leader in AI, cloud systems, and web computing.'),
(2, 'Microsoft Corporation', 'Enterprise Software & Cloud', 'https://careers.microsoft.com', 'Hyderabad, Telangana', 'university-hiring@microsoft.com', '+91-40-66950000', 'Global cloud computing, OS, and productivity applications platform.'),
(3, 'Amazon Development Centre', 'E-commerce & Cloud Services', 'https://amazon.jobs', 'Bengaluru, Karnataka', 'in-campus-recruitment@amazon.com', '+91-80-41512000', 'Pioneering cloud computing (AWS) and digital marketplace solutions.');

-- 3. Recruiters
INSERT INTO `recruiters` (`id`, `user_id`, `company_id`, `full_name`, `designation`, `phone`) VALUES
(1, 2, 1, 'Siddharth Menon', 'Lead University Talent Partner', '+91-9876543210'),
(2, 3, 2, 'Pooja Singhania', 'Senior University Recruiter', '+91-9812345678');

-- 4. Students
INSERT INTO `students` (`id`, `user_id`, `full_name`, `roll_no`, `department`, `semester`, `cgpa`, `graduation_year`, `backlogs`, `phone`, `bio`, `placement_status`) VALUES
(1, 4, 'Rohit Sharma', 'CS20220101', 'Computer Science & Engineering', 7, 8.85, 2026, 0, '+91-9876501122', 'Passionate full-stack developer and competitive programmer with a passion for building scalable web systems.', 'Placed'),
(2, 5, 'Priya Patel', 'IT20220205', 'Information Technology', 7, 8.20, 2026, 0, '+91-9822334455', 'Frontend engineer with strong eye for UI/UX, responsive interfaces, and modern JavaScript frameworks.', 'Shortlisted'),
(3, 6, 'Ananya Deshmukh', 'AI20220310', 'Artificial Intelligence & Data Science', 7, 9.25, 2026, 0, '+91-9988776655', 'AI researcher and cloud enthusiast with practical experience in neural networks and predictive modeling.', 'Placed');

-- 5. Skills
INSERT INTO `skills` (`id`, `name`, `category`, `description`) VALUES
(1, 'Python', 'Technical', 'High-level programming language for web, data science, and scripting'),
(2, 'Data Structures & Algorithms', 'Technical', 'Core CS fundamentals: Arrays, Trees, Graphs, Sorting'),
(3, 'SQL', 'Technical', 'Relational database querying, joins, indexing, and schema design'),
(4, 'React.js', 'Technical', 'Frontend JavaScript library for building component-driven user interfaces'),
(5, 'Quantitative Aptitude', 'Aptitude', 'Arithmetic, percentages, ratios, permutations, time & work'),
(6, 'Technical Communication', 'Soft Skill', 'Ability to explain complex technical concepts clearly to peers & stakeholders');

-- 6. Jobs
INSERT INTO `jobs` (`id`, `company_id`, `title`, `description`, `job_type`, `location`, `salary_package`, `min_cgpa`, `max_backlogs`, `allowed_departments`, `openings`, `is_active`) VALUES
(1, 1, 'Software Engineer - Campus Graduate (2026)', 'Contribute to massive-scale distributed infrastructure, machine intelligence, search rankings, or Android platform.', 'Full-time', 'Bengaluru / Hyderabad', '24 - 28 LPA', 8.00, 0, 'Computer Science & Engineering, Information Technology, Artificial Intelligence & Data Science', 10, 1),
(2, 2, 'Software Engineer - Azure Cloud Engineering', 'Build hyper-scale resilient microservices, distributed storage, and AI developer services powering Microsoft Cloud.', 'Full-time', 'Hyderabad / Bengaluru', '18 - 22 LPA', 7.50, 0, 'All', 8, 1);

-- 7. Placements
INSERT INTO `placements` (`id`, `student_id`, `company_id`, `job_id`, `package_lpa`, `placement_date`, `offer_letter_ref`, `status`) VALUES
(1, 3, 2, 2, 18.50, '2026-11-01', 'OFFER-MSFT-AI20220310', 'Accepted');

