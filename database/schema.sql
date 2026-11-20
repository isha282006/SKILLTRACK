-- ============================================================================
-- SkillTrack: Student Skill & Placement Management Platform
-- Complete Normalized Relational Database Schema DDL for MySQL 8.0+
-- Database: skilltrack_db
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `skilltrack_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `skilltrack_db`;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `activity_logs`;
DROP TABLE IF EXISTS `interviews`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `placements`;
DROP TABLE IF EXISTS `applications`;
DROP TABLE IF EXISTS `job_required_skills`;
DROP TABLE IF EXISTS `jobs`;
DROP TABLE IF EXISTS `assessment_answers`;
DROP TABLE IF EXISTS `assessment_attempts`;
DROP TABLE IF EXISTS `assessment_results`;
DROP TABLE IF EXISTS `questions`;
DROP TABLE IF EXISTS `assessments`;
DROP TABLE IF EXISTS `student_skills`;
DROP TABLE IF EXISTS `extracted_skills`;
DROP TABLE IF EXISTS `resumes`;
DROP TABLE IF EXISTS `skills`;
DROP TABLE IF EXISTS `recruiter_profiles`;
DROP TABLE IF EXISTS `recruiters`;
DROP TABLE IF EXISTS `student_profiles`;
DROP TABLE IF EXISTS `students`;
DROP TABLE IF EXISTS `companies`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Users Table (Authentication & RBAC)
CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(120) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('student', 'admin', 'recruiter') NOT NULL DEFAULT 'student',
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Companies Table
CREATE TABLE `companies` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL UNIQUE,
    `industry` VARCHAR(100) DEFAULT 'Technology',
    `tier` ENUM('Dream', 'Tier 1', 'Regular') DEFAULT 'Tier 1',
    `website` VARCHAR(255) NULL,
    `location` VARCHAR(150) DEFAULT 'Bengaluru, India',
    `contact_email` VARCHAR(120) NULL,
    `contact_phone` VARCHAR(20) NULL,
    `description` TEXT NULL,
    `logo_path` VARCHAR(255) NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_company_name` (`name`),
    INDEX `idx_company_tier` (`tier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Student Profiles Table
CREATE TABLE `students` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL UNIQUE,
    `full_name` VARCHAR(100) NOT NULL,
    `roll_no` VARCHAR(50) NOT NULL UNIQUE,
    `department` VARCHAR(100) NOT NULL,
    `semester` INT DEFAULT 7,
    `cgpa` DECIMAL(3, 2) DEFAULT 7.50,
    `graduation_year` INT DEFAULT 2026,
    `backlogs` INT DEFAULT 0,
    `phone` VARCHAR(20) NULL,
    `bio` TEXT NULL,
    `resume_path` VARCHAR(255) NULL,
    `linkedin_url` VARCHAR(255) NULL,
    `github_url` VARCHAR(255) NULL,
    `placement_status` ENUM('Not Placed', 'Shortlisted', 'Placed') DEFAULT 'Not Placed',
    `readiness_score` DECIMAL(5, 2) DEFAULT 0.00,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_student_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    INDEX `idx_student_roll` (`roll_no`),
    INDEX `idx_student_dept` (`department`),
    INDEX `idx_student_status` (`placement_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE OR REPLACE VIEW `student_profiles` AS SELECT * FROM `students`;

-- 4. Recruiter Profiles Table
CREATE TABLE `recruiters` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL UNIQUE,
    `company_id` INT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `contact_person` VARCHAR(100) NULL,
    `designation` VARCHAR(100) DEFAULT 'Lead University Talent Partner',
    `phone` VARCHAR(20) NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_recruiter_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_recruiter_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE SET NULL,
    INDEX `idx_recruiter_company` (`company_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE OR REPLACE VIEW `recruiter_profiles` AS SELECT * FROM `recruiters`;

-- 5. Resumes Table
CREATE TABLE `resumes` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `student_id` INT NOT NULL,
    `filename` VARCHAR(255) NOT NULL,
    `file_path` VARCHAR(255) NOT NULL,
    `file_size` INT DEFAULT 0,
    `file_type` VARCHAR(50) DEFAULT 'application/pdf',
    `extracted_text` LONGTEXT NULL,
    `parsed_json` JSON NULL,
    `uploaded_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_resume_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
    INDEX `idx_resume_student` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Skills Table (Standard Taxonomy)
CREATE TABLE `skills` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `category` ENUM('Programming Languages', 'Frontend Development', 'Backend Development', 'Databases', 'Frameworks & Libraries', 'Developer Tools & Cloud', 'Technical Skills', 'Aptitude', 'Soft Skills') NOT NULL DEFAULT 'Technical Skills',
    `description` TEXT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_skill_name` (`name`),
    INDEX `idx_skill_cat` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Extracted Skills Table (Pre-Confirmation Audit Staging)
CREATE TABLE `extracted_skills` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `resume_id` INT NOT NULL,
    `skill_name` VARCHAR(100) NOT NULL,
    `category` VARCHAR(100) DEFAULT 'Technical Skills',
    `confidence_score` DECIMAL(3, 2) DEFAULT 0.85,
    `status` ENUM('Extracted', 'Student Confirmed', 'Rejected', 'Assessment Verified') DEFAULT 'Extracted',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_es_resume` FOREIGN KEY (`resume_id`) REFERENCES `resumes` (`id`) ON DELETE CASCADE,
    INDEX `idx_es_resume` (`resume_id`),
    INDEX `idx_es_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Student Skills Table (Confirmed & Verified Skills Inventory)
CREATE TABLE `student_skills` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `student_id` INT NOT NULL,
    `skill_id` INT NOT NULL,
    `proficiency_level` ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert') DEFAULT 'Intermediate',
    `years_of_experience` DECIMAL(3, 1) DEFAULT 1.0,
    `source` ENUM('Manual Entry', 'Resume NLP Extracted', 'Assessment Verified') DEFAULT 'Manual Entry',
    `verified` BOOLEAN DEFAULT FALSE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_ss_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_ss_skill` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE,
    UNIQUE KEY `uk_student_skill` (`student_id`, `skill_id`),
    INDEX `idx_ss_student` (`student_id`),
    INDEX `idx_ss_verified` (`verified`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Assessments Table
CREATE TABLE `assessments` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(150) NOT NULL,
    `category` ENUM('Technical', 'Aptitude', 'Communication') NOT NULL,
    `description` TEXT NULL,
    `time_limit_mins` INT DEFAULT 15,
    `passing_score` INT DEFAULT 60,
    `total_marks` INT DEFAULT 50,
    `created_by` INT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_assessment_user` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    INDEX `idx_assessment_cat` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Questions Table
CREATE TABLE `questions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `assessment_id` INT NOT NULL,
    `question_text` TEXT NOT NULL,
    `option_a` TEXT NOT NULL,
    `option_b` TEXT NOT NULL,
    `option_c` TEXT NOT NULL,
    `option_d` TEXT NOT NULL,
    `correct_option` CHAR(1) NOT NULL,
    `marks` INT DEFAULT 10,
    `explanation` TEXT NULL,
    CONSTRAINT `fk_q_assessment` FOREIGN KEY (`assessment_id`) REFERENCES `assessments` (`id`) ON DELETE CASCADE,
    INDEX `idx_q_assessment` (`assessment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Assessment Attempts / Results Table
CREATE TABLE `assessment_results` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `student_id` INT NOT NULL,
    `assessment_id` INT NOT NULL,
    `score` DECIMAL(5, 2) NOT NULL,
    `total_marks` DECIMAL(5, 2) NOT NULL,
    `percentage` DECIMAL(5, 2) NOT NULL,
    `is_passed` BOOLEAN DEFAULT FALSE,
    `passed` BOOLEAN DEFAULT FALSE,
    `time_taken_seconds` INT DEFAULT 0,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_ar_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_ar_assessment` FOREIGN KEY (`assessment_id`) REFERENCES `assessments` (`id`) ON DELETE CASCADE,
    INDEX `idx_ar_student` (`student_id`),
    INDEX `idx_ar_assessment` (`assessment_id`),
    INDEX `idx_ar_passed` (`is_passed`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE OR REPLACE VIEW `assessment_attempts` AS SELECT * FROM `assessment_results`;

-- 12. Assessment Answers Table
CREATE TABLE `assessment_answers` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `result_id` INT NOT NULL,
    `question_id` INT NOT NULL,
    `selected_option` CHAR(1) NOT NULL,
    `is_correct` BOOLEAN NOT NULL DEFAULT FALSE,
    `marks_awarded` INT NOT NULL DEFAULT 0,
    CONSTRAINT `fk_aa_result` FOREIGN KEY (`result_id`) REFERENCES `assessment_results` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_aa_question` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Jobs Table
CREATE TABLE `jobs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `company_id` INT NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `description` TEXT NOT NULL,
    `job_type` VARCHAR(50) DEFAULT 'Full-time',
    `location` VARCHAR(100) DEFAULT 'Bengaluru, India',
    `salary_package` VARCHAR(100) NOT NULL,
    `salary_range` VARCHAR(100) NULL,
    `min_cgpa` DECIMAL(3, 2) DEFAULT 6.50,
    `max_backlogs` INT DEFAULT 0,
    `allowed_departments` VARCHAR(255) DEFAULT 'All',
    `openings` INT DEFAULT 5,
    `application_deadline` DATE NULL,
    `deadline` DATETIME NULL,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_job_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
    INDEX `idx_job_company` (`company_id`),
    INDEX `idx_job_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Job Required Skills Table
CREATE TABLE `job_required_skills` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `job_id` INT NOT NULL,
    `skill_id` INT NOT NULL,
    `is_mandatory` BOOLEAN DEFAULT TRUE,
    CONSTRAINT `fk_jrs_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_jrs_skill` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE,
    UNIQUE KEY `uk_job_skill` (`job_id`, `skill_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Applications Table
CREATE TABLE `applications` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `job_id` INT NOT NULL,
    `student_id` INT NOT NULL,
    `status` ENUM('Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Interviewing', 'Selected', 'Placed', 'Rejected') DEFAULT 'Applied',
    `notes` TEXT NULL,
    `recruiter_notes` TEXT NULL,
    `interview_date` DATETIME NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_app_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_app_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
    UNIQUE KEY `uk_student_job_app` (`job_id`, `student_id`),
    INDEX `idx_app_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. Interviews Table
CREATE TABLE `interviews` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `application_id` INT NOT NULL,
    `round_name` VARCHAR(100) DEFAULT 'Technical Interview 1',
    `scheduled_at` DATETIME NOT NULL,
    `meeting_link` VARCHAR(255) NULL,
    `interviewer_name` VARCHAR(100) NULL,
    `status` ENUM('Scheduled', 'Completed', 'Rescheduled', 'Cancelled') DEFAULT 'Scheduled',
    `feedback` TEXT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_int_app` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE,
    INDEX `idx_int_schedule` (`scheduled_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. Placements Table (Official Placement Registry)
CREATE TABLE `placements` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `student_id` INT NOT NULL,
    `company_id` INT NOT NULL,
    `job_id` INT NULL,
    `package_lpa` DECIMAL(5, 2) NOT NULL,
    `placement_date` DATE DEFAULT (CURRENT_DATE),
    `offer_letter_ref` VARCHAR(100) NULL,
    `status` ENUM('Accepted', 'Pending') DEFAULT 'Accepted',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_plc_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_plc_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_plc_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE SET NULL,
    INDEX `idx_plc_student` (`student_id`),
    INDEX `idx_plc_company` (`company_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. Notifications Table
CREATE TABLE `notifications` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `message` TEXT NOT NULL,
    `link` VARCHAR(255) NULL,
    `is_read` BOOLEAN DEFAULT FALSE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_notif_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    INDEX `idx_notif_user` (`user_id`, `is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 19. Activity Logs Table
CREATE TABLE `activity_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `action` VARCHAR(100) NOT NULL,
    `details` TEXT NULL,
    `ip_address` VARCHAR(45) NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_act_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    INDEX `idx_act_user` (`user_id`),
    INDEX `idx_act_time` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
