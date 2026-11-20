import React from 'react';

const Footer = () => {
  return (
    <footer
      className="footer py-3 border-top mt-auto"
      style={{
        backgroundColor: '#111827',
        color: '#FFFFFF',
        borderTop: '1px solid #111827',
        fontFamily: 'var(--font-mono, monospace)',
        fontSize: '0.72rem'
      }}
    >
      <div className="container-fluid px-4 d-flex flex-column flex-md-row align-items-center justify-content-between gap-2">
        <div className="d-flex align-items-center gap-2">
          <span
            style={{
              backgroundColor: '#C5F36B',
              color: '#111827',
              padding: '1px 5px',
              fontWeight: 800,
              fontSize: '0.65rem'
            }}
          >
            ST // LAB
          </span>
          <span className="text-white-50">
            &copy; {new Date().getFullYear()} SKILLTRACK &mdash; STUDENT SKILL &amp; PLACEMENT MANAGEMENT PLATFORM
          </span>
        </div>
        <div className="d-flex align-items-center gap-3 text-white-50">
          <span>ARCH: REACT + NODE.JS + MYSQL RELATIONAL</span>
          <span>&bull;</span>
          <span style={{ color: '#C5F36B' }}>ENGINE // ACTIVE</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
