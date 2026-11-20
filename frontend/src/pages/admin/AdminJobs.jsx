import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Post Job Modal
  const [showPostModal, setShowPostModal] = useState(false);
  const [postForm, setPostForm] = useState({
    company_id: '',
    title: '',
    description: '',
    job_type: 'Full-time',
    location: 'Bengaluru',
    salary_package: '',
    min_cgpa: 7.0,
    max_backlogs: 0,
    allowed_departments: 'Computer Science, Information Science',
    openings: 5,
    deadline: '',
    skill_ids: []
  });

  // Eligible Students Modal
  const [selectedJobForAudit, setSelectedJobForAudit] = useState(null);
  const [eligibleCohort, setEligibleCohort] = useState([]);
  const [loadingCohort, setLoadingCohort] = useState(false);

  useEffect(() => {
    fetchJobsAndMetadata();
  }, []);

  const fetchJobsAndMetadata = async () => {
    try {
      setLoading(true);
      const [jobsRes, compsRes, skillsRes] = await Promise.all([
        adminService.getJobs(),
        adminService.getCompanies(),
        adminService.getSkills()
      ]);

      if (jobsRes.success) setJobs(jobsRes.data || []);
      if (compsRes.success) setCompanies(compsRes.data || []);
      if (skillsRes.success) setSkills(skillsRes.data || []);
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to load jobs data.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await adminService.createJob(postForm);
      setSuccessMsg(`Placement drive "${postForm.title}" posted successfully!`);
      setShowPostModal(false);
      fetchJobsAndMetadata();
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to post job opening.');
    }
  };

  const handleViewEligibleStudents = async (job) => {
    setSelectedJobForAudit(job);
    setLoadingCohort(true);
    try {
      const res = await adminService.getJobEligibleStudents(job.id);
      if (res.success && res.data) {
        setEligibleCohort(res.data.eligibleStudents || []);
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to fetch eligible students.');
    } finally {
      setLoadingCohort(false);
    }
  };

  if (loading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-dark" role="status" style={{ width: '2.5rem', height: '2.5rem', borderWidth: '3px' }}></div>
        <p className="font-mono text-muted mt-3 small">// RETRIEVING CORPORATE PLACEMENT DRIVES...</p>
      </div>
    );
  }

  return (
    <div className="admin-jobs pb-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 border-bottom border-lab-black pb-3">
        <div>
          <div className="font-mono text-muted" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
            // INSTITUTIONAL CAREER INTELLIGENCE &bull; PLACEMENT DRIVES
          </div>
          <h2 className="font-editorial text-dark mb-0 fw-bold" style={{ letterSpacing: '-0.03em' }}>
            Campus Recruitment Drives &amp; Openings
          </h2>
          <p className="text-secondary small mb-0 font-sans">
            Manage corporate job postings, eligibility rule sets, and view automated student eligibility audits.
          </p>
        </div>
        <button onClick={() => setShowPostModal(true)} className="btn-lab-sm btn-lab-sm-lime">
          <i className="fas fa-plus me-1"></i>
          <span>[PUBLISH PLACEMENT DRIVE]</span>
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

      {/* Grid of Job Postings */}
      <div className="row g-4">
        {jobs.map((job) => (
          <div className="col-md-6 col-xl-4" key={job.id}>
            <div className="card-editorial p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-start justify-content-between gap-2 mb-3">
                  <span className="badge-editorial badge-editorial-navy">
                    {job.company?.name || 'Recruiting Partner'}
                  </span>
                  <span className="badge-editorial badge-editorial-ivory">
                    {job.job_type}
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
                    onClick={() => handleViewEligibleStudents(job)}
                    className="btn-lab-sm btn-lab-sm-lime flex-grow-1"
                  >
                    <i className="fas fa-user-check me-1"></i>
                    <span>[AUDIT ELIGIBLE CANDIDATES]</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Eligible Students Modal */}
      {selectedJobForAudit && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'rgba(17, 24, 39, 0.7)', zIndex: 1060 }}
        >
          <div className="card-editorial p-4" style={{ width: '680px', maxHeight: '85vh', overflowY: 'auto', backgroundColor: '#FFFFFF' }}>
            <div className="d-flex align-items-center justify-content-between border-b-lab pb-2 mb-3">
              <div>
                <span className="font-mono fw-bold text-dark small">
                  // ELIGIBLE COHORT &bull; {selectedJobForAudit.title}
                </span>
                <div className="font-mono text-muted small" style={{ fontSize: '0.65rem' }}>
                  CRITERIA: MIN CGPA {selectedJobForAudit.min_cgpa} &bull; MAX BACKLOGS {selectedJobForAudit.max_backlogs}
                </div>
              </div>
              <button
                className="btn btn-link p-0 text-dark font-mono text-decoration-none"
                onClick={() => setSelectedJobForAudit(null)}
              >
                [X]
              </button>
            </div>

            <div>
              {loadingCohort ? (
                <div className="text-center py-4 font-mono text-muted small">
                  // AUDITING STUDENT DATABASE AGAINST ELIGIBILITY RULES...
                </div>
              ) : eligibleCohort.length === 0 ? (
                <div className="text-center py-4 font-mono text-muted small">
                  // ZERO CANDIDATES CURRENTLY MEET ALL CUTOFFS FOR THIS OPENING
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table-editorial">
                    <thead>
                      <tr>
                        <th>CANDIDATE</th>
                        <th>DEPARTMENT</th>
                        <th>CGPA</th>
                        <th>READINESS INDEX</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eligibleCohort.map(({ student, readiness }) => (
                        <tr key={student.id}>
                          <td>
                            <div className="fw-bold font-editorial text-dark">{student.full_name}</div>
                            <div className="font-mono text-muted small" style={{ fontSize: '0.65rem' }}>USN: {student.usn || student.roll_no}</div>
                          </td>
                          <td className="font-mono small">{student.department}</td>
                          <td className="font-mono fw-bold text-dark">{student.cgpa}</td>
                          <td>
                            <span className="badge-editorial badge-editorial-lime">
                              {readiness.score}/100 &bull; {readiness.category?.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="d-flex justify-content-end pt-3 mt-3 border-t-lab">
              <button
                className="btn-lab-sm btn-lab-sm-navy"
                onClick={() => setSelectedJobForAudit(null)}
              >
                [DISMISS AUDIT]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Job Modal */}
      {showPostModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'rgba(17, 24, 39, 0.7)', zIndex: 1060 }}
        >
          <div className="card-editorial p-4" style={{ width: '680px', maxHeight: '88vh', overflowY: 'auto', backgroundColor: '#FFFFFF' }}>
            <div className="d-flex align-items-center justify-content-between border-b-lab pb-2 mb-3">
              <span className="font-mono fw-bold text-dark small">// PUBLISH CAMPUS RECRUITMENT DRIVE</span>
              <button
                className="btn btn-link p-0 text-dark font-mono text-decoration-none"
                onClick={() => setShowPostModal(false)}
              >
                [X]
              </button>
            </div>
            <form onSubmit={handleCreateJob}>
              <div className="row g-2 mb-3">
                <div className="col-md-6">
                  <label className="form-label-editorial">Recruiting Company Partner</label>
                  <select
                    className="form-control-editorial font-mono"
                    value={postForm.company_id}
                    onChange={(e) => setPostForm(prev => ({ ...prev, company_id: e.target.value }))}
                    required
                  >
                    <option value="">-- Select Company --</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label-editorial">Job Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Associate Software Engineer"
                    className="form-control-editorial font-mono"
                    value={postForm.title}
                    onChange={(e) => setPostForm(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-md-4">
                  <label className="form-label-editorial">Job Type</label>
                  <select
                    className="form-control-editorial font-mono"
                    value={postForm.job_type}
                    onChange={(e) => setPostForm(prev => ({ ...prev, job_type: e.target.value }))}
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
                    value={postForm.location}
                    onChange={(e) => setPostForm(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label-editorial">Salary / Package (CTC)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 14.0 LPA"
                    className="form-control-editorial font-mono"
                    value={postForm.salary_package}
                    onChange={(e) => setPostForm(prev => ({ ...prev, salary_package: e.target.value }))}
                  />
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-md-4">
                  <label className="form-label-editorial">Min CGPA Cutoff</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    required
                    className="form-control-editorial font-mono"
                    value={postForm.min_cgpa}
                    onChange={(e) => setPostForm(prev => ({ ...prev, min_cgpa: e.target.value }))}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label-editorial">Max Backlogs Allowed</label>
                  <input
                    type="number"
                    min="0"
                    required
                    className="form-control-editorial font-mono"
                    value={postForm.max_backlogs}
                    onChange={(e) => setPostForm(prev => ({ ...prev, max_backlogs: e.target.value }))}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label-editorial">Application Deadline</label>
                  <input
                    type="date"
                    required
                    className="form-control-editorial font-mono"
                    value={postForm.deadline}
                    onChange={(e) => setPostForm(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label-editorial">Eligible Departments</label>
                <input
                  type="text"
                  required
                  className="form-control-editorial font-mono"
                  value={postForm.allowed_departments}
                  onChange={(e) => setPostForm(prev => ({ ...prev, allowed_departments: e.target.value }))}
                />
              </div>

              <div className="mb-4">
                <label className="form-label-editorial">Role Description &amp; Candidate Responsibilities</label>
                <textarea
                  rows="3"
                  required
                  className="form-control-editorial"
                  value={postForm.description}
                  onChange={(e) => setPostForm(prev => ({ ...prev, description: e.target.value }))}
                ></textarea>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-2 border-t-lab">
                <button
                  type="button"
                  className="btn-lab-sm btn-lab-sm-outline"
                  onClick={() => setShowPostModal(false)}
                >
                  [CANCEL]
                </button>
                <button
                  type="submit"
                  className="btn-lab-sm btn-lab-sm-lime"
                >
                  [PUBLISH DRIVE TO CAMPUS]
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobs;
