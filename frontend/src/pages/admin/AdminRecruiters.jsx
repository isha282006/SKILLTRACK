import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

const AdminRecruiters = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Add Recruiter Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    company_id: '',
    phone: ''
  });

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const fetchRecruiters = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await adminService.getRecruiters();
      if (res && res.success && res.data) {
        setRecruiters(res.data.recruiters || []);
        setCompanies(res.data.companies || []);
        if (res.data.companies && res.data.companies.length > 0 && !formData.company_id) {
          setFormData(prev => ({ ...prev, company_id: res.data.companies[0].id }));
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load recruiter roster.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRecruiter = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      const res = await adminService.createRecruiter(formData);
      if (res && res.success) {
        setSuccessMsg(`Recruiter account for "${formData.full_name}" registered successfully!`);
        setShowAddModal(false);
        setFormData({
          full_name: '',
          email: '',
          password: '',
          company_id: companies[0]?.id || '',
          phone: ''
        });
        fetchRecruiters();
      } else {
        setErrorMsg(res.message || 'Failed to register recruiter.');
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Error registering recruiter account.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRecruiters = recruiters.filter(r => {
    const matchesSearch =
      (r.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.user?.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.company?.name || '').toLowerCase().includes(search.toLowerCase());

    const matchesCompany = selectedCompany === 'All' || String(r.company_id) === String(selectedCompany);
    return matchesSearch && matchesCompany;
  });

  if (loading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-dark" role="status" style={{ width: '2.5rem', height: '2.5rem', borderWidth: '3px' }}></div>
        <p className="font-mono text-muted mt-3 small">// RETRIEVING CORPORATE RECRUITER ROSTER...</p>
      </div>
    );
  }

  return (
    <div className="admin-recruiters pb-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 border-bottom border-lab-black pb-3">
        <div>
          <div className="font-mono text-muted" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
            // INSTITUTIONAL CAREER INTELLIGENCE &bull; RECRUITER ROSTER
          </div>
          <h2 className="font-editorial text-dark mb-0 fw-bold" style={{ letterSpacing: '-0.03em' }}>
            Corporate Recruiters Directory
          </h2>
          <p className="text-secondary small mb-0 font-sans">
            Manage authorized hiring partner accounts, recruitment contacts, and portal access credentials.
          </p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-lab-sm btn-lab-sm-lime">
          <i className="fas fa-plus me-1"></i>
          <span>[AUTHORIZE NEW RECRUITER]</span>
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

      {/* Filter Ledger */}
      <div className="card-editorial p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control-editorial font-mono"
              placeholder="Search recruiter name, email, or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ fontSize: '0.8rem' }}
            />
          </div>
          <div className="col-md-6">
            <select
              className="form-control-editorial font-mono"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              style={{ fontSize: '0.8rem' }}
            >
              <option value="All">All Partner Companies</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Recruiter Table */}
      <div className="card-editorial p-4">
        <div className="table-responsive">
          <table className="table-editorial">
            <thead>
              <tr>
                <th>RECRUITER CONTACT</th>
                <th>HIRING PARTNER ENTITY</th>
                <th>ACCESS EMAIL</th>
                <th>TELEPHONE</th>
                <th>REGISTERED DATE</th>
                <th className="text-end">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecruiters.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 font-mono text-muted small">
                    // ZERO RECRUITERS FOUND MATCHING CRITERIA
                  </td>
                </tr>
              ) : (
                filteredRecruiters.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div className="fw-bold font-editorial text-dark">{r.full_name || 'Recruiter'}</div>
                      <div className="font-mono text-muted small" style={{ fontSize: '0.65rem' }}>ID // #{r.id}</div>
                    </td>
                    <td>
                      <span className="badge-editorial badge-editorial-navy">
                        {r.company?.name || 'Assigned Partner'}
                      </span>
                    </td>
                    <td className="font-mono text-dark small">
                      {r.user?.email || 'N/A'}
                    </td>
                    <td className="font-mono text-muted small">
                      {r.phone || '—'}
                    </td>
                    <td className="font-mono text-muted small">
                      {new Date(r.created_at || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="text-end">
                      <span className="badge-editorial badge-editorial-lime">
                        AUTHORIZED
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Recruiter Modal */}
      {showAddModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'rgba(17, 24, 39, 0.7)', zIndex: 1060 }}
        >
          <div className="card-editorial p-4" style={{ width: '500px', backgroundColor: '#FFFFFF' }}>
            <div className="d-flex align-items-center justify-content-between border-b-lab pb-2 mb-3">
              <span className="font-mono fw-bold text-dark small">// PROVISION RECRUITER ACCOUNT</span>
              <button
                className="btn btn-link p-0 text-dark font-mono text-decoration-none"
                onClick={() => setShowAddModal(false)}
              >
                [X]
              </button>
            </div>
            <form onSubmit={handleCreateRecruiter}>
              <div className="mb-3">
                <label className="form-label-editorial">Recruiter Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Sundar Pichai"
                  className="form-control-editorial"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                />
              </div>
              <div className="mb-3">
                <label className="form-label-editorial">Official Corporate Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g., recruiter@partner.com"
                  className="form-control-editorial font-mono"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="mb-3">
                <label className="form-label-editorial">Temporary Initial Password</label>
                <input
                  type="password"
                  required
                  placeholder="Initial security password"
                  className="form-control-editorial font-mono"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
              <div className="mb-3">
                <label className="form-label-editorial">Assign to Partner Company</label>
                <select
                  className="form-control-editorial font-mono"
                  value={formData.company_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, company_id: e.target.value }))}
                  required
                >
                  <option value="">-- Select Corporate Partner --</option>
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.tier || 'Partner'})</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="form-label-editorial">Direct Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 00000"
                  className="form-control-editorial font-mono"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
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
                  disabled={submitting}
                  className="btn-lab-sm btn-lab-sm-lime"
                >
                  {submitting ? '[PROVISIONING...]' : '[CONFIRM RECRUITER PROVISIONING]'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRecruiters;
