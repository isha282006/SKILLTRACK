import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import jobService from '../../services/jobService';

const JobsCatalog = () => {
  const [jobCards, setJobCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyEligible, setOnlyEligible] = useState(false);
  const [selectedType, setSelectedType] = useState('All');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await jobService.getAllJobs();
      if (res.success && res.data) {
        setJobCards(res.data);
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobCards.filter(({ job, eligibility }) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.company?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.location || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEligibility = !onlyEligible || eligibility.isEligible;
    const matchesType = selectedType === 'All' || job.job_type === selectedType;

    return matchesSearch && matchesEligibility && matchesType;
  });

  if (loading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-dark" role="status" style={{ width: '2.5rem', height: '2.5rem', borderWidth: '3px' }}></div>
        <p className="font-mono text-muted mt-3 small">// SCANNING RECRUITMENT DRIVES &amp; VERIFYING ELIGIBILITY...</p>
      </div>
    );
  }

  return (
    <div className="jobs-catalog pb-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 border-bottom border-lab-black pb-3">
        <div>
          <div className="font-mono text-muted" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
            // INSTITUTIONAL CAREER INTELLIGENCE &bull; SECTION 09
          </div>
          <h2 className="font-editorial text-dark mb-0 fw-bold" style={{ letterSpacing: '-0.03em' }}>
            Campus Placement Drives &amp; Openings
          </h2>
          <p className="text-secondary small mb-0 font-sans">
            Verified corporate recruitment pipelines with live eligibility gating based on CGPA, backlogs, and competencies.
          </p>
        </div>
        <NavLink to="/student/applications" className="btn-lab-sm btn-lab-sm-outline text-decoration-none">
          <i className="fas fa-file-signature me-1"></i>
          <span>[TRACK MY APPLICATIONS]</span>
        </NavLink>
      </div>

      {errorMsg && (
        <div className="p-3 mb-4 bg-danger bg-opacity-10 border border-danger d-flex align-items-center gap-2 font-mono small text-danger">
          <i className="fas fa-circle-exclamation"></i>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="card-editorial p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-5">
            <input
              type="text"
              className="form-control-editorial font-mono"
              placeholder="Search by role, company, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ fontSize: '0.8rem' }}
            />
          </div>

          <div className="col-md-3">
            <select
              className="form-control-editorial font-mono"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{ fontSize: '0.8rem' }}
            >
              <option value="All">All Commitment Types</option>
              <option value="Full-Time">Full-Time (Direct Hire)</option>
              <option value="Internship">Internship + PPO</option>
              <option value="Part-Time">Part-Time</option>
            </select>
          </div>

          <div className="col-md-4 d-flex align-items-center justify-content-md-end">
            <label className="d-flex align-items-center gap-2 font-mono small text-dark cursor-pointer m-0" style={{ cursor: 'pointer', fontSize: '0.75rem' }}>
              <input
                type="checkbox"
                checked={onlyEligible}
                onChange={(e) => setOnlyEligible(e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <span className="fw-bold">// SHOW ONLY ELIGIBLE DRIVES</span>
            </label>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="card-editorial p-5 text-center">
          <i className="fas fa-briefcase fa-3x text-muted opacity-50 mb-3"></i>
          <h4 className="font-editorial fw-bold text-dark mb-1">// ZERO MATCHING PLACEMENT OPENINGS</h4>
          <p className="font-mono text-muted small mb-4">
            NO OPENINGS MATCH YOUR CURRENT SEARCH CRITERIA OR ELIGIBILITY CUTOFFS.
          </p>
          <button
            onClick={() => { setSearchTerm(''); setOnlyEligible(false); setSelectedType('All'); }}
            className="btn-lab-sm btn-lab-sm-navy mx-auto"
          >
            [RESET ALL FILTERS]
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {filteredJobs.map(({ job, eligibility, hasApplied }) => (
            <div className="col-md-6 col-xl-4" key={job.id}>
              <div className="card-editorial p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-start justify-content-between gap-2 mb-3">
                    <span className="badge-editorial badge-editorial-navy" style={{ fontSize: '0.65rem' }}>
                      {job.company?.name || 'Recruiting Partner'}
                    </span>
                    <span className={`badge-editorial ${eligibility.isEligible ? 'badge-editorial-lime' : 'badge-editorial-coral'}`}>
                      {eligibility.isEligible ? 'ELIGIBLE' : 'INELIGIBLE'}
                    </span>
                  </div>

                  <h4 className="font-editorial fw-bold text-dark mb-1">{job.title}</h4>
                  <div className="font-mono text-muted small mb-3" style={{ fontSize: '0.68rem' }}>
                    PACKAGE: ₹ {job.salary_range} &bull; {job.location} &bull; {job.job_type}
                  </div>

                  <p className="text-secondary small mb-3" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {job.description}
                  </p>
                </div>

                <div>
                  {/* Eligibility Cutoffs */}
                  <div className="p-2 mb-3 border border-lab-black bg-lab-ivory-light font-mono small" style={{ fontSize: '0.68rem' }}>
                    <div className="d-flex justify-content-between">
                      <span>MIN CGPA: <strong>{job.min_cgpa}</strong></span>
                      <span>MAX BACKLOGS: <strong>{job.max_backlogs}</strong></span>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="d-flex flex-wrap gap-1 mb-3">
                    {job.required_skills && job.required_skills.slice(0, 3).map((rs) => (
                      <span key={rs.id} className="badge-editorial badge-editorial-ivory" style={{ fontSize: '0.6rem' }}>
                        {rs.skill?.name}
                      </span>
                    ))}
                    {job.required_skills && job.required_skills.length > 3 && (
                      <span className="badge-editorial badge-editorial-ivory" style={{ fontSize: '0.6rem' }}>
                        +{job.required_skills.length - 3} MORE
                      </span>
                    )}
                  </div>

                  <div className="d-flex align-items-center justify-content-between pt-3 border-t-lab">
                    <span className="font-mono text-muted" style={{ fontSize: '0.65rem' }}>
                      DEADLINE: {new Date(job.application_deadline).toLocaleDateString()}
                    </span>
                    <NavLink
                      to={`/student/jobs/${job.id}`}
                      className={`btn-lab-sm ${hasApplied ? 'btn-lab-sm-outline' : eligibility.isEligible ? 'btn-lab-sm-lime' : 'btn-lab-sm-outline'} text-decoration-none`}
                    >
                      {hasApplied ? (
                        <span>[APPLIED ✓]</span>
                      ) : (
                        <span>[AUDIT &amp; APPLY]</span>
                      )}
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsCatalog;
