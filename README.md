# SkillTrack – Student Skill & Placement Management Platform
## Career Intelligence Lab (React.js + Node.js + Express + MySQL)

[![Live Demo on Vercel](https://img.shields.io/badge/Live%20Demo-Vercel%20Production-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://frontend-delta-one-5c2af1modk.vercel.app)
[![API on Render](https://img.shields.io/badge/REST%20API-Render%20Cloud-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://skilltrack-backend-qfff.onrender.com)
[![GitHub Repository](https://img.shields.io/badge/Source-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/isha282006/SKILLTRACK)

---

### 🌐 Live Production Links

| Resource | Service | URL | Status |
| :--- | :--- | :--- | :--- |
| **Live Web App** | **Vercel** | [https://frontend-delta-one-5c2af1modk.vercel.app](https://frontend-delta-one-5c2af1modk.vercel.app) | ![Vercel](https://img.shields.io/badge/Status-Active%20(200%20OK)-success?style=flat-square) |
| **Backend REST API** | **Render** | [https://skilltrack-backend-qfff.onrender.com](https://skilltrack-backend-qfff.onrender.com) | ![Render](https://img.shields.io/badge/Status-Live%20(200%20OK)-success?style=flat-square) |
| **Source Code** | **GitHub** | [https://github.com/isha282006/SKILLTRACK](https://github.com/isha282006/SKILLTRACK) | ![Branch](https://img.shields.io/badge/Branch-main-blue?style=flat-square) |

#### 🔑 Instant 1-Click Demo Logins:
- **Student Terminal:** `rohit.sharma@skilltrack.com` / `Student@123`
- **Campus Admin Terminal:** `admin@skilltrack.com` / `Admin@123`
- **Corporate Recruiter Terminal:** `recruiter@google.com` / `Recruiter@123`

---

[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-MySQL%208.0%20(mysql2%20%2F%20Sequelize)-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Analytics](https://img.shields.io/badge/Visuals-Recharts%20%2B%20Chart.js-FF6384)](https://recharts.org/)
[![Design](https://img.shields.io/badge/Design-Swiss%20Editorial%20System-111827)](#)

**SkillTrack** is an enterprise-grade full-stack web application developed for engineering colleges, placement cells, and corporate recruiters. It unifies student profiling, automatic PDF/DOCX resume skill extraction, an interactive skills matrix, standardized timed assessments with instant auto-grading, an algorithmic 100-point placement readiness scoring engine, real-time corporate drive eligibility audits, recruiter hiring pipelines, and institutional accreditation reporting.

---

## 🏛️ Project Architecture & Clean Directory Structure

SkillTrack strictly separates frontend, backend, and database:

```
skilltrack/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── Charts.jsx              # Recharts analytics visualizations
│   │   │   ├── ProtectedRoute.jsx      # Role & auth route guard
│   │   │   └── Loading.jsx             # Editorial loading indicator
│   │   │
│   │   ├── pages/
│   │   │   ├── public/
│   │   │   │   ├── Home.jsx            # Approved Career Intelligence Lab landing page
│   │   │   │   ├── Login.jsx           # Multi-role authentication & 1-click switcher
│   │   │   │   ├── Register.jsx        # 3-step student onboarding form
│   │   │   │   └── About.jsx           # Institutional methodology & 4-pillar formula
│   │   │   │
│   │   │   ├── student/
│   │   │   │   ├── Dashboard.jsx       # Swiss editorial student intelligence dossier
│   │   │   │   ├── Profile.jsx         # Academic records & profile editing
│   │   │   │   ├── ResumeUpload.jsx    # Drag-and-drop PDF/DOCX resume file parser
│   │   │   │   ├── ExtractedSkills.jsx # Candidate confirmation & editing studio
│   │   │   │   ├── SkillsMatrix.jsx    # Categorized skill taxonomy management
│   │   │   │   ├── Assessments.jsx     # Test center & available quizzes
│   │   │   │   ├── TakeAssessment.jsx  # Timed proctored MCQ quiz engine
│   │   │   │   ├── ReadinessScore.jsx  # 100-pt algorithmic formula breakdown
│   │   │   │   ├── SkillGapAnalysis.jsx# Role comparator with matched & missing pills
│   │   │   │   ├── JobOpportunities.jsx# Campus drives with eligibility audits
│   │   │   │   ├── Applications.jsx    # Application status pipeline & tracker
│   │   │   │   └── Notifications.jsx   # Live system notifications & read toggles
│   │   │   │
│   │   │   ├── admin/
│   │   │   │   ├── Dashboard.jsx       # Institutional placement KPI metrics
│   │   │   │   ├── Students.jsx        # Student cohort roster & detailed dossiers
│   │   │   │   ├── Recruiters.jsx      # Recruiter partner account directory & onboarding
│   │   │   │   ├── Companies.jsx       # Corporate partner directory & hiring tiers
│   │   │   │   ├── ManageJobs.jsx      # Campus drive creator & candidate pool viewer
│   │   │   │   ├── ManageAssessments.jsx # Test creator & question bank manager
│   │   │   │   ├── Applications.jsx    # Master application funnel & stage updates
│   │   │   │   └── Reports.jsx         # Placement statistics & CSV report exports
│   │   │   │
│   │   │   └── recruiter/
│   │   │       ├── Dashboard.jsx       # Company hiring pipeline overview
│   │   │       ├── CompanyProfile.jsx  # Employer brand profile & tier settings
│   │   │       ├── CreateJob.jsx       # Job vacancy posting studio with cutoffs
│   │   │       ├── ManageJobs.jsx      # Job listings & status toggles
│   │   │       ├── Applicants.jsx      # Candidate pool evaluation & student dossiers
│   │   │       └── Interviews.jsx      # Multi-round interview scheduling pipeline
│   │   │
│   │   ├── services/
│   │   │   ├── api.js                  # Axios interceptor with bearer token injection
│   │   │   ├── authService.js          # Authentication API calls
│   │   │   ├── resumeService.js        # File upload & batch skill confirmation API
│   │   │   └── dashboardService.js     # Unified dashboard telemetry API
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # Centralized JWT session & role context
│   │   │
│   │   ├── layouts/
│   │   │   ├── PublicLayout.jsx        # Landing & public nav/footer layout
│   │   │   ├── StudentLayout.jsx       # Guarded student workspace layout
│   │   │   ├── AdminLayout.jsx         # Guarded admin workspace layout
│   │   │   └── RecruiterLayout.jsx     # Guarded recruiter workspace layout
│   │   │
│   │   ├── styles/
│   │   │   ├── global.css              # Theme CSS variables & font rules
│   │   │   ├── landing.css             # Hero & 6-stage pipeline styles
│   │   │   ├── dashboard.css           # Institutional ledger & table styles
│   │   │   ├── responsive.css          # Mobile & tablet layout breakpoints
│   │   │   └── editorial.css           # Swiss Editorial design system
│   │   │
│   │   ├── App.jsx                     # Top-level React Router 6 configuration
│   │   └── main.jsx                    # Vite React entry point
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── backend/
│   ├── config/
│   │   ├── database.js                 # Sequelize / mysql2 connection pool
│   │   └── memoryStore.js              # Resilient fallback memory data store
│   │
│   ├── controllers/
│   │   ├── authController.js           # Login, registration, 1-click demo switcher
│   │   ├── studentController.js        # Profile, skills, quizzes, readiness calculation
│   │   ├── resumeController.js         # PDF/DOCX parsing & skill confirmation
│   │   ├── skillController.js          # Skills taxonomy endpoints
│   │   ├── assessmentController.js     # Quiz submission & grading endpoints
│   │   ├── jobController.js            # Job listings & eligibility audits
│   │   ├── applicationController.js    # Application pipeline & status changes
│   │   ├── adminController.js          # Admin reports, recruiters, companies
│   │   ├── recruiterController.js      # Recruiter candidate reviews & interviews
│   │   └── notificationController.js   # Telemetry in-app notifications
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js           # JWT verification & claims validation
│   │   ├── roleMiddleware.js           # Student/Admin/Recruiter role guards
│   │   └── uploadMiddleware.js         # Multer PDF/DOCX file validation
│   │
│   ├── models/
│   │   ├── User.js, Student.js, Recruiter.js, Company.js, Skill.js,
│   │   ├── StudentSkill.js, Assessment.js, Question.js, AssessmentResult.js,
│   │   ├── Job.js, JobRequiredSkill.js, Application.js, Placement.js, Notification.js
│   │   └── index.js                    # Model associations & relationship definitions
│   │
│   ├── routes/                         # Express route routers
│   ├── services/
│   │   ├── resumeParser.js             # pdf-parse & mammoth text extraction
│   │   ├── skillExtractor.js           # JavaScript NLP dictionary matcher
│   │   ├── readinessCalculator.js      # 4-pillar weighted formula engine
│   │   └── eligibilityEngine.js        # Multi-factor corporate cutoff validator
│   │
│   ├── uploads/resumes/                # Uploaded candidate files
│   ├── .env.example
│   ├── package.json
│   └── server.js                       # Express HTTP server bootstrap
│
├── database/
│   ├── schema.sql                      # Complete 18-table relational MySQL DDL
│   ├── seed.sql                        # Production seed records (BCrypt passwords)
│   └── README.md                       # MySQL installation guide
│
├── README.md
└── .gitignore
```

---

## 🎨 Approved Career Intelligence Lab Visual Direction

- **Philosophy:** Swiss editorial graphic design, financial analytics software density, and modern academic research interfaces.
- **Palette:**
  - **Midnight Navy:** `#111827` (Dominant structural canvas, typography, borders)
  - **Warm Ivory:** `#F4F0E8` (Dominant editorial backgrounds, alternating table strips)
  - **Electric Lime:** `#C5F36B` (Optimal readiness, matched skills, passed cutoffs)
  - **Cobalt Blue:** `#5265E8` (Institutional telemetry IDs, active tabs, secondary accents)
  - **Coral:** `#F28B70` (Skill gaps, unmet criteria alerts, critical remediation items)
  - **White:** `#FFFFFF` (Crisp data containers and input fields)
- **Typography:**
  - Interface & Headings: `Space Grotesk` / `Plus Jakarta Sans` / `Inter`
  - Technical Labels, Metrics & Timestamps: `JetBrains Mono` / `IBM Plex Mono`
- **Borders & Spacing:** Thin hairline 1px borders (`border: 1px solid #111827`), square or crisp 0–2px corners, tabular figures.

---

## ⚡ Quick Start: 9-Step Setup Guide

Follow these steps to run SkillTrack locally. **No Python, Flask, or Django is required.**

### 1. Install Node.js Dependencies

In two separate terminal windows:

```bash
# Terminal 1: Backend
cd backend
npm install

# Terminal 2: Frontend
cd frontend
npm install
```

### 2. Create the MySQL Database (Optional — Resilient Memory Mode Built-In)

If you have MySQL running locally:

```sql
CREATE DATABASE IF NOT EXISTS `skilltrack_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

*(Note: If MySQL is not running, SkillTrack automatically boots in resilient baseline mode so all features, tests, and pages work 100% out of the box!)*

### 3. Import `schema.sql`

```bash
mysql -u root -p skilltrack_db < database/schema.sql
```

### 4. Import `seed.sql`

```bash
mysql -u root -p skilltrack_db < database/seed.sql
```

*(Or run the automated seeder script: `cd backend && npm run db:seed`)*

### 5. Configure Environment Variables

**Backend (`backend/.env`):**
```ini
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=skilltrack_db
DB_USER=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=skilltrack-super-secure-jwt-secret-key-2026
JWT_EXPIRES_IN=7d
```

**Frontend (`frontend/.env`):**
```ini
VITE_API_URL=http://localhost:5000/api
```

### 6. Start the Backend REST API Server

```bash
cd backend
node src/server.js
```
The backend will launch on `http://localhost:5000` (API base: `http://localhost:5000/api`).

### 7. Start the React Frontend Application

```bash
cd frontend
npm run dev
```
The Vite dev server will launch on `http://localhost:3000`.

### 8. Access the Website

Open your browser to:
[http://localhost:3000](http://localhost:3000)

### 9. Sign In Using Demo Accounts

You can sign in using standard email and password or click the instant **1-Click Demo** buttons on the login page:

| Role | Email | Password | Access Area |
| :--- | :--- | :--- | :--- |
| **Student** | `rohit.sharma@skilltrack.com` | `Student@123` *(or `student123`)* | `/student/dashboard` |
| **Campus Admin** | `admin@skilltrack.com` | `Admin@123` *(or `admin123`)* | `/admin/dashboard` |
| **Recruiter** | `recruiter@google.com` | `Recruiter@123` *(or `recruiter123`)* | `/recruiter/dashboard` |

---

## 🔬 Core Architectural Modules

### 1. Automatic Resume Parser & Skill Extraction
- **Text Extraction:** Native JavaScript engine supporting PDF (`pdf-parse`) and Word DOCX (`mammoth`).
- **NLP Dictionary:** Identifies Programming Languages, Frameworks, Databases, Cloud Tools, Soft Skills, and detects Education/CGPA/Projects.
- **Three-Tier Verification Audit:**
  1. `Extracted`: Raw competencies recognized by parser.
  2. `Student Confirmed`: Skills reviewed, edited, and approved by the student.
  3. `Assessment Verified`: Skills backed by passed online timed quizzes.
- **Staging & Persistence:** Extracted skills are displayed in an editable confirmation interface with category filters, proficiency ratings, and experience before being committed to MySQL.

### 2. Algorithmic 100-Point Placement Readiness Engine
Calculated through a 4-pillar institutional formula:

$$\text{Readiness Score} = (0.35 \times \text{Technical}) + (0.25 \times \text{Aptitude}) + (0.20 \times \text{Communication}) + (0.20 \times \text{Academic})$$

- **Performance Classification:**
  - `80 – 100`: **Excellent** (Dream Tier Eligible, ≥ 20 LPA)
  - `60 – 79`: **Good** (Tier-1 Eligible, 10–20 LPA)
  - `40 – 59`: **Average** (Mass Recruitment Ready)
  - `< 40`: **Needs Improvement** (Remediation Required)
- Visualized using an architectural contribution bar, delta-to-cutoff indicators, and **Recharts** analytics.

### 3. Real-Time Corporate Job Eligibility Engine
Evaluates student academic and competency vectors against job criteria:
- Minimum CGPA cutoff (e.g. `≥ 8.00`)
- Maximum active backlogs (e.g. `≤ 0`)
- Eligible engineering departments
- Mandatory technical skills
- Status chips: Electric Lime for passed criteria, Coral for unmet requirements.

### 4. Interactive Diagnostic Skill Gap Analysis
- Benchmarks student competencies against corporate target profiles (e.g., Google India, Microsoft Corporation, Amazon).
- Identifies **Matched Skills** (Electric Lime checkmarks) and **Missing Skills** (Coral warning tags).
- Outputs dynamic percentage match and strategic assessment roadmaps.

### 5. Standardized Timed Online Assessments
- Multiple-choice questions with countdown timer, question palette navigation, and immediate scoring.
- Automatic result generation with answer explanations and history logging.

---

## 🧪 Automated Full-Stack Verification Suite

Run the full end-to-end integration suite from the root directory:

```bash
node verify_multipage_suite.js
```

**Verification Results:**
```
=== SKILLTRACK COMPLETE MULTI-PAGE APPLICATION VERIFICATION ===

[PASS] Public Jobs Preview (GET /api/jobs/public-preview)
[PASS] Student Login
[PASS] Admin Login
[PASS] Recruiter Login
[PASS] Student Profile Retrieval
[PASS] Student Skills Matrix
[PASS] Extracted Skills Confirmation & Persistence
[PASS] Student Readiness Score Calculation
[PASS] Student Notifications Inbox
[PASS] Student Notifications Mark All Read
[PASS] Admin Dashboard Metrics
[PASS] Admin Student Management
[PASS] Admin Recruiter Management (GET)
[PASS] Admin Create Recruiter (POST)
[PASS] Admin Companies Management
[PASS] Admin Placement Records
[PASS] Admin Placement & Skill Analytics Reports
[PASS] Recruiter Dashboard Metrics
[PASS] Recruiter Create Job Opening
[PASS] Recruiter Applicants Pool Retrieval
[PASS] RBAC: Student forbidden from Admin endpoint
[PASS] RBAC: Recruiter forbidden from Admin endpoint
[PASS] RBAC: Student forbidden from Recruiter endpoint

Verification Complete! Passed: 23, Failed: 0
```

---

## 🛡️ Security & Integrity
- BCrypt salted password hashing.
- JWT token authentication with expiration and claims validation.
- Role-based authorization middleware (`roleRequired`) guarding all endpoints.
- Multer mime-type and extension validation (PDF/DOCX only, 16MB max).
- Zero plain-text credentials stored or transmitted.
