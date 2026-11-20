import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import adminService from '../../services/adminService';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await adminService.getStudents();
      if (res.success && res.data) {
        setStudents(res.data);
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to load students.');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(({ student }) => {
    const term = search.toLowerCase();
    const matchesSearch =
      (student.full_name || '').toLowerCase().includes(term) ||
      (student.usn || student.roll_no || '').toLowerCase().includes(term) ||
      (student.user?.email || '').toLowerCase().includes(term);

    const matchesDept = deptFilter === 'All' || student.department === deptFilter;
    const matchesStatus = statusFilter === 'All' || student.placement_status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const departments = ['All', ...new Set(students.map(s => s.student.department).filter(Boolean))];

  if (loading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-dark" role="status" style={{ width: '2.5rem', height: '2.5rem', borderWidth: '3px' }}></div>
        <p className="font-mono text-muted mt-3 small">// RETRIEVING STUDENT PLACEMENT COHORT REPOSITORY...</p>
      </div>
    );
  }

  return (
    <div className="admin-students pb-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 border-bottom border-lab-black pb-3">
        <div>
          <div className="font-mono text-muted" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
            // INSTITUTIONAL CAREER INTELLIGENCE &bull; COHORT ROSTER
          </div>
          <h2 className="font-editorial text-dark mb-0 fw-bold" style={{ letterSpacing: '-0.03em' }}>
            Student Placement Cohort &amp; Audit
          </h2>
          <p className="text-secondary small mb-0 font-sans">
            Verified academic telemetry, readiness index benchmarks, and recruitment lifecycle standing.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 mb-4 bg-danger bg-opacity-10 border border-danger d-flex align-items-center gap-2 font-mono small text-danger">
          <i className="fas fa-circle-exclamation"></i>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Search & Filters */}
      <div className="card-editorial p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control-editorial font-mono"
              placeholder="Search candidate name, USN, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ fontSize: '0.8rem' }}
            />
          </div>

          <div className="col-md-3">
            <select
              className="form-control-editorial font-mono"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              style={{ fontSize: '0.8rem' }}
            >
              {departments.map((d) => (
                <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <select
              className="form-control-editorial font-mono"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ fontSize: '0.8rem' }}
            >
              <option value="All">All Placement Statuses</option>
              <option value="Placed">Placed</option>
              <option value="Not Placed">Not Placed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Student List Table */}
      <div className="card-editorial p-4">
        <div className="table-responsive">
          <table className="table-editorial">
            <thead>
              <tr>
                <th>CANDIDATE DOSSIER</th>
                <th>DEPARTMENT &amp; SEM</th>
                <th>CGPA / BACKLOGS</th>
                <th>SKILLS INDEX</th>
                <th>READINESS INDEX</th>
                <th>STATUS</th>
                <th className="text-end">AUDIT</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 font-mono text-muted small">
                    // ZERO CANDIDATES MATCHING CURRENT FILTER CRITERIA
                  </td>
                </tr>
              ) : (
                filteredStudents.map(({ student, readiness }) => (
                  <tr key={student.id}>
                    <td>
                      <div className="fw-bold font-editorial text-dark">{student.full_name}</div>
                      <div className="font-mono text-muted small" style={{ fontSize: '0.65rem' }}>
                        USN: {student.usn || student.roll_no} &bull; {student.user?.email}
                      </div>
                    </td>
                    <td>
                      <span className="badge-editorial badge-editorial-ivory">
                        {student.department} &bull; S{student.semester}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono fw-bold text-dark">{student.cgpa}</span>
                      <span className="font-mono text-muted small" style={{ fontSize: '0.65rem' }}>
                        {' '}({student.active_backlogs || 0} BL)
                      </span>
                    </td>
                    <td>
                      <span className="badge-editorial badge-editorial-navy">
                        {student.skills ? student.skills.length : 0} SKILLS
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span className={`badge-editorial ${
                          readiness.score >= 80 ? 'badge-editorial-lime' :
                          readiness.score >= 60 ? 'badge-editorial-navy' :
                          'badge-editorial-coral'
                        }`}>
                          {readiness.score} / 100
                        </span>
                        <span className="font-mono text-muted small" style={{ fontSize: '0.65rem' }}>
                          {readiness.category?.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge-editorial ${student.placement_status === 'Placed' ? 'badge-editorial-lime' : 'badge-editorial-ivory'}`}>
                        {(student.placement_status || 'Not Placed').toUpperCase()}
                      </span>
                    </td>
                    <td className="text-end">
                      <NavLink to={`/admin/students/${student.id}`} className="btn-lab-sm btn-lab-sm-outline text-decoration-none">
                        [AUDIT DOSSIER]
                      </NavLink>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminStudents;
