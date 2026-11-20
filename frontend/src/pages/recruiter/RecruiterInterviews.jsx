import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import recruiterService from '../../services/recruiterService';

const RecruiterInterviews = () => {
  const [applicantData, setApplicantData] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('scheduled'); // 'scheduled' | 'ready' | 'all'
  const [search, setSearch] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Schedule Modal State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    interview_date: '',
    round: 'Technical Round 1 - DSA & Systems',
    mode: 'Google Meet',
    meeting_link: 'https://meet.google.com/abc-defg-hij',
    notes: 'Please keep camera on and have your development environment ready.'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await recruiterService.getApplicants();
      if (res && res.success && res.data) {
        setApplicantData(res.data.applicantData || []);
        setJobs(res.data.jobs || []);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load candidate interview records.');
    } finally {
      setLoading(false);
    }
  };

  const openScheduleModal = (item) => {
    setSelectedApp(item);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    tomorrow.setHours(10, 0, 0, 0);

    setInterviewForm({
      interview_date: tomorrow.toISOString().slice(0, 16),
      round: 'Technical Round 1 - DSA & Systems',
      mode: 'Google Meet',
      meeting_link: `https://meet.google.com/st-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}`,
      notes: 'Prepare coding walk-through of past projects and fundamental algorithmic concepts.'
    });
    setShowScheduleModal(true);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    setSubmitting(true);
    try {
      const fullNotes = `[${interviewForm.round} via ${interviewForm.mode}]: ${interviewForm.notes} | Link: ${interviewForm.meeting_link}`;
      const res = await recruiterService.updateApplicantStatus(selectedApp.application.id, {
        status: 'Interview',
        interview_date: interviewForm.interview_date,
        notes: fullNotes
      });

      if (res && res.success) {
        setSuccessMsg(`Interview successfully scheduled for ${selectedApp.application.student?.full_name}! Candidate notified via telemetry.`);
        setShowScheduleModal(false);
        fetchData();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setErrorMsg(res.message || 'Failed to schedule interview.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err?.message || 'Error updating interview schedule.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkOutcome = async (appId, outcomeStatus) => {
    try {
      const res = await recruiterService.updateApplicantStatus(appId, {
        status: outcomeStatus,
        notes: outcomeStatus === 'Placed' ? 'Candidate cleared final technical round with distinction. Offer extended!' : 'Interview completed.'
      });
      if (res && res.success) {
        setSuccessMsg(`Application marked as "${outcomeStatus}"!`);
        fetchData();
        setTimeout(() => setSuccessMsg(''), 2500);
      }
    } catch (err) {
      setErrorMsg('Failed to update interview outcome.');
    }
  };

  // Filtered views
  const scheduledList = applicantData.filter(item => item.application.status === 'Interview' || item.application.status === 'Interviewing');
  const readyList = applicantData.filter(item => item.application.status === 'Shortlisted');
  const hiredList = applicantData.filter(item => item.application.status === 'Placed' || item.application.status === 'Selected');

  let currentList = [];
  if (activeTab === 'scheduled') currentList = scheduledList;
  else if (activeTab === 'ready') currentList = readyList;
  else currentList = applicantData;

  const filteredList = currentList.filter(({ application }) => {
    const term = search.toLowerCase();
    return (
      (application.student?.full_name || '').toLowerCase().includes(term) ||
      (application.job?.title || '').toLowerCase().includes(term) ||
      (application.student?.department || '').toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="py-5 text-center font-mono">
        <div className="spinner-border text-dark" role="status" style={{ width: '2rem', height: '2rem' }}></div>
        <p className="text-secondary mt-2 small text-uppercase">Loading interview schedules & session rosters...</p>
      </div>
    );
  }

  return (
    <div className="recruiter-interviews">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4 pb-3 border-bottom border-dark">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge-editorial-lime">[EVALUATION LAB]</span>
            <span className="font-mono small text-secondary">{scheduledList.length} SESSIONS ACTIVE</span>
          </div>
          <h2 className="font-editorial fw-bold text-dark mb-0" style={{ letterSpacing: '-0.02em' }}>
            Interview Scheduling & Pipeline
          </h2>
          <p className="text-secondary font-mono small mb-0">
            Coordinate technical evaluation rounds, virtual room links, and candidate offer outcomes
          </p>
        </div>

        <div className="d-flex gap-2">
          <NavLink to="/recruiter/applicants" className="btn-lab-sm btn-lab-sm-outline text-decoration-none">
            <i className="fas fa-users me-1"></i> FULL CANDIDATE POOL
          </NavLink>
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

      {/* Metric Cards */}
      <div className="row g-3 mb-4 font-mono">
        <div className="col-sm-6 col-lg-3">
          <div className="card-editorial p-3 bg-white h-100">
            <span className="text-secondary small d-block mb-1">01 // ACTIVE INTERVIEWS</span>
            <div className="font-editorial display-6 fw-bold text-dark">{scheduledList.length}</div>
            <span className="badge-editorial-cobalt mt-2 d-inline-block">SCHEDULED / IN PROGRESS</span>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card-editorial p-3 bg-white h-100">
            <span className="text-secondary small d-block mb-1">02 // READY TO SCHEDULE</span>
            <div className="font-editorial display-6 fw-bold text-dark">{readyList.length}</div>
            <span className="badge-editorial-lime mt-2 d-inline-block">SHORTLISTED COHORT</span>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card-editorial p-3 bg-white h-100">
            <span className="text-secondary small d-block mb-1">03 // OFFERS EXTENDED</span>
            <div className="font-editorial display-6 fw-bold text-dark">{hiredList.length}</div>
            <span className="badge-editorial-lime mt-2 d-inline-block">PLACED IN REGISTRY</span>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card-editorial p-3 bg-white h-100">
            <span className="text-secondary small d-block mb-1">04 // TOTAL APPLICATIONS</span>
            <div className="font-editorial display-6 fw-bold text-dark">{applicantData.length}</div>
            <span className="badge-editorial-neutral mt-2 d-inline-block">ALL DRIVE SUBMISSIONS</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
        <div className="d-flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('scheduled')}
            className={`btn-lab-sm ${activeTab === 'scheduled' ? 'btn-lab-sm-primary' : 'btn-lab-sm-outline'}`}
          >
            [SCHEDULED] ({scheduledList.length})
          </button>
          <button
            onClick={() => setActiveTab('ready')}
            className={`btn-lab-sm ${activeTab === 'ready' ? 'btn-lab-sm-primary' : 'btn-lab-sm-outline'}`}
          >
            [SHORTLISTED • READY] ({readyList.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`btn-lab-sm ${activeTab === 'all' ? 'btn-lab-sm-primary' : 'btn-lab-sm-outline'}`}
          >
            [ALL PIPELINE] ({applicantData.length})
          </button>
        </div>

        <div className="input-group input-group-sm" style={{ maxWidth: '320px' }}>
          <span className="input-group-text bg-white border border-dark border-end-0 rounded-0 font-mono text-muted">
            <i className="fas fa-search"></i>
          </span>
          <input
            type="text"
            placeholder="Search candidate or job..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control-editorial border-start-0"
          />
        </div>
      </div>

      {/* Interviews Table */}
      <div className="card-editorial p-0 overflow-hidden mb-4 bg-white">
        <div className="p-3 border-bottom border-dark bg-light d-flex align-items-center justify-content-between">
          <span className="font-mono small fw-bold text-dark text-uppercase">INTERVIEW EVALUATION ROSTER</span>
          <span className="badge-editorial-neutral">ROSTER COUNT: {filteredList.length}</span>
        </div>
        <div className="table-responsive">
          <table className="table-editorial mb-0">
            <thead>
              <tr>
                <th>Candidate & Department</th>
                <th>Target Drive</th>
                <th>Readiness Index</th>
                <th>Interview Session / Status</th>
                <th>Notes / Meeting Link</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 font-mono text-muted">
                    No candidates found in this view.
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => {
                  const app = item.application || {};
                  const student = app.student || {};
                  const job = app.job || {};
                  const score = item.readiness?.score || 85;

                  return (
                    <tr key={app.id}>
                      <td>
                        <strong className="text-dark font-editorial d-block">{student.full_name || 'Candidate'}</strong>
                        <span className="font-mono text-muted" style={{ fontSize: '11px' }}>
                          {student.department} • USN: {student.usn || student.roll_no || 'N/A'}
                        </span>
                      </td>

                      <td>
                        <span className="text-dark font-editorial fw-bold d-block">{job.title}</span>
                        <span className="font-mono text-muted" style={{ fontSize: '11px' }}>₹ {job.salary_range || job.salary_package || 'Package Confirmed'}</span>
                      </td>

                      <td>
                        <span
                          className={`badge-editorial-${
                            score >= 80 ? 'lime' : score >= 60 ? 'cobalt' : 'coral'
                          }`}
                        >
                          {score}/100 READINESS
                        </span>
                      </td>

                      <td>
                        {app.status === 'Interview' || app.status === 'Interviewing' ? (
                          <div>
                            <span className="badge-editorial-cobalt mb-1 d-block text-center font-mono">
                              <i className="fas fa-calendar-alt me-1"></i>
                              {app.interview_date ? new Date(app.interview_date).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) : 'SCHEDULED'}
                            </span>
                            <span className="font-mono text-secondary d-block text-center" style={{ fontSize: '10px' }}>
                              ROUND CONFIRMED
                            </span>
                          </div>
                        ) : (
                          <span
                            className={
                              app.status === 'Shortlisted'
                                ? 'badge-editorial-cobalt'
                                : app.status === 'Placed' || app.status === 'Selected'
                                ? 'badge-editorial-lime'
                                : 'badge-editorial-neutral'
                            }
                          >
                            {app.status}
                          </span>
                        )}
                      </td>

                      <td style={{ maxWidth: '260px' }}>
                        <div className="font-mono text-secondary text-truncate" style={{ fontSize: '12px' }} title={app.notes || app.recruiter_notes || 'No notes'}>
                          {app.notes || app.recruiter_notes || 'Awaiting interview scheduling...'}
                        </div>
                      </td>

                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            onClick={() => openScheduleModal(item)}
                            className="btn-lab-sm btn-lab-sm-outline py-1 px-2"
                            title="Schedule or Reschedule Interview"
                          >
                            <i className="fas fa-calendar-plus me-1"></i>
                            {app.status === 'Interview' || app.status === 'Interviewing' ? 'RESCHEDULE' : 'SCHEDULE'}
                          </button>

                          {(app.status === 'Interview' || app.status === 'Interviewing') && (
                            <button
                              onClick={() => handleMarkOutcome(app.id, 'Placed')}
                              className="btn-lab-sm btn-lab-sm-primary py-1 px-2"
                              title="Extend Offer Letter"
                            >
                              <i className="fas fa-trophy me-1"></i> OFFER
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {showScheduleModal && selectedApp && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(17,24,39,0.7)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-0 border border-dark shadow-none bg-white">
              <div className="modal-header rounded-0 bg-dark text-white border-bottom border-dark px-4 py-3">
                <div>
                  <div className="badge-editorial-lime mb-1">[INTERVIEW DISPATCH]</div>
                  <h5 className="modal-title font-editorial fw-bold text-white mb-0">
                    Schedule Interview: {selectedApp.application.student?.full_name}
                  </h5>
                  <small className="font-mono text-white-50">{selectedApp.application.job?.title}</small>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowScheduleModal(false)}></button>
              </div>

              <form onSubmit={handleScheduleSubmit}>
                <div className="modal-body p-4">
                  <div className="p-3 bg-light border border-dark font-mono small mb-3">
                    <div>Candidate: <strong>{selectedApp.application.student?.full_name}</strong> ({selectedApp.application.student?.department})</div>
                    <div>Target Role: <strong>{selectedApp.application.job?.title}</strong></div>
                    <div>Placement Readiness: <strong className="text-dark">{selectedApp.readiness?.score || 85}/100</strong></div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label-editorial">Interview Date & Time *</label>
                    <input
                      type="datetime-local"
                      className="form-control-editorial"
                      value={interviewForm.interview_date}
                      onChange={(e) => setInterviewForm({ ...interviewForm, interview_date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label-editorial">Interview Evaluation Round</label>
                    <select
                      className="form-control-editorial"
                      value={interviewForm.round}
                      onChange={(e) => setInterviewForm({ ...interviewForm, round: e.target.value })}
                    >
                      <option value="Technical Round 1 - DSA & Systems">Technical Round 1 - DSA & Systems</option>
                      <option value="Technical Round 2 - System Architecture">Technical Round 2 - System Architecture</option>
                      <option value="Managerial & Team Fit">Managerial & Team Fit</option>
                      <option value="Executive HR Discussion">Executive HR Discussion</option>
                    </select>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label-editorial">Interview Medium</label>
                      <select
                        className="form-control-editorial"
                        value={interviewForm.mode}
                        onChange={(e) => setInterviewForm({ ...interviewForm, mode: e.target.value })}
                      >
                        <option value="Google Meet">Google Meet</option>
                        <option value="Microsoft Teams">Microsoft Teams</option>
                        <option value="Campus Placement Cell">Campus Placement Cell</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label-editorial">Meeting Link / Room</label>
                      <input
                        type="text"
                        className="form-control-editorial"
                        value={interviewForm.meeting_link}
                        onChange={(e) => setInterviewForm({ ...interviewForm, meeting_link: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label-editorial">Interviewer Instructions & Candidate Brief</label>
                    <textarea
                      rows="3"
                      className="form-control-editorial"
                      value={interviewForm.notes}
                      onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer bg-light border-top border-dark rounded-0 px-4 py-3">
                  <button type="button" className="btn-lab-sm btn-lab-sm-outline" onClick={() => setShowScheduleModal(false)}>
                    CANCEL
                  </button>
                  <button type="submit" disabled={submitting} className="btn-lab-sm btn-lab-sm-primary">
                    {submitting ? 'DISPATCHING...' : 'DISPATCH INVITATION'}
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

export default RecruiterInterviews;