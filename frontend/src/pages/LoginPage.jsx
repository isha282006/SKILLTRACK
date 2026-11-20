import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState('');
  const [error, setError] = useState('');

  const redirectByRole = (userRole) => {
    if (userRole === 'student') navigate('/student/dashboard');
    else if (userRole === 'admin') navigate('/admin/dashboard');
    else if (userRole === 'recruiter') navigate('/recruiter/dashboard');
    else navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        redirectByRole(res.user?.role);
      } else {
        setError(res.message || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      setError(err?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async (role) => {
    setError('');
    setDemoLoading(role);
    try {
      const res = await demoLogin(role);
      if (res.success) {
        redirectByRole(res.user?.role);
      } else {
        setError(res.message || `Demo login for ${role} failed.`);
      }
    } catch (err) {
      setError(err?.message || `Demo login failed.`);
    } finally {
      setDemoLoading('');
    }
  };

  return (
    <div className="py-5" style={{ minHeight: 'calc(100vh - 150px)', backgroundColor: 'var(--lab-ivory, #F4F0E8)' }}>
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-9 col-lg-6">
            {/* Header */}
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center gap-2 mb-2">
                <div
                  className="bg-dark text-white fw-bold font-mono d-inline-flex align-items-center justify-content-center border border-dark"
                  style={{ width: '42px', height: '42px', fontSize: '16px' }}
                >
                  <span style={{ color: 'var(--lab-lime, #C5F36B)' }}>ST</span>
                </div>
                <span className="badge-editorial-lime">[SYS AUTH 2.0]</span>
              </div>
              <h2 className="font-editorial fw-bold text-dark mb-1" style={{ letterSpacing: '-0.02em' }}>
                Career Intelligence Lab Access
              </h2>
              <p className="text-secondary font-mono small">
                Sign in to your student, campus admin, or corporate recruiter terminal
              </p>
            </div>

            {/* 1-Click Demo Login Banner */}
            <div className="card-editorial p-3 mb-4 bg-white">
              <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-dark">
                <span className="font-mono small fw-bold text-uppercase text-dark">
                  <i className="fas fa-bolt me-1 text-warning"></i> 1-CLICK DEMO ACCESS
                </span>
                <span className="badge-editorial-lime">INSTANT AUTH</span>
              </div>
              <div className="row g-2 font-mono">
                <div className="col-4">
                  <button
                    onClick={() => handleDemoClick('student')}
                    disabled={!!demoLoading}
                    className="btn-lab-sm btn-lab-sm-outline w-100 py-2 text-start d-flex flex-column align-items-start"
                  >
                    <span className="fw-bold d-flex align-items-center gap-1">
                      {demoLoading === 'student' ? <span className="spinner-border spinner-border-sm"></span> : <i className="fas fa-user-graduate"></i>}
                      STUDENT
                    </span>
                    <span className="text-secondary" style={{ fontSize: '10px' }}>Rohit Sharma</span>
                  </button>
                </div>
                <div className="col-4">
                  <button
                    onClick={() => handleDemoClick('admin')}
                    disabled={!!demoLoading}
                    className="btn-lab-sm btn-lab-sm-outline w-100 py-2 text-start d-flex flex-column align-items-start"
                  >
                    <span className="fw-bold d-flex align-items-center gap-1">
                      {demoLoading === 'admin' ? <span className="spinner-border spinner-border-sm"></span> : <i className="fas fa-shield-alt"></i>}
                      ADMIN
                    </span>
                    <span className="text-secondary" style={{ fontSize: '10px' }}>Campus Lead</span>
                  </button>
                </div>
                <div className="col-4">
                  <button
                    onClick={() => handleDemoClick('recruiter')}
                    disabled={!!demoLoading}
                    className="btn-lab-sm btn-lab-sm-outline w-100 py-2 text-start d-flex flex-column align-items-start"
                  >
                    <span className="fw-bold d-flex align-items-center gap-1">
                      {demoLoading === 'recruiter' ? <span className="spinner-border spinner-border-sm"></span> : <i className="fas fa-building"></i>}
                      RECRUITER
                    </span>
                    <span className="text-secondary" style={{ fontSize: '10px' }}>Google HR</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Standard Login Card */}
            <div className="card-editorial p-4 p-md-5 bg-white">
              {error && (
                <div className="alert bg-white border border-dark rounded-0 font-mono small py-2 mb-4 d-flex align-items-center gap-2" role="alert">
                  <span className="badge-editorial-coral">[ALERT]</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label-editorial">Institutional / Corporate Email</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border border-dark border-end-0 rounded-0 font-mono text-muted">
                      <i className="far fa-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control-editorial border-start-0"
                      placeholder="name@college.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label-editorial">Security Credential / Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border border-dark border-end-0 rounded-0 font-mono text-muted">
                      <i className="fas fa-lock"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control-editorial border-start-0"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                      <span>AUTHENTICATING TERMINAL...</span>
                    </span>
                  ) : (
                    'SIGN IN TO SKILLTRACK'
                  )}
                </button>
              </form>

              <hr className="my-4 border-dark" />

              <div className="text-center font-mono small text-secondary">
                New candidate cohort?{' '}
                <NavLink to="/register" className="text-dark fw-bold text-decoration-underline ms-1">
                  Register Student Dossier →
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;