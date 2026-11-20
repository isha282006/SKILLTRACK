import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Update Status Modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusForm, setStatusForm] = useState({
    status: 'Shortlisted',
    notes: '',
    interview_date: '',
    package_lpa: ''
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await adminService.getApplications();
      if (res.success && res.data) {
        setApplications(res.data);
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenStatusModal = (app) => {
    setSelectedApp(app);
    setStatusForm({
      status: app.status || 'Shortlisted',
      notes: app.notes || app.recruiter_notes || '',
      interview_date: app.interview_date ? app.interview_date.split('T')[0] : '',
      package_lpa: app.job?.salary_package || '10.0'
    });
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      await adminService.updateApplicationStatus(selectedApp.id, statusForm);
      setSuccessMsg(`Candidate application updated to "${statusForm.status}"!`);
      setSelectedApp(null);
      fetchApplications();
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to update application status.');
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesSearch =
      (app.student?.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (app.job?.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (app.job?.company?.name || '').toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Placed':
      case 'Selected':
        return 'badge-editorial-lime';
      case 'Shortlisted':
        return 'badge-editorial-navy';
      case 'Interviewing':
        return 'badge-editorial-cobalt';
      case 'Rejected':
        return 'badge-editorial-coral';
      default:
        return 'badge-editorial-ivory';
    }
  };

  if (loading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-dark" role="status" style={{ width: '2.5rem', height: '2.5rem', borderWidth: '3px' }}></div>
        <p className="font-mono text-muted mt-3 small">// RETRIEVING PIPELINE CANDIDACY APPLICATIONS...</p>
      </div>
    );
  }

  return (
    <div className="admin-applications pb-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 border-bottom border-lab-black pb-3">
        <div>
          <div className="font-mono text-muted" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
            // INSTITUTIONAL CAREER INTELLIGENCE &bull; CANDIDACY PIPELINE
          </div>
          <h2 className="font-editorial text-dark mb-0 fw-bold" style={{ letterSpacing: '-0.03em' }}>
            Applications &amp; Recruitment Pipeline
          </h2>
          <p className="text-secondary small mb-0 font-sans">
            Oversee student submissions across drives, advance candidate stages, and log interview schedules.
          </p>
        </div>
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

      {/* Filter Bar */}
      <div className="card-editorial p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-7">
            <input
              type="text"
              className="form-control-editorial font-mono"
              placeholder="Search candidate name, job title, or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ fontSize: '0.8rem' }}
            />
          </div>
          <div className="col-md-5">
            <select
              className="form-control-editorial font-mono"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ fontSize: '0.8rem' }}
            >
              <option value="All">All Pipeline Stages</option>
              <option value="Applied">Applied</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Selected">Selected</option>
              <option value="Placed">Placed (Offer Confirmed)</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card-editorial p-4">
        <div className="table-responsive">
          <table className="table-editorial">
            <thead>
              <tr>
                <th>CANDIDATE DOSSIER</th>
                <th>TARGET ROLE &amp; COMPANY</th>
                <th>ACADEMIC PROFILE</th>
                <th>SUBMISSION DATE</th>
                <th>PIPELINE STAGE</th>
                <th>INTERVIEW SCHEDULE</th>
                <th className="text-end">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 font-mono text-muted small">
                    // ZERO APPLICATIONS MATCHING CURRENT FILTER CRITERIA
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div className="fw-bold font-editorial text-dark">{app.student?.full_name}</div>
                      <div className="font-mono text-muted small" style={{ fontSize: '0.65rem' }}>
                        {app.student?.department} &bull; USN: {app.student?.usn || app.student?.roll_no}
                      </div>
                    </td>
                    <td>
                      <div className="fw-bold font-editorial text-dark">{app.job?.title}</div>
                      <div className="font-mono text-muted small" style={{ fontSize: '0.65rem' }}>{app.job?.company?.name}</div>
                    </td>
                    <td>
                      <span className="font-mono fw-bold text-dark">CGPA: {app.student?.cgpa}</span>
                      <div className="font-mono text-muted small" style={{ fontSize: '0.65rem' }}>
                        {app.student?.active_backlogs || 0} BACKLOGS
                      </div>
                    </td>
                    <td className="font-mono text-muted small">
                      {new Date(app.created_at || app.applied_at).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`badge-editorial ${getStatusBadge(app.status)}`}>
                        {app.status?.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      {app.interview_date ? (
                        <div className="font-mono fw-bold text-dark small">
                          <i className="far fa-calendar-alt me-1"></i>
                          {new Date(app.interview_date).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="font-mono text-muted small">—</span>
                      )}
                      {app.notes && (
                        <div className="font-mono text-muted small" style={{ fontSize: '0.65rem' }}>NOTE: {app.notes}</div>
                      )}
                    </td>
                    <td className="text-end">
                      <button
                        onClick={() => handleOpenStatusModal(app)}
                        className="btn-lab-sm btn-lab-sm-outline"
                      >
                        [UPDATE STAGE]
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Status Modal */}
      {selectedApp && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'rgba(17, 24, 39, 0.7)', zIndex: 1060 }}
        >
          <div className="card-editorial p-4" style={{ width: '520px', backgroundColor: '#FFFFFF' }}>
            <div className="d-flex align-items-center justify-content-between border-b-lab pb-2 mb-3">
              <div>
                <span className="font-mono fw-bold text-dark small">// ADVANCE CANDIDACY STAGE</span>
                <div className="font-mono text-muted small" style={{ fontSize: '0.65rem' }}>
                  {selectedApp.student?.full_name} &rarr; {selectedApp.job?.title}
                </div>
              </div>
              <button
                className="btn btn-link p-0 text-dark font-mono text-decoration-none"
                onClick={() => setSelectedApp(null)}
              >
                [X]
              </button>
            </div>
            <form onSubmit={handleUpdateStatus}>
              <div className="mb-3">
                <label className="form-label-editorial">Recruitment Pipeline Stage</label>
                <select
                  className="form-control-editorial font-mono"
                  value={statusForm.status}
                  onChange={(e) => setStatusForm(prev => ({ ...prev, status: e.target.value }))}
                  required
                >
                  <option value="Applied">Applied (Initial Intake)</option>
                  <option value="Shortlisted">Shortlisted for Technical Assessment</option>
                  <option value="Interviewing">Interviewing (Rounds Active)</option>
                  <option value="Selected">Selected (Offer Pending)</option>
                  <option value="Placed">Placed (Official Offer Confirmed)</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label-editorial">Scheduled Interview Date (Optional)</label>
                <input
                  type="date"
                  className="form-control-editorial font-mono"
                  value={statusForm.interview_date}
                  onChange={(e) => setStatusForm(prev => ({ ...prev, interview_date: e.target.value }))}
                />
              </div>

              {statusForm.status === 'Placed' && (
                <div className="mb-3">
                  <label className="form-label-editorial">Confirmed Package (LPA)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control-editorial font-mono"
                    placeholder="e.g. 14.5"
                    value={statusForm.package_lpa}
                    onChange={(e) => setStatusForm(prev => ({ ...prev, package_lpa: e.target.value }))}
                    required
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="form-label-editorial">Recruiter / Admin Feedback Notes</label>
                <textarea
                  rows="3"
                  placeholder="Feedback, test scores, or interview link..."
                  className="form-control-editorial"
                  value={statusForm.notes}
                  onChange={(e) => setStatusForm(prev => ({ ...prev, notes: e.target.value }))}
                ></textarea>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-2 border-t-lab">
                <button
                  type="button"
                  className="btn-lab-sm btn-lab-sm-outline"
                  onClick={() => setSelectedApp(null)}
                >
                  [CANCEL]
                </button>
                <button
                  type="submit"
                  className="btn-lab-sm btn-lab-sm-lime"
                >
                  [COMMIT STAGE TRANSITION]
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApplications;
