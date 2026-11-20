import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import adminService from '../../services/adminService';
import ReadinessGauge from '../../components/ReadinessGauge';

const AdminStudentDetail = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const res = await adminService.getStudentDetail(id);
      if (res.success && res.data) {
        setStudent(res.data.student);
        setReadiness(res.data.readiness);
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to load student details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-dark" role="status" style={{ width: '2.5rem', height: '2.5rem', borderWidth: '3px' }}></div>
        <p className="font-mono text-muted mt-3 small">// AUDITING CANDIDATE SPECIFICATIONS &amp; PLACEMENT RECORDS...</p>
      </div>
    );
  }

  if (errorMsg || !student) {
    return (
      <div className="card-editorial p-5 text-center my-4">
        <i className="fas fa-circle-exclamation fa-2x mb-3 text-danger"></i>
        <p className="font-mono text-dark fw-bold mb-3">{errorMsg || '// STUDENT DOSSIER RECORD NOT FOUND'}</p>
        <NavLink to="/admin/students" className="btn-lab-sm btn-lab-sm-navy text-decoration-none">
          [BACK TO STUDENTS ROSTER]
        </NavLink>
      </div>
    );
  }

  return (
    <div className="admin-student-detail pb-5">
      {/* Breadcrumb Navigation */}
      <div className="mb-3">
        <NavLink to="/admin/students" className="btn-lab-sm btn-lab-sm-outline text-decoration-none" style={{ fontSize: '0.7rem' }}>
          <i className="fas fa-arrow-left me-1"></i> [BACK TO STUDENT ROSTER]
        </NavLink>
      </div>

      {/* Header Profile Card */}
      <div className="card-editorial p-4 p-md-5 mb-4">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4">
          <div className="d-flex align-items-center gap-4">
            <div
              className="d-flex align-items-center justify-content-center fw-bold font-mono flex-shrink-0"
              style={{
                width: '68px',
                height: '68px',
                fontSize: '1.75rem',
                backgroundColor: '#111827',
                color: '#C5F36B',
                border: '2px solid #111827'
              }}
            >
              {student.full_name?.charAt(0) || 'S'}
            </div>
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge-editorial badge-editorial-navy">
                  {student.department} &bull; SEM {student.semester}
                </span>
                <span className="badge-editorial badge-editorial-ivory">
                  USN: {student.usn || student.roll_no}
                </span>
                <span className={`badge-editorial ${student.placement_status === 'Placed' ? 'badge-editorial-lime' : 'badge-editorial-coral'}`}>
                  {(student.placement_status || 'Not Placed').toUpperCase()}
                </span>
              </div>
              <h2 className="font-editorial fw-bold text-dark mb-1">{student.full_name}</h2>
              <div className="d-flex flex-wrap align-items-center gap-3 font-mono text-muted small" style={{ fontSize: '0.72rem' }}>
                <span>EMAIL: {student.user?.email}</span>
                {student.phone && <span>&bull;</span>}
                {student.phone && <span>PHONE: {student.phone}</span>}
              </div>
            </div>
          </div>

          <div className="d-flex gap-2">
            {student.resume_path && (
              <a
                href={student.resume_path.startsWith('http') ? student.resume_path : `/${student.resume_path}`}
                target="_blank"
                rel="noreferrer"
                className="btn-lab-sm btn-lab-sm-navy text-decoration-none"
              >
                <i className="fas fa-file-pdf me-1 text-danger"></i>
                <span>[INSPECT RESUME PDF]</span>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Readiness Score Breakdown */}
        <div className="col-lg-5">
          <div className="card-editorial p-4 p-md-5 h-100 text-center d-flex flex-column justify-content-between">
            <div>
              <div className="font-mono text-muted small mb-1" style={{ fontSize: '0.68rem' }}>
                // PLACEMENT READINESS SCORECARD
              </div>
              <h4 className="font-editorial fw-bold text-dark mb-3">Placement Readiness</h4>

              {readiness && (
                <div className="d-flex justify-content-center my-3">
                  <ReadinessGauge score={readiness.score} category={readiness.category} size={180} />
                </div>
              )}
            </div>

            <div className="p-3 border border-lab-black bg-lab-ivory-light font-mono small text-start">
              <div className="d-flex justify-content-between mb-2 pb-1 border-b-lab">
                <span>01 // TECHNICAL SKILLS (35%):</span>
                <strong className="text-dark">{readiness?.breakdown?.technical?.earned} / 35</strong>
              </div>
              <div className="d-flex justify-content-between mb-2 pb-1 border-b-lab">
                <span>02 // APTITUDE EVALUATION (25%):</span>
                <strong className="text-dark">{readiness?.breakdown?.aptitude?.earned} / 25</strong>
              </div>
              <div className="d-flex justify-content-between mb-2 pb-1 border-b-lab">
                <span>03 // COMMUNICATION (20%):</span>
                <strong className="text-dark">{readiness?.breakdown?.communication?.earned} / 20</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>04 // ACADEMIC RECORD (20%):</span>
                <strong className="text-dark">{readiness?.breakdown?.academic?.earned} / 20</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Details & Skills Matrix */}
        <div className="col-lg-7">
          <div className="card-editorial p-4 p-md-5 h-100">
            <h4 className="font-editorial fw-bold text-dark border-b-lab pb-2 mb-3">
              Academic &amp; Competency Profile
            </h4>
            <div className="row g-3 mb-4">
              <div className="col-sm-4">
                <div className="p-3 border border-lab-black bg-lab-ivory-light text-center font-mono">
                  <span className="small text-muted d-block" style={{ fontSize: '0.65rem' }}>// CGPA METRIC</span>
                  <span className="fw-bold fs-3 text-dark font-editorial">{student.cgpa}</span>
                  <span className="text-muted small d-block" style={{ fontSize: '0.65rem' }}>MAX 10.0</span>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="p-3 border border-lab-black bg-lab-ivory-light text-center font-mono">
                  <span className="small text-muted d-block" style={{ fontSize: '0.65rem' }}>// ACTIVE BACKLOGS</span>
                  <span className={`fw-bold fs-3 font-editorial ${student.active_backlogs > 0 ? 'text-danger' : 'text-dark'}`}>
                    {student.active_backlogs || 0}
                  </span>
                  <span className="text-muted small d-block" style={{ fontSize: '0.65rem' }}>
                    {student.active_backlogs > 0 ? 'RESTRICTED' : 'CLEARED'}
                  </span>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="p-3 border border-lab-black bg-lab-ivory-light text-center font-mono">
                  <span className="small text-muted d-block" style={{ fontSize: '0.65rem' }}>// SKILLS INDEX</span>
                  <span className="fw-bold fs-3 text-dark font-editorial">{student.skills ? student.skills.length : 0}</span>
                  <span className="text-muted small d-block" style={{ fontSize: '0.65rem' }}>IN MATRIX</span>
                </div>
              </div>
            </div>

            <h5 className="font-editorial fw-bold text-dark border-b-lab pb-2 mb-2">
              Verified Technical Competencies
            </h5>
            <div className="d-flex flex-wrap gap-2">
              {student.skills && student.skills.length > 0 ? (
                student.skills.map((s) => (
                  <span key={s.id} className="badge-editorial badge-editorial-navy">
                    {s.skill?.name} <span className="text-white-50">[{s.proficiency_level?.toUpperCase()}]</span>
                  </span>
                ))
              ) : (
                <span className="font-mono text-muted small">// ZERO SKILLS RECORDED IN MATRIX</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Assessment History & Applications History */}
      <div className="row g-4">
        {/* Assessment Results */}
        <div className="col-lg-6">
          <div className="card-editorial p-4">
            <h5 className="font-editorial fw-bold text-dark border-b-lab pb-2 mb-3">
              Proctored Quiz History
            </h5>
            {student.assessment_results && student.assessment_results.length > 0 ? (
              <div className="table-responsive">
                <table className="table-editorial">
                  <thead>
                    <tr>
                      <th>QUIZ TITLE</th>
                      <th>PERCENTAGE</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.assessment_results.map((r) => (
                      <tr key={r.id}>
                        <td className="font-editorial fw-bold text-dark">{r.assessment?.title || 'Quiz'}</td>
                        <td className="font-mono fw-bold text-dark">{r.percentage}%</td>
                        <td>
                          <span className={`badge-editorial ${r.is_passed ? 'badge-editorial-lime' : 'badge-editorial-coral'}`}>
                            {r.is_passed ? 'PASSED' : 'RETRY'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="font-mono text-muted small mb-0">// ZERO ASSESSMENTS COMPLETED</p>
            )}
          </div>
        </div>

        {/* Applications */}
        <div className="col-lg-6">
          <div className="card-editorial p-4">
            <h5 className="font-editorial fw-bold text-dark border-b-lab pb-2 mb-3">
              Campus Drive Applications
            </h5>
            {student.applications && student.applications.length > 0 ? (
              <div className="table-responsive">
                <table className="table-editorial">
                  <thead>
                    <tr>
                      <th>ROLE &amp; COMPANY</th>
                      <th>STATUS</th>
                      <th>DATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.applications.map((app) => (
                      <tr key={app.id}>
                        <td>
                          <div className="fw-bold font-editorial text-dark">{app.job?.title}</div>
                          <div className="font-mono text-muted small" style={{ fontSize: '0.65rem' }}>{app.job?.company?.name}</div>
                        </td>
                        <td>
                          <span className="badge-editorial badge-editorial-navy">
                            {app.status?.toUpperCase()}
                          </span>
                        </td>
                        <td className="font-mono text-muted small">
                          {new Date(app.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="font-mono text-muted small mb-0">// ZERO APPLICATIONS ON FILE</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStudentDetail;
