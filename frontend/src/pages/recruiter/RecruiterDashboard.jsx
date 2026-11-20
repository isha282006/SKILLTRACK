import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import recruiterService from '../../services/recruiterService';
import StatCard from '../../components/StatCard';

const RecruiterDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await recruiterService.getDashboard();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to load recruiter dashboard.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-dark" role="status" style={{ width: '2.5rem', height: '2.5rem', borderWidth: '3px' }}></div>
        <p className="font-mono text-muted mt-3 small">// RETRIEVING CORPORATE TALENT ACQUISITION DESK...</p>
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <div className="card-editorial p-5 text-center my-4">
        <i className="fas fa-circle-exclamation fa-2x mb-3 text-danger"></i>
        <p className="font-mono text-dark fw-bold mb-3">{errorMsg || '// UNABLE TO RETRIEVE RECRUITER WORKSPACE'}</p>
        <button className="btn-lab-sm btn-lab-sm-navy" onClick={fetchDashboard}>
          [RELOAD WORKSPACE]
        </button>
      </div>
    );
  }

  const { recruiter, company, activeJobsCount, totalApplicants, shortlistedCount, hiredCount, recentApplications, jobs } = data;

  return (
    <div className="recruiter-dashboard pb-5">
      {/* Header Banner */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 border-bottom border-lab-black pb-3">
        <div>
          <div className="font-mono text-muted" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
            // INSTITUTIONAL CAREER INTELLIGENCE &bull; RECRUITER DESK
          </div>
          <h2 className="font-editorial text-dark mb-0 fw-bold" style={{ letterSpacing: '-0.03em' }}>
            {company?.name || 'Recruiting Partner'} Desk
          </h2>
          <p className="text-secondary small mb-0 font-sans">
            Recruiter Lead: {recruiter?.contact_person || 'Campus Coordinator'}. Manage candidate review pools and interview tracks.
          </p>
        </div>
        <div className="d-flex gap-2">
          <NavLink to="/recruiter/jobs/create" className="btn-lab-sm btn-lab-sm-lime text-decoration-none">
            <i className="fas fa-plus me-1"></i>
            <span>[POST CAMPUS VACANCY]</span>
          </NavLink>
          <NavLink to="/recruiter/applicants" className="btn-lab-sm btn-lab-sm-outline text-decoration-none">
            <i className="fas fa-users me-1"></i>
            <span>[REVIEW CANDIDATES]</span>
          </NavLink>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title="ACTIVE VACANCIES"
            value={activeJobsCount}
            subtitle="Campus Openings"
            icon="fa-briefcase"
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title="TOTAL APPLICANTS"
            value={totalApplicants}
            subtitle="Candidacy Submissions"
            icon="fa-users"
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title="SHORTLISTED POOL"
            value={shortlistedCount}
            subtitle="Ready for Interview"
            icon="fa-user-check"
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title="OFFERS EXTENDED"
            value={hiredCount}
            subtitle="Placed Candidates"
            icon="fa-trophy"
          />
        </div>
      </div>

      <div className="row g-4">
        {/* Recent Applicants */}
        <div className="col-lg-7">
          <div className="card-editorial p-4 h-100">
            <div className="d-flex align-items-center justify-content-between border-b-lab pb-3 mb-3">
              <div>
                <span className="font-mono text-muted small" style={{ fontSize: '0.68rem' }}>
                  // LIVE SUBMISSIONS
                </span>
                <h5 className="font-editorial fw-bold text-dark mb-0">Recent Candidate Applications</h5>
              </div>
              <NavLink to="/recruiter/applicants" className="btn-lab-sm btn-lab-sm-outline text-decoration-none">
                <span>[ALL APPLICANTS ({totalApplicants})]</span>
              </NavLink>
            </div>

            {recentApplications && recentApplications.length > 0 ? (
              <div className="table-responsive">
                <table className="table-editorial">
                  <thead>
                    <tr>
                      <th>CANDIDATE</th>
                      <th>TARGET OPENING</th>
                      <th>CGPA</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentApplications.map((app) => (
                      <tr key={app.id}>
                        <td>
                          <div className="fw-bold font-editorial text-dark">{app.student?.full_name}</div>
                          <div className="font-mono text-muted small" style={{ fontSize: '0.65rem' }}>{app.student?.department}</div>
                        </td>
                        <td className="font-editorial text-dark">{app.job?.title}</td>
                        <td className="font-mono fw-bold text-dark">{app.student?.cgpa}</td>
                        <td>
                          <span className={`badge-editorial ${
                            app.status === 'Selected' || app.status === 'Placed' ? 'badge-editorial-lime' :
                            app.status === 'Shortlisted' ? 'badge-editorial-navy' :
                            app.status === 'Interviewing' ? 'badge-editorial-cobalt' :
                            app.status === 'Rejected' ? 'badge-editorial-coral' :
                            'badge-editorial-ivory'
                          }`}>
                            {app.status?.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4 font-mono text-muted small">
                // ZERO CANDIDATE SUBMISSIONS CURRENTLY LOGGED
              </div>
            )}
          </div>
        </div>

        {/* Company Active Openings */}
        <div className="col-lg-5">
          <div className="card-editorial p-4 h-100">
            <div className="d-flex align-items-center justify-content-between border-b-lab pb-3 mb-3">
              <div>
                <span className="font-mono text-muted small" style={{ fontSize: '0.68rem' }}>
                  // RECRUITMENT DRIVES
                </span>
                <h5 className="font-editorial fw-bold text-dark mb-0">Active Job Postings</h5>
              </div>
              <NavLink to="/recruiter/jobs" className="btn-lab-sm btn-lab-sm-outline text-decoration-none">
                <span>[MANAGE]</span>
              </NavLink>
            </div>

            {jobs && jobs.length > 0 ? (
              <div className="d-flex flex-column gap-2">
                {jobs.map((j) => (
                  <div key={j.id} className="p-3 border border-lab-black bg-lab-ivory-light">
                    <div className="d-flex align-items-start justify-content-between mb-1">
                      <h6 className="font-editorial fw-bold text-dark mb-0">{j.title}</h6>
                      <span className={`badge-editorial ${j.is_active ? 'badge-editorial-lime' : 'badge-editorial-coral'}`}>
                        {j.is_active ? 'ACTIVE' : 'CLOSED'}
                      </span>
                    </div>
                    <div className="font-mono text-muted small mb-2" style={{ fontSize: '0.68rem' }}>
                      {j.location} &bull; ₹ {j.salary_package || j.salary_range} &bull; MIN CGPA: {j.min_cgpa}
                    </div>
                    <NavLink to={`/recruiter/applicants?job_id=${j.id}`} className="font-mono text-dark fw-bold small text-decoration-none" style={{ fontSize: '0.72rem' }}>
                      [INSPECT APPLICANT POOL &rarr;]
                    </NavLink>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 font-mono text-muted small">
                <p className="mb-3">// ZERO ACTIVE JOB POSTINGS ON FILE</p>
                <NavLink to="/recruiter/jobs/create" className="btn-lab-sm btn-lab-sm-navy text-decoration-none">
                  [PUBLISH FIRST VACANCY]
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
