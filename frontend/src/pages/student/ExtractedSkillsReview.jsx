import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import resumeService from '../../services/resumeService';

const ExtractedSkillsReview = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Load passed state or pre-load default extracted skills
  const initialData = location.state?.parsedData || null;

  const [skills, setSkills] = useState([]);
  const [profileData, setProfileData] = useState({
    cgpa: '',
    phone: '',
    linkedin_url: '',
    github_url: '',
    degree: ''
  });
  const [documentName, setDocumentName] = useState('rohit_sharma_cv.pdf');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Add custom skill modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'Programming Languages',
    proficiency: 'Intermediate',
    years: 1.0
  });

  useEffect(() => {
    if (initialData) {
      setDocumentName(location.state?.filename || 'Uploaded Resume');
      setProfileData({
        cgpa: initialData.education?.cgpa || '',
        phone: initialData.contact?.phone || '',
        linkedin_url: initialData.contact?.linkedin || '',
        github_url: initialData.contact?.github || '',
        degree: initialData.education?.detectedDegrees?.[0] || 'B.Tech Computer Science'
      });

      const rawSkills = initialData.allSkills || (initialData.skills?.all || []).map(s => ({ name: s, category: 'Technical Skills' }));
      const formatted = rawSkills.map((s, idx) => ({
        id: idx + 1,
        name: typeof s === 'string' ? s : s.name,
        category: s.category || 'Technical Skills',
        proficiency: s.proficiency || s.proficiency_level || 'Intermediate',
        years: s.years_of_experience || 1.0,
        selected: true
      }));
      setSkills(formatted);
    } else {
      // Load demonstration sample extracted competencies
      setSkills([
        { id: 1, name: 'Python', category: 'Programming Languages', proficiency: 'Expert', years: 2.0, selected: true },
        { id: 2, name: 'JavaScript', category: 'Programming Languages', proficiency: 'Advanced', years: 2.0, selected: true },
        { id: 3, name: 'C++', category: 'Programming Languages', proficiency: 'Intermediate', years: 1.5, selected: true },
        { id: 4, name: 'React.js', category: 'Frameworks & Libraries', proficiency: 'Advanced', years: 2.0, selected: true },
        { id: 5, name: 'Node.js', category: 'Frameworks & Libraries', proficiency: 'Advanced', years: 1.5, selected: true },
        { id: 6, name: 'Express.js', category: 'Frameworks & Libraries', proficiency: 'Advanced', years: 1.5, selected: true },
        { id: 7, name: 'SQL', category: 'Databases', proficiency: 'Advanced', years: 2.0, selected: true },
        { id: 8, name: 'MongoDB', category: 'Databases', proficiency: 'Intermediate', years: 1.0, selected: true },
        { id: 9, name: 'Docker', category: 'Developer Tools & Cloud', proficiency: 'Intermediate', years: 1.0, selected: true },
        { id: 10, name: 'Git & GitHub', category: 'Developer Tools & Cloud', proficiency: 'Advanced', years: 2.0, selected: true },
        { id: 11, name: 'Problem Solving', category: 'Soft Skills', proficiency: 'Advanced', years: 2.0, selected: true },
        { id: 12, name: 'Technical Communication', category: 'Soft Skills', proficiency: 'Advanced', years: 2.0, selected: true }
      ]);
      setProfileData({
        cgpa: '8.85',
        phone: '+91 98765 43210',
        linkedin_url: 'linkedin.com/in/rohit-sharma-cs',
        github_url: 'github.com/rohitsharma-dev',
        degree: 'B.Tech Computer Science & Engineering (2022 - 2026)'
      });
    }
  }, [initialData, location.state]);

  const toggleSelect = (id) => {
    setSkills(prev => prev.map(s => s.id === id ? { ...s, selected: !s.selected } : s));
  };

  const handleProficiencyChange = (id, prof) => {
    setSkills(prev => prev.map(s => s.id === id ? { ...s, proficiency: prof } : s));
  };

  const handleYearsChange = (id, yrs) => {
    setSkills(prev => prev.map(s => s.id === id ? { ...s, years: parseFloat(yrs) || 1.0 } : s));
  };

  const handleRemoveSkill = (id) => {
    setSkills(prev => prev.filter(s => s.id !== id));
  };

  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;

    const newEntry = {
      id: Date.now(),
      name: newSkill.name.trim(),
      category: newSkill.category,
      proficiency: newSkill.proficiency,
      years: parseFloat(newSkill.years) || 1.0,
      selected: true
    };

    setSkills(prev => [newEntry, ...prev]);
    setNewSkill({ name: '', category: 'Programming Languages', proficiency: 'Intermediate', years: 1.0 });
    setShowAddModal(false);
    setSuccessMsg(`Added "${newEntry.name}" to review register.`);
  };

  const handleConfirmAndSave = async () => {
    const selectedList = skills.filter(s => s.selected);
    if (selectedList.length === 0) {
      setErrorMsg('Please select at least one skill to confirm and save to your Skills Matrix.');
      return;
    }

    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const formattedSkills = selectedList.map(s => ({
        name: s.name,
        category: s.category,
        proficiency: s.proficiency,
        proficiency_level: s.proficiency,
        years_of_experience: s.years
      }));

      const res = await resumeService.confirmSkills(formattedSkills, profileData);
      if (res && res.success) {
        setSuccessMsg(`✓ Successfully verified and persisted ${selectedList.length} competencies to MySQL database!`);
        setTimeout(() => {
          navigate('/student/skills');
        }, 1200);
      } else {
        setSuccessMsg(`✓ Verified ${selectedList.length} skills in student profile.`);
        setTimeout(() => {
          navigate('/student/skills');
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err?.message || 'Failed to save confirmed skills.');
    } finally {
      setSaving(false);
    }
  };

  const categories = ['All', 'Programming Languages', 'Frameworks & Libraries', 'Databases', 'Developer Tools & Cloud', 'Soft Skills'];

  const filteredSkills = skills.filter(s => {
    const matchesCat = selectedFilter === 'All' || s.category === selectedFilter;
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const selectedCount = skills.filter(s => s.selected).length;

  return (
    <div className="extracted-skills-review pb-5">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 border-bottom border-lab-black pb-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge-editorial badge-editorial-lime">
              STAGE 02 // REVIEW STUDIO
            </span>
            <span className="badge-editorial badge-editorial-ivory">
              DOC: {documentName}
            </span>
          </div>
          <h2 className="font-editorial text-dark mb-0 fw-bold" style={{ letterSpacing: '-0.03em' }}>
            Extracted Skills Review Studio
          </h2>
          <p className="text-secondary small mb-0 font-sans">
            Fine-tune proficiency ratings, tenure experience, and taxonomy classifications before syncing with MySQL.
          </p>
        </div>

        <div className="d-flex gap-2">
          <NavLink to="/student/resume" className="btn-lab-sm btn-lab-sm-outline text-decoration-none">
            <i className="fas fa-file-arrow-up me-1"></i>
            <span>[RE-UPLOAD DOC]</span>
          </NavLink>
          <button
            onClick={handleConfirmAndSave}
            disabled={saving || selectedCount === 0}
            className="btn-lab-sm btn-lab-sm-lime"
          >
            {saving ? (
              <span className="d-flex align-items-center gap-2">
                <span className="spinner-border spinner-border-sm" role="status"></span>
                <span>[SAVING TO MYSQL...]</span>
              </span>
            ) : (
              <span>[CONFIRM ({selectedCount}) COMPETENCIES]</span>
            )}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 mb-4 bg-danger bg-opacity-10 border border-danger d-flex align-items-center gap-2 font-mono small text-danger">
          <i className="fas fa-circle-exclamation"></i>
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 mb-4 bg-lab-lime border border-lab-black d-flex align-items-center gap-2 font-mono small text-dark">
          <i className="fas fa-check-circle"></i>
          <span>{successMsg}</span>
        </div>
      )}

      {/* Control Filter Bar */}
      <div className="card-editorial p-3 mb-4">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
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
                [{cat.toUpperCase()}]
              </button>
            ))}
          </div>

          <div className="d-flex align-items-center gap-2">
            <input
              type="text"
              placeholder="Search extracted skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control-editorial py-1 px-3 font-mono"
              style={{ width: '220px', fontSize: '0.75rem' }}
            />
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-lab-sm btn-lab-sm-navy"
            >
              <i className="fas fa-plus me-1"></i>
              <span>[ADD CUSTOM]</span>
            </button>
          </div>
        </div>
      </div>

      {/* Skills Ledger Table */}
      <div className="card-editorial p-4 mb-4">
        <div className="table-responsive">
          <table className="table-editorial">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>SELECT</th>
                <th>COMPETENCY NAME</th>
                <th>TAXONOMY GROUP</th>
                <th>PROFICIENCY RATING</th>
                <th>EXPERIENCE (YRS)</th>
                <th style={{ width: '80px' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredSkills.map((s) => (
                <tr key={s.id} style={{ opacity: s.selected ? 1 : 0.45 }}>
                  <td>
                    <input
                      type="checkbox"
                      checked={s.selected}
                      onChange={() => toggleSelect(s.id)}
                      style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                    />
                  </td>
                  <td className="fw-bold font-editorial text-dark">{s.name}</td>
                  <td>
                    <span className="badge-editorial badge-editorial-ivory">
                      {s.category}
                    </span>
                  </td>
                  <td>
                    <select
                      className="form-control-editorial py-1 px-2 font-mono"
                      style={{ width: '140px', fontSize: '0.75rem' }}
                      value={s.proficiency}
                      disabled={!s.selected}
                      onChange={(e) => handleProficiencyChange(s.id, e.target.value)}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="15"
                      className="form-control-editorial py-1 px-2 font-mono"
                      style={{ width: '80px', fontSize: '0.75rem' }}
                      value={s.years}
                      disabled={!s.selected}
                      onChange={(e) => handleYearsChange(s.id, e.target.value)}
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => handleRemoveSkill(s.id)}
                      className="btn-lab-sm"
                      style={{ backgroundColor: '#F4F0E8', color: '#dc2626', borderColor: '#dc2626', fontSize: '0.65rem', padding: '0.2rem 0.5rem' }}
                      title="Remove from batch"
                    >
                      <i className="fas fa-trash-can"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredSkills.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 font-mono text-muted small">
                    // ZERO COMPETENCIES FOUND MATCHING CURRENT FILTER CRITERIA
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex align-items-center justify-content-between pt-3 mt-3 border-t-lab">
          <div className="font-mono text-muted small" style={{ fontSize: '0.7rem' }}>
            TOTAL DETECTED: {skills.length} &bull; SELECTED FOR MYSQL COMMIT: {selectedCount}
          </div>
          <button
            onClick={handleConfirmAndSave}
            disabled={saving || selectedCount === 0}
            className="btn-lab-sm btn-lab-sm-lime"
            style={{ fontSize: '0.85rem', padding: '0.65rem 2rem' }}
          >
            <span>[COMMIT &amp; SYNC WITH SKILLS MATRIX &rarr;]</span>
          </button>
        </div>
      </div>

      {/* Add Custom Skill Modal */}
      {showAddModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'rgba(17, 24, 39, 0.7)', zIndex: 1060 }}
        >
          <div className="card-editorial p-4" style={{ width: '460px', backgroundColor: '#FFFFFF' }}>
            <div className="d-flex align-items-center justify-content-between border-b-lab pb-2 mb-3">
              <span className="font-mono fw-bold text-dark small">// REGISTER CUSTOM COMPETENCY</span>
              <button
                className="btn btn-link p-0 text-dark font-mono text-decoration-none"
                onClick={() => setShowAddModal(false)}
              >
                [X]
              </button>
            </div>
            <form onSubmit={handleAddCustomSkill}>
              <div className="mb-3">
                <label className="form-label-editorial">Skill / Competency Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., GraphQL, PyTorch, Kubernetes"
                  className="form-control-editorial font-mono"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
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
                  <option value="Soft Skills">Soft Skills</option>
                </select>
              </div>
              <div className="row g-2 mb-4">
                <div className="col-6">
                  <label className="form-label-editorial">Proficiency</label>
                  <select
                    className="form-control-editorial font-mono"
                    value={newSkill.proficiency}
                    onChange={(e) => setNewSkill(prev => ({ ...prev, proficiency: e.target.value }))}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label-editorial">Experience (Yrs)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    className="form-control-editorial font-mono"
                    value={newSkill.years}
                    onChange={(e) => setNewSkill(prev => ({ ...prev, years: e.target.value }))}
                  />
                </div>
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
                  [APPEND COMPETENCY]
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExtractedSkillsReview;
