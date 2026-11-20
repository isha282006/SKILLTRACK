import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import studentService from '../../services/studentService';

const QuizResult = () => {
  const { resultId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchResult();
  }, [resultId]);

  const fetchResult = async () => {
    try {
      setLoading(true);
      const res = await studentService.getAssessmentResult(resultId);
      if (res.success && res.data) {
        setResult(res.data);
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to load assessment result.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-dark" role="status" style={{ width: '2.5rem', height: '2.5rem', borderWidth: '3px' }}></div>
        <p className="font-mono text-muted mt-3 small">// COMPILING SCORECARD TELEMETRY...</p>
      </div>
    );
  }

  if (errorMsg || !result) {
    return (
      <div className="card-editorial p-5 text-center my-4">
        <i className="fas fa-circle-exclamation fa-2x mb-3 text-danger"></i>
        <p className="font-mono text-dark fw-bold mb-3">{errorMsg || '// SCORECARD RECORD NOT FOUND'}</p>
        <NavLink to="/student/assessments" className="btn-lab-sm btn-lab-sm-navy text-decoration-none">
          [BACK TO ASSESSMENTS]
        </NavLink>
      </div>
    );
  }

  const { assessment, score, total_marks, percentage, passed, created_at } = result;

  return (
    <div className="quiz-result pb-5">
      {/* Result Hero Header */}
      <div className="card-editorial p-4 p-md-5 text-center mb-4">
        <div
          className="d-inline-flex align-items-center justify-content-center mx-auto mb-3 font-mono fw-bold"
          style={{
            width: '72px',
            height: '72px',
            backgroundColor: passed ? '#C5F36B' : '#F28B70',
            color: '#111827',
            border: '2px solid #111827',
            fontSize: '2rem'
          }}
        >
          {passed ? '✓' : '✗'}
        </div>

        <div className="font-mono text-muted small mb-1" style={{ fontSize: '0.7rem' }}>
          // EVALUATION SUMMARY &bull; {new Date(created_at).toLocaleDateString()}
        </div>
        <h2 className="font-editorial fw-bold text-dark mb-1">
          {passed ? 'Assessment Successfully Certified' : 'Assessment Completed (Re-evaluation Recommended)'}
        </h2>
        <p className="font-mono text-secondary small mb-3">
          TOPIC: {assessment?.title} &bull; CATEGORY: {assessment?.category}
        </p>

        <div className="d-flex justify-content-center align-items-baseline gap-2 mb-4 font-mono">
          <span className="font-editorial fw-bold text-dark display-4">{percentage}%</span>
          <span className="text-muted fs-5">({score} / {total_marks} POINTS)</span>
        </div>

        <div className="d-flex justify-content-center gap-3">
          <NavLink to="/student/assessments" className="btn-lab-sm btn-lab-sm-outline text-decoration-none">
            <i className="fas fa-arrow-left me-1"></i> [ALL ASSESSMENTS]
          </NavLink>
          <NavLink to="/student/readiness" className="btn-lab-sm btn-lab-sm-lime text-decoration-none">
            <span>[VIEW UPDATED READINESS]</span> <i className="fas fa-arrow-right ms-1"></i>
          </NavLink>
        </div>
      </div>

      {/* Question by Question Review */}
      {assessment?.questions && assessment.questions.length > 0 && (
        <div className="card-editorial p-4 p-md-5">
          <div className="border-b-lab pb-3 mb-4">
            <div className="font-mono text-muted small" style={{ fontSize: '0.68rem' }}>
              // AUDIT LOG
            </div>
            <h4 className="font-editorial fw-bold text-dark mb-0">Question Bank Review &amp; Explanations</h4>
          </div>

          <div className="d-flex flex-column gap-4">
            {assessment.questions.map((q, idx) => (
              <div key={q.id} className="p-3 border border-lab-black bg-lab-ivory-light">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="badge-editorial badge-editorial-navy">ITEM #{idx + 1}</span>
                  <span className="badge-editorial badge-editorial-lime">
                    CORRECT CHOICE: {q.correct_option}
                  </span>
                </div>

                <p className="font-sans fw-semibold text-dark mb-3">
                  {q.question_text}
                </p>

                <div className="row g-2 mb-2 font-mono small">
                  {['A', 'B', 'C', 'D'].map(opt => {
                    const optText = q[`option_${opt.toLowerCase()}`];
                    if (!optText) return null;
                    const isCorrect = q.correct_option === opt;

                    return (
                      <div className="col-md-6" key={opt}>
                        <div
                          className="p-2 border border-lab-black d-flex align-items-center gap-2"
                          style={{
                            backgroundColor: isCorrect ? '#C5F36B' : '#FFFFFF',
                            fontWeight: isCorrect ? 'bold' : 'normal'
                          }}
                        >
                          <span className="fw-bold">[{opt}]</span>
                          <span>{optText}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {q.explanation && (
                  <div className="p-2 border-t-lab mt-2 font-mono text-secondary small" style={{ fontSize: '0.72rem' }}>
                    <strong>EXPLANATION:</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizResult;
