import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import studentService from '../../services/studentService';
import ReadinessGauge from '../../components/ReadinessGauge';

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    department: '',
    semester: 6,
    cgpa: 0,
    activeBacklogs: 0,
    bio: '',
    linkedinUrl: '',
    githubUrl: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await studentService.getProfile();
      if (res.success && res.data) {
        setStudent(res.data.student);
        setReadiness(res.data.readiness);
        setFormData({
          fullName: res.data.student.full_name || '',
          phone: res.data.student.phone || '',
          department: res.data.student.department || '',
          semester: res.data.student.semester || 6,
          cgpa: res.data.student.cgpa || 0,
          activeBacklogs: res.data.student.active_backlogs || 0,
          bio: res.data.student.bio || '',
          linkedinUrl: res.data.student.linkedin_url || '',
          githubUrl: res.data.student.github_url || ''
        });
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setSaving(true);

    try {
      const res = await studentService.updateProfile({
        fullName: formData.fullName,
        phone: formData.phone,
        department: formData.department,
        semester: Number(formData.semester),
        cgpa: parseFloat(formData.cgpa),
        activeBacklogs: Number(formData.activeBacklogs),
        bio: formData.bio,
        linkedinUrl: formData.linkedinUrl,
        githubUrl: formData.githubUrl
      });

      if (res.success) {
        setSuccessMsg('Academic dossier updated and verified successfully in MySQL repository.');
        if (res.data?.student) {
          setStudent(res.data.student);
        }
        if (res.data?.readiness) {
          setReadiness(res.data.readiness);
        }
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to update student profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-dark" role="status" style={{ width: '2.5rem', height: '2.5rem', borderWidth: '3px' }}></div>
        <p className="font-mono text-muted mt-3 small">// RETRIEVING STUDENT PROFILE RECORD...</p>
      </div>
    );
  }

  return (
    <div className="student-profile pb-5">
      {/* Header Banner */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 border-bottom border-lab-black pb-3">
        <div>
          <div className="font-mono text-muted" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
            // INSTITUTIONAL CAREER INTELLIGENCE &bull; SECTION 02
          </div>
          <h2 className="font-editorial text-dark mb-0 fw-bold" style={{ letterSpacing: '-0.03em' }}>
            Student Dossier &amp; Credentials
          </h2>
          <p className="text-secondary small mb-0 font-sans">
            Verified academic telemetry, institutional USN identity, and official career links.
          </p>
        </div>
        <NavLink to="/student/resume" className="btn-lab-sm btn-lab-sm-lime text-decoration-none">
          <i className="fas fa-file-invoice"></i>
          <span>[RESUME &amp; NLP PARSER]</span>
        </NavLink>
      </div>

      <div className="row g-4">
        {/* Left Column: Dossier Card & Readiness Gauge */}
        <div className="col-lg-4">
          <div className="card-editorial p-4 mb-4 text-center">
            <div
              className="d-inline-flex align-items-center justify-content-center fw-bold font-mono mb-3"
              style={{
                width: '68px',
                height: '68px',
                fontSize: '1.75rem',
                backgroundColor: '#111827',
                color: '#C5F36B',
                border: '2px solid #111827'
              }}
            >
              {student?.full_name?.charAt(0) || 'S'}
            </div>
            <h4 className="font-editorial fw-bold text-dark mb-1">{student?.full_name}</h4>
            <div className="font-mono text-muted small mb-2">{student?.user?.email}</div>

            <div className="d-flex justify-content-center gap-2 mb-3">
              <span className="badge-editorial badge-editorial-navy">
                USN: {student?.usn || 'UNASSIGNED'}
              </span>
              <span className="badge-editorial badge-editorial-lime">
                SEM {student?.semester || 6}
              </span>
            </div>

            <div className="border-t-lab pt-3 mt-3">
              <div className="font-mono text-muted small mb-2" style={{ fontSize: '0.68rem', letterSpacing: '0.05em' }}>
                // PLACEMENT READINESS SCORE
              </div>
              {readiness && (
                <div className="d-flex flex-column align-items-center">
                  <ReadinessGauge score={readiness.score} category={readiness.category} size={150} />
                  <div className="font-mono text-dark fw-bold mt-2" style={{ fontSize: '0.85rem' }}>
                    INDEX: {readiness.score}/100 &bull; {readiness.category?.toUpperCase()}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Resume Quick Access Card */}
          <div className="card-editorial p-4">
            <div className="font-mono text-muted small mb-2" style={{ fontSize: '0.68rem', letterSpacing: '0.06em' }}>
              // RESUME DOCUMENT REPOSITORY
            </div>
            {student?.resume_path ? (
              <div className="p-3 bg-lab-ivory-light border border-lab-black">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="fas fa-file-pdf text-danger fa-lg"></i>
                  <span className="font-mono fw-bold text-dark small text-truncate">
                    {student.resume_path.split(/[/\\\\]/).pop() || 'STUDENT_RESUME.PDF'}
                  </span>
                </div>
                <div className="font-mono text-muted small mb-3" style={{ fontSize: '0.65rem' }}>
                  PARSER STATUS: AST PARSED &bull; EXTRACTED
                </div>
                <div className="d-flex flex-column gap-2">
                  <a
                    href={student.resume_path.startsWith('http') ? student.resume_path : `/${student.resume_path}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-lab-sm btn-lab-sm-outline text-center text-decoration-none"
                  >
                    <i className="fas fa-arrow-up-right-from-square"></i>
                    <span>[VIEW DOCUMENT]</span>
                  </a>
                  <NavLink to="/student/resume" className="btn-lab-sm btn-lab-sm-lime text-center text-decoration-none">
                    <i className="fas fa-arrows-rotate"></i>
                    <span>[RE-RUN NLP PARSER]</span>
                  </NavLink>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-lab-ivory-light border border-lab-black text-center">
                <i className="fas fa-cloud-arrow-up text-muted fa-2x mb-2"></i>
                <div className="font-mono text-dark fw-bold small mb-1">// ZERO RESUME ON FILE</div>
                <p className="text-secondary small mb-3">Upload your PDF or DOCX resume for automated NLP skill extraction.</p>
                <NavLink to="/student/resume" className="btn-lab-sm btn-lab-sm-navy text-decoration-none">
                  [UPLOAD RESUME]
                </NavLink>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="col-lg-8">
          <div className="card-editorial p-4 p-md-5">
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

            <form onSubmit={handleSubmit}>
              <div className="d-flex align-items-center justify-content-between border-b-lab pb-2 mb-4">
                <span className="font-mono fw-bold text-dark" style={{ fontSize: '0.8rem', letterSpacing: '0.05em' }}>
                  01 // ACADEMIC RECORD &amp; DOSSIER
                </span>
                <span className="font-mono text-muted" style={{ fontSize: '0.68rem' }}>
                  INSTITUTIONAL METRICS
                </span>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label-editorial">Full Name (Official Record)</label>
                  <input
                    type="text"
                    className="form-control-editorial"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label-editorial">Primary Telephone Number</label>
                  <input
                    type="tel"
                    className="form-control-editorial"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label-editorial">Academic Department / Branch</label>
                  <input
                    type="text"
                    className="form-control-editorial"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label-editorial">Semester</label>
                  <input
                    type="number"
                    className="form-control-editorial"
                    name="semester"
                    min="1"
                    max="8"
                    value={formData.semester}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label-editorial">CGPA (out of 10)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    className="form-control-editorial"
                    name="cgpa"
                    value={formData.cgpa}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label-editorial">Active Backlogs</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control-editorial"
                    name="activeBacklogs"
                    value={formData.activeBacklogs}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-between border-b-lab pb-2 mb-4 mt-5">
                <span className="font-mono fw-bold text-dark" style={{ fontSize: '0.8rem', letterSpacing: '0.05em' }}>
                  02 // EXTERNAL REPOSITORIES &amp; CAREER BIOGRAPHY
                </span>
                <span className="font-mono text-muted" style={{ fontSize: '0.68rem' }}>
                  VERIFIED CHANNELS
                </span>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label-editorial">LinkedIn Profile URI</label>
                  <input
                    type="url"
                    className="form-control-editorial font-mono"
                    placeholder="https://linkedin.com/in/username"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label-editorial">GitHub Profile URI</label>
                  <input
                    type="url"
                    className="form-control-editorial font-mono"
                    placeholder="https://github.com/username"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label-editorial">Professional Bio &amp; Career Objective</label>
                  <textarea
                    className="form-control-editorial"
                    rows="3"
                    name="bio"
                    placeholder="Brief summary of engineering specializations, systems built, and placement goals..."
                    value={formData.bio}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              <div className="d-flex justify-content-end pt-3 border-t-lab">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-lab-sm btn-lab-sm-navy"
                  style={{ fontSize: '0.85rem', padding: '0.75rem 1.75rem' }}
                >
                  {saving ? (
                    <span className="d-flex align-items-center gap-2">
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      <span>[SAVING RECORD...]</span>
                    </span>
                  ) : (
                    <span>[COMMIT DOSSIER UPDATES]</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
