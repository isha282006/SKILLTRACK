import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import studentService from '../../services/studentService';

const SkillsMatrix = () => {
  const [skills, setSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [newSkill, setNewSkill] = useState({
    skillId: '',
    skillName: '',
    category: 'Technical Skills',
    proficiencyLevel: 'Intermediate'
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await studentService.getSkills();
      if (res.success && res.data) {
        setSkills(res.data.skills || res.data.studentSkills || []);
        setAvailableSkills(res.data.availableSkills || res.data.allSkills || []);
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to load skills matrix.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await studentService.addSkill({
        skillId: newSkill.skillId ? Number(newSkill.skillId) : null,
        skillName: newSkill.skillName,
        category: newSkill.category,
        proficiencyLevel: newSkill.proficiencyLevel
      });

      if (res.success) {
        setSuccessMsg('Skill appended to matrix successfully! Placement Readiness updated.');
        setShowAddModal(false);
        setNewSkill({ skillId: '', skillName: '', category: 'Technical Skills', proficiencyLevel: 'Intermediate' });
        fetchSkills();
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to register skill.');
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Confirm removal of this competency from your active placement record?')) return;
    try {
      const res = await studentService.deleteSkill(id);
      if (res.success) {
        setSuccessMsg('Competency deregistered from matrix.');
        setSkills(prev => prev.filter(s => s.id !== id));
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to delete competency.');
    }
  };

  const categories = ['All', ...new Set(skills.map(s => s.skill?.category || 'Technical Skills'))];

  const filteredSkills = selectedFilter === 'All'
    ? skills
    : skills.filter(s => (s.skill?.category || 'Technical Skills') === selectedFilter);

  const getMeterBars = (level) => {
    const bars = {
      'Beginner': 1,
      'Intermediate': 2,
      'Advanced': 3,
      'Expert': 4
    }[level] || 2;

    return (
      <div className="d-flex align-items-center gap-1">
        {[1, 2, 3, 4].map(idx => (
          <div
            key={idx}
            style={{
              width: '12px',
              height: '8px',
              backgroundColor: idx <= bars ? '#C5F36B' : 'rgba(17, 24, 39, 0.15)',
              border: '1px solid #111827'
            }}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-dark" role="status" style={{ width: '2.5rem', height: '2.5rem', borderWidth: '3px' }}></div>
        <p className="font-mono text-muted mt-3 small">// RETRIEVING SKILLS MATRIX REPOSITORY...</p>
      </div>
    );
  }

  return (
    <div className="skills-matrix pb-5">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 border-bottom border-lab-black pb-3">
        <div>
          <div className="font-mono text-muted" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
            // INSTITUTIONAL CAREER INTELLIGENCE &bull; SECTION 05
          </div>
          <h2 className="font-editorial text-dark mb-0 fw-bold" style={{ letterSpacing: '-0.03em' }}>
            Verified Skills Matrix &amp; Competencies
          </h2>
          <p className="text-secondary small mb-0 font-sans">
            Categorized technical and professional proficiencies fueling your automated placement eligibility.
          </p>
        </div>
        <div className="d-flex gap-2">
          <NavLink to="/student/resume" className="btn-lab-sm btn-lab-sm-outline text-decoration-none">
            <i className="fas fa-file-invoice"></i>
            <span>[IMPORT VIA RESUME]</span>
          </NavLink>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-lab-sm btn-lab-sm-lime"
          >
            <i className="fas fa-plus"></i>
            <span>[ADD COMPETENCY]</span>
          </button>
        </div>
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

      {/* Filter Ledger */}
      <div className="card-editorial p-3 mb-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
          <div className="d-flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className="btn-lab-sm"
                style={{
                  fontSize: '0.7rem',
                  backgroundColor: selectedFilter === cat ? '#111827' : '#FFFFFF',
                  color: selectedFilter === cat ? '#FFFFFF' : '#111827'
                }}
              >
                [{cat.toUpperCase()}] {cat === 'All' ? `(${skills.length})` : ''}
              </button>
            ))}
          </div>
          <span className="font-mono text-muted small" style={{ fontSize: '0.68rem' }}>
            SHOWING: {filteredSkills.length} OF {skills.length} VERIFIED
          </span>
        </div>
      </div>

      {/* Skills Matrix Display */}
      {filteredSkills.length === 0 ? (
        <div className="card-editorial p-5 text-center">
          <i className="fas fa-code-branch fa-3x text-muted opacity-50 mb-3"></i>
          <h4 className="font-editorial fw-bold text-dark mb-1">// ZERO COMPETENCIES IN THIS TAXONOMY</h4>
          <p className="font-mono text-muted small mb-4">
            NO SKILLS CURRENTLY INDEXED UNDER THIS FILTER. INTAKE VIA NLP RESUME PARSER OR ADD MANUALLY.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <button onClick={() => setShowAddModal(true)} className="btn-lab-sm btn-lab-sm-navy">
              [ADD SKILL MANUALLY]
            </button>
            <NavLink to="/student/resume" className="btn-lab-sm btn-lab-sm-lime text-decoration-none">
              [UPLOAD RESUME DOCUMENT]
            </NavLink>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {filteredSkills.map((s) => (
            <div className="col-sm-6 col-md-4 col-xl-3" key={s.id}>
              <div className="card-editorial p-3 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-start justify-content-between gap-1 mb-2">
                    <span className="badge-editorial badge-editorial-ivory" style={{ fontSize: '0.65rem' }}>
                      {s.skill?.category || 'Technical'}
                    </span>
                    <button
                      onClick={() => handleDeleteSkill(s.id)}
                      className="btn btn-link p-0 text-muted"
                      title="Deregister competency"
                      style={{ fontSize: '0.75rem' }}
                    >
                      <i className="fas fa-xmark hover-text-danger"></i>
                    </button>
                  </div>
                  <h5 className="font-editorial fw-bold text-dark mb-1">{s.skill?.name || 'Skill'}</h5>
                </div>

                <div className="border-t-lab pt-2 mt-3 d-flex align-items-center justify-content-between">
                  <div className="font-mono" style={{ fontSize: '0.68rem', color: '#111827', fontWeight: 600 }}>
                    {(s.proficiency_level || s.proficiency || 'Intermediate').toUpperCase()}
                  </div>
                  {getMeterBars(s.proficiency_level || s.proficiency)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Skill Modal */}
      {showAddModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'rgba(17, 24, 39, 0.7)', zIndex: 1060 }}
        >
          <div className="card-editorial p-4" style={{ width: '480px', backgroundColor: '#FFFFFF' }}>
            <div className="d-flex align-items-center justify-content-between border-b-lab pb-2 mb-3">
              <span className="font-mono fw-bold text-dark small">// REGISTER NEW COMPETENCY</span>
              <button
                className="btn btn-link p-0 text-dark font-mono text-decoration-none"
                onClick={() => setShowAddModal(false)}
              >
                [X]
              </button>
            </div>
            <form onSubmit={handleAddSkill}>
              <div className="mb-3">
                <label className="form-label-editorial">Select from Master Taxonomy</label>
                <select
                  className="form-control-editorial font-mono"
                  value={newSkill.skillId}
                  onChange={(e) => {
                    const sId = e.target.value;
                    const found = availableSkills.find(s => s.id === Number(sId));
                    setNewSkill(prev => ({
                      ...prev,
                      skillId: sId,
                      skillName: found ? found.name : prev.skillName,
                      category: found ? found.category : prev.category
                    }));
                  }}
                >
                  <option value="">-- Master Taxonomy Dropdown (Optional) --</option>
                  {availableSkills.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label-editorial">Skill Name (Custom or Master)</label>
                <input
                  type="text"
                  className="form-control-editorial font-mono"
                  placeholder="e.g. Docker, TypeScript, Microservices"
                  value={newSkill.skillName}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, skillName: e.target.value }))}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label-editorial">Category Taxonomy</label>
                <select
                  className="form-control-editorial font-mono"
                  value={newSkill.category}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="Programming Languages">Programming Languages</option>
                  <option value="Frameworks & Libraries">Frameworks & Libraries</option>
                  <option value="Databases">Databases</option>
                  <option value="Developer Tools & Cloud">Developer Tools & Cloud</option>
                  <option value="Technical Skills">General Technical</option>
                  <option value="Soft Skills">Soft Skills & Communication</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label-editorial">Proficiency Level</label>
                <select
                  className="form-control-editorial font-mono"
                  value={newSkill.proficiencyLevel}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, proficiencyLevel: e.target.value }))}
                >
                  <option value="Beginner">Beginner (Foundational Concepts)</option>
                  <option value="Intermediate">Intermediate (Project Implementation)</option>
                  <option value="Advanced">Advanced (Production Experience)</option>
                  <option value="Expert">Expert (Systems Architecture Mastery)</option>
                </select>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-2 border-t-lab">
                <button
                  type="button"
                  className="btn-lab-sm btn-lab-sm-outline"
                  onClick={() => setShowAddModal(false)}
                >
                  [CANCEL]
                </button>
                <button
                  type="submit"
                  className="btn-lab-sm btn-lab-sm-lime"
                >
                  [INDEX INTO MATRIX]
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsMatrix;
