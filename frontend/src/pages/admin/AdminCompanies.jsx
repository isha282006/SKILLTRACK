import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

const AdminCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    industry: 'Information Technology',
    tier: 'Tier 1',
    description: '',
    contact_email: '',
    location: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await adminService.getCompanies();
      if (res.success && res.data) {
        setCompanies(res.data);
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to load recruiting partners.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    try {
      await adminService.createCompany(formData);
      setSuccessMsg(`Company "${formData.name}" added to partner network!`);
      setShowModal(false);
      setFormData({ name: '', website: '', industry: 'Information Technology', tier: 'Tier 1', description: '', contact_email: '', location: '' });
      fetchCompanies();
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to create company.');
    }
  };

  const handleDeleteCompany = async (id, name) => {
    if (!window.confirm(`Delete company "${name}"? Active job drives and applications may be affected.`)) return;
    try {
      await adminService.deleteCompany(id);
      setSuccessMsg(`Company "${name}" removed.`);
      fetchCompanies();
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to delete company.');
    }
  };

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.industry || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-dark" role="status" style={{ width: '2.5rem', height: '2.5rem', borderWidth: '3px' }}></div>
        <p className="font-mono text-muted mt-3 small">// RETRIEVING CORPORATE PARTNERSHIP DIRECTORY...</p>
      </div>
    );
  }

  return (
    <div className="admin-companies pb-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 border-bottom border-lab-black pb-3">
        <div>
          <div className="font-mono text-muted" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
            // INSTITUTIONAL CAREER INTELLIGENCE &bull; PARTNERSHIP NETWORK
          </div>
          <h2 className="font-editorial text-dark mb-0 fw-bold" style={{ letterSpacing: '-0.03em' }}>
            Partner Companies &amp; Corporate Relations
          </h2>
          <p className="text-secondary small mb-0 font-sans">
            Institutional recruitment agreements, tier classifications, and corporate profiles.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-lab-sm btn-lab-sm-lime">
          <i className="fas fa-plus me-1"></i>
          <span>[REGISTER PARTNER COMPANY]</span>
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

      {/* Filter Bar */}
      <div className="card-editorial p-3 mb-4">
        <input
          type="text"
          className="form-control-editorial font-mono"
          placeholder="Filter by company name or industry domain..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ fontSize: '0.8rem' }}
        />
      </div>

      {/* Companies Table */}
      <div className="card-editorial p-4">
        <div className="table-responsive">
          <table className="table-editorial">
            <thead>
              <tr>
                <th>COMPANY ENTITY</th>
                <th>INDUSTRY DOMAIN</th>
                <th>CLASSIFICATION TIER</th>
                <th>HEADQUARTERS / CITY</th>
                <th>CONTACT EMAIL</th>
                <th className="text-end">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 font-mono text-muted small">
                    // ZERO COMPANIES FOUND MATCHING FILTER
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="fw-bold font-editorial text-dark">{c.name}</div>
                      {c.website && (
                        <a
                          href={c.website.startsWith('http') ? c.website : `https://${c.website}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-muted small text-decoration-none"
                          style={{ fontSize: '0.65rem' }}
                        >
                          {c.website.replace(/^https?:\/\//, '')} &rarr;
                        </a>
                      )}
                    </td>
                    <td>
                      <span className="badge-editorial badge-editorial-ivory">
                        {c.industry || 'Tech / Engineering'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-editorial ${
                        c.tier === 'Super Dream' ? 'badge-editorial-lime' :
                        c.tier === 'Dream' ? 'badge-editorial-cobalt' :
                        'badge-editorial-navy'
                      }`}>
                        {(c.tier || 'Tier 1').toUpperCase()}
                      </span>
                    </td>
                    <td className="font-mono text-muted small">
                      {c.location || 'Multiple Centers'}
                    </td>
                    <td className="font-mono text-dark small">
                      {c.contact_email || '—'}
                    </td>
                    <td className="text-end">
                      <button
                        onClick={() => handleDeleteCompany(c.id, c.name)}
                        className="btn-lab-sm"
                        style={{ backgroundColor: '#FAF8F5', color: '#dc2626', borderColor: '#dc2626', fontSize: '0.65rem', padding: '0.2rem 0.5rem' }}
                        title="Remove Partner"
                      >
                        <i className="fas fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Company Modal */}
      {showModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'rgba(17, 24, 39, 0.7)', zIndex: 1060 }}
        >
          <div className="card-editorial p-4" style={{ width: '520px', backgroundColor: '#FFFFFF' }}>
            <div className="d-flex align-items-center justify-content-between border-b-lab pb-2 mb-3">
              <span className="font-mono fw-bold text-dark small">// REGISTER HIRING PARTNER</span>
              <button
                className="btn btn-link p-0 text-dark font-mono text-decoration-none"
                onClick={() => setShowModal(false)}
              >
                [X]
              </button>
            </div>
            <form onSubmit={handleCreateCompany}>
              <div className="mb-3">
                <label className="form-label-editorial">Company Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Microsoft India R&D"
                  className="form-control-editorial font-mono"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label-editorial">Classification Tier</label>
                  <select
                    className="form-control-editorial font-mono"
                    value={formData.tier}
                    onChange={(e) => setFormData(prev => ({ ...prev, tier: e.target.value }))}
                  >
                    <option value="Super Dream">Super Dream (&gt;20 LPA)</option>
                    <option value="Dream">Dream (10–20 LPA)</option>
                    <option value="Tier 1">Tier 1 (6–10 LPA)</option>
                    <option value="Standard">Standard (&lt;6 LPA)</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label-editorial">Industry Domain</label>
                  <input
                    type="text"
                    placeholder="e.g., Cloud & AI"
                    className="form-control-editorial font-mono"
                    value={formData.industry}
                    onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                  />
                </div>
              </div>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label-editorial">Corporate Website URL</label>
                  <input
                    type="text"
                    placeholder="https://company.com"
                    className="form-control-editorial font-mono"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label-editorial">Primary Office Location</label>
                  <input
                    type="text"
                    placeholder="e.g., Bengaluru, India"
                    className="form-control-editorial font-mono"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label-editorial">Campus Relations Contact Email</label>
                <input
                  type="email"
                  placeholder="university-recruiting@company.com"
                  className="form-control-editorial font-mono"
                  value={formData.contact_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                />
              </div>
              <div className="mb-4">
                <label className="form-label-editorial">Institutional Notes &amp; Overview</label>
                <textarea
                  rows="2"
                  placeholder="Brief overview of hiring relationship, standard roles, and drive patterns..."
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
                  [INDEX PARTNER COMPANY]
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCompanies;
