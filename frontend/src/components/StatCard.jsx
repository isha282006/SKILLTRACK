import React from 'react';

const StatCard = ({
  title,
  value,
  subtitle,
  icon = 'fa-chart-pie',
  iconBg = '',
  trend = null,
  trendPositive = true,
  onClick = null,
  className = ''
}) => {
  return (
    <div
      className={`card-editorial p-3 h-100 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      style={{
        backgroundColor: '#FFFFFF',
        cursor: onClick ? 'pointer' : 'default'
      }}
    >
      <div className="d-flex align-items-center justify-content-between mb-2">
        <span className="font-mono text-muted text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.06em' }}>
          {title}
        </span>
        <div
          className="d-inline-flex align-items-center justify-content-center font-mono"
          style={{
            width: '28px',
            height: '28px',
            backgroundColor: '#111827',
            color: '#C5F36B',
            border: '1px solid #111827',
            fontSize: '0.75rem'
          }}
        >
          <i className={`fas ${icon}`}></i>
        </div>
      </div>

      <div className="d-flex align-items-baseline justify-content-between">
        <h3 className="font-editorial fw-bold mb-0 text-dark" style={{ letterSpacing: '-0.03em' }}>
          {value}
        </h3>
        {trend && (
          <span
            className="badge-editorial"
            style={{
              fontSize: '0.62rem',
              backgroundColor: trendPositive ? '#C5F36B' : '#F28B70',
              color: '#111827'
            }}
          >
            {trendPositive ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <div className="font-mono text-muted small mt-2" style={{ fontSize: '0.65rem' }}>
          {subtitle}
        </div>
      )}
    </div>
  );
};

export default StatCard;
