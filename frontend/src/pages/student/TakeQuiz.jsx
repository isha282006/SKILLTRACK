import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import studentService from '../../services/studentService';

const TakeQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const timerRef = useRef(null);

  useEffect(() => {
    fetchQuiz();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [id]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const res = await studentService.getAssessmentById(id);
      if (res.success && res.data) {
        setAssessment(res.data);
        const qs = res.data.questions || [];
        setQuestions(qs);
        const totalSeconds = (res.data.duration_minutes || 15) * 60;
        setTimeLeft(totalSeconds);

        // Start Countdown
        timerRef.current = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              handleAutoSubmit();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to load assessment questions.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId, optionLetter) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionLetter
    }));
  };

  const handleSubmit = async (isAuto = false) => {
    if (!isAuto && !window.confirm('Confirm submission of your assessment? Answers cannot be revised post submission.')) {
      return;
    }

    if (timerRef.current) clearInterval(timerRef.current);
    setSubmitting(true);

    try {
      const res = await studentService.takeAssessment(id, answers);
      if (res.success && res.resultId) {
        navigate(`/student/assessments/result/${res.resultId}`);
      } else {
        setErrorMsg(res.message || 'Submission failed.');
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Error evaluating quiz submission.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAutoSubmit = () => {
    alert('Assessment duration elapsed. Submitting test telemetry automatically.');
    handleSubmit(true);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-dark" role="status" style={{ width: '2.5rem', height: '2.5rem', borderWidth: '3px' }}></div>
        <p className="font-mono text-muted mt-3 small">// INITIALIZING PROCTORED TESTING ENVIRONMENT...</p>
      </div>
    );
  }

  if (errorMsg || !assessment || questions.length === 0) {
    return (
      <div className="card-editorial p-5 text-center my-4">
        <i className="fas fa-circle-exclamation fa-2x mb-3 text-danger"></i>
        <p className="font-mono text-dark fw-bold mb-3">{errorMsg || '// ZERO ACTIVE QUESTIONS IN THIS ASSESSMENT SPECIFICATION'}</p>
        <button className="btn-lab-sm btn-lab-sm-navy" onClick={() => navigate('/student/assessments')}>
          [RETURN TO ASSESSMENTS]
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const selectedOption = answers[currentQ.id];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="take-quiz pb-5">
      {/* Top Bar with Timer */}
      <div className="card-editorial p-3 mb-4 sticky-top bg-white" style={{ top: '80px', zIndex: 1010 }}>
        <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
          <div>
            <div className="font-mono text-muted" style={{ fontSize: '0.68rem', letterSpacing: '0.06em' }}>
              // PROCTORED TESTING ACTIVE
            </div>
            <h4 className="font-editorial fw-bold text-dark mb-0">{assessment.title}</h4>
            <div className="font-mono text-muted small">
              QUESTION {currentIndex + 1} OF {questions.length} &bull; {answeredCount} ANSWERED
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center gap-2 px-3 py-2 font-mono fw-bold"
              style={{
                backgroundColor: timeLeft < 180 ? '#F28B70' : '#C5F36B',
                color: '#111827',
                border: '1px solid #111827',
                fontSize: '0.85rem'
              }}
            >
              <i className="far fa-clock"></i>
              <span>{formatTime(timeLeft)}</span>
            </div>

            <button
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              className="btn-lab-sm btn-lab-sm-navy"
            >
              {submitting ? '[EVALUATING...]' : '[SUBMIT TEST]'}
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Main Question Panel */}
        <div className="col-lg-8">
          <div className="card-editorial p-4 p-md-5">
            <div className="d-flex align-items-center justify-content-between pb-3 border-b-lab mb-4">
              <span className="badge-editorial badge-editorial-navy">
                QUESTION #{currentIndex + 1}
              </span>
              <span className="font-mono text-muted small">
                POINTS: <strong className="text-dark">{currentQ.marks || 1}</strong>
              </span>
            </div>

            <h4 className="font-editorial fw-bold text-dark mb-4" style={{ lineHeight: '1.4', letterSpacing: '-0.02em' }}>
              {currentQ.question_text}
            </h4>

            {/* Options */}
            <div className="d-flex flex-column gap-3 mb-4">
              {[
                { key: 'A', text: currentQ.option_a },
                { key: 'B', text: currentQ.option_b },
                { key: 'C', text: currentQ.option_c },
                { key: 'D', text: currentQ.option_d }
              ].map(({ key, text }) => {
                if (!text) return null;
                const isSelected = selectedOption === key;

                return (
                  <div
                    key={key}
                    onClick={() => handleSelectOption(currentQ.id, key)}
                    className="d-flex align-items-center p-3 border-lab-black cursor-pointer transition-all"
                    style={{
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'rgba(197, 243, 107, 0.25)' : '#FAF8F5',
                      borderLeft: isSelected ? '5px solid #111827' : '1px solid #111827'
                    }}
                  >
                    <div
                      className="d-flex align-items-center justify-content-center fw-bold me-3 flex-shrink-0 font-mono"
                      style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: isSelected ? '#111827' : '#FFFFFF',
                        color: isSelected ? '#C5F36B' : '#111827',
                        border: '1px solid #111827'
                      }}
                    >
                      {key}
                    </div>
                    <span className="font-sans text-dark fw-medium">{text}</span>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="d-flex align-items-center justify-content-between pt-3 border-t-lab">
              <button
                type="button"
                className="btn-lab-sm btn-lab-sm-outline"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(prev => prev - 1)}
              >
                <i className="fas fa-chevron-left me-1"></i> [PREVIOUS]
              </button>

              <button
                type="button"
                className="btn-lab-sm btn-lab-sm-lime"
                disabled={currentIndex === questions.length - 1}
                onClick={() => setCurrentIndex(prev => prev + 1)}
              >
                [NEXT] <i className="fas fa-chevron-right ms-1"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Question Palette Sidebar */}
        <div className="col-lg-4">
          <div className="card-editorial p-4">
            <div className="font-mono fw-bold text-dark border-b-lab pb-2 mb-3 small">
              // QUESTION INDEX PALETTE
            </div>
            <div className="d-flex flex-wrap gap-2 mb-4">
              {questions.map((q, idx) => {
                const isAnswered = !!answers[q.id];
                const isCurrent = idx === currentIndex;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className="font-mono fw-bold d-flex align-items-center justify-content-center"
                    style={{
                      width: '36px',
                      height: '36px',
                      border: '1px solid #111827',
                      backgroundColor: isCurrent ? '#111827' : isAnswered ? '#C5F36B' : '#FFFFFF',
                      color: isCurrent ? '#C5F36B' : '#111827',
                      cursor: 'pointer'
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="font-mono text-muted border-t-lab pt-3 d-flex flex-column gap-2" style={{ fontSize: '0.7rem' }}>
              <div className="d-flex align-items-center gap-2">
                <span style={{ width: '12px', height: '12px', backgroundColor: '#C5F36B', border: '1px solid #111827', display: 'inline-block' }}></span>
                <span>ANSWERED ({answeredCount})</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span style={{ width: '12px', height: '12px', backgroundColor: '#FFFFFF', border: '1px solid #111827', display: 'inline-block' }}></span>
                <span>UNANSWERED ({questions.length - answeredCount})</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span style={{ width: '12px', height: '12px', backgroundColor: '#111827', border: '1px solid #111827', display: 'inline-block' }}></span>
                <span>ACTIVE POSITION</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;
