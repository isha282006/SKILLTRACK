import React from 'react';

/**
 * Standard Editorial Loading Spinner & State
 */
const Loading = ({ message = 'Loading intelligence telemetry...' }) => {
  return (
    <div className="py-5 text-center font-mono" style={{ backgroundColor: 'transparent', minHeight: '200px' }}>
      <div className="spinner-border text-dark" role="status" style={{ width: '2rem', height: '2rem' }}></div>
      <div className="mt-3 text-lab-navy fw-bold" style={{ letterSpacing: '0.08em', fontSize: '12px' }}>
        {message.toUpperCase()}
      </div>
      <div className="text-muted small mt-1 font-sans">Connecting to SkillTrack institutional network</div>
    </div>
  );
};

export default Loading;

