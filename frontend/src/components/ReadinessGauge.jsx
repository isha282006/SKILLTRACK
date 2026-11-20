import React from 'react';

const ReadinessGauge = ({ score = 0, category = '', size = 180, strokeWidth = 14 }) => {
  const normalizedScore = Math.min(100, Math.max(0, Math.round(score || 0)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  let color = '#ef4444'; // Red (< 40)
  let badgeClass = 'bg-danger-subtle text-danger border border-danger-subtle';
  let categoryLabel = category || 'Needs Improvement';

  if (normalizedScore >= 80) {
    color = '#10b981'; // Green (80 - 100)
    badgeClass = 'bg-success-subtle text-success border border-success-subtle';
    if (!category) categoryLabel = 'Excellent';
  } else if (normalizedScore >= 60) {
    color = '#4f46e5'; // Indigo (60 - 79)
    badgeClass = 'bg-primary-subtle text-primary border border-primary-subtle';
    if (!category) categoryLabel = 'Good';
  } else if (normalizedScore >= 40) {
    color = '#f59e0b'; // Amber (40 - 59)
    badgeClass = 'bg-warning-subtle text-warning-emphasis border border-warning-subtle';
    if (!category) categoryLabel = 'Average';
  }

  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center">
      <div className="position-relative d-inline-flex align-items-center justify-content-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform-rotate" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Value Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </svg>

        {/* Center Label */}
        <div className="position-absolute d-flex flex-column align-items-center justify-content-center">
          <span className="display-6 fw-bold mb-0 lh-1" style={{ color: '#0f172a' }}>
            {normalizedScore}
          </span>
          <span className="text-muted small fw-medium mt-1">out of 100</span>
        </div>
      </div>

      <div className="mt-3">
        <span className={`badge rounded-pill px-3 py-2 fw-semibold ${badgeClass}`}>
          {categoryLabel}
        </span>
      </div>
    </div>
  );
};

export default ReadinessGauge;

