# SkillTrack Database Directory

This directory contains database schemas, migrations, and seeders for **SkillTrack**.

## Database Overview
SkillTrack uses **MySQL 8.0+** (with relational constraints, foreign keys, and indexes) managed through **Sequelize ORM** in Node.js.

### Core Tables
1. `users` - User authentication, roles (`student`, `admin`, `recruiter`), password hashes
2. `companies` - Hiring companies directory
3. `students` - Student profiles, academic details, CGPA, backlogs, resume paths
4. `recruiters` - Recruiter profiles linked to company accounts
5. `skills` - Standardized skills taxonomy (Technical, Aptitude, Soft Skill)
6. `student_skills` - Student claimed/verified skills and proficiency levels
7. `assessments` - Online tests with categories, time limits, passing scores
8. `questions` - MCQ question bank with options A-D, marks, explanations
9. `assessment_results` - Student test submissions, percentages, pass/fail status
10. `jobs` - Campus job postings, eligibility criteria, CTC
11. `job_required_skills` - Mandatory skills linked to job postings
12. `applications` - Student job applications with recruitment stages
13. `placements` - Confirmed placement registry with LPA packages and offer letters
14. `notifications` - In-app alerts for students, recruiters, and admins

---

## MySQL Setup Instructions

1. **Log in to MySQL:**
   ```bash
   mysql -u root -p
   ```

2. **Create Database:**
   ```sql
   CREATE DATABASE IF NOT EXISTS skilltrack_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. **Run Schema:**
   ```bash
   mysql -u root -p skilltrack_db < database/schema.sql
   ```

4. **Run Seed Data:**
   ```bash
   mysql -u root -p skilltrack_db < database/seed.sql
   ```

Or alternatively, run the Node.js automated seeder:
```bash
cd backend
npm run db:seed
```

