import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    usn: '',
    phone: '',
    department: 'Computer Science',
    semester: 6,
    cgpa: 8.2,
    activeBacklogs: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await authService.register({
        email: formData.email,
        password: formData.password,
        role: 'student',
        fullName: formData.fullName,
        usn: formData.usn,
        phone: formData.phone,
        department: formData.department,
        semester: Number(formData.semester),
        cgpa: parseFloat(formData.cgpa),
        activeBacklogs: Number(formData.activeBacklogs)
      });

      if (res.success) {
        // Automatically log in with the new credentials
        await login(formData.email, formData.password);
        navigate('/student/dashboard');
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err?.message || 'Failed to create student account. Email or USN may already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5" style={{ minHeight: 'calc(100vh - 150px)', backgroundColor: 'var(--lab-ivory, #F4F0E8)' }}>
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">
            {/* Header */}
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center gap-2 mb-2">
                <div
                  className="bg-dark text-white fw-bold font-mono d-inline-flex align-items-center justify-content-center border border-dark"
                  style={{ width: '42px', height: '42px', fontSize: '16px' }}
                >
                  <span style={{ color: 'var(--lab-lime, #C5F36B)' }}>ST</span>
                </div>
                <span className="badge-editorial-lime">[COHORT ONBOARDING]</span>
              </div>
              <h2 className="font-editorial fw-bold text-dark mb-1" style={{ letterSpacing: '-0.02em' }}>
                Create Student Placement Dossier
              </h2>
              <p className="text-secondary font-mono small">
                Enroll in SkillTrack to benchmark competency vectors and unlock verified placement drives
              </p>
            </div>

            <div className="card-editorial p-4 p-md-5 bg-white">
              {error && (
                <div className="alert bg-white border border-dark rounded-0 font-mono small py-2 mb-4 d-flex align-items-center gap-2" role="alert">
                  <span className="badge-editorial-coral">[ALERT]</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="d-flex align-items-center justify-content-between border-bottom border-dark pb-2 mb-3">
                  <span className="font-mono small fw-bold text-dark text-uppercase">
                    01 // PERSONAL IDENTITY & AUTHENTICATION
                  </span>
                  <span className="badge-editorial-neutral">REQUIRED</span>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label-editorial">Full Legal Name</label>
                    <input
                      type="text"
                      className="form-control-editorial"
                      placeholder="e.g. Ananya Patel"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-editorial">College Email Address</label>
                    <input
                      type="email"
                      className="form-control-editorial"
                      placeholder="ananya.p@college.edu"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-editorial">Security Credential (Password)</label>
                    <input
                      type="password"
                      className="form-control-editorial"
                      placeholder="••••••••"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-editorial">Confirm Security Credential</label>
                    <input
                      type="password"
                      className="form-control-editorial"
                      placeholder="••••••••"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between border-bottom border-dark pb-2 mb-3">
                  <span className="font-mono small fw-bold text-dark text-uppercase">
                    02 // ACADEMIC & PLACEMENT CRITERIA
                  </span>
                  <span className="badge-editorial-lime">AUDIT READY</span>
                </div>

                <div className="row g-3 mb-4 font-mono">
                  <div className="col-md-6">
                    <label className="form-label-editorial">University Seat Number (USN / Roll)</label>
                    <input
                      type="text"
                      className="form-control-editorial"
                      placeholder="e.g. 1RV21CS042"
                      name="usn"
                      value={formData.usn}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-editorial">Phone Contact</label>
                    <input
                      type="tel"
                      className="form-control-editorial"
                      placeholder="+91 98765 43210"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label-editorial">Engineering Department</label>
                    <select
                      className="form-control-editorial"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Science">Information Science</option>
                      <option value="Artificial Intelligence">Artificial Intelligence & ML</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                    </select>
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
                  <div className="col-md-3">
                    <label className="form-label-editorial">Cumulative CGPA (/10)</label>
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
                  <div className="col-md-3">
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

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-lab-sm btn-lab-sm-primary w-100 py-2 text-center"
                >
                  {loading ? (
                    <span className="d-flex align-items-center justify-content-center gap-2">
                      <span className="spinner-border spinner-border-sm"></span>
                      <span>ENROLLING STUDENT DOSSIER...</span>
                    </span>
                  ) : (
                    'REGISTER & INITIALIZE PLACEMENT DOSSIER'
                  )}
                </button>
              </form>

              <hr className="my-4 border-dark" />

              <div className="text-center font-mono small text-secondary">
                Already registered in cohort?{' '}
                <NavLink to="/login" className="text-dark fw-bold text-decoration-underline ms-1">
                  Terminal Sign In →
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;