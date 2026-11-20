import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import studentService from '../../services/studentService';

const AssessmentsList = () => {
  const [assessments, setAssessments] = useState([]);
  const [resultsMap, setResultsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const res = await studentService.getAssessments();
      if (res.success && res.data) {
        setAssessments(res.data.assessments || []);
        setResultsMap(res.data.resultsMap || {});
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to load assessments.');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(assessments.map(a => a.category || 'General'))];

  const filteredAssessments = selectedCategory === 'All'
    ? assessments
    : assessments.filter(a => (a.category || 'General') === selectedCategory);

  if (loading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-dark" role="status" style={{ width: '2.5rem', height: '2.5rem', borderWidth: '3px' }}></div>
        <p className="font-mono text-muted mt-3 small">// RETRIEVING ASSESSMENT CATALOG...</p>
      </div>
    );
  }

  return (
    <div className="assessments-list pb-5">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 border-bottom border-lab-black pb-3">
        <div>
          <div className="font-mono text-muted" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
            // INSTITUTIONAL CAREER INTELLIGENCE &bull; SECTION 06
          </div>
          <h2 className="font-editorial text-dark mb-0 fw-bold" style={{ letterSpacing: '-0.03em' }}>
            Proctored Skill Assessments
          </h2>
          <p className="text-secondary small mb-0 font-sans">
            Timed technical, aptitude, and verbal evaluations calibrating your verified placement readiness index.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 mb-4 bg-danger bg-opacity-10 border border-danger d-flex align-items-center gap-2 font-mono small text-danger">
          <i className="fas fa-circle-exclamation"></i>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="card-editorial p-3 mb-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
          <div className="d-flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="btn-lab-sm"
                style={{
                  fontSize: '0.7rem',
                  backgroundColor: selectedCategory === cat ? '#111827' : '#FFFFFF',
                  color: selectedCategory === cat ? '#FFFFFF' : '#111827'
                }}
              >
                [{cat.toUpperCase()}]
              </button>
            ))}
          </div>
          <span className="font-mono text-muted small" style={{ fontSize: '0.68rem' }}>
            TOTAL ASSESSMENTS: {filteredAssessments.length}
          </span>
        </div>
      </div>

      {/* Grid of Assessments */}
      <div className="row g-4">
        {filteredAssessments.map((a) => {
          const priorResult = resultsMap[a.id];
          const hasTaken = !!priorResult;

          return (
            <div className="col-md-6 col-xl-4" key={a.id}>
              <div className="card-editorial p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="badge-editorial badge-editorial-ivory" style={{ fontSize: '0.65rem' }}>
                      {a.category}
                    </span>
                    {hasTaken && (
                      <span className={`badge-editorial ${priorResult.passed ? 'badge-editorial-lime' : 'badge-editorial-coral'}`}>
                        {priorResult.passed ? 'PASSED' : 'RETRY NEEDED'} [{priorResult.percentage}%]
                      </span>
                    )}
                  </div>

                  <h4 className="font-editorial fw-bold text-dark mb-2">{a.title}</h4>
                  <p className="text-secondary small mb-3">
                    {a.description || 'Comprehensive evaluation of core domain concepts and problem solving.'}
                  </p>
                </div>

                <div>
                  <div className="p-3 mb-3 border border-lab-black bg-lab-ivory-light font-mono small text-dark">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">DURATION:</span>
                      <strong>{a.duration_minutes} MINS</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">QUESTIONS:</span>
                      <strong>{a.questions ? a.questions.length : 0} ITEMS</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">PASS CUTOFF:</span>
                      <strong className="text-dark">{a.passing_score}%</strong>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <NavLink
                      to={`/student/assessments/${a.id}/take`}
                      className="btn-lab-sm btn-lab-sm-lime flex-grow-1 text-center text-decoration-none"
                    >
                      <i className="fas fa-play me-1"></i>
                      <span>{hasTaken ? '[RETAKE TEST]' : '[START TEST]'}</span>
                    </NavLink>
                    {hasTaken && (
                      <NavLink
                        to={`/student/assessments/result/${priorResult.id}`}
                        className="btn-lab-sm btn-lab-sm-outline text-decoration-none"
                        title="View Scorecard"
                      >
                        <i className="fas fa-poll-h"></i>
                      </NavLink>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssessmentsList;
