import React, { useState, useEffect } from 'react';
import recruiterService from '../../services/recruiterService';

const RecruiterApplicants = () => {
  const [applicantData, setApplicantData] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filters
  const [selectedJobId, setSelectedJobId] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Status Modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusForm, setStatusForm] = useState({
    status: 'Shortlisted',
    notes: '',
    interview_date: ''
  });

  useEffect(() => {
    fetchApplicants();
  }, [selectedJobId, statusFilter]);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedJobId) params.job_id = selectedJobId;
      if (statusFilter !== 'All') params.status = statusFilter;

      const res = await recruiterService.getApplicants(params);
      if (res.success && res.data) {
        setApplicantData(res.data.applicantData || []);
        setJobs(res.data.jobs || []);
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to load applicant pool.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenStatusModal = (app) => {
    setSelectedApp(app);
    setStatusForm({
      status: app.status || 'Shortlisted',
      notes: app.recruiter_notes || app.notes || '',
      interview_date: app.interview_date ? app.interview_date.split('T')[0] : ''
    });
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      await recruiterService.updateApplicantStatus(selectedApp.id, statusForm);
      setSuccessMsg(`Candidate application updated to "${statusForm.status}"!`);
      setSelectedApp(null);
      fetchApplicants();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to update candidate status.');
    }
  };

  const filteredApplicants = applicantData.filter(({ application }) => {
    const term = search.toLowerCase();
    const matchesSearch =
      (application.student?.full_name || '').toLowerCase().includes(term) ||
      (application.job?.title || '').toLowerCase().includes(term) ||
      (application.student?.department || '').toLowerCase().includes(term);

    return matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selected':
      case 'Placed':
        return 'badge-editorial-lime';
      case 'Shortlisted':
      case 'Interview':
      case 'Interviewing':
        return 'badge-editorial-cobalt';
      case 'Rejected':
        return 'badge-editorial-coral';
      default:
        return 'badge-editorial-neutral';
    }
  };

  if (loading) {
    return (
      <div className="py-5 text-center font-mono">
        <div className="spinner-border text-dark" role="status" style={{ width: '2rem', height: '2rem' }}></div>
        <p className="text-secondary mt-2 small text-uppercase">Loading candidate profiles & readiness indicators...</p>
      </div>
    );
  }

  return (
    <div className="recruiter-applicants">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mb-4 pb-3 border-bottom border-dark">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge-editorial-lime">[RECRUITMENT LEDGER]</span>
            <span className="font-mono small text-secondary">ACTIVE POOL: {filteredApplicants.length} CANDIDATES</span>
          </div>
          <h2 className="font-editorial fw-bold text-dark mb-0" style={{ letterSpacing: '-0.02em' }}>
            Campus Candidate Pool
          </h2>
          <p className="text-secondary font-mono small mb-0">
            Evaluate candidate readiness scores, inspect resumes, and manage interview decisions
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="alert bg-white border border-dark rounded-0 font-mono small py-2 mb-4 d-flex align-items-center gap-2">
          <span className="badge-editorial-lime">[SUCCESS]</span>
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="alert bg-white border border-dark rounded-0 font-mono small py-2 mb-4 d-flex align-items-center gap-2">
          <span className="badge-editorial-coral">[ALERT]</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="card-editorial p-3 mb-4 bg-white">
        <div className="row g-3 align-items-center">
          <div className="col-md-5">
            <label className="form-label-editorial">Search Candidates</label>
            <div className="input-group">
              <span className="input-group-text bg-white border border-dark border-end-0 rounded-0 font-mono text-muted">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                className="form-control-editorial border-start-0"
                placeholder="Search candidate name or department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <label className="form-label-editorial">Filter By Job Drive</label>
            <select
              className="form-control-editorial"
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
            >
              <option value="">All Job Drives</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>{j.title}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label-editorial">Pipeline Stage</label>
            <select
              className="form-control-editorial"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Pipeline Stages</option>
              <option value="Applied">Applied</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Interview">Interview</option>
              <option value="Selected">Selected</option>
              <option value="Placed">Placed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card-editorial p-0 overflow-hidden mb-4 bg-white">
        <div className="p-3 border-bottom border-dark bg-light d-flex align-items-center justify-content-between">
          <span className="font-mono small fw-bold text-dark text-uppercase">CANDIDATE DOSSIERS & STAGE EVALUATION</span>
          <span className="badge-editorial-neutral">MATCHES: {filteredApplicants.length}</span>
        </div>
        <div className="table-responsive">
          <table className="table-editorial mb-0">
            <thead>
              <tr>
                <th>Candidate & Department</th>
                <th>Target Drive</th>
                <th>Academic Standing</th>
                <th>Readiness Index</th>
                <th>Resume</th>
                <th>Pipeline Status</th>
                <th>Interview / Feedback</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5 font-mono text-muted">
                    No candidates found matching the active criteria.
                  </td>
                </tr>
              ) : (
                filteredApplicants.map(({ application, readiness }) => (
                  <tr key={application.id}>
                    <td>
                      <div className="fw-bold text-dark font-editorial">{application.student?.full_name}</div>
                      <div className="font-mono text-muted" style={{ fontSize: '11px' }}>
                        {application.student?.department} • USN: {application.student?.usn || application.student?.roll_no || 'N/A'}
                      </div>
                    </td>
                    <td>
                      <span className="fw-bold text-dark font-editorial">{application.job?.title}</span>
                    </td>
                    <td>
                      <div className="font-mono">
                        <strong className="text-dark">CGPA {application.student?.cgpa || 'N/A'}</strong>
                        <div className="text-secondary" style={{ fontSize: '11px' }}>
                          Backlogs: {application.student?.active_backlogs ?? 0}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge-editorial-${
                        (readiness?.score || 0) >= 80 ? 'lime' :
                        (readiness?.score || 0) >= 60 ? 'cobalt' :
                        (readiness?.score || 0) >= 40 ? 'coral' : 'coral'
                      }`}>
                        {readiness?.score ?? 'N/A'}/100 [{readiness?.category || 'TIER'}]
                      </span>
                    </td>
                    <td>
                      {application.student?.resume_path ? (
                        <a
                          href={application.student.resume_path.startsWith('http') ? application.student.resume_path : `/${application.student.resume_path}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-lab-sm btn-lab-sm-outline text-decoration-none py-1 px-2 font-mono"
                          title="Download Dossier"
                        >
                          <i className="fas fa-file-pdf me-1 text-danger"></i> PDF
                        </a>
                      ) : (
                        <span className="font-mono text-muted" style={{ fontSize: '11px' }}>—</span>
                      )}
                    </td>
                    <td>
                      <span className={getStatusBadge(application.status)}>
                        {application.status}
                      </span>
                    </td>
                    <td>
                      {application.interview_date ? (
                        <div className="font-mono text-dark fw-bold" style={{ fontSize: '12px' }}>
                          <i className="far fa-calendar-check me-1 text-primary"></i>
                          {new Date(application.interview_date).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="font-mono text-muted">—</span>
                      )}
                      {application.recruiter_notes && (
                        <div className="font-mono text-secondary text-truncate" style={{ fontSize: '11px', maxWidth: '180px' }} title={application.recruiter_notes}>
                          {application.recruiter_notes}
                        </div>
                      )}
                    </td>
                    <td className="text-end">
                      <button
                        onClick={() => handleOpenStatusModal(application)}
                        className="btn-lab-sm btn-lab-sm-primary py-1 px-3"
                      >
                        DECISION
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision Modal */}
      {selectedApp && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(17,24,39,0.7)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-0 border border-dark shadow-none bg-white">
              <div className="modal-header rounded-0 bg-dark text-white border-bottom border-dark px-4 py-3">
                <div>
                  <div className="badge-editorial-lime mb-1">[STAGE AUDIT]</div>
                  <h5 className="modal-title font-editorial fw-bold text-white mb-0">Candidate Hiring Decision</h5>
                  <small className="font-mono text-white-50">{selectedApp.student?.full_name} • {selectedApp.job?.title}</small>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedApp(null)}></button>
              </div>
              <form onSubmit={handleUpdateStatus}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label-editorial">Recruitment Pipeline Stage</label>
                    <select
                      className="form-control-editorial"
                      value={statusForm.status}
                      onChange={(e) => setStatusForm(prev => ({ ...prev, status: e.target.value }))}
                      required
                    >
                      <option value="Applied">Applied</option>
                      <option value="Shortlisted">Shortlisted for Assessment / Interview</option>
                      <option value="Interview">Interview Scheduled</option>
                      <option value="Selected">Selected / Offer Recommended</option>
                      <option value="Placed">Offer Extended (Placed in Registry)</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label-editorial">Interview Schedule Date</label>
                    <input
                      type="date"
                      className="form-control-editorial"
                      value={statusForm.interview_date}
                      onChange={(e) => setStatusForm(prev => ({ ...prev, interview_date: e.target.value }))}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label-editorial">Recruiter Feedback / Telemetry Notes</label>
                    <textarea
                      className="form-control-editorial"
                      rows="3"
                      placeholder="Candidate strengths, meeting link, interview instructions..."
                      value={statusForm.notes}
                      onChange={(e) => setStatusForm(prev => ({ ...prev, notes: e.target.value }))}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer bg-light border-top border-dark rounded-0 px-4 py-3">
                  <button type="button" className="btn-lab-sm btn-lab-sm-outline" onClick={() => setSelectedApp(null)}>
                    CANCEL
                  </button>
                  <button type="submit" className="btn-lab-sm btn-lab-sm-primary">
                    SUBMIT DECISION
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterApplicants;