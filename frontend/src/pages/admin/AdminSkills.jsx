import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: 'Programming Languages', description: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await adminService.getSkills();
      if (res.success && res.data) {
        setSkills(res.data);
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to load skills taxonomy.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingSkill(null);
    setFormData({ name: '', category: 'Programming Languages', description: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({ name: skill.name, category: skill.category, description: skill.description || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      if (editingSkill) {
        await adminService.updateSkill(editingSkill.id, formData);
        setSuccessMsg(`Skill "${formData.name}" updated successfully!`);
      } else {
        await adminService.createSkill(formData);
        setSuccessMsg(`Skill "${formData.name}" created successfully!`);
      }
      setShowModal(false);
      fetchSkills();
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to save skill.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete skill "${name}" from the taxonomy?`)) return;
    try {
      await adminService.deleteSkill(id);
      setSuccessMsg(`Skill "${name}" deleted.`);
      setSkills(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to delete skill.');
    }
  };

  const categories = ['All', ...new Set(skills.map(s => s.category).filter(Boolean))];

  const filteredSkills = skills.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'All' || s.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  if (loading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-dark" role="status" style={{ width: '2.5rem', height: '2.5rem', borderWidth: '3px' }}></div>
        <p className="font-mono text-muted mt-3 small">// RETRIEVING MASTER SKILLS TAXONOMY...</p>
      </div>
    );
  }

  return (
    <div className="admin-skills pb-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 border-bottom border-lab-black pb-3">
        <div>
          <div className="font-mono text-muted" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
            // INSTITUTIONAL CAREER INTELLIGENCE &bull; SKILLS TAXONOMY
          </div>
          <h2 className="font-editorial text-dark mb-0 fw-bold" style={{ letterSpacing: '-0.03em' }}>
            Master Skills Taxonomy
          </h2>
          <p className="text-secondary small mb-0 font-sans">
            Catalog of verified corporate competencies used by the AST resume parser, student matrix, and job gating engine.
          </p>
        </div>
        <button onClick={handleOpenCreate} className="btn-lab-sm btn-lab-sm-lime">
          <i className="fas fa-plus me-1"></i>
          <span>[REGISTER NEW SKILL]</span>
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

      {/* Filter bar */}
      <div className="card-editorial p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control-editorial font-mono"
              placeholder="Search skill by keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ fontSize: '0.8rem' }}
            />
          </div>
          <div className="col-md-6">
            <select
              className="form-control-editorial font-mono"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ fontSize: '0.8rem' }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c === 'All' ? 'All Skill Categories' : c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card-editorial p-4">
        <div className="table-responsive">
          <table className="table-editorial">
            <thead>
              <tr>
                <th>COMPETENCY NAME</th>
                <th>CATEGORY CLASSIFICATION</th>
                <th>DESCRIPTION / SPEC</th>
                <th>CANDIDATES CERTIFIED</th>
                <th className="text-end">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredSkills.map((s) => (
                <tr key={s.id}>
                  <td className="fw-bold font-editorial text-dark">{s.name}</td>
                  <td>
                    <span className="badge-editorial badge-editorial-navy">
                      {s.category}
                    </span>
                  </td>
                  <td className="text-muted small">{s.description || 'Standard industry competency'}</td>
                  <td>
                    <span className="badge-editorial badge-editorial-lime">
                      {s.student_skills ? s.student_skills.length : 0} CANDIDATES
                    </span>
                  </td>
                  <td className="text-end">
                    <button
                      onClick={() => handleOpenEdit(s)}
                      className="btn-lab-sm btn-lab-sm-outline me-2"
                      style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem' }}
                    >
                      [EDIT]
                    </button>
                    <button
                      onClick={() => handleDelete(s.id, s.name)}
                      className="btn-lab-sm"
                      style={{ backgroundColor: '#FAF8F5', color: '#dc2626', borderColor: '#dc2626', fontSize: '0.65rem', padding: '0.2rem 0.5rem' }}
                    >
                      [DELETE]
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'rgba(17, 24, 39, 0.7)', zIndex: 1060 }}
        >
          <div className="card-editorial p-4" style={{ width: '480px', backgroundColor: '#FFFFFF' }}>
            <div className="d-flex align-items-center justify-content-between border-b-lab pb-2 mb-3">
              <span className="font-mono fw-bold text-dark small">
                {editingSkill ? '// EDIT COMPETENCY' : '// PROVISION TAXONOMY ENTRY'}
              </span>
              <button
                className="btn btn-link p-0 text-dark font-mono text-decoration-none"
                onClick={() => setShowModal(false)}
              >
                [X]
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label-editorial">Skill Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kotlin, Docker, Leadership"
                  className="form-control-editorial font-mono"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="mb-3">
                <label className="form-label-editorial">Category Classification</label>
                <select
                  className="form-control-editorial font-mono"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="Programming Languages">Programming Languages</option>
                  <option value="Frameworks & Libraries">Frameworks & Libraries</option>
                  <option value="Databases">Databases</option>
                  <option value="Developer Tools & Cloud">Developer Tools & Cloud</option>
                  <option value="Technical Skills">Technical Skills</option>
                  <option value="Soft Skills">Soft Skills & Communication</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="form-label-editorial">Description / Scope</label>
                <textarea
                  rows="2"
                  placeholder="Context or application domain..."
                  className="form-control-editorial"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                ></textarea>
              </div>
              <div className="d-flex justify-content-end gap-2 pt-2 border-t-lab">
                <button
                  type="button"
                  className="btn-lab-sm btn-lab-sm-outline"
                  onClick={() => setShowModal(false)}
                >
                  [CANCEL]
                </button>
                <button
                  type="submit"
                  className="btn-lab-sm btn-lab-sm-lime"
                >
                  {editingSkill ? '[SAVE CHANGES]' : '[REGISTER SKILL]'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSkills;
