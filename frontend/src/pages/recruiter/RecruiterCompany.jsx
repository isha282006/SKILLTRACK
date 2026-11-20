import React, { useState, useEffect } from 'react';
import recruiterService from '../../services/recruiterService';

const RecruiterCompany = () => {
  const [company, setCompany] = useState(null);
  const [recruiter, setRecruiter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    website: '',
    location: '',
    contact_email: '',
    contact_phone: '',
    description: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await recruiterService.getCompanyProfile();
      if (res.success && res.data) {
        setCompany(res.data.company);
        setRecruiter(res.data.recruiter);
        const c = res.data.company || {};
        setFormData({
          name: c.name || '',
          industry: c.industry || 'Information Technology',
          website: c.website || '',
          location: c.location || '',
          contact_email: c.contact_email || '',
          contact_phone: c.contact_phone || '',
          description: c.description || ''
        });
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to load company profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await recruiterService.updateCompanyProfile(formData);
      if (res.success) {
        setSuccessMsg('Corporate profile specifications updated successfully in MySQL!');
        if (res.data) setCompany(res.data);
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to update company.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-dark" role="status" style={{ width: '2.5rem', height: '2.5rem', borderWidth: '3px' }}></div>
        <p className="font-mono text-muted mt-3 small">// RETRIEVING CORPORATE PROFILE SPECIFICATIONS...</p>
      </div>
    );
  }

  return (
    <div className="recruiter-company pb-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 border-bottom border-lab-black pb-3">
        <div>
          <div className="font-mono text-muted" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
            // INSTITUTIONAL CAREER INTELLIGENCE &bull; EMPLOYER BRANDING
          </div>
          <h2 className="font-editorial text-dark mb-0 fw-bold" style={{ letterSpacing: '-0.03em' }}>
            Company Profile &amp; Campus Branding
          </h2>
          <p className="text-secondary small mb-0 font-sans">
            Maintain authorized corporate profile, official recruiting contacts, and engineering mission specifications.
          </p>
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

      <div className="row g-4">
        {/* Left Column: Employer Card */}
        <div className="col-lg-4">
          <div className="card-editorial p-4 text-center">
            <div
              className="d-flex align-items-center justify-content-center font-mono fw-bold mx-auto mb-3"
              style={{ width: '72px', height: '72px', fontSize: '1.75rem', backgroundColor: '#111827', color: '#C5F36B', border: '2px solid #111827' }}
            >
              <i className="fas fa-building"></i>
            </div>
            <h4 className="font-editorial fw-bold text-dark mb-1">{company?.name || 'Company Name'}</h4>
            <div className="d-flex justify-content-center gap-2 mb-3">
              <span className="badge-editorial badge-editorial-navy">
                {company?.tier || 'Tier 1 Partner'}
              </span>
              <span className="badge-editorial badge-editorial-lime">
                VERIFIED PARTNER
              </span>
            </div>
            <p className="text-secondary small mb-4 font-sans">
              {company?.industry || 'Technology & Software Development'}
            </p>

            <div className="border-t-lab pt-3 font-mono text-start small d-flex flex-column gap-2" style={{ fontSize: '0.75rem' }}>
              <div>
                <span className="text-muted">RECRUITING LEAD:</span> <strong className="text-dark">{recruiter?.contact_person || 'N/A'}</strong>
              </div>
              <div>
                <span className="text-muted">CORPORATE EMAIL:</span> <strong className="text-dark">{company?.contact_email || recruiter?.email || 'N/A'}</strong>
              </div>
              {company?.website && (
                <div>
                  <span className="text-muted">PORTAL URI:</span>{' '}
                  <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noreferrer" className="text-dark fw-bold text-decoration-none">
                    {company.website.replace(/^https?:\/\//, '')} &rarr;
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="col-lg-8">
          <div className="card-editorial p-4 p-md-5">
            <h4 className="font-editorial fw-bold text-dark border-b-lab pb-3 mb-4">
              Edit Employer Specifications
            </h4>

            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label-editorial">Company Name</label>
                  <input
                    type="text"
                    required
                    className="form-control-editorial font-mono"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label-editorial">Industry Domain</label>
                  <input
                    type="text"
                    required
                    className="form-control-editorial font-mono"
                    value={formData.industry}
                    onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label-editorial">Careers Website</label>
                  <input
                    type="url"
                    placeholder="https://company.com/careers"
                    className="form-control-editorial font-mono"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label-editorial">Primary Office Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru, Karnataka"
                    className="form-control-editorial font-mono"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label-editorial">Contact Email</label>
                  <input
                    type="email"
                    className="form-control-editorial font-mono"
                    value={formData.contact_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label-editorial">Contact Phone</label>
                  <input
                    type="tel"
                    className="form-control-editorial font-mono"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label-editorial">Company Overview &amp; Engineering Culture</label>
                <textarea
                  rows="4"
                  placeholder="Tell students about your company, work culture, engineering challenges..."
                  className="form-control-editorial font-sans"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                ></textarea>
              </div>

              <div className="d-flex justify-content-end pt-3 border-t-lab">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-lab-sm btn-lab-sm-navy"
                  style={{ fontSize: '0.85rem', padding: '0.75rem 2rem' }}
                >
                  {saving ? '[UPDATING...]' : '[SAVE CORPORATE SPECIFICATIONS]'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterCompany;
