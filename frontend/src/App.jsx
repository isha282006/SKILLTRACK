import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import ResumeUploadReview from './pages/student/ResumeUploadReview';
import ExtractedSkillsReview from './pages/student/ExtractedSkillsReview';
import SkillsMatrix from './pages/student/SkillsMatrix';
import AssessmentsList from './pages/student/AssessmentsList';
import TakeQuiz from './pages/student/TakeQuiz';
import QuizResult from './pages/student/QuizResult';
import ReadinessAnalytics from './pages/student/ReadinessAnalytics';
import StudentSkillGap from './pages/student/StudentSkillGap';
import JobsCatalog from './pages/student/JobsCatalog';
import JobDetail from './pages/student/JobDetail';
import MyApplications from './pages/student/MyApplications';
import StudentNotifications from './pages/student/StudentNotifications';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminStudentDetail from './pages/admin/AdminStudentDetail';
import AdminRecruiters from './pages/admin/AdminRecruiters';
import AdminSkills from './pages/admin/AdminSkills';
import AdminAssessments from './pages/admin/AdminAssessments';
import AdminCompanies from './pages/admin/AdminCompanies';
import AdminJobs from './pages/admin/AdminJobs';
import AdminApplications from './pages/admin/AdminApplications';
import AdminPlacements from './pages/admin/AdminPlacements';
import AdminReports from './pages/admin/AdminReports';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import RecruiterCompany from './pages/recruiter/RecruiterCompany';
import RecruiterJobs from './pages/recruiter/RecruiterJobs';
import RecruiterCreateJob from './pages/recruiter/RecruiterCreateJob';
import RecruiterApplicants from './pages/recruiter/RecruiterApplicants';
import RecruiterInterviews from './pages/recruiter/RecruiterInterviews';

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>

      {/* Authenticated Pages */}
      <Route element={<DashboardLayout />}>
        {/* Student Routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/resume" element={<ResumeUploadReview />} />
        <Route path="/student/resume/review" element={<ExtractedSkillsReview />} />
        <Route path="/student/skills" element={<SkillsMatrix />} />
        <Route path="/student/assessments" element={<AssessmentsList />} />
        <Route path="/student/assessments/:id/take" element={<TakeQuiz />} />
        <Route path="/student/assessments/result/:resultId" element={<QuizResult />} />
        <Route path="/student/skill-gap" element={<StudentSkillGap />} />
        <Route path="/student/readiness" element={<ReadinessAnalytics />} />
        <Route path="/student/jobs" element={<JobsCatalog />} />
        <Route path="/student/jobs/:id" element={<JobDetail />} />
        <Route path="/student/applications" element={<MyApplications />} />
        <Route path="/student/notifications" element={<StudentNotifications />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/students/:id" element={<AdminStudentDetail />} />
        <Route path="/admin/recruiters" element={<AdminRecruiters />} />
        <Route path="/admin/skills" element={<AdminSkills />} />
        <Route path="/admin/assessments" element={<AdminAssessments />} />
        <Route path="/admin/companies" element={<AdminCompanies />} />
        <Route path="/admin/jobs" element={<AdminJobs />} />
        <Route path="/admin/applications" element={<AdminApplications />} />
        <Route path="/admin/placements" element={<AdminPlacements />} />
        <Route path="/admin/reports" element={<AdminReports />} />

        {/* Recruiter Routes */}
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/recruiter/company" element={<RecruiterCompany />} />
        <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
        <Route path="/recruiter/jobs/create" element={<RecruiterCreateJob />} />
        <Route path="/recruiter/applicants" element={<RecruiterApplicants />} />
        <Route path="/recruiter/interviews" element={<RecruiterInterviews />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

