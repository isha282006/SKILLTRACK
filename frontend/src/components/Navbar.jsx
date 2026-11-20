import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import notificationService from '../services/notificationService';

const Navbar = ({ toggleSidebar }) => {
  const { user, role, demoLogin, logout } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifs, setShowNotifs] = useState(false);
  const [switchingRole, setSwitchingRole] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // 30s poll
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getNotifications();
      if (res.success && res.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unread_count || 0);
      }
    } catch {
      // Ignore background notification fetch errors
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRoleSwitch = async (targetRole) => {
    if (role === targetRole || switchingRole) return;
    setSwitchingRole(true);
    try {
      const res = await demoLogin(targetRole);
      if (res.success) {
        if (targetRole === 'student') navigate('/student/dashboard');
        else if (targetRole === 'admin') navigate('/admin/dashboard');
        else if (targetRole === 'recruiter') navigate('/recruiter/dashboard');
      }
    } catch (err) {
      console.error('Demo login switch error:', err);
    } finally {
      setSwitchingRole(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = user?.student?.full_name || user?.recruiter?.contact_person || (role === 'admin' ? 'Campus Admin' : user?.email?.split('@')[0]) || 'User';

  return (
    <header
      className="app-navbar bg-white border-bottom border-lab-black position-sticky top-0"
      style={{ zIndex: 1020, height: '68px', borderBottom: '1px solid #111827' }}
    >
      <div className="container-fluid h-100 px-3 px-lg-4 d-flex align-items-center justify-content-between">
        {/* Left: Mobile Toggle & Page Greeting */}
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn d-lg-none p-2"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
            style={{
              backgroundColor: '#F4F0E8',
              border: '1px solid #111827',
              borderRadius: 0,
              color: '#111827'
            }}
          >
            <i className="fas fa-bars"></i>
          </button>
          <div>
            <div className="font-mono text-muted" style={{ fontSize: '0.65rem', letterSpacing: '0.06em' }}>
              // CAREER INTELLIGENCE LAB ACTIVE SESSION
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="fw-bold font-editorial text-dark" style={{ fontSize: '1.05rem', letterSpacing: '-0.02em' }}>
                {displayName}
              </span>
              <span
                className="font-mono px-2 py-0"
                style={{
                  fontSize: '0.62rem',
                  backgroundColor: role === 'student' ? '#C5F36B' : role === 'admin' ? '#111827' : '#5265E8',
                  color: role === 'admin' ? '#FFFFFF' : '#111827',
                  border: '1px solid #111827',
                  fontWeight: 700
                }}
              >
                {role ? role.toUpperCase() : 'USER'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Demo Switcher, Notifications, User Menu */}
        <div className="d-flex align-items-center gap-2 gap-md-3">
          {/* Quick Demo Switcher */}
          <div className="d-none d-md-flex align-items-center border border-lab-black bg-lab-ivory-light p-1">
            <span className="font-mono text-muted px-2" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>
              ROLE SWITCH:
            </span>
            <div className="d-flex gap-1">
              <button
                onClick={() => handleRoleSwitch('student')}
                disabled={switchingRole}
                className="px-2 py-1 font-mono fw-bold"
                style={{
                  fontSize: '0.7rem',
                  border: '1px solid #111827',
                  borderRadius: 0,
                  backgroundColor: role === 'student' ? '#C5F36B' : '#FFFFFF',
                  color: '#111827',
                  cursor: 'pointer'
                }}
              >
                [STU]
              </button>
              <button
                onClick={() => handleRoleSwitch('admin')}
                disabled={switchingRole}
                className="px-2 py-1 font-mono fw-bold"
                style={{
                  fontSize: '0.7rem',
                  border: '1px solid #111827',
                  borderRadius: 0,
                  backgroundColor: role === 'admin' ? '#111827' : '#FFFFFF',
                  color: role === 'admin' ? '#FFFFFF' : '#111827',
                  cursor: 'pointer'
                }}
              >
                [ADM]
              </button>
              <button
                onClick={() => handleRoleSwitch('recruiter')}
                disabled={switchingRole}
                className="px-2 py-1 font-mono fw-bold"
                style={{
                  fontSize: '0.7rem',
                  border: '1px solid #111827',
                  borderRadius: 0,
                  backgroundColor: role === 'recruiter' ? '#5265E8' : '#FFFFFF',
                  color: role === 'recruiter' ? '#FFFFFF' : '#111827',
                  cursor: 'pointer'
                }}
              >
                [REC]
              </button>
            </div>
          </div>

          {/* Notifications Dropdown */}
          <div className="position-relative">
            <button
              className="position-relative d-flex align-items-center justify-content-center"
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #111827',
                borderRadius: 0,
                cursor: 'pointer'
              }}
              onClick={() => setShowNotifs(!showNotifs)}
              aria-label="Notifications"
            >
              <i className="far fa-bell text-dark" style={{ fontSize: '0.9rem' }}></i>
              {unreadCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle font-mono fw-bold px-1"
                  style={{
                    fontSize: '0.6rem',
                    backgroundColor: '#F28B70',
                    color: '#111827',
                    border: '1px solid #111827'
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Popover */}
            {showNotifs && (
              <div
                className="position-absolute end-0 mt-2 p-0 bg-white"
                style={{
                  width: '330px',
                  zIndex: 1050,
                  border: '1px solid #111827',
                  boxShadow: '4px 4px 0px #111827'
                }}
              >
                <div
                  className="py-2 px-3 d-flex align-items-center justify-content-between border-bottom"
                  style={{ backgroundColor: '#111827', color: '#FFFFFF' }}
                >
                  <span className="font-mono" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                    // LOGS & ALERTS ({notifications.length})
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="btn btn-link p-0 text-white font-mono text-decoration-none"
                      style={{ fontSize: '0.65rem' }}
                    >
                      [CLEAR ALL]
                    </button>
                  )}
                </div>
                <div className="p-0" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div className="text-center py-4 text-muted small font-mono">
                      <p className="mb-0">// ZERO UNREAD TELEMETRY DISPATCHES</p>
                    </div>
                  ) : (
                    <div>
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className="p-3 border-bottom small"
                          onClick={() => handleMarkAsRead(n.id)}
                          style={{
                            cursor: 'pointer',
                            backgroundColor: !n.is_read ? '#FAF8F5' : '#FFFFFF',
                            transition: 'background-color 0.1s ease'
                          }}
                        >
                          <div className="d-flex align-items-start justify-content-between gap-1">
                            <span className="fw-bold font-editorial text-dark">{n.title}</span>
                            {!n.is_read && (
                              <span
                                className="font-mono px-1"
                                style={{
                                  fontSize: '0.55rem',
                                  backgroundColor: '#C5F36B',
                                  border: '1px solid #111827',
                                  color: '#111827'
                                }}
                              >
                                NEW
                              </span>
                            )}
                          </div>
                          <p className="text-muted small mb-1 mt-1" style={{ fontSize: '0.75rem' }}>{n.message}</p>
                          <span className="font-mono text-muted" style={{ fontSize: '0.6rem' }}>
                            {new Date(n.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div
                  className="d-flex align-items-center justify-content-between py-2 px-3 border-top"
                  style={{ backgroundColor: '#F4F0E8' }}
                >
                  {role === 'student' ? (
                    <button
                      className="btn btn-link p-0 fw-bold font-mono text-dark text-decoration-none"
                      style={{ fontSize: '0.7rem' }}
                      onClick={() => {
                        setShowNotifs(false);
                        navigate('/student/notifications');
                      }}
                    >
                      [OPEN FULL LOG &rarr;]
                    </button>
                  ) : <span />}
                  <button
                    className="btn btn-link p-0 text-muted font-mono text-decoration-none"
                    style={{ fontSize: '0.7rem' }}
                    onClick={() => setShowNotifs(false)}
                  >
                    [DISMISS]
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Initial Badge & Quick Exit */}
          <div className="d-flex align-items-center gap-2">
            <div
              className="d-flex align-items-center justify-content-center fw-bold font-mono"
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: '#111827',
                color: '#C5F36B',
                border: '1px solid #111827'
              }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              className="d-none d-sm-inline-flex align-items-center gap-1 font-mono px-2 py-1"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #111827',
                borderRadius: 0,
                color: '#111827',
                fontSize: '0.7rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              title="Terminate Session"
            >
              <span>EXIT</span>
              <i className="fas fa-arrow-right-from-bracket" style={{ fontSize: '0.65rem' }}></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
