import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import studentService from '../../services/studentService';
import ReadinessGauge from '../../components/ReadinessGauge';
import { ReadinessBarChart } from '../../components/Charts';

const ReadinessAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchReadiness();
  }, []);

  const fetchReadiness = async () => {
    try {
      setLoading(true);
      const res = await studentService.getReadiness();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to load readiness analytics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-dark" role="status" style={{ width: '2.5rem', height: '2.5rem', borderWidth: '3px' }}></div>
        <p className="font-mono text-muted mt-3 small">// CALCULATING MULTI-FACTOR PLACEMENT READINESS INDEX...</p>
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <div className="card-editorial p-5 text-center my-4">
        <i className="fas fa-circle-exclamation fa-2x mb-3 text-danger"></i>
        <p className="font-mono text-dark fw-bold mb-3">{errorMsg || '// UNABLE TO COMPUTE READINESS INDEX'}</p>
        <button className="btn-lab-sm btn-lab-sm-navy" onClick={fetchReadiness}>
          [RETRY CALCULATION]
        </button>
      </div>
    );
  }

  const { student, readiness } = data;
  const { score, category, breakdown, tips } = readiness;

  return (
    <div className="readiness-analytics pb-5">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 border-bottom border-lab-black pb-3">
        <div>
          <div className="font-mono text-muted" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
            // INSTITUTIONAL CAREER INTELLIGENCE &bull; SECTION 08
          </div>
          <h2 className="font-editorial text-dark mb-0 fw-bold" style={{ letterSpacing: '-0.03em' }}>
            Placement Readiness Index
          </h2>
          <p className="text-secondary small mb-0 font-sans">
            Deterministic 100-point formula benchmarking academic standing, technical competencies, proctored quizzes, and communication.
          </p>
        </div>
        <div className="d-flex gap-2">
          <NavLink to="/student/assessments" className="btn-lab-sm btn-lab-sm-outline text-decoration-none">
            <i className="fas fa-tasks me-1"></i>
            <span>[TAKE ASSESSMENTS]</span>
          </NavLink>
          <NavLink to="/student/skills" className="btn-lab-sm btn-lab-sm-lime text-decoration-none">
            <i className="fas fa-plus me-1"></i>
            <span>[ADD MORE SKILLS]</span>
          </NavLink>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Gauge Card */}
        <div className="col-lg-5">
          <div className="card-editorial p-4 p-md-5 h-100 text-center d-flex flex-column justify-content-between">
            <div>
              <div className="font-mono text-muted small mb-1" style={{ fontSize: '0.68rem' }}>
                // AGGREGATE BENCHMARK
              </div>
              <h4 className="font-editorial fw-bold text-dark mb-3">Overall Placement Readiness</h4>

              <div className="d-flex justify-content-center my-3">
                <ReadinessGauge score={score} category={category} size={200} strokeWidth={16} />
              </div>
            </div>

            <div className="border-t-lab pt-3 mt-3">
              <div className="font-mono text-muted small mb-2 text-start" style={{ fontSize: '0.65rem' }}>
                // INSTITUTIONAL TIER SCALES:
              </div>
              <div className="row g-1 text-center font-mono" style={{ fontSize: '10px' }}>
                <div className="col-3">
                  <div className="p-1 border border-lab-black" style={{ backgroundColor: '#F28B70', color: '#111827', fontWeight: 'bold' }}>
                    &lt; 40<br/>CRITICAL
                  </div>
                </div>
                <div className="col-3">
                  <div className="p-1 border border-lab-black" style={{ backgroundColor: '#FAF8F5', color: '#111827', fontWeight: 'bold' }}>
                    40–59<br/>AVERAGE
                  </div>
                </div>
                <div className="col-3">
                  <div className="p-1 border border-lab-black" style={{ backgroundColor: '#5265E8', color: '#FFFFFF', fontWeight: 'bold' }}>
                    60–79<br/>GOOD
                  </div>
                </div>
                <div className="col-3">
                  <div className="p-1 border border-lab-black" style={{ backgroundColor: '#C5F36B', color: '#111827', fontWeight: 'bold' }}>
                    80–100<br/>READY
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Breakdown & Interactive Recharts */}
        <div className="col-lg-7">
          <div className="card-editorial p-4 p-md-5 h-100">
            <div className="d-flex align-items-center justify-content-between border-b-lab pb-3 mb-4">
              <div>
                <span className="font-mono text-muted small" style={{ fontSize: '0.68rem' }}>
                  // EVALUATION FORMULA BREAKDOWN
                </span>
                <h4 className="font-editorial fw-bold text-dark mb-0">Component Contribution Pillars</h4>
              </div>
              <span className="badge-editorial badge-editorial-navy">
                TOTAL: {score}/100 PTS
              </span>
            </div>

            <div className="mb-4">
              <ReadinessBarChart breakdown={breakdown} height={200} />
            </div>

            <div className="d-flex flex-column gap-3">
              {/* Pillar 1: Technical Skills */}
              <div className="p-3 border border-lab-black bg-lab-ivory-light font-mono small">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <div>
                    <strong className="text-dark">01 // TECHNICAL SKILLS (WEIGHT: 35%)</strong>
                    <div className="text-muted" style={{ fontSize: '0.68rem' }}>Verified languages, frameworks &amp; databases</div>
                  </div>
                  <div className="fw-bold fs-6 text-dark">
                    {breakdown?.technical?.earned || 0} / 35
                  </div>
                </div>
                <div style={{ height: '8px', backgroundColor: '#FFFFFF', border: '1px solid #111827' }}>
                  <div style={{ height: '100%', width: `${((breakdown?.technical?.earned || 0) / 35) * 100}%`, backgroundColor: '#111827' }} />
                </div>
              </div>

              {/* Pillar 2: Aptitude */}
              <div className="p-3 border border-lab-black bg-lab-ivory-light font-mono small">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <div>
                    <strong className="text-dark">02 // APTITUDE &amp; LOGIC (WEIGHT: 25%)</strong>
                    <div className="text-muted" style={{ fontSize: '0.68rem' }}>Quantitative problem solving &amp; logic tests</div>
                  </div>
                  <div className="fw-bold fs-6 text-dark">
                    {breakdown?.aptitude?.earned || 0} / 25
                  </div>
                </div>
                <div style={{ height: '8px', backgroundColor: '#FFFFFF', border: '1px solid #111827' }}>
                  <div style={{ height: '100%', width: `${((breakdown?.aptitude?.earned || 0) / 25) * 100}%`, backgroundColor: '#5265E8' }} />
                </div>
              </div>

              {/* Pillar 3: Communication */}
              <div className="p-3 border border-lab-black bg-lab-ivory-light font-mono small">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <div>
                    <strong className="text-dark">03 // COMMUNICATION &amp; SOFT SKILLS (WEIGHT: 20%)</strong>
                    <div className="text-muted" style={{ fontSize: '0.68rem' }}>Verbal quizzes &amp; behavioral competencies</div>
                  </div>
                  <div className="fw-bold fs-6 text-dark">
                    {breakdown?.communication?.earned || 0} / 20
                  </div>
                </div>
                <div style={{ height: '8px', backgroundColor: '#FFFFFF', border: '1px solid #111827' }}>
                  <div style={{ height: '100%', width: `${((breakdown?.communication?.earned || 0) / 20) * 100}%`, backgroundColor: '#F28B70' }} />
                </div>
              </div>

              {/* Pillar 4: Academic */}
              <div className="p-3 border border-lab-black bg-lab-ivory-light font-mono small">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <div>
                    <strong className="text-dark">04 // ACADEMIC STANDING (WEIGHT: 20%)</strong>
                    <div className="text-muted" style={{ fontSize: '0.68rem' }}>CGPA {student?.cgpa}/10 with {student?.active_backlogs || 0} backlogs</div>
                  </div>
                  <div className="fw-bold fs-6 text-dark">
                    {breakdown?.academic?.earned || 0} / 20
                  </div>
                </div>
                <div style={{ height: '8px', backgroundColor: '#FFFFFF', border: '1px solid #111827' }}>
                  <div style={{ height: '100%', width: `${((breakdown?.academic?.earned || 0) / 20) * 100}%`, backgroundColor: '#C5F36B' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Next Steps / Tips */}
      {tips && tips.length > 0 && (
        <div className="card-editorial p-4 p-md-5">
          <div className="border-b-lab pb-3 mb-4">
            <span className="font-mono text-muted small" style={{ fontSize: '0.68rem' }}>
              // ACTIONABLE PRESCRIPTION
            </span>
            <h4 className="font-editorial fw-bold text-dark mb-0">Recommended Interventions to Boost Readiness</h4>
          </div>

          <div className="row g-3">
            {tips.map((tip, idx) => (
              <div className="col-md-6" key={idx}>
                <div className="p-3 border border-lab-black bg-white d-flex align-items-start gap-3 h-100">
                  <div
                    className="font-mono fw-bold d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: '#111827',
                      color: '#C5F36B',
                      border: '1px solid #111827',
                      fontSize: '0.8rem'
                    }}
                  >
                    0{idx + 1}
                  </div>
                  <div>
                    <span className="font-sans small text-dark fw-medium">{tip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadinessAnalytics;
