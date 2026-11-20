import React, { useState, useEffect } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import jobService from '../../services/jobService';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchJobDetail();
  }, [id]);

  const fetchJobDetail = async () => {
    try {
      setLoading(true);
      const res = await jobService.getJobDetail(id);
      if (res.success && res.data) {
        setJob(res.data.job);
        setEligibility(res.data.eligibility);
        setApplication(res.data.application);
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to load job details.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!eligibility?.isEligible) {
      setErrorMsg('You do not meet the minimum eligibility criteria for this opening.');
      return;
    }

    if (!window.confirm(`Confirm submitting verified candidacy for ${job.title} at ${job.company?.name}?`)) {
      return;
    }

    setApplying(true);
    setErrorMsg('');

    try {
      const res = await jobService.applyJob(id);
      if (res.success) {
        setSuccessMsg('Candidacy submitted successfully to recruiter pipeline. Track under My Applications.');
        setApplication(res.data?.application || { status: 'Applied', created_at: new Date() });
      } else {
        setErrorMsg(res.message || 'Application failed.');
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to submit application.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-dark" role="status" style={{ width: '2.5rem', height: '2.5rem', borderWidth: '3px' }}></div>
        <p className="font-mono text-muted mt-3 small">// AUDITING SPECIFICATIONS &amp; ELIGIBILITY PROTOCOLS...</p>
      </div>
    );
  }

  if (errorMsg && !job) {
    return (
      <div className="card-editorial p-5 text-center my-4">
        <i className="fas fa-circle-exclamation fa-2x mb-3 text-danger"></i>
        <p className="font-mono text-dark fw-bold mb-3">{errorMsg || '// JOB OPENING SPECIFICATION NOT FOUND'}</p>
        <NavLink to="/student/jobs" className="btn-lab-sm btn-lab-sm-navy text-decoration-none">
          [BACK TO ALL DRIVES]
        </NavLink>
      </div>
    );
  }

  return (
    <div className="job-detail pb-5">
      {/* Breadcrumb Navigation */}
      <div className="mb-3">
        <NavLink to="/student/jobs" className="btn-lab-sm btn-lab-sm-outline text-decoration-none" style={{ fontSize: '0.7rem' }}>
          <i className="fas fa-arrow-left me-1"></i> [BACK TO RECRUITMENT DRIVES]
        </NavLink>
      </div>

      {successMsg && (
        <div className="p-3 mb-4 bg-lab-lime border border-lab-black d-flex align-items-center gap-2 font-mono small text-dark">
          <i className="fas fa-check-circle"></i>
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 mb-4 bg-danger bg-opacity-10 border border-danger d-flex align-items-center gap-2 font-mono small text-danger">
          <i className="fas fa-circle-exclamation"></i>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Header Card */}
      <div className="card-editorial p-4 p-md-5 mb-4">
        <div className="d-flex flex-column flex-md-row align-items-md-start justify-content-between gap-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge-editorial badge-editorial-navy">
                {job.company?.name || 'Recruiting Partner'}
              </span>
              <span className="badge-editorial badge-editorial-lime">
                {job.job_type}
              </span>
            </div>
            <h2 className="font-editorial fw-bold text-dark mb-2">{job.title}</h2>
            <div className="d-flex flex-wrap align-items-center gap-3 font-mono text-muted small" style={{ fontSize: '0.75rem' }}>
              <span>LOCATION: {job.location}</span>
              <span>&bull;</span>
              <span>COMPENSATION: ₹ {job.salary_range}</span>
              <span>&bull;</span>
              <span>DEADLINE: {new Date(job.application_deadline).toLocaleDateString()}</span>
            </div>
          </div>

          <div>
            {application ? (
              <div className="text-md-end">
                <span className="badge-editorial badge-editorial-lime fs-6 d-inline-flex align-items-center gap-2 py-2 px-3">
                  <i className="fas fa-check-double"></i> APPLIED &bull; {application.status?.toUpperCase()}
                </span>
                <div className="font-mono text-muted small mt-1" style={{ fontSize: '0.65rem' }}>
                  RECORDED ON {new Date(application.created_at).toLocaleDateString()}
                </div>
              </div>
            ) : eligibility?.isEligible ? (
              <button
                onClick={handleApply}
                disabled={applying}
                className="btn-lab-sm btn-lab-sm-lime"
                style={{ fontSize: '0.85rem', padding: '0.75rem 2rem' }}
              >
                {applying ? '[SUBMITTING CANDIDACY...]' : '[CONFIRM & APPLY FOR THIS ROLE]'}
              </button>
            ) : (
              <button disabled className="btn-lab-sm btn-lab-sm-outline opacity-50 cursor-not-allowed">
                [INELIGIBLE TO APPLY]
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Side: Job Specs */}
        <div className="col-lg-7">
          <div className="card-editorial p-4 p-md-5 mb-4">
            <h4 className="font-editorial fw-bold text-dark border-b-lab pb-2 mb-3">
              Role Specification &amp; Responsibilities
            </h4>
            <div className="text-secondary small mb-4 font-sans" style={{ lineHeight: '1.8', whiteSpace: 'pre-line' }}>
              {job.description}
            </div>

            <h5 className="font-editorial fw-bold text-dark border-b-lab pb-2 mb-3">
              Required Technical Competencies
            </h5>
            <div className="d-flex flex-wrap gap-2 mb-4">
              {job.required_skills && job.required_skills.length > 0 ? (
                job.required_skills.map((rs) => (
                  <span key={rs.id} className="badge-editorial badge-editorial-navy">
                    {rs.skill?.name} <span className="text-white-50">[{rs.minimum_proficiency?.toUpperCase()}]</span>
                  </span>
                ))
              ) : (
                <span className="font-mono text-muted small">// OPEN TO ALL ENGINEERING SKILL PROFILES</span>
              )}
            </div>

            <h5 className="font-editorial fw-bold text-dark border-b-lab pb-2 mb-2">
              Corporate Profile: {job.company?.name}
            </h5>
            <p className="text-secondary small mb-0 font-sans">
              {job.company?.description || 'Premier institutional hiring partner participating in college placement drive.'}
            </p>
          </div>
        </div>

        {/* Right Side: Real-Time Eligibility Audit */}
        <div className="col-lg-5">
          <div className="card-editorial p-4 p-md-5">
            <div className="d-flex align-items-center justify-content-between mb-4 border-b-lab pb-3">
              <h5 className="font-editorial fw-bold text-dark mb-0">Automated Eligibility Audit</h5>
              <span className={`badge-editorial ${eligibility?.isEligible ? 'badge-editorial-lime' : 'badge-editorial-coral'}`}>
                {eligibility?.isEligible ? 'VERIFIED ELIGIBLE' : 'INELIGIBLE'}
              </span>
            </div>

            <div className="d-flex flex-column gap-3 font-mono small">
              {/* CGPA */}
              <div className="p-3 border border-lab-black bg-lab-ivory-light d-flex align-items-center justify-content-between">
                <div>
                  <span className="fw-bold text-dark d-block">MINIMUM CGPA</span>
                  <span className="text-muted" style={{ fontSize: '0.68rem' }}>CUTOFF: {job.min_cgpa}</span>
                </div>
                <div>
                  {eligibility?.reasons?.some(r => r.includes('CGPA')) ? (
                    <span className="badge-editorial badge-editorial-coral">BELOW CUTOFF</span>
                  ) : (
                    <span className="badge-editorial badge-editorial-lime">PASSED</span>
                  )}
                </div>
              </div>

              {/* Backlogs */}
              <div className="p-3 border border-lab-black bg-lab-ivory-light d-flex align-items-center justify-content-between">
                <div>
                  <span className="fw-bold text-dark d-block">MAX BACKLOG ALLOWANCE</span>
                  <span className="text-muted" style={{ fontSize: '0.68rem' }}>LIMIT: {job.max_backlogs} ACTIVE</span>
                </div>
                <div>
                  {eligibility?.reasons?.some(r => r.includes('backlog')) ? (
                    <span className="badge-editorial badge-editorial-coral">EXCEEDED</span>
                  ) : (
                    <span className="badge-editorial badge-editorial-lime">CLEARED</span>
                  )}
                </div>
              </div>

              {/* Eligible Branches */}
              <div className="p-3 border border-lab-black bg-lab-ivory-light d-flex align-items-center justify-content-between">
                <div>
                  <span className="fw-bold text-dark d-block">BRANCH RESTRICTION</span>
                  <span className="text-muted" style={{ fontSize: '0.68rem' }}>{job.eligible_branches || 'All Engineering Branches'}</span>
                </div>
                <div>
                  {eligibility?.reasons?.some(r => r.includes('branch') || r.includes('department')) ? (
                    <span className="badge-editorial badge-editorial-coral">BRANCH MISMATCH</span>
                  ) : (
                    <span className="badge-editorial badge-editorial-lime">ELIGIBLE</span>
                  )}
                </div>
              </div>

              {/* Missing Skills Warning */}
              {eligibility?.missingSkills && eligibility.missingSkills.length > 0 && (
                <div className="p-3 border border-lab-black" style={{ backgroundColor: '#FAF8F5' }}>
                  <div className="fw-bold text-dark mb-1 small">// PREREQUISITE SKILL DEFICITS:</div>
                  <ul className="mb-0 ps-3 font-mono" style={{ fontSize: '0.72rem' }}>
                    {eligibility.missingSkills.map((ms, idx) => (
                      <li key={idx} className="text-secondary">{ms}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Ineligibility Reasons */}
            {eligibility && !eligibility.isEligible && eligibility.reasons && (
              <div className="p-3 border border-lab-black mt-3 bg-danger bg-opacity-10 text-danger font-mono small">
                <div className="fw-bold mb-1">// INELIGIBILITY SPECIFICATION:</div>
                <ul className="mb-0 ps-3" style={{ fontSize: '0.7rem' }}>
                  {eligibility.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
