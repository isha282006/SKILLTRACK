import React, { useState, useEffect } from 'react';
import recruiterService from '../../services/recruiterService';

const RecruiterJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    job_type: 'Full-time',
    location: 'Bengaluru',
    salary_package: '',
    min_cgpa: 7.0,
    max_backlogs: 0,
    allowed_departments: 'Computer Science, Information Science',
    openings: 5,
    deadline: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await recruiterService.getJobs();
      if (res.success && res.data) {
        setJobs(res.data);
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to load company jobs.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await recruiterService.createJob(formData);
      setSuccessMsg(`Campus opening "${formData.title}" published successfully!`);
      setShowModal(false);
      fetchJobs();
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to post vacancy.');
    }
  };

  const handleToggleJob = async (id) => {
    try {
      const res = await recruiterService.toggleJob(id);
      if (res.success) {
        setSuccessMsg(res.message || 'Job status updated.');
        fetchJobs();
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to toggle status.');
    }
  };

  if (loading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-dark" role="status" style={{ width: '2.5rem', height: '2.5rem', borderWidth: '3px' }}></div>
        <p className="font-mono text-muted mt-3 small">// RETRIEVING CORPORATE JOB POSTINGS...</p>
      </div>
    );
  }

  return (
    <div className="recruiter-jobs pb-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 border-bottom border-lab-black pb-3">
        <div>
          <div className="font-mono text-muted" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
            // INSTITUTIONAL CAREER INTELLIGENCE &bull; JOB MANAGEMENT
          </div>
          <h2 className="font-editorial text-dark mb-0 fw-bold" style={{ letterSpacing: '-0.03em' }}>
            Manage Corporate Vacancies
          </h2>
          <p className="text-secondary small mb-0 font-sans">
            Publish recruitment drive specifications, define CGPA / backlog cut-offs, and toggle application acceptance.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-lab-sm btn-lab-sm-lime">
          <i className="fas fa-plus me-1"></i>
          <span>[PUBLISH NEW VACANCY]</span>
        </button>
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

      {/* Jobs Grid */}
      <div className="row g-4">
        {jobs.length === 0 ? (
          <div className="col-12">
            <div className="card-editorial p-5 text-center">
              <i className="fas fa-briefcase fa-3x text-muted opacity-50 mb-3"></i>
              <h4 className="font-editorial fw-bold text-dark mb-1">// ZERO OPENINGS CURRENTLY POSTED</h4>
              <p className="font-mono text-muted small mb-4">
                PUBLISH A JOB OPENING TO INTAKE AND AUDIT VERIFIED STUDENT CANDIDATES.
              </p>
              <button onClick={() => setShowModal(true)} className="btn-lab-sm btn-lab-sm-navy mx-auto">
                [POST FIRST VACANCY]
              </button>
            </div>
          </div>
        ) : (
          jobs.map((job) => (
            <div className="col-md-6 col-xl-4" key={job.id}>
              <div className="card-editorial p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-start justify-content-between gap-2 mb-3">
                    <span className="badge-editorial badge-editorial-navy">
                      {job.job_type}
                    </span>
                    <span className={`badge-editorial ${job.is_active ? 'badge-editorial-lime' : 'badge-editorial-coral'}`}>
                      {job.is_active ? 'ACCEPTING' : 'CLOSED'}
                    </span>
                  </div>

                  <h4 className="font-editorial fw-bold text-dark mb-1">{job.title}</h4>
                  <div className="font-mono text-muted small mb-3" style={{ fontSize: '0.68rem' }}>
                    PACKAGE: ₹ {job.salary_range || job.salary_package} &bull; {job.location}
                  </div>
                </div>

                <div>
                  <div className="p-2 mb-3 border border-lab-black bg-lab-ivory-light font-mono small" style={{ fontSize: '0.68rem' }}>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">MIN CGPA:</span>
                      <strong className="text-dark">{job.min_cgpa}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">MAX BACKLOGS:</span>
                      <strong className="text-dark">{job.max_backlogs}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">APPLICANTS:</span>
                      <strong className="text-dark">{job.applications ? job.applications.length : 0} CANDIDATES</strong>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      onClick={() => handleToggleJob(job.id)}
                      className={`btn-lab-sm ${job.is_active ? 'btn-lab-sm-outline' : 'btn-lab-sm-lime'} flex-grow-1`}
                    >
                      {job.is_active ? '[CLOSE DRIVE]' : '[RE-OPEN DRIVE]'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'rgba(17, 24, 39, 0.7)', zIndex: 1060 }}
        >
          <div className="card-editorial p-4" style={{ width: '640px', maxHeight: '88vh', overflowY: 'auto', backgroundColor: '#FFFFFF' }}>
            <div className="d-flex align-items-center justify-content-between border-b-lab pb-2 mb-3">
              <span className="font-mono fw-bold text-dark small">// POST CAMPUS JOB OPENING</span>
              <button
                className="btn btn-link p-0 text-dark font-mono text-decoration-none"
                onClick={() => setShowModal(false)}
              >
                [X]
              </button>
            </div>
            <form onSubmit={handleCreateJob}>
              <div className="mb-3">
                <label className="form-label-editorial">Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cloud Security Engineer"
                  className="form-control-editorial font-mono"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-md-4">
                  <label className="form-label-editorial">Commitment Type</label>
                  <select
                    className="form-control-editorial font-mono"
                    value={formData.job_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, job_type: e.target.value }))}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label-editorial">Work Location</label>
                  <input
                    type="text"
                    required
                    className="form-control-editorial font-mono"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label-editorial">Salary / Package (CTC)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 18.0 LPA"
                    className="form-control-editorial font-mono"
                    value={formData.salary_package}
                    onChange={(e) => setFormData(prev => ({ ...prev, salary_package: e.target.value }))}
                  />
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-md-4">
                  <label className="form-label-editorial">Min CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    required
                    className="form-control-editorial font-mono"
                    value={formData.min_cgpa}
                    onChange={(e) => setFormData(prev => ({ ...prev, min_cgpa: e.target.value }))}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label-editorial">Max Backlogs</label>
                  <input
                    type="number"
                    min="0"
                    required
                    className="form-control-editorial font-mono"
                    value={formData.max_backlogs}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_backlogs: e.target.value }))}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label-editorial">Deadline</label>
                  <input
                    type="date"
                    required
                    className="form-control-editorial font-mono"
                    value={formData.deadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label-editorial">Job Description &amp; Candidate Responsibilities</label>
                <textarea
                  rows="3"
                  required
                  className="form-control-editorial"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                ></textarea>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-2 border-t-lab">
                <button
                  type="button"
                  className="btn-lab-sm btn-lab-sm-outline"
                  onClick={() => setShowModal(false)}
                >
                  [CANCEL]
                </button>
                <button
                  type="submit"
                  className="btn-lab-sm btn-lab-sm-lime"
                >
                  [PUBLISH VACANCY]
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterJobs;
