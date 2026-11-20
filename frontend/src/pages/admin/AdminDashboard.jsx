import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import adminService from '../../services/adminService';
import StatCard from '../../components/StatCard';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await adminService.getDashboard();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to load admin dashboard.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-dark" role="status" style={{ width: '2.5rem', height: '2.5rem', borderWidth: '3px' }}></div>
        <p className="font-mono text-muted mt-3 small">// COMPILING INSTITUTIONAL PLACEMENT METRICS &amp; REPOSITORIES...</p>
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <div className="card-editorial p-5 text-center my-4">
        <i className="fas fa-circle-exclamation fa-2x mb-3 text-danger"></i>
        <p className="font-mono text-dark fw-bold mb-3">{errorMsg || '// UNABLE TO RETRIEVE ADMIN COMMAND TELEMETRY'}</p>
        <button className="btn-lab-sm btn-lab-sm-navy" onClick={fetchDashboard}>
          [RELOAD REPOSITORY]
        </button>
      </div>
    );
  }

  const {
    totalStudents,
    totalCompanies,
    totalJobs,
    totalApplications,
    totalPlacements,
    placementRate,
    recentApplications,
    recentPlacements,
    departments,
    applicationStatuses
  } = data;

  // Department Bar Chart
  const deptChartData = {
    labels: departments?.labels || [],
    datasets: [
      {
        label: 'Enrolled Students',
        data: departments?.totals || [],
        backgroundColor: '#111827',
        borderColor: '#111827',
        borderWidth: 1,
        borderRadius: 0
      },
      {
        label: 'Placed Students',
        data: departments?.placed || [],
        backgroundColor: '#C5F36B',
        borderColor: '#111827',
        borderWidth: 1,
        borderRadius: 0
      }
    ]
  };

  // Status Funnel Doughnut Chart
  const statusColors = {
    Applied: '#111827',
    Shortlisted: '#5265E8',
    Interviewing: '#C5F36B',
    Selected: '#10b981',
    Rejected: '#F28B70'
  };

  const doughnutData = {
    labels: applicationStatuses?.labels || [],
    datasets: [
      {
        data: applicationStatuses?.counts || [],
        backgroundColor: (applicationStatuses?.labels || []).map(l => statusColors[l] || '#5265E8'),
        borderWidth: 1,
        borderColor: '#111827'
      }
    ]
  };

  return (
    <div className="admin-dashboard pb-5">
      {/* Header Banner */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 border-bottom border-lab-black pb-3">
        <div>
          <div className="font-mono text-muted" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
            // INSTITUTIONAL CAREER INTELLIGENCE &bull; ADMIN COMMAND DESK
          </div>
          <h2 className="font-editorial text-dark mb-0 fw-bold" style={{ letterSpacing: '-0.03em' }}>
            Campus Placement Command Center
          </h2>
          <p className="text-secondary small mb-0 font-sans">
            Institutional cohort analytics, corporate recruitment drives, and student placement execution.
          </p>
        </div>
        <div className="d-flex gap-2">
          <NavLink to="/admin/jobs" className="btn-lab-sm btn-lab-sm-lime text-decoration-none">
            <i className="fas fa-plus"></i>
            <span>[POST NEW DRIVE]</span>
          </NavLink>
          <NavLink to="/admin/reports" className="btn-lab-sm btn-lab-sm-outline text-decoration-none">
            <i className="fas fa-file-export"></i>
            <span>[EXPORT REPORTS]</span>
          </NavLink>
        </div>
      </div>

      {/* Top 6 Institutional Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-2">
          <StatCard
            title="ENROLLED STUDENTS"
            value={totalStudents}
            icon="fa-user-graduate"
          />
        </div>
        <div className="col-sm-6 col-xl-2">
          <StatCard
            title="HIRING PARTNERS"
            value={totalCompanies}
            icon="fa-building"
          />
        </div>
        <div className="col-sm-6 col-xl-2">
          <StatCard
            title="ACTIVE DRIVES"
            value={totalJobs}
            icon="fa-briefcase"
          />
        </div>
        <div className="col-sm-6 col-xl-2">
          <StatCard
            title="APPLICATIONS"
            value={totalApplications}
            icon="fa-paper-plane"
          />
        </div>
        <div className="col-sm-6 col-xl-2">
          <StatCard
            title="CONFIRMED OFFERS"
            value={totalPlacements}
            icon="fa-trophy"
          />
        </div>
        <div className="col-sm-6 col-xl-2">
          <StatCard
            title="PLACEMENT RATE"
            value={`${placementRate}%`}
            icon="fa-chart-line"
            trend={placementRate >= 70 ? 'STABLE' : 'WATCH'}
            trendPositive={placementRate >= 70}
          />
        </div>
      </div>

      {/* Interactive Charts */}
      <div className="row g-4 mb-4">
        {/* Department Placement Comparison */}
        <div className="col-lg-8">
          <div className="card-editorial p-4 h-100">
            <div className="d-flex align-items-center justify-content-between border-b-lab pb-3 mb-3">
              <div>
                <span className="font-mono text-muted small" style={{ fontSize: '0.68rem' }}>
                  // DEPARTMENTAL COMPARATOR
                </span>
                <h5 className="font-editorial fw-bold text-dark mb-0">Cohort Placement Ratio by Department</h5>
              </div>
              <span className="badge-editorial badge-editorial-navy">ANNUAL TELEMETRY</span>
            </div>
            <div style={{ height: '280px' }}>
              <Bar
                data={deptChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'top' } },
                  scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
                }}
              />
            </div>
          </div>
        </div>

        {/* Application Funnel Doughnut */}
        <div className="col-lg-4">
          <div className="card-editorial p-4 h-100">
            <div className="border-b-lab pb-3 mb-3">
              <span className="font-mono text-muted small" style={{ fontSize: '0.68rem' }}>
                // PIPELINE DISTRIBUTION
              </span>
              <h5 className="font-editorial fw-bold text-dark mb-0">Application Funnel Breakdown</h5>
            </div>
            <div style={{ height: '240px' }} className="d-flex align-items-center justify-content-center">
              {applicationStatuses?.counts?.length > 0 ? (
                <Doughnut
                  data={doughnutData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom' } }
                  }}
                />
              ) : (
                <span className="font-mono text-muted small">// ZERO ACTIVE PIPELINE ENTRIES</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity: Applications & Placements */}
      <div className="row g-4">
        {/* Recent Applications Pipeline */}
        <div className="col-lg-7">
          <div className="card-editorial p-4">
            <div className="d-flex align-items-center justify-content-between border-b-lab pb-3 mb-3">
              <div>
                <span className="font-mono text-muted small" style={{ fontSize: '0.68rem' }}>
                  // LIVE TELEMETRY
                </span>
                <h5 className="font-editorial fw-bold text-dark mb-0">Recent Candidate Applications</h5>
              </div>
              <NavLink to="/admin/applications" className="btn-lab-sm btn-lab-sm-outline text-decoration-none">
                <span>[VIEW PIPELINE]</span>
              </NavLink>
            </div>
            {recentApplications && recentApplications.length > 0 ? (
              <div className="table-responsive">
                <table className="table-editorial">
                  <thead>
                    <tr>
                      <th>CANDIDATE</th>
                      <th>ROLE &amp; COMPANY</th>
                      <th>STATUS</th>
                      <th>DATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentApplications.map((app) => (
                      <tr key={app.id}>
                        <td>
                          <div className="fw-bold font-editorial text-dark">{app.student?.full_name}</div>
                          <div className="font-mono text-muted small" style={{ fontSize: '0.65rem' }}>{app.student?.department}</div>
                        </td>
                        <td>
                          <div className="font-editorial text-dark">{app.job?.title}</div>
                          <div className="font-mono text-muted small" style={{ fontSize: '0.65rem' }}>{app.job?.company?.name}</div>
                        </td>
                        <td>
                          <span className={`badge-editorial ${
                            app.status === 'Selected' ? 'badge-editorial-lime' :
                            app.status === 'Shortlisted' ? 'badge-editorial-navy' :
                            app.status === 'Interviewing' ? 'badge-editorial-cobalt' :
                            app.status === 'Rejected' ? 'badge-editorial-coral' :
                            'badge-editorial-ivory'
                          }`}>
                            {app.status?.toUpperCase()}
                          </span>
                        </td>
                        <td className="font-mono text-muted small">
                          {new Date(app.created_at || app.applied_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="font-mono text-muted small mb-0">// ZERO APPLICATIONS RECORDED IN LOGS</p>
            )}
          </div>
        </div>

        {/* Recent Confirmed Placements */}
        <div className="col-lg-5">
          <div className="card-editorial p-4">
            <div className="d-flex align-items-center justify-content-between border-b-lab pb-3 mb-3">
              <div>
                <span className="font-mono text-muted small" style={{ fontSize: '0.68rem' }}>
                  // OFFICIAL RECORDS
                </span>
                <h5 className="font-editorial fw-bold text-dark mb-0">Latest Confirmed Offers</h5>
              </div>
              <NavLink to="/admin/placements" className="btn-lab-sm btn-lab-sm-outline text-decoration-none">
                <span>[MANAGE]</span>
              </NavLink>
            </div>
            {recentPlacements && recentPlacements.length > 0 ? (
              <div className="d-flex flex-column gap-2">
                {recentPlacements.map((plc) => (
                  <div key={plc.id} className="p-3 border border-lab-black bg-lab-ivory-light d-flex align-items-center justify-content-between">
                    <div>
                      <div className="font-editorial fw-bold text-dark">{plc.student?.full_name}</div>
                      <div className="font-mono text-muted small" style={{ fontSize: '0.68rem' }}>
                        {plc.company?.name || 'Partner Co.'} &bull; {plc.role_offered || 'Software Engineer'}
                      </div>
                    </div>
                    <div className="text-end">
                      <span className="badge-editorial badge-editorial-lime">
                        ₹ {plc.package_lpa} LPA
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-mono text-muted small mb-0">// ZERO PLACEMENTS CONFIRMED IN CURRENT CYCLE</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
