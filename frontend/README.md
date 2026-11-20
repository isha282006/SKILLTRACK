# SkillTrack - Frontend Application (React.js + Vite)

The frontend for **SkillTrack** is an enterprise-grade, high-performance Single Page Application (SPA) built with **React 18**, **Vite**, **Bootstrap 5**, **React Router 6**, and **Chart.js**.

---

## 🛠️ Technology Stack

- **Framework:** React 18 (Hooks, Context API)
- **Build Tool:** Vite 5 (Fast HMR & Optimized Production Bundler)
- **Styling:** Bootstrap 5.3 + Custom Modern SaaS CSS (`src/styles/main.css`)
- **Routing:** React Router DOM v6
- **HTTP Client:** Axios (Centralized JWT Interceptors in `src/services/api.js`)
- **Data Visualization:** Chart.js & React-Chartjs-2
- **Icons:** Font Awesome 6

---

## 📂 Directory Structure

```
frontend/
├── public/                 # Static public assets
├── src/
│   ├── assets/             # Brand logos & graphics
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.jsx          # Top bar, notifications, demo role switcher
│   │   ├── Sidebar.jsx         # Dark navy responsive SaaS sidebar
│   │   ├── ReadinessGauge.jsx  # SVG animated 100-pt circular progress gauge
│   │   ├── StatCard.jsx        # Metric widgets with icons and trends
│   │   └── Footer.jsx          # App footer
│   ├── context/
│   │   └── AuthContext.jsx     # Global JWT auth, user state, and 1-click role switcher
│   ├── layouts/
│   │   ├── DashboardLayout.jsx # Authenticated portal layout with sidebar and navbar
│   │   └── PublicLayout.jsx    # Public marketing layout for landing and auth pages
│   ├── pages/
│   │   ├── LandingPage.jsx     # Marketing landing page with live gauge preview
│   │   ├── LoginPage.jsx       # Dual credential & 1-click demo login
│   │   ├── RegisterPage.jsx    # Student registration with academic profile
│   │   ├── student/            # Student portal pages
│   │   │   ├── StudentDashboard.jsx     # Executive student overview
│   │   │   ├── StudentProfile.jsx       # Academic credentials & resume links
│   │   │   ├── ResumeUploadReview.jsx   # AI PDF/DOCX parser & skill confirmation
│   │   │   ├── SkillsMatrix.jsx         # Technical & soft skills matrix
│   │   │   ├── AssessmentsList.jsx      # Available timed quizzes
│   │   │   ├── TakeQuiz.jsx             # Interactive test UI with countdown
│   │   │   ├── QuizResult.jsx           # Scorecard with explanations
│   │   │   ├── ReadinessAnalytics.jsx   # 4-factor placement readiness deep dive
│   │   │   ├── JobsCatalog.jsx          # Placement drives with real-time eligibility
│   │   │   ├── JobDetail.jsx            # Job specifications & 1-click apply
│   │   │   └── MyApplications.jsx       # Application tracking pipeline
│   │   ├── admin/              # Campus placement officer pages
│   │   │   ├── AdminDashboard.jsx       # Department bar chart & application funnel
│   │   │   ├── AdminStudents.jsx        # Cohort roster with readiness audit
│   │   │   ├── AdminStudentDetail.jsx   # Complete candidate audit
│   │   │   ├── AdminSkills.jsx          # Master skills taxonomy CRUD
│   │   │   ├── AdminAssessments.jsx     # Assessments & question bank manager
│   │   │   ├── AdminCompanies.jsx       # Partner company directory
│   │   │   ├── AdminJobs.jsx            # Drive postings & eligible candidates viewer
│   │   │   ├── AdminApplications.jsx    # Candidate pipeline & status updater
│   │   │   ├── AdminPlacements.jsx      # Official offer registry
│   │   │   └── AdminReports.jsx         # Accreditation placement reports
│   │   └── recruiter/          # Corporate recruiter pages
│   │       ├── RecruiterDashboard.jsx   # Talent acquisition metrics
│   │       ├── RecruiterCompany.jsx     # Employer branding & profile
│   │       ├── RecruiterJobs.jsx        # Vacancy management & status toggles
│   │       └── RecruiterApplicants.jsx  # Candidate evaluation & decisions
│   ├── services/           # Centralized API service layer
│   │   ├── api.js              # Axios instance with request/response interceptors
│   │   ├── authService.js
│   │   ├── studentService.js
│   │   ├── resumeService.js
│   │   ├── jobService.js
│   │   ├── adminService.js
│   │   ├── recruiterService.js
│   │   └── notificationService.js
│   ├── styles/
│   │   └── main.css            # Production CSS design system
│   ├── App.jsx             # Master routes definition
│   └── main.jsx            # Application entry point
├── package.json
└── vite.config.js          # Vite config with proxy to backend port 5000
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
The application will start on **`http://localhost:3000`** with automatic reverse proxy forwarding `/api` and `/uploads` requests to the Node.js backend on `http://localhost:5000`.

### 3. Build for Production
```bash
npm run build
```
Generates a minified, production-optimized build in `frontend/dist/`.

