import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import StatCard from '../../components/StatCard';

const AdminReports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await adminService.getReports();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to generate placement reports.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-dark" role="status" style={{ width: '2.5rem', height: '2.5rem', borderWidth: '3px' }}></div>
        <p className="font-mono text-muted mt-3 small">// COMPILING ACCREDITATION PLACEMENT AUDIT DOSSIERS...</p>
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <div className="card-editorial p-5 text-center my-4">
        <i className="fas fa-circle-exclamation fa-2x mb-3 text-danger"></i>
        <p className="font-mono text-dark fw-bold mb-3">{errorMsg || '// UNABLE TO COMPILE ACCREDITATION REPORT'}</p>
        <button className="btn-lab-sm btn-lab-sm-navy" onClick={fetchReports}>
          [RETRY COMPILATION]
        </button>
      </div>
    );
  }

  const { totalStudents, placedCount, overallRate, branchStats, highestCtc, avgCtc } = data;

  return (
    <div className="admin-reports pb-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 border-bottom border-lab-black pb-3">
        <div>
          <div className="font-mono text-muted" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
            // INSTITUTIONAL CAREER INTELLIGENCE &bull; ACCREDITATION AUDIT
          </div>
          <h2 className="font-editorial text-dark mb-0 fw-bold" style={{ letterSpacing: '-0.03em' }}>
            Institutional Placement &amp; Accreditation Reports
          </h2>
          <p className="text-secondary small mb-0 font-sans">
            Official annual placement metrics, branch audits, and salary distribution for NAAC / NBA documentation.
          </p>
        </div>
        <button onClick={handlePrint} className="btn-lab-sm btn-lab-sm-lime">
          <i className="fas fa-print me-1"></i>
          <span>[PRINT / EXPORT REPORT]</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title="TOTAL COHORT"
            value={totalStudents}
            subtitle="Final Year Candidates"
            icon="fa-users"
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title="PLACED CANDIDATES"
            value={placedCount}
            subtitle="Official Offer Letters"
            icon="fa-trophy"
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title="CONVERSION RATE"
            value={`${overallRate}%`}
            subtitle="Campus Conversion"
            icon="fa-chart-pie"
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title="HIGHEST PACKAGE"
            value={`₹ ${highestCtc} LPA`}
            subtitle={`Average: ₹ ${avgCtc} LPA`}
            icon="fa-sack-dollar"
          />
        </div>
      </div>

      {/* Branch Breakdown Table */}
      <div className="card-editorial p-4 mb-4">
        <div className="border-b-lab pb-3 mb-3">
          <span className="font-mono text-muted small" style={{ fontSize: '0.68rem' }}>
            // DEPARTMENT AUDIT
          </span>
          <h4 className="font-editorial fw-bold text-dark mb-0">Branch-Wise Placement Performance Audit</h4>
        </div>

        <div className="table-responsive">
          <table className="table-editorial">
            <thead>
              <tr>
                <th>ENGINEERING / TECH BRANCH</th>
                <th className="text-center">TOTAL ENROLLED</th>
                <th className="text-center">CANDIDATES PLACED</th>
                <th style={{ width: '250px' }}>CONVERSION INDEX (%)</th>
                <th className="text-end">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {branchStats.map((b) => (
                <tr key={b.department}>
                  <td className="fw-bold font-editorial text-dark">{b.department}</td>
                  <td className="text-center font-mono">{b.total}</td>
                  <td className="text-center font-mono fw-bold text-dark">{b.placed}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="flex-grow-1" style={{ height: '8px', backgroundColor: '#FFFFFF', border: '1px solid #111827' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${b.rate}%`,
                            backgroundColor: b.rate >= 80 ? '#C5F36B' : b.rate >= 60 ? '#5265E8' : '#F28B70'
                          }}
                        />
                      </div>
                      <span className="font-mono fw-bold text-dark" style={{ width: '45px', fontSize: '0.75rem' }}>{b.rate}%</span>
                    </div>
                  </td>
                  <td className="text-end">
                    <span className={`badge-editorial ${b.rate >= 80 ? 'badge-editorial-lime' :
                        b.rate >= 60 ? 'badge-editorial-navy' :
                          'badge-editorial-coral'
                      }`}>
                      {b.rate >= 80 ? 'HIGH' : b.rate >= 60 ? 'GOOD' : 'ACTION REQUIRED'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Accreditation Notice */}
      <div className="card-editorial p-4" style={{ backgroundColor: '#FAF8F5' }}>
        <div className="d-flex align-items-start gap-3">
          <div
            className="d-flex align-items-center justify-content-center font-mono flex-shrink-0"
            style={{ width: '40px', height: '40px', backgroundColor: '#111827', color: '#C5F36B', border: '1px solid #111827' }}
          >
            <i className="fas fa-certificate fa-lg"></i>
          </div>
          <div>
            <div className="font-mono text-muted small" style={{ fontSize: '0.68rem' }}>
              // UNIVERSITY ACCREDITATION AUDIT TRAIL
            </div>
            <h5 className="font-editorial fw-bold text-dark mb-1">Institutional Compliance &amp; Verification Protocol</h5>
            <p className="font-sans text-secondary small mb-0" style={{ lineHeight: '1.6' }}>
              Placement records and verified readiness metrics in SkillTrack are permanently archived with cryptographic timestamps and offer reference hashes for university board audits and statutory reporting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
