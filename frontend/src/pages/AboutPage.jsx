import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AboutPage = () => {
  const { demoLogin, isAuthenticated, role } = useAuth();

  const handleDemo = async (roleName) => {
    try {
      await demoLogin(roleName);
      if (roleName === 'student') window.location.href = '/student/dashboard';
      else if (roleName === 'admin') window.location.href = '/admin/dashboard';
      else if (roleName === 'recruiter') window.location.href = '/recruiter/dashboard';
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="about-page bg-lab-ivory">
      {/* Editorial Header Manifesto */}
      <section className="py-5 py-lg-6 border-b-lab bg-white">
        <div className="container py-2 py-lg-4">
          <div className="d-inline-flex align-items-center gap-2 mb-3">
            <span className="editorial-num">ABOUT // SYS 2.0</span>
            <span className="mono-tag text-lab-navy" style={{ letterSpacing: '0.1em' }}>
              CAREER INTELLIGENCE LAB PHILOSOPHY
            </span>
          </div>

          <h1 className="editorial-title text-lab-navy display-3 fw-bold mb-4" style={{ maxWidth: '850px' }}>
            Transforming Academic Capability Into Verified Placement Readiness.
          </h1>

          <p className="text-secondary fs-5 font-sans mb-0" style={{ maxWidth: '720px', lineHeight: '1.7' }}>
            SkillTrack was founded on a simple premise: conventional campus placement systems rely on static GPA cutoffs and unverified resume bullet points. We replace arbitrary gatekeeping with transparent, data-driven competency modeling.
          </p>
        </div>
      </section>

      {/* Section 1: The Core Concept (Editorial Grid) */}
      <section className="py-5 py-lg-6 border-b-lab bg-lab-ivory">
        <div className="container py-3">
          <div className="row g-5 align-items-start">
            <div className="col-lg-5">
              <span className="mono-tag text-lab-cobalt mb-2 d-block">[01 – THE PROBLEM & THE LAB]</span>
              <h2 className="editorial-title text-lab-navy display-5 fw-bold mb-4">
                Beyond Static GPAs.
              </h2>
              <p className="text-secondary font-sans mb-4" style={{ lineHeight: '1.7' }}>
                Colleges struggle to identify which students are truly industry-ready, while corporate recruiters sift through thousands of identical generic resumes.
              </p>
              <p className="text-secondary font-sans mb-4" style={{ lineHeight: '1.7' }}>
                SkillTrack operates as an <strong>Institutional Career Intelligence Laboratory</strong>. By combining multi-format resume parsing (PDF/DOCX), objective timed assessments, and live job requirement matching, we create an auditable bridge between classroom and career.
              </p>

              <div className="p-3 bg-white border-lab-black font-mono small">
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">FOUNDATIONAL ARCHITECTURE:</span>
                  <span className="text-lab-navy fw-bold">NODE.JS + REACT + MYSQL</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">PARSING ENGINE:</span>
                  <span className="text-lab-lime fw-bold bg-dark px-2">JAVASCRIPT NLP V2.0</span>
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="row g-4">
                <div className="col-sm-6">
                  <div className="editorial-block p-4 h-100 bg-white">
                    <span className="editorial-num mb-2">01</span>
                    <h5 className="font-editorial fw-bold text-dark mb-2">Student Intelligence</h5>
                    <p className="text-secondary small font-sans mb-0">
                      Students gain self-awareness through diagnostic gap analyses, identifying missing competencies before applying to top-tier campus drives.
                    </p>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="editorial-block p-4 h-100 bg-white">
                    <span className="editorial-num mb-2" style={{ backgroundColor: 'var(--lab-coral)' }}>02</span>
                    <h5 className="font-editorial fw-bold text-dark mb-2">Institutional Analytics</h5>
                    <p className="text-secondary small font-sans mb-0">
                      Placement officers monitor departmental cohort readiness, average CTC projections, and real-time application pipelines across all branches.
                    </p>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="editorial-block p-4 h-100 bg-white">
                    <span className="editorial-num mb-2" style={{ backgroundColor: 'var(--lab-lime)', color: 'var(--lab-navy)' }}>03</span>
                    <h5 className="font-editorial fw-bold text-dark mb-2">Recruiter Precision</h5>
                    <p className="text-secondary small font-sans mb-0">
                      Recruiters configure automated criteria filters (CGPA, backlogs, branch, skills) to immediately surface verified, high-probability candidates.
                    </p>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="editorial-block p-4 h-100 bg-white">
                    <span className="editorial-num mb-2" style={{ backgroundColor: 'var(--lab-cobalt)', color: '#ffffff' }}>04</span>
                    <h5 className="font-editorial fw-bold text-dark mb-2">Transparent Verification</h5>
                    <p className="text-secondary small font-sans mb-0">
                      Placement readiness scores are deterministic and auditable. No hidden black-box estimations or fabricated credentials.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Mathematical Scoring Formula */}
      <section className="py-5 py-lg-6 border-b-lab bg-white">
        <div className="container py-3">
          <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between mb-5 border-b-lab pb-4">
            <div>
              <span className="mono-tag text-lab-navy mb-2 d-block">[THE 100-POINT ALGORITHMIC BENCHMARK]</span>
              <h2 className="editorial-title text-lab-navy display-4 fw-bold mb-0">
                Placement Readiness Formula.
              </h2>
            </div>
            <p className="text-secondary font-mono small mt-3 mt-md-0 mb-0" style={{ maxWidth: '400px' }}>
              Four deterministic pillars combined into an institutional 100-point index.
            </p>
          </div>

          <div className="row g-4 font-mono">
            {/* Pillar 1 */}
            <div className="col-md-6 col-lg-3">
              <div className="editorial-block p-4 bg-lab-ivory-light h-100">
                <span className="badge bg-dark text-white rounded-0 mb-2">35% WEIGHT</span>
                <h4 className="font-editorial fw-bold text-dark mb-2">Technical Skills</h4>
                <p className="text-muted small font-sans mb-3">
                  Evaluated from verified programming languages, frameworks, databases, and objective technical assessments.
                </p>
                <div className="p-2 bg-white border-lab-black small">
                  Max: <strong>35.0 Points</strong>
                </div>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="col-md-6 col-lg-3">
              <div className="editorial-block p-4 bg-lab-ivory-light h-100">
                <span className="badge bg-lab-cobalt text-white rounded-0 mb-2">25% WEIGHT</span>
                <h4 className="font-editorial fw-bold text-dark mb-2">Aptitude Logic</h4>
                <p className="text-muted small font-sans mb-3">
                  Benchmarked via timed quantitative assessments, logical reasoning, and mathematical pattern recognition.
                </p>
                <div className="p-2 bg-white border-lab-black small">
                  Max: <strong>25.0 Points</strong>
                </div>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="col-md-6 col-lg-3">
              <div className="editorial-block p-4 bg-lab-ivory-light h-100">
                <span className="badge bg-lab-lime text-lab-navy rounded-0 mb-2">20% WEIGHT</span>
                <h4 className="font-editorial fw-bold text-dark mb-2">Communication</h4>
                <p className="text-muted small font-sans mb-3">
                  Workplace collaboration, verbal clarity, professional email etiquette, and structured technical explanations.
                </p>
                <div className="p-2 bg-white border-lab-black small">
                  Max: <strong>20.0 Points</strong>
                </div>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="col-md-6 col-lg-3">
              <div className="editorial-block p-4 bg-lab-ivory-light h-100">
                <span className="badge bg-lab-coral text-lab-navy rounded-0 mb-2">20% WEIGHT</span>
                <h4 className="font-editorial fw-bold text-dark mb-2">Academics</h4>
                <p className="text-muted small font-sans mb-3">
                  Cumulative Grade Point Average (CGPA) with standardized deductions applied for active backlogs.
                </p>
                <div className="p-2 bg-white border-lab-black small">
                  Max: <strong>20.0 Points</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Classification Tiers */}
          <div className="mt-5 p-4 bg-lab-navy text-white border-lab-black font-mono small">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <span className="text-lab-lime fw-bold">TIER 1 (80 - 100): EXCELLENT</span>
                <span className="text-white-50 ms-2">→ Immediate Dream Company Clearance</span>
              </div>
              <div>
                <span className="text-white fw-bold">TIER 2 (60 - 79): GOOD</span>
                <span className="text-white-50 ms-2">→ Qualified for Core IT & Product Roles</span>
              </div>
              <div>
                <span className="text-warning fw-bold">TIER 3 (40 - 59): AVERAGE</span>
                <span className="text-white-50 ms-2">→ Needs Targeted Remediation</span>
              </div>
              <div>
                <span className="text-lab-coral fw-bold">TIER 4 (&lt;40): NEEDS IMPROVEMENT</span>
                <span className="text-white-50 ms-2">→ Remedial Skills Bootcamp</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Technology Architecture */}
      <section className="py-5 py-lg-6 border-b-lab bg-lab-ivory">
        <div className="container py-3">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <span className="mono-tag text-lab-navy mb-2 d-block">[ENGINEERING & SYSTEM DESIGN]</span>
              <h2 className="editorial-title text-lab-navy display-5 fw-bold mb-4">
                Built on Modern Web Standards.
              </h2>
              <div className="d-flex flex-column gap-3 font-mono small">
                <div className="p-3 bg-white border-lab-black">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <strong className="text-dark">Frontend Ecosystem:</strong>
                    <span className="badge bg-light text-dark border">REACT 18 + VITE</span>
                  </div>
                  <span className="text-secondary font-sans">
                    Modular single-page architecture with React Router 6, Axios API integration, Chart.js telemetry, and custom Swiss editorial CSS.
                  </span>
                </div>

                <div className="p-3 bg-white border-lab-black">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <strong className="text-dark">Backend & Services:</strong>
                    <span className="badge bg-light text-dark border">NODE.JS + EXPRESS</span>
                  </div>
                  <span className="text-secondary font-sans">
                    RESTful API micro-architecture, JWT bearer authentication, role-based authorization middleware, and automated scoring services.
                  </span>
                </div>

                <div className="p-3 bg-white border-lab-black">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <strong className="text-dark">Storage & ORM:</strong>
                    <span className="badge bg-light text-dark border">SEQUELIZE + MYSQL</span>
                  </div>
                  <span className="text-secondary font-sans">
                    Relational schema definitions with cascade rules, foreign keys, index optimization, and memoryStore resilience fallback.
                  </span>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="editorial-block p-4 p-md-5 bg-white text-center">
                <div className="d-inline-flex p-3 bg-lab-navy text-white rounded-circle mb-3">
                  <i className="fas fa-shield-alt fa-2x text-lab-lime"></i>
                </div>
                <h4 className="font-editorial fw-bold text-dark mb-2">Integrity & Transparency</h4>
                <p className="text-secondary font-sans small mb-4" style={{ lineHeight: '1.7' }}>
                  All algorithms run transparently. When a student is categorized as eligible or ineligible for a job, the exact passing or failing criteria are rendered directly in the interface.
                </p>
                <div className="d-flex justify-content-center gap-2">
                  <NavLink to="/register" className="btn btn-dark rounded-0 font-mono small px-3 py-2">
                    Create Student Account
                  </NavLink>
                  <button onClick={() => handleDemo('student')} className="btn btn-outline-dark rounded-0 font-mono small px-3 py-2">
                    Launch Demo Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Block */}
      <section className="py-5 bg-lab-navy text-white">
        <div className="container text-center py-4">
          <h2 className="editorial-title display-5 fw-bold mb-3">
            Ready to explore your career intelligence?
          </h2>
          <p className="text-white-50 fs-5 mb-4 mx-auto" style={{ maxWidth: '600px' }}>
            Experience verified skill profiling, real-time job eligibility checking, and predictive readiness scoring.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <NavLink to="/register" className="btn-lab-lime">
              <span>Register as Student</span>
              <i className="fas fa-arrow-right"></i>
            </NavLink>
            <NavLink to="/login" className="btn-lab-secondary" style={{ borderColor: '#ffffff', color: '#ffffff' }}>
              <span>Sign In to Portal</span>
              <i className="fas fa-user"></i>
            </NavLink>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
