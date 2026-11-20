# SkillTrack - Backend REST API (Node.js + Express + Sequelize + MySQL)

The backend for **SkillTrack** is an enterprise-grade RESTful API server built with **Node.js**, **Express.js**, **Sequelize ORM**, and **MySQL**. It features JWT authentication, multi-format resume parsing (`pdf-parse`, `mammoth`), NLP skill extraction, dynamic placement readiness calculation, and real-time eligibility checking.

---

## 🛠️ Technology Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js 4
- **ORM:** Sequelize 6
- **Database:** MySQL 8.0+ / MariaDB 10.4+
- **Authentication:** JSON Web Tokens (JWT) + bcryptjs
- **File Handling:** Multer (secure resume uploads)
- **Document Extractors:** `pdf-parse` (PDF) + `mammoth` (DOCX)
- **NLP Engine:** Pure JavaScript dictionary and heuristic pattern matcher

---

## 📂 Directory Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Sequelize connection configured for MySQL
│   │   ├── memoryStore.js       # In-memory baseline store for offline resilience
│   │   └── mockStore.js         # Initial mock cohort data
│   ├── controllers/             # Express route controllers
│   │   ├── authController.js        # Register, login, 1-click demo login, getMe
│   │   ├── studentController.js     # Dashboard, profile, skills matrix, assessments
│   │   ├── resumeController.js      # Resume upload, parsing & skill confirmation
│   │   ├── jobController.js         # Jobs catalog & application submission
│   │   ├── adminController.js       # Admin CRUD, eligibility viewer, reports
│   │   ├── recruiterController.js   # Recruiter profile, vacancy management
│   │   └── notificationController.js# In-app notification delivery
│   ├── middleware/              # Express middlewares
│   │   ├── authMiddleware.js        # JWT verification & role authorization guards
│   │   ├── uploadMiddleware.js      # Multer resume file storage & filtering
│   │   └── errorHandler.js          # Centralized error handling
│   ├── models/                  # Sequelize ORM data models
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── Recruiter.js
│   │   ├── Company.js
│   │   ├── Skill.js
│   │   ├── StudentSkill.js
│   │   ├── Assessment.js
│   │   ├── Question.js
│   │   ├── AssessmentResult.js
│   │   ├── Job.js
│   │   ├── JobRequiredSkill.js
│   │   ├── Application.js
│   │   ├── Placement.js
│   │   ├── Notification.js
│   │   └── index.js             # Model associations & transparent dispatcher
│   ├── routes/                  # Express API routers
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── resumeRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── recruiterRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── index.js             # Router aggregator mounted at /api
│   ├── services/                # Core business logic services
│   │   ├── readinessService.js      # 4-factor placement readiness calculator
│   │   ├── eligibilityService.js    # Real-time job criteria verification
│   │   ├── skillExtractorService.js # NLP skill dictionary & pattern matcher
│   │   └── resumeParserService.js   # Multi-format PDF/DOCX text & entity extractor
│   ├── app.js                   # Express app configuration & middlewares
│   └── server.js                # Server entry point & database connection handler
├── uploads/
│   └── resumes/                 # Uploaded candidate resume files
├── package.json
└── .env.example                 # Template for database & JWT environment variables
```

---

## ⚙️ Configuration (.env)

Create a `.env` file in `backend/` based on `.env.example`:

```ini
PORT=5000
NODE_ENV=development

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=skilltrack_db
DB_USER=root
DB_PASSWORD=your_password

# Authentication
JWT_SECRET=skilltrack_super_secure_jwt_secret_key_2026
JWT_EXPIRES_IN=7d
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Seed Database (Optional for MySQL)
```bash
npm run db:seed
```

### 3. Run Development Server
```bash
npm run dev
```
The server will start on **`http://localhost:5000`**.
API Base URL: **`http://localhost:5000/api`**

---

## 📡 Core API Endpoints

| Category | Method | Endpoint | Description |
|---|---|---|---|
| **Health** | `GET` | `/api/health` | Service health status |
| **Auth** | `POST` | `/api/auth/login` | Email & password login |
| **Auth** | `GET` | `/api/auth/demo-login/:role` | Instant 1-click demo login (`student`, `admin`, `recruiter`) |
| **Auth** | `POST` | `/api/auth/register` | Student registration |
| **Student** | `GET` | `/api/student/dashboard` | Student KPIs, readiness score, recommended drives |
| **Student** | `GET` | `/api/student/skills` | Active skills matrix |
| **Student** | `POST` | `/api/student/skills` | Add skill to matrix |
| **Student** | `POST` | `/api/student/assessments/:id/take` | Submit online quiz & auto-grade |
| **Resume** | `POST` | `/api/resumes/upload` | Upload & NLP-parse PDF/DOCX resume |
| **Resume** | `POST` | `/api/resumes/confirm-skills` | Import confirmed skills to matrix |
| **Jobs** | `GET` | `/api/jobs` | Browse drives with real-time eligibility status |
| **Jobs** | `POST` | `/api/jobs/:id/apply` | Submit 1-click drive application |
| **Admin** | `GET` | `/api/admin/dashboard` | Placement stats, department chart, funnel |
| **Admin** | `GET` | `/api/admin/jobs/:id/eligible-students` | List all students meeting job criteria |
| **Admin** | `GET` | `/api/admin/reports` | Exportable accreditation placement reports |
| **Recruiter** | `GET` | `/api/recruiter/dashboard` | Talent acquisition metrics |
| **Recruiter** | `GET` | `/api/recruiter/applicants` | Candidate pool with live readiness scores |
| **Recruiter** | `PUT` | `/api/recruiter/applicants/:id/status` | Update candidate stage (Shortlist, Interview, Hire) |

