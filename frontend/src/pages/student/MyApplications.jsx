import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import studentService from '../../services/studentService';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await studentService.getApplications();
      if (res.success && res.data) {
        setApplications(res.data.applications || res.data || []);
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
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
        <p className="font-mono text-muted mt-3 small">// RETRIEVING CANDIDACY PIPELINE DISPATCHES...</p>
      </div>
    );
  }

  return (
    <div className="my-applications pb-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 border-bottom border-lab-black pb-3">
        <div>
          <div className="font-mono text-muted" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
            // INSTITUTIONAL CAREER INTELLIGENCE &bull; SECTION 10
          </div>
          <h2 className="font-editorial text-dark mb-0 fw-bold" style={{ letterSpacing: '-0.03em' }}>
            My Applications &amp; Hiring Pipeline
          </h2>
          <p className="text-secondary small mb-0 font-sans">
            Track interview rounds, screening evaluations, and corporate shortlisting telemetry in real time.
          </p>
        </div>
        <NavLink to="/student/jobs" className="btn-lab-sm btn-lab-sm-lime text-decoration-none">
          <i className="fas fa-briefcase me-1"></i>
          <span>[BROWSE MORE DRIVES]</span>
        </NavLink>
      </div>

      {errorMsg && (
        <div className="p-3 mb-4 bg-danger bg-opacity-10 border border-danger d-flex align-items-center gap-2 font-mono small text-danger">
          <i className="fas fa-circle-exclamation"></i>
          <span>{errorMsg}</span>
        </div>
      )}

      {applications.length === 0 ? (
        <div className="card-editorial p-5 text-center">
          <i className="far fa-paper-plane fa-3x text-muted opacity-50 mb-3"></i>
          <h4 className="font-editorial fw-bold text-dark mb-1">// ZERO APPLICATIONS IN PIPELINE</h4>
          <p className="font-mono text-muted small mb-4">
            YOU HAVE NOT SUBMITTED CANDIDACY TO ANY ACTIVE CAMPUS RECRUITMENT DRIVES.
          </p>
          <NavLink to="/student/jobs" className="btn-lab-sm btn-lab-sm-navy text-decoration-none mx-auto">
            [EXPLORE ELIGIBLE OPENINGS]
          </NavLink>
        </div>
      ) : (
        <div className="card-editorial p-4 mb-4">
          <div className="table-responsive">
            <table className="table-editorial">
              <thead>
                <tr>
                  <th>ROLE &amp; HIRING PARTNER</th>
                  <th>COMMITMENT TYPE</th>
                  <th>PACKAGE / CTC</th>
                  <th>SUBMITTED DATE</th>
                  <th>PIPELINE STATUS</th>
                  <th>INTERVIEW SCHEDULE</th>
                  <th className="text-end">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div className="fw-bold font-editorial text-dark">{app.job?.title || 'Job Opening'}</div>
                      <div className="font-mono text-muted small" style={{ fontSize: '0.68rem' }}>{app.job?.company?.name || 'Recruiting Partner'}</div>
                    </td>
                    <td>
                      <span className="badge-editorial badge-editorial-ivory">
                        {app.job?.job_type || 'Full-Time'}
                      </span>
                    </td>
                    <td className="font-mono fw-bold text-dark">
                      ₹ {app.job?.salary_range || 'Competitive'}
                    </td>
                    <td className="font-mono text-muted small">
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`badge-editorial ${getStatusBadge(app.status)}`}>
                        {app.status?.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      {app.interview_date ? (
                        <div className="font-mono fw-bold text-dark small">
                          <i className="far fa-calendar-check me-1"></i>
                          {new Date(app.interview_date).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="font-mono text-muted small">—</span>
                      )}
                      {app.recruiter_notes && (
                        <div className="font-mono text-muted" style={{ fontSize: '0.65rem' }}>
                          NOTE: {app.recruiter_notes}
                        </div>
                      )}
                    </td>
                    <td className="text-end">
                      {app.job && (
                        <NavLink to={`/student/jobs/${app.job.id}`} className="btn-lab-sm btn-lab-sm-outline text-decoration-none">
                          [VIEW SPEC]
                        </NavLink>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplications;
