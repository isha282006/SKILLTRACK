import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicLayout = () => {
  const { isAuthenticated, role, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleDemo = async (roleName) => {
    try {
      const res = await demoLogin(roleName);
      if (res.success) {
        if (roleName === 'student') navigate('/student/dashboard');
        else if (roleName === 'admin') navigate('/admin/dashboard');
        else if (roleName === 'recruiter') navigate('/recruiter/dashboard');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="editorial-page d-flex flex-column min-vh-100">
      {/* Top Telemetry Bar */}
      <div className="bg-lab-navy text-white py-1 px-3 d-none d-md-block border-b-lab">
        <div className="container d-flex align-items-center justify-content-between font-mono" style={{ fontSize: '11px' }}>
          <div className="d-flex align-items-center gap-3">
            <span className="d-flex align-items-center gap-2">
              <span className="live-dot"></span>
              <span className="text-lab-lime fw-bold">LAB 2.0 ACTIVE</span>
            </span>
            <span className="text-white-50">|</span>
            <span className="text-white-50">INSTITUTIONAL CAREER INTELLIGENCE SYSTEM</span>
          </div>
          <div className="d-flex align-items-center gap-3 text-white-50">
            <span>ALGORITHM: MULTI-TIER 100-PT READINESS</span>
            <span>|</span>
            <span className="text-white">DEMO SANDBOX ENABLED</span>
          </div>
        </div>
      </div>

      {/* Swiss Editorial Header */}
      <header className="navbar navbar-expand-lg bg-lab-ivory py-3 border-b-lab sticky-top" style={{ zIndex: 1030 }}>
        <div className="container">
          <NavLink to="/" className="navbar-brand d-flex align-items-center gap-2 text-decoration-none">
            <div
              className="d-flex align-items-center justify-content-center bg-lab-navy text-white fw-bold font-mono"
              style={{ width: '34px', height: '34px', fontSize: '15px' }}
            >
              ST
            </div>
            <div className="d-flex flex-column">
              <span className="font-editorial fw-bold text-lab-navy tracking-tight" style={{ fontSize: '1.35rem', letterSpacing: '-0.03em', lineHeight: 1 }}>
                SKILL<span style={{ color: 'var(--lab-cobalt)' }}>TRACK</span>
              </span>
              <span className="font-mono text-muted" style={{ fontSize: '9px', letterSpacing: '0.1em' }}>
                CAREER INTELLIGENCE LAB
              </span>
            </div>
          </NavLink>

          <button
            className="navbar-toggler border-lab-black rounded-0 p-2"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#publicNav"
            aria-controls="publicNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="fas fa-bars text-lab-navy"></i>
          </button>

          <div className="collapse navbar-collapse" id="publicNav">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-4 font-mono small">
              <li className="nav-item">
                <a href="#advantage" className="nav-link text-lab-navy fw-semibold px-2 hover-underline">
                  [01] ADVANTAGE
                </a>
              </li>
              <li className="nav-item">
                <a href="#workflow" className="nav-link text-lab-navy fw-semibold px-2 hover-underline">
                  [02] PIPELINE
                </a>
              </li>
              <li className="nav-item">
                <a href="#preview" className="nav-link text-lab-navy fw-semibold px-2 hover-underline">
                  [03] PRODUCT LAB
                </a>
              </li>
              <li className="nav-item">
                <a href="#gap-analysis" className="nav-link text-lab-navy fw-semibold px-2 hover-underline">
                  [04] GAP ANALYSIS
                </a>
              </li>
              <li className="nav-item">
                <a href="/#opportunities" className="nav-link text-lab-navy fw-semibold px-2 hover-underline">
                  [05] OPPORTUNITIES
                </a>
              </li>
              <li className="nav-item">
                <NavLink to="/about" className="nav-link text-lab-navy fw-semibold px-2 hover-underline">
                  [06] ABOUT
                </NavLink>
              </li>
            </ul>

            <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
              {isAuthenticated ? (
                <NavLink
                  to={role === 'student' ? '/student/dashboard' : role === 'admin' ? '/admin/dashboard' : '/recruiter/dashboard'}
                  className="btn-lab-primary py-2 px-3 small font-mono"
                  style={{ fontSize: '13px' }}
                >
                  ENTER WORKSPACE <i className="fas fa-arrow-right ms-1"></i>
                </NavLink>
              ) : (
                <>
                  <div className="dropdown d-none d-xl-block">
                    <button
                      className="btn btn-sm border-lab-black rounded-0 bg-lab-lime px-3 py-2 font-mono fw-bold text-lab-navy dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      style={{ fontSize: '12px' }}
                    >
                      <i className="fas fa-bolt me-1"></i> FAST DEMO
                    </button>
                    <ul className="dropdown-menu shadow border-lab-black rounded-0 p-1 font-mono small">
                      <li>
                        <button className="dropdown-item py-2" onClick={() => handleDemo('student')}>
                          <span className="badge bg-primary me-2">STU</span> Demo Student
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item py-2" onClick={() => handleDemo('admin')}>
                          <span className="badge bg-danger me-2">ADM</span> Demo Admin
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item py-2" onClick={() => handleDemo('recruiter')}>
                          <span className="badge bg-warning text-dark me-2">REC</span> Demo Recruiter
                        </button>
                      </li>
                    </ul>
                  </div>

                  <NavLink to="/login" className="btn btn-sm text-lab-navy font-mono fw-bold px-3 py-2 text-decoration-none">
                    SIGN IN
                  </NavLink>
                  <NavLink to="/register" className="btn-lab-primary py-2 px-3 small font-mono" style={{ fontSize: '13px' }}>
                    EXPLORE LAB
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Page Outlet */}
      <main className="flex-grow-1">
        <Outlet />
      </main>

      {/* Swiss Editorial Footer */}
      <footer className="bg-lab-navy text-white pt-5 pb-4 mt-auto border-t-lab">
        <div className="container">
          <div className="row g-4 pb-4">
            <div className="col-lg-5">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div
                  className="d-flex align-items-center justify-content-center bg-lab-lime text-lab-navy fw-bold font-mono"
                  style={{ width: '32px', height: '32px', fontSize: '14px' }}
                >
                  ST
                </div>
                <span className="font-editorial fw-bold fs-4 text-white">SKILLTRACK</span>
                <span className="lab-pill lab-pill-lime" style={{ fontSize: '10px' }}>CAREER LAB</span>
              </div>
              <p className="text-white-50 small mb-3 font-sans" style={{ maxWidth: '400px' }}>
                Institutional student skill intelligence & career placement platform. Translates raw competencies, assessments, and verified coursework into predictable placement outcomes.
              </p>
              <div className="d-flex flex-wrap gap-2 font-mono" style={{ fontSize: '11px' }}>
                <span className="badge border border-secondary text-white-50 rounded-0 px-2 py-1">REACT 18</span>
                <span className="badge border border-secondary text-white-50 rounded-0 px-2 py-1">VITE 5</span>
                <span className="badge border border-secondary text-white-50 rounded-0 px-2 py-1">NODE.JS</span>
                <span className="badge border border-secondary text-white-50 rounded-0 px-2 py-1">SEQUELIZE</span>
                <span className="badge border border-secondary text-white-50 rounded-0 px-2 py-1">MYSQL 8</span>
              </div>
            </div>

            <div className="col-6 col-lg-2 offset-lg-1">
              <div className="mono-tag text-lab-lime mb-3">[LAB PROTOCOLS]</div>
              <ul className="list-unstyled small font-mono d-flex flex-column gap-2 mb-0">
                <li><a href="/#advantage" className="text-white-50 text-decoration-none hover-white">01. Advantage</a></li>
                <li><a href="/#workflow" className="text-white-50 text-decoration-none hover-white">02. 6-Stage Pipeline</a></li>
                <li><a href="/#preview" className="text-white-50 text-decoration-none hover-white">03. Dashboard Lab</a></li>
                <li><a href="/#gap-analysis" className="text-white-50 text-decoration-none hover-white">04. Gap Analysis</a></li>
                <li><a href="/#opportunities" className="text-white-50 text-decoration-none hover-white">05. Campus Drives</a></li>
                <li><NavLink to="/about" className="text-white-50 text-decoration-none hover-white">06. About the Lab</NavLink></li>
              </ul>
            </div>

            <div className="col-6 col-lg-2">
              <div className="mono-tag text-lab-lime mb-3">[SANDBOX ACCESS]</div>
              <ul className="list-unstyled small font-mono d-flex flex-column gap-2 mb-0">
                <li><button onClick={() => handleDemo('student')} className="btn btn-link text-white-50 text-decoration-none p-0 small font-mono hover-white">Demo Student</button></li>
                <li><button onClick={() => handleDemo('admin')} className="btn btn-link text-white-50 text-decoration-none p-0 small font-mono hover-white">Demo Campus Admin</button></li>
                <li><button onClick={() => handleDemo('recruiter')} className="btn btn-link text-white-50 text-decoration-none p-0 small font-mono hover-white">Demo Recruiter</button></li>
                <li><NavLink to="/register" className="text-lab-lime text-decoration-none hover-white mt-1 d-inline-block">Student Onboarding →</NavLink></li>
              </ul>
            </div>

            <div className="col-lg-2">
              <div className="mono-tag text-lab-lime mb-3">[VERIFICATION]</div>
              <p className="text-white-50 small mb-2 font-mono" style={{ fontSize: '11px' }}>
                Algorithmic 100-pt placement readiness engine with real-time criteria audits.
              </p>
              <div className="p-2 border border-secondary font-mono text-white-50" style={{ fontSize: '10px' }}>
                <div>STATUS: NORMAL</div>
                <div className="text-lab-lime">UPTIME: 100.0%</div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-top border-secondary border-opacity-25 d-flex flex-column flex-sm-row align-items-center justify-content-between font-mono small text-white-50">
            <span>© {new Date().getFullYear()} SKILLTRACK LABS. ALL RIGHTS RESERVED.</span>
            <span>SWISS EDITORIAL ART DIRECTION // PROPRIETARY CAREER INTELLIGENCE</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
