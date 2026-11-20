import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

const AdminPlacements = () => {
  const [placements, setPlacements] = useState([]);
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    student_id: '',
    company_id: '',
    package_lpa: '',
    offer_letter_ref: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [plcRes, stuRes, compRes] = await Promise.all([
        adminService.getPlacements(),
        adminService.getStudents(),
        adminService.getCompanies()
      ]);

      if (plcRes.success) setPlacements(plcRes.data || []);
      if (stuRes.success) setStudents(stuRes.data || []);
      if (compRes.success) setCompanies(compRes.data || []);
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to load placement records.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlacement = async (e) => {
    e.preventDefault();
    try {
      await adminService.createPlacement(formData);
      setSuccessMsg('Placement offer recorded in official institutional registry!');
      setShowModal(false);
      setFormData({ student_id: '', company_id: '', package_lpa: '', offer_letter_ref: '' });
      fetchData();
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to record placement.');
    }
  };

  const filteredPlacements = placements.filter(p => {
    const term = search.toLowerCase();
    return (
      (p.student?.full_name || '').toLowerCase().includes(term) ||
      (p.company?.name || '').toLowerCase().includes(term) ||
      (p.student?.department || '').toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-dark" role="status" style={{ width: '2.5rem', height: '2.5rem', borderWidth: '3px' }}></div>
        <p className="font-mono text-muted mt-3 small">// RETRIEVING VERIFIED PLACEMENT REGISTRIES...</p>
      </div>
    );
  }

  return (
    <div className="admin-placements pb-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 border-bottom border-lab-black pb-3">
        <div>
          <div className="font-mono text-muted" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
            // INSTITUTIONAL CAREER INTELLIGENCE &bull; PLACEMENT LEDGER
          </div>
          <h2 className="font-editorial text-dark mb-0 fw-bold" style={{ letterSpacing: '-0.03em' }}>
            Official Placement Registry &amp; Offers
          </h2>
          <p className="text-secondary small mb-0 font-sans">
            Verified candidate corporate offers, CTC packages, and offer letter reference tracking.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-lab-sm btn-lab-sm-lime">
          <i className="fas fa-plus me-1"></i>
          <span>[RECORD VERIFIED OFFER]</span>
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

      {/* Search */}
      <div className="card-editorial p-3 mb-4">
        <input
          type="text"
          className="form-control-editorial font-mono"
          placeholder="Search placed candidate name, company, or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ fontSize: '0.8rem' }}
        />
      </div>

      {/* Table */}
      <div className="card-editorial p-4">
        <div className="table-responsive">
          <table className="table-editorial">
            <thead>
              <tr>
                <th>CANDIDATE NAME</th>
                <th>DEPARTMENT &amp; USN</th>
                <th>RECRUITING COMPANY</th>
                <th>ROLE DESIGNATION</th>
                <th>PACKAGE (CTC)</th>
                <th>OFFER DATE</th>
                <th className="text-end">REFERENCE CODE</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlacements.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 font-mono text-muted small">
                    // ZERO CONFIRMED PLACEMENT RECORDS FOUND
                  </td>
                </tr>
              ) : (
                filteredPlacements.map((plc) => (
                  <tr key={plc.id}>
                    <td className="fw-bold font-editorial text-dark">{plc.student?.full_name}</td>
                    <td>
                      <span className="badge-editorial badge-editorial-ivory">
                        {plc.student?.department} &bull; {plc.student?.usn || plc.student?.roll_no}
                      </span>
                    </td>
                    <td>
                      <div className="fw-bold font-editorial text-dark">{plc.company?.name || 'Recruiting Partner'}</div>
                    </td>
                    <td className="font-sans text-dark small">{plc.role_offered || plc.job?.title || 'Software Engineer'}</td>
                    <td>
                      <span className="badge-editorial badge-editorial-lime fs-6">
                        ₹ {plc.package_lpa} LPA
                      </span>
                    </td>
                    <td className="font-mono text-muted small">
                      {new Date(plc.placement_date || plc.created_at).toLocaleDateString()}
                    </td>
                    <td className="text-end font-mono text-muted small">
                      {plc.offer_letter_ref || `OFFER-REF-${plc.id}`}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Placement Modal */}
      {showModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'rgba(17, 24, 39, 0.7)', zIndex: 1060 }}
        >
          <div className="card-editorial p-4" style={{ width: '520px', backgroundColor: '#FFFFFF' }}>
            <div className="d-flex align-items-center justify-content-between border-b-lab pb-2 mb-3">
              <span className="font-mono fw-bold text-dark small">// RECORD CANDIDATE PLACEMENT</span>
              <button
                className="btn btn-link p-0 text-dark font-mono text-decoration-none"
                onClick={() => setShowModal(false)}
              >
                [X]
              </button>
            </div>
            <form onSubmit={handleCreatePlacement}>
              <div className="mb-3">
                <label className="form-label-editorial">Student Candidate</label>
                <select
                  className="form-control-editorial font-mono"
                  value={formData.student_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, student_id: e.target.value }))}
                  required
                >
                  <option value="">-- Choose Candidate --</option>
                  {students.map(({ student }) => (
                    <option key={student.id} value={student.id}>
                      {student.full_name} ({student.department} &bull; USN: {student.usn || student.roll_no})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label-editorial">Hiring Partner Company</label>
                <select
                  className="form-control-editorial font-mono"
                  value={formData.company_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, company_id: e.target.value }))}
                  required
                >
                  <option value="">-- Choose Company --</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label-editorial">Annual Package (CTC in LPA)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="e.g. 14.5"
                  className="form-control-editorial font-mono"
                  value={formData.package_lpa}
                  onChange={(e) => setFormData(prev => ({ ...prev, package_lpa: e.target.value }))}
                />
              </div>

              <div className="mb-4">
                <label className="form-label-editorial">Offer Letter Reference Code</label>
                <input
                  type="text"
                  placeholder="e.g. MS-2026-OFFER-089"
                  className="form-control-editorial font-mono"
                  value={formData.offer_letter_ref}
                  onChange={(e) => setFormData(prev => ({ ...prev, offer_letter_ref: e.target.value }))}
                />
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
                  [COMMIT TO PLACEMENT REGISTRY]
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlacements;
