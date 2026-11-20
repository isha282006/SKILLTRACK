import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import notificationService from '../../services/notificationService';

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await notificationService.getNotifications();
      if (res && res.success && res.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
      setSuccessMsg('All notification dispatches marked as read.');
      setTimeout(() => setSuccessMsg(''), 2500);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'Unread') return !n.is_read;
    return true;
  });

  if (loading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-dark" role="status" style={{ width: '2.5rem', height: '2.5rem', borderWidth: '3px' }}></div>
        <p className="font-mono text-muted mt-3 small">// RETRIEVING TELEMETRY INBOX LOGS...</p>
      </div>
    );
  }

  return (
    <div className="student-notifications pb-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 border-bottom border-lab-black pb-3">
        <div>
          <div className="font-mono text-muted" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
            // INSTITUTIONAL CAREER INTELLIGENCE &bull; SECTION 11
          </div>
          <h2 className="font-editorial text-dark mb-0 fw-bold" style={{ letterSpacing: '-0.03em' }}>
            Telemetry Inbox &amp; Placement Alerts
          </h2>
          <p className="text-secondary small mb-0 font-sans">
            System dispatch logs for interview invitations, application shortlists, and readiness recalibrations.
          </p>
        </div>

        <div className="d-flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="btn-lab-sm btn-lab-sm-lime"
            >
              <i className="fas fa-check-double me-1"></i>
              <span>[MARK ALL AS READ]</span>
            </button>
          )}
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

      {/* Filter Tabs */}
      <div className="card-editorial p-3 mb-4">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex gap-2">
            <button
              onClick={() => setFilter('All')}
              className="btn-lab-sm"
              style={{
                fontSize: '0.7rem',
                backgroundColor: filter === 'All' ? '#111827' : '#FFFFFF',
                color: filter === 'All' ? '#FFFFFF' : '#111827'
              }}
            >
              [ALL DISPATCHES ({notifications.length})]
            </button>
            <button
              onClick={() => setFilter('Unread')}
              className="btn-lab-sm"
              style={{
                fontSize: '0.7rem',
                backgroundColor: filter === 'Unread' ? '#111827' : '#FFFFFF',
                color: filter === 'Unread' ? '#FFFFFF' : '#111827'
              }}
            >
              [UNREAD ONLY ({unreadCount})]
            </button>
          </div>
          <span className="font-mono text-muted small" style={{ fontSize: '0.68rem' }}>
            TOTAL LOGS: {notifications.length}
          </span>
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="card-editorial p-5 text-center">
          <i className="far fa-bell fa-3x text-muted opacity-50 mb-3"></i>
          <h4 className="font-editorial fw-bold text-dark mb-1">// ZERO TELEMETRY LOGS FOUND</h4>
          <p className="font-mono text-muted small mb-0">
            NO DISPATCHES CURRENTLY RECORDED UNDER THIS FILTER CRITERIA.
          </p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filteredNotifications.map((n) => (
            <div
              key={n.id}
              className="card-editorial p-4"
              style={{
                backgroundColor: !n.is_read ? '#FAF8F5' : '#FFFFFF',
                borderLeft: !n.is_read ? '6px solid #111827' : '1px solid #111827'
              }}
            >
              <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 mb-2">
                <div className="d-flex align-items-center gap-2">
                  <h5 className="font-editorial fw-bold text-dark mb-0">{n.title}</h5>
                  {!n.is_read && (
                    <span className="badge-editorial badge-editorial-lime" style={{ fontSize: '0.6rem' }}>
                      NEW DISPATCH
                    </span>
                  )}
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="font-mono text-muted small" style={{ fontSize: '0.65rem' }}>
                    {new Date(n.created_at).toLocaleDateString()} &bull; {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {!n.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(n.id)}
                      className="btn-lab-sm btn-lab-sm-outline"
                      style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem' }}
                    >
                      [ACKNOWLEDGE]
                    </button>
                  )}
                </div>
              </div>
              <p className="font-sans text-secondary small mb-0" style={{ lineHeight: '1.6' }}>
                {n.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentNotifications;
