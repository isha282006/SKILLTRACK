import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

const AdminAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Assessment Modal
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [assessmentForm, setAssessmentForm] = useState({
    title: '',
    category: 'Technical',
    description: '',
    time_limit_mins: 15,
    passing_score: 60,
    total_marks: 100
  });

  // Question Management
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_option: 'A',
    marks: 10,
    explanation: ''
  });

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAssessments();
      if (res.success && res.data) {
        setAssessments(res.data);
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to load assessments.');
    } finally {
      setLoading(false);
    }
  };

  // Assessment Handlers
  const handleOpenCreateAssessment = () => {
    setEditingAssessment(null);
    setAssessmentForm({
      title: '',
      category: 'Technical',
      description: '',
      time_limit_mins: 15,
      passing_score: 60,
      total_marks: 100
    });
    setShowAssessmentModal(true);
  };

  const handleOpenEditAssessment = (a) => {
    setEditingAssessment(a);
    setAssessmentForm({
      title: a.title,
      category: a.category,
      description: a.description || '',
      time_limit_mins: a.duration_minutes || a.time_limit_mins || 15,
      passing_score: a.passing_score || 60,
      total_marks: a.total_marks || 100
    });
    setShowAssessmentModal(true);
  };

  const handleSaveAssessment = async (e) => {
    e.preventDefault();
    try {
      if (editingAssessment) {
        await adminService.updateAssessment(editingAssessment.id, assessmentForm);
        setSuccessMsg('Assessment updated successfully!');
      } else {
        await adminService.createAssessment(assessmentForm);
        setSuccessMsg('Assessment created successfully!');
      }
      setShowAssessmentModal(false);
      fetchAssessments();
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to save assessment.');
    }
  };

  const handleDeleteAssessment = async (id, title) => {
    if (!window.confirm(`Delete assessment "${title}"? All questions and scores will be removed.`)) return;
    try {
      await adminService.deleteAssessment(id);
      setSuccessMsg(`Assessment "${title}" deleted.`);
      fetchAssessments();
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to delete assessment.');
    }
  };

  // Question Handlers
  const handleOpenQuestions = (assessment) => {
    setSelectedAssessment(assessment);
  };

  const handleOpenAddQuestion = () => {
    setQuestionForm({
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_option: 'A',
      marks: 10,
      explanation: ''
    });
    setShowQuestionModal(true);
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!selectedAssessment) return;
    try {
      await adminService.addQuestion(selectedAssessment.id, questionForm);
      setSuccessMsg('Question added successfully!');
      setShowQuestionModal(false);
      const res = await adminService.getAssessments();
      if (res.success && res.data) {
        setAssessments(res.data);
        const updated = res.data.find(a => a.id === selectedAssessment.id);
        setSelectedAssessment(updated || null);
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to add question.');
    }
  };

  const handleDeleteQuestion = async (assessmentId, questionId) => {
    if (!window.confirm('Remove this question from the assessment?')) return;
    try {
      await adminService.deleteQuestion(assessmentId, questionId);
      setSuccessMsg('Question deleted.');
      const res = await adminService.getAssessments();
      if (res.success && res.data) {
        setAssessments(res.data);
        const updated = res.data.find(a => a.id === assessmentId);
        setSelectedAssessment(updated || null);
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to delete question.');
    }
  };

  if (loading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-dark" role="status" style={{ width: '2.5rem', height: '2.5rem', borderWidth: '3px' }}></div>
        <p className="font-mono text-muted mt-3 small">// RETRIEVING PROCTORED ASSESSMENTS BATTERY...</p>
      </div>
    );
  }

  return (
    <div className="admin-assessments pb-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 border-bottom border-lab-black pb-3">
        <div>
          <div className="font-mono text-muted" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
            // INSTITUTIONAL CAREER INTELLIGENCE &bull; PROCTORED TESTING
          </div>
          <h2 className="font-editorial text-dark mb-0 fw-bold" style={{ letterSpacing: '-0.03em' }}>
            Online Assessments &amp; Question Banks
          </h2>
          <p className="text-secondary small mb-0 font-sans">
            Configure timed evaluations, domain tests, passing cutoffs, and question banks.
          </p>
        </div>
        <button onClick={handleOpenCreateAssessment} className="btn-lab-sm btn-lab-sm-lime">
          <i className="fas fa-plus me-1"></i>
          <span>[CREATE NEW ASSESSMENT]</span>
        </button>
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

      {/* Assessments Grid */}
      <div className="row g-4 mb-4">
        {assessments.map((a) => (
          <div className="col-md-6 col-xl-4" key={a.id}>
            <div
              className="card-editorial p-4 h-100 d-flex flex-column justify-content-between"
              style={{
                border: selectedAssessment?.id === a.id ? '2px solid #111827' : '1px solid #111827',
                boxShadow: selectedAssessment?.id === a.id ? '4px 4px 0px #111827' : 'none'
              }}
            >
              <div>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="badge-editorial badge-editorial-navy">
                    {a.category}
                  </span>
                  <span className="badge-editorial badge-editorial-lime">
                    {a.questions ? a.questions.length : 0} QUESTIONS
                  </span>
                </div>

                <h4 className="font-editorial fw-bold text-dark mb-2">{a.title}</h4>
                <p className="text-secondary small mb-3">
                  {a.description || 'Comprehensive online benchmark assessment.'}
                </p>
              </div>

              <div>
                <div className="p-2 mb-3 border border-lab-black bg-lab-ivory-light font-mono small" style={{ fontSize: '0.68rem' }}>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">DURATION:</span>
                    <strong className="text-dark">{a.duration_minutes || a.time_limit_mins} MINS</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">PASSING CUTOFF:</span>
                    <strong className="text-dark">{a.passing_score}%</strong>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button
                    onClick={() => handleOpenQuestions(a)}
                    className="btn-lab-sm btn-lab-sm-lime flex-grow-1"
                  >
                    <i className="fas fa-tasks me-1"></i>
                    <span>[BANK ({a.questions ? a.questions.length : 0})]</span>
                  </button>
                  <button
                    onClick={() => handleOpenEditAssessment(a)}
                    className="btn-lab-sm btn-lab-sm-outline"
                  >
                    [EDIT]
                  </button>
                  <button
                    onClick={() => handleDeleteAssessment(a.id, a.title)}
                    className="btn-lab-sm"
                    style={{ backgroundColor: '#FAF8F5', color: '#dc2626', borderColor: '#dc2626' }}
                  >
                    <i className="fas fa-trash-can"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Assessment Question Bank Panel */}
      {selectedAssessment && (
        <div className="card-editorial p-4 p-md-5 mb-4">
          <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mb-4 border-b-lab pb-3">
            <div>
              <span className="font-mono text-muted small" style={{ fontSize: '0.68rem' }}>
                // ACTIVE QUESTION REPOSITORY
              </span>
              <h4 className="font-editorial fw-bold text-dark mb-0">
                Question Bank: {selectedAssessment.title}
              </h4>
              <div className="font-mono text-muted small mt-1">
                {selectedAssessment.questions?.length || 0} QUESTIONS CONFIGURED &bull; CUTOFF: {selectedAssessment.passing_score}%
              </div>
            </div>
            <div className="d-flex gap-2">
              <button onClick={handleOpenAddQuestion} className="btn-lab-sm btn-lab-sm-lime">
                <i className="fas fa-plus me-1"></i>
                <span>[APPEND QUESTION]</span>
              </button>
              <button onClick={() => setSelectedAssessment(null)} className="btn-lab-sm btn-lab-sm-outline">
                [CLOSE PALETTE]
              </button>
            </div>
          </div>

          {selectedAssessment.questions && selectedAssessment.questions.length > 0 ? (
            <div className="d-flex flex-column gap-3">
              {selectedAssessment.questions.map((q, idx) => (
                <div key={q.id} className="p-3 border border-lab-black bg-lab-ivory-light">
                  <div className="d-flex align-items-start justify-content-between mb-2">
                    <span className="badge-editorial badge-editorial-navy">
                      ITEM #{idx + 1} [{q.marks} MARKS]
                    </span>
                    <button
                      onClick={() => handleDeleteQuestion(selectedAssessment.id, q.id)}
                      className="btn btn-link text-danger p-0 font-mono small text-decoration-none"
                    >
                      [REMOVE ITEM]
                    </button>
                  </div>
                  <p className="font-sans fw-semibold text-dark mb-2">{q.question_text}</p>
                  <div className="row g-2 font-mono small">
                    <div className={`col-md-6 ${q.correct_option === 'A' ? 'fw-bold text-dark' : 'text-muted'}`}>
                      [A] {q.option_a} {q.correct_option === 'A' && '✓'}
                    </div>
                    <div className={`col-md-6 ${q.correct_option === 'B' ? 'fw-bold text-dark' : 'text-muted'}`}>
                      [B] {q.option_b} {q.correct_option === 'B' && '✓'}
                    </div>
                    <div className={`col-md-6 ${q.correct_option === 'C' ? 'fw-bold text-dark' : 'text-muted'}`}>
                      [C] {q.option_c} {q.correct_option === 'C' && '✓'}
                    </div>
                    <div className={`col-md-6 ${q.correct_option === 'D' ? 'fw-bold text-dark' : 'text-muted'}`}>
                      [D] {q.option_d} {q.correct_option === 'D' && '✓'}
                    </div>
                  </div>
                  {q.explanation && (
                    <div className="mt-2 font-mono text-muted small border-t-lab pt-2" style={{ fontSize: '0.68rem' }}>
                      RATIONALE: {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 font-mono text-muted">
              <p className="mb-3">// ZERO QUESTIONS CONFIGURED FOR THIS ASSESSMENT SPECIFICATION</p>
              <button onClick={handleOpenAddQuestion} className="btn-lab-sm btn-lab-sm-navy">
                [ADD FIRST QUESTION]
              </button>
            </div>
          )}
        </div>
      )}

      {/* Assessment Create / Edit Modal */}
      {showAssessmentModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'rgba(17, 24, 39, 0.7)', zIndex: 1060 }}
        >
          <div className="card-editorial p-4" style={{ width: '520px', backgroundColor: '#FFFFFF' }}>
            <div className="d-flex align-items-center justify-content-between border-b-lab pb-2 mb-3">
              <span className="font-mono fw-bold text-dark small">
                {editingAssessment ? '// REVISE ASSESSMENT SPEC' : '// CREATE NEW ASSESSMENT'}
              </span>
              <button
                className="btn btn-link p-0 text-dark font-mono text-decoration-none"
                onClick={() => setShowAssessmentModal(false)}
              >
                [X]
              </button>
            </div>
            <form onSubmit={handleSaveAssessment}>
              <div className="mb-3">
                <label className="form-label-editorial">Assessment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Core Java & OOP Concepts"
                  className="form-control-editorial font-mono"
                  value={assessmentForm.title}
                  onChange={(e) => setAssessmentForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label-editorial">Category</label>
                  <select
                    className="form-control-editorial font-mono"
                    value={assessmentForm.category}
                    onChange={(e) => setAssessmentForm(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="Technical">Technical</option>
                    <option value="Aptitude">Aptitude</option>
                    <option value="Communication">Communication</option>
                    <option value="Domain">Domain</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label-editorial">Duration (Mins)</label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    className="form-control-editorial font-mono"
                    value={assessmentForm.time_limit_mins}
                    onChange={(e) => setAssessmentForm(prev => ({ ...prev, time_limit_mins: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label-editorial">Passing Cut-off (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    className="form-control-editorial font-mono"
                    value={assessmentForm.passing_score}
                    onChange={(e) => setAssessmentForm(prev => ({ ...prev, passing_score: e.target.value }))}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label-editorial">Total Points</label>
                  <input
                    type="number"
                    className="form-control-editorial font-mono"
                    value={assessmentForm.total_marks}
                    onChange={(e) => setAssessmentForm(prev => ({ ...prev, total_marks: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label-editorial">Scope &amp; Description</label>
                <textarea
                  rows="2"
                  className="form-control-editorial"
                  value={assessmentForm.description}
                  onChange={(e) => setAssessmentForm(prev => ({ ...prev, description: e.target.value }))}
                ></textarea>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-2 border-t-lab">
                <button
                  type="button"
                  className="btn-lab-sm btn-lab-sm-outline"
                  onClick={() => setShowAssessmentModal(false)}
                >
                  [CANCEL]
                </button>
                <button
                  type="submit"
                  className="btn-lab-sm btn-lab-sm-lime"
                >
                  {editingAssessment ? '[SAVE UPDATES]' : '[CREATE ASSESSMENT]'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Question Create Modal */}
      {showQuestionModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'rgba(17, 24, 39, 0.7)', zIndex: 1060 }}
        >
          <div className="card-editorial p-4" style={{ width: '600px', backgroundColor: '#FFFFFF' }}>
            <div className="d-flex align-items-center justify-content-between border-b-lab pb-2 mb-3">
              <span className="font-mono fw-bold text-dark small">
                // APPEND QUESTION &bull; {selectedAssessment?.title}
              </span>
              <button
                className="btn btn-link p-0 text-dark font-mono text-decoration-none"
                onClick={() => setShowQuestionModal(false)}
              >
                [X]
              </button>
            </div>
            <form onSubmit={handleSaveQuestion}>
              <div className="mb-3">
                <label className="form-label-editorial">Question Statement</label>
                <textarea
                  rows="2"
                  required
                  placeholder="Enter the question problem statement..."
                  className="form-control-editorial"
                  value={questionForm.question_text}
                  onChange={(e) => setQuestionForm(prev => ({ ...prev, question_text: e.target.value }))}
                ></textarea>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-md-6">
                  <label className="form-label-editorial">Option A</label>
                  <input
                    type="text"
                    required
                    className="form-control-editorial font-mono"
                    value={questionForm.option_a}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, option_a: e.target.value }))}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label-editorial">Option B</label>
                  <input
                    type="text"
                    required
                    className="form-control-editorial font-mono"
                    value={questionForm.option_b}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, option_b: e.target.value }))}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label-editorial">Option C</label>
                  <input
                    type="text"
                    required
                    className="form-control-editorial font-mono"
                    value={questionForm.option_c}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, option_c: e.target.value }))}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label-editorial">Option D</label>
                  <input
                    type="text"
                    required
                    className="form-control-editorial font-mono"
                    value={questionForm.option_d}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, option_d: e.target.value }))}
                  />
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-md-6">
                  <label className="form-label-editorial">Correct Option</label>
                  <select
                    className="form-control-editorial font-mono"
                    value={questionForm.correct_option}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, correct_option: e.target.value }))}
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label-editorial">Marks / Points</label>
                  <input
                    type="number"
                    required
                    className="form-control-editorial font-mono"
                    value={questionForm.marks}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, marks: e.target.value }))}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label-editorial">Technical Explanation</label>
                <textarea
                  rows="2"
                  placeholder="Review feedback shown post assessment..."
                  className="form-control-editorial font-mono"
                  value={questionForm.explanation}
                  onChange={(e) => setQuestionForm(prev => ({ ...prev, explanation: e.target.value }))}
                ></textarea>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-2 border-t-lab">
                <button
                  type="button"
                  className="btn-lab-sm btn-lab-sm-outline"
                  onClick={() => setShowQuestionModal(false)}
                >
                  [CANCEL]
                </button>
                <button
                  type="submit"
                  className="btn-lab-sm btn-lab-sm-lime"
                >
                  [INDEX QUESTION]
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAssessments;
