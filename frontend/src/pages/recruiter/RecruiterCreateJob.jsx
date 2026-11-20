import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import recruiterService from '../../services/recruiterService';
import studentService from '../../services/studentService';

const RecruiterCreateJob = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    job_type: 'Full-time',
    location: 'Bengaluru / Hyderabad',
    salary_package: '22.0 - 26.0 LPA',
    openings: 5,
    min_cgpa: 7.5,
    max_backlogs: 0,
    allowed_departments: 'Computer Science, Information Science',
    deadline: '',
    description: '',
    skill_ids: []
  });

  const [availableSkills, setAvailableSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchAvailableSkills();
  }, []);

  const fetchAvailableSkills = async () => {
    try {
      setLoadingSkills(true);
      const res = await studentService.getSkills();
      if (res && res.success && res.data) {
        setAvailableSkills(res.data.allSkills || res.data.availableSkills || []);
      }
    } catch (err) {
      setAvailableSkills([
        { id: 1, name: 'Python', category: 'Programming Languages' },
        { id: 2, name: 'JavaScript', category: 'Programming Languages' },
        { id: 3, name: 'React.js', category: 'Frameworks & Libraries' },
        { id: 4, name: 'Node.js', category: 'Frameworks & Libraries' },
        { id: 5, name: 'SQL', category: 'Databases' },
        { id: 6, name: 'Docker', category: 'Developer Tools & Cloud' },
        { id: 7, name: 'Problem Solving', category: 'Soft Skills' },
        { id: 8, name: 'Technical Communication', category: 'Soft Skills' }
      ]);
    } finally {
      setLoadingSkills(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleSkill = (skillId) => {
    setFormData(prev => {
      const exists = prev.skill_ids.includes(skillId);
      return {
        ...prev,
        skill_ids: exists
          ? prev.skill_ids.filter(id => id !== skillId)
          : [...prev.skill_ids, skillId]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.title.trim()) {
      setErrorMsg('Please enter a valid job title.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        min_cgpa: parseFloat(formData.min_cgpa),
        max_backlogs: parseInt(formData.max_backlogs, 10),
        openings: parseInt(formData.openings, 10),
        salary_range: formData.salary_package
      };

      const res = await recruiterService.createJob(payload);
      if (res && res.success) {
        setSuccessMsg(`Campus recruitment opening "${formData.title}" published successfully!`);
        setTimeout(() => {
          navigate('/recruiter/jobs');
        }, 1200);
      } else {
        setErrorMsg(res.message || 'Failed to create job opening.');
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Error creating job opening.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="recruiter-create-job pb-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 border-bottom border-lab-black pb-3">
        <div>
          <div className="font-mono text-muted" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
            // INSTITUTIONAL CAREER INTELLIGENCE &bull; JOB AUTHORING
          </div>
          <h2 className="font-editorial text-dark mb-0 fw-bold" style={{ letterSpacing: '-0.03em' }}>
            Publish New Placement Opening
          </h2>
          <p className="text-secondary small mb-0 font-sans">
            Set automated CGPA cutoffs, backlogs allowances, salary packages, and required technical competencies.
          </p>
        </div>

        <NavLink to="/recruiter/jobs" className="btn-lab-sm btn-lab-sm-outline text-decoration-none">
          <i className="fas fa-arrow-left me-1"></i>
          <span>[BACK TO JOBS LIST]</span>
        </NavLink>
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

      {/* Main Form */}
      <form onSubmit={handleSubmit}>
        <div className="card-editorial p-4 p-md-5 mb-4">
          {/* Section 1: Role Overview */}
          <div className="d-flex align-items-center justify-content-between border-b-lab pb-2 mb-4">
            <span className="font-mono fw-bold text-dark" style={{ fontSize: '0.8rem' }}>
              01 // POSITION OVERVIEW
            </span>
            <span className="font-mono text-muted small" style={{ fontSize: '0.68rem' }}>ROLE SPECIFICATION</span>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-8">
              <label className="form-label-editorial">Job Title *</label>
              <input
                type="text"
                name="title"
                required
                className="form-control-editorial font-mono"
                placeholder="e.g. Software Engineer - Campus Drive 2026"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label-editorial">Commitment Type</label>
              <select
                name="job_type"
                className="form-control-editorial font-mono"
                value={formData.job_type}
                onChange={handleChange}
              >
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship (6 Months)</option>
                <option value="Contract">Contract / Trainee</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label-editorial">Location / Hub</label>
              <input
                type="text"
                name="location"
                className="form-control-editorial font-mono"
                placeholder="e.g. Bengaluru / Hyderabad / Remote"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label-editorial">Compensation Package (CTC)</label>
              <input
                type="text"
                name="salary_package"
                className="form-control-editorial font-mono"
                placeholder="e.g. ₹ 24.0 - 28.0 LPA"
                value={formData.salary_package}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label-editorial">Total Vacancies</label>
              <input
                type="number"
                name="openings"
                min="1"
                className="form-control-editorial font-mono"
                value={formData.openings}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Section 2: Eligibility Criteria */}
          <div className="d-flex align-items-center justify-content-between border-b-lab pb-2 mb-4 mt-5">
            <span className="font-mono fw-bold text-dark" style={{ fontSize: '0.8rem' }}>
              02 // ELIGIBILITY CUTOFFS &amp; ACADEMIC FILTERS
            </span>
            <span className="font-mono text-muted small" style={{ fontSize: '0.68rem' }}>AUTOMATED GATING</span>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <label className="form-label-editorial">Minimum CGPA Cutoff</label>
              <input
                type="number"
                name="min_cgpa"
                step="0.1"
                min="0"
                max="10"
                className="form-control-editorial font-mono"
                placeholder="e.g. 7.5"
                value={formData.min_cgpa}
                onChange={handleChange}
              />
              <span className="font-mono text-muted small" style={{ fontSize: '0.65rem' }}>Students below this cutoff cannot submit.</span>
            </div>

            <div className="col-md-4">
              <label className="form-label-editorial">Max Active Backlogs Allowed</label>
              <input
                type="number"
                name="max_backlogs"
                min="0"
                className="form-control-editorial font-mono"
                value={formData.max_backlogs}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label-editorial">Application Deadline</label>
              <input
                type="date"
                name="deadline"
                required
                className="form-control-editorial font-mono"
                value={formData.deadline}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <label className="form-label-editorial">Eligible Academic Departments</label>
              <input
                type="text"
                name="allowed_departments"
                className="form-control-editorial font-mono"
                value={formData.allowed_departments}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Section 3: Skill Prerequisites */}
          <div className="d-flex align-items-center justify-content-between border-b-lab pb-2 mb-4 mt-5">
            <span className="font-mono fw-bold text-dark" style={{ fontSize: '0.8rem' }}>
              03 // REQUIRED TECHNICAL COMPETENCIES
            </span>
            <span className="font-mono text-muted small" style={{ fontSize: '0.68rem' }}>SKILL GAP BENCHMARK</span>
          </div>

          <div className="mb-4">
            <div className="d-flex flex-wrap gap-2">
              {availableSkills.map((sk) => {
                const isChecked = formData.skill_ids.includes(sk.id);
                return (
                  <button
                    key={sk.id}
                    type="button"
                    onClick={() => toggleSkill(sk.id)}
                    className="btn-lab-sm"
                    style={{
                      fontSize: '0.72rem',
                      backgroundColor: isChecked ? '#111827' : '#FFFFFF',
                      color: isChecked ? '#C5F36B' : '#111827'
                    }}
                  >
                    {isChecked ? '✓ ' : '+ '}
                    {sk.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Job Description */}
          <div className="d-flex align-items-center justify-content-between border-b-lab pb-2 mb-4 mt-5">
            <span className="font-mono fw-bold text-dark" style={{ fontSize: '0.8rem' }}>
              04 // JOB DESCRIPTION &amp; RESPONSIBILITIES
            </span>
            <span className="font-mono text-muted small" style={{ fontSize: '0.68rem' }}>FULL SPECIFICATION</span>
          </div>

          <div className="mb-4">
            <textarea
              name="description"
              rows="4"
              required
              placeholder="Outline project responsibilities, technical stacks used, team structures, and selection stages..."
              className="form-control-editorial"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="d-flex justify-content-end gap-3 pt-3 border-t-lab">
            <NavLink to="/recruiter/jobs" className="btn-lab-sm btn-lab-sm-outline text-decoration-none">
              [CANCEL]
            </NavLink>
            <button
              type="submit"
              disabled={submitting}
              className="btn-lab-sm btn-lab-sm-lime"
              style={{ fontSize: '0.85rem', padding: '0.75rem 2rem' }}
            >
              {submitting ? '[PUBLISHING TO REPOSITORY...]' : '[PUBLISH CAMPUS OPENING]'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RecruiterCreateJob;
