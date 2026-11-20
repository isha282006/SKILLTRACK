import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentLinks = [
    { to: '/student/dashboard', code: '01', icon: 'fa-th-large', label: 'Dashboard' },
    { to: '/student/profile', code: '02', icon: 'fa-user-circle', label: 'My Profile' },
    { to: '/student/resume', code: '03', icon: 'fa-file-invoice', label: 'Resume & Skill Parser', badge: 'NLP' },
    { to: '/student/resume/review', code: '04', icon: 'fa-list-check', label: 'Extracted Skills Review' },
    { to: '/student/skills', code: '05', icon: 'fa-code-branch', label: 'Skills Matrix' },
    { to: '/student/assessments', code: '06', icon: 'fa-clipboard-question', label: 'Skill Assessments' },
    { to: '/student/skill-gap', code: '07', icon: 'fa-sliders', label: 'Skill Gap Analysis' },
    { to: '/student/readiness', code: '08', icon: 'fa-gauge-high', label: 'Readiness Analytics' },
    { to: '/student/jobs', code: '09', icon: 'fa-briefcase', label: 'Job Opportunities' },
    { to: '/student/applications', code: '10', icon: 'fa-paper-plane', label: 'My Applications' },
    { to: '/student/notifications', code: '11', icon: 'fa-bell', label: 'Notifications' }
  ];

  const adminLinks = [
    { to: '/admin/dashboard', code: '01', icon: 'fa-chart-pie', label: 'Admin Command' },
    { to: '/admin/students', code: '02', icon: 'fa-user-graduate', label: 'Manage Students' },
    { to: '/admin/recruiters', code: '03', icon: 'fa-user-tie', label: 'Manage Recruiters' },
    { to: '/admin/companies', code: '04', icon: 'fa-building', label: 'Companies' },
    { to: '/admin/skills', code: '05', icon: 'fa-cubes', label: 'Skills Taxonomy' },
    { to: '/admin/assessments', code: '06', icon: 'fa-clipboard-question', label: 'Assessments' },
    { to: '/admin/jobs', code: '07', icon: 'fa-briefcase', label: 'Job Openings' },
    { to: '/admin/applications', code: '08', icon: 'fa-file-signature', label: 'Applications Pipeline' },
    { to: '/admin/placements', code: '09', icon: 'fa-trophy', label: 'Placement Records' },
    { to: '/admin/reports', code: '10', icon: 'fa-chart-line', label: 'Institutional Reports' }
  ];

  const recruiterLinks = [
    { to: '/recruiter/dashboard', code: '01', icon: 'fa-chart-pie', label: 'Recruiter Desk' },
    { to: '/recruiter/company', code: '02', icon: 'fa-building', label: 'Company Profile' },
    { to: '/recruiter/jobs/create', code: '03', icon: 'fa-plus-circle', label: 'Create Job Opening' },
    { to: '/recruiter/jobs', code: '04', icon: 'fa-briefcase', label: 'Manage Job Openings' },
    { to: '/recruiter/applicants', code: '05', icon: 'fa-users', label: 'Candidate Pool' },
    { to: '/recruiter/interviews', code: '06', icon: 'fa-calendar-check', label: 'Interview Schedules' }
  ];

  let links = [];
  if (role === 'student') links = studentLinks;
  else if (role === 'admin') links = adminLinks;
  else if (role === 'recruiter') links = recruiterLinks;

  const roleTag = {
    student: 'ROLE // STUDENT',
    admin: 'ROLE // CAMPUS ADMIN',
    recruiter: 'ROLE // RECRUITER'
  }[role] || 'ROLE // USER';

  const roleAccent = {
    student: '#C5F36B',
    admin: '#F28B70',
    recruiter: '#5265E8'
  }[role] || '#C5F36B';

  const displayName = user?.student?.full_name || user?.recruiter?.contact_person || (role === 'admin' ? 'Campus Admin' : user?.email?.split('@')[0]) || 'User';

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="sidebar-backdrop d-lg-none position-fixed top-0 start-0 w-100 h-100"
          style={{ zIndex: 1040, backgroundColor: 'rgba(17, 24, 39, 0.7)' }}
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`app-sidebar d-flex flex-column text-white position-fixed top-0 bottom-0 start-0 ${
          isOpen ? 'show' : ''
        }`}
        style={{
          width: '270px',
          backgroundColor: '#111827',
          zIndex: 1045,
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          borderRight: '1px solid rgba(255, 255, 255, 0.12)'
        }}
      >
        {/* Brand Header */}
        <div className="d-flex align-items-center justify-content-between px-3 px-xl-4 py-3 border-bottom border-white border-opacity-10" style={{ height: '70px' }}>
          <NavLink to="/" className="d-flex align-items-center text-decoration-none text-white gap-2">
            <div
              className="d-flex align-items-center justify-content-center fw-bold"
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#C5F36B',
                color: '#111827',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.85rem',
                border: '1px solid #111827'
              }}
            >
              ST
            </div>
            <div>
              <div className="fw-bold tracking-tight text-white font-editorial" style={{ fontSize: '1.05rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                SKILL<span style={{ color: '#C5F36B' }}>TRACK</span>
              </div>
              <div className="font-mono text-white-50" style={{ fontSize: '0.62rem', letterSpacing: '0.06em' }}>
                LAB // v2.0 RELATIONAL
              </div>
            </div>
          </NavLink>
          <button
            className="btn btn-sm btn-link text-white-50 d-lg-none p-0 text-decoration-none"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <i className="fas fa-times fs-5"></i>
          </button>
        </div>

        {/* User Dossier Card */}
        <div className="p-3 mx-3 mt-3 border border-white border-opacity-10" style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
          <div className="d-flex align-items-center gap-2">
            <div
              className="d-flex align-items-center justify-content-center fw-bold flex-shrink-0 font-mono"
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: roleAccent,
                border: `1px solid ${roleAccent}`,
                fontSize: '0.9rem'
              }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden flex-grow-1">
              <div className="fw-bold text-truncate text-white small" title={displayName} style={{ letterSpacing: '-0.01em' }}>
                {displayName}
              </div>
              <div className="font-mono" style={{ fontSize: '0.64rem', color: roleAccent, letterSpacing: '0.05em' }}>
                [{roleTag}]
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="sidebar-nav flex-grow-1 overflow-y-auto px-2 py-3">
          <div className="font-mono text-white-50 px-3 mb-2" style={{ fontSize: '0.68rem', letterSpacing: '0.1em' }}>
            // DIRECTORY INDEX
          </div>
          <ul className="nav flex-column gap-1">
            {links.map((link) => (
              <li className="nav-item" key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={() => window.innerWidth < 992 && toggleSidebar()}
                  className={({ isActive }) =>
                    `nav-link d-flex align-items-center justify-content-between px-3 py-2 transition-all ${
                      isActive ? 'active-link' : 'hover-link'
                    }`
                  }
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? 'rgba(197, 243, 107, 0.12)' : 'transparent',
                    color: isActive ? '#C5F36B' : '#94a3b8',
                    borderLeft: isActive ? '3px solid #C5F36B' : '3px solid transparent',
                    borderRadius: 0,
                    fontWeight: isActive ? '700' : '500',
                    fontSize: '0.82rem',
                    letterSpacing: '-0.01em',
                    textDecoration: 'none'
                  })}
                >
                  <div className="d-flex align-items-center gap-2 overflow-hidden text-truncate">
                    <span className="font-mono text-white-50" style={{ fontSize: '0.7rem', width: '20px' }}>
                      {link.code}
                    </span>
                    <i className={`fas ${link.icon} fa-fw`} style={{ width: '16px', fontSize: '0.85rem' }}></i>
                    <span className="text-truncate">{link.label}</span>
                  </div>
                  {link.badge && (
                    <span
                      className="font-mono text-dark fw-bold px-1"
                      style={{
                        backgroundColor: '#C5F36B',
                        fontSize: '0.6rem',
                        letterSpacing: '0.04em',
                        border: '1px solid #111827'
                      }}
                    >
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-top border-white border-opacity-10">
          <button
            onClick={handleLogout}
            className="w-100 d-flex align-items-center justify-content-center gap-2 py-2 btn-signout font-mono"
            style={{
              backgroundColor: 'transparent',
              color: '#F28B70',
              border: '1px solid rgba(242, 139, 112, 0.6)',
              borderRadius: 0,
              fontSize: '0.72rem',
              letterSpacing: '0.06em',
              fontWeight: 700,
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F28B70';
              e.currentTarget.style.color = '#111827';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#F28B70';
            }}
          >
            <i className="fas fa-arrow-right-from-bracket"></i>
            <span>TERMINATE SESSION</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
