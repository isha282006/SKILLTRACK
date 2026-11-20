import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line
} from 'recharts';

/**
 * Custom Tooltip for Swiss Editorial Charts
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="p-2 border-lab-black bg-white font-mono shadow-sm"
        style={{ fontSize: '11px', border: '1px solid #111827' }}
      >
        <div className="fw-bold text-lab-navy mb-1">{label || payload[0].name}</div>
        <div className="text-muted">
          Value: <strong className="text-lab-navy">{payload[0].value}</strong>
        </div>
      </div>
    );
  }
  return null;
};

/**
 * Readiness Component Bar Chart (Recharts)
 */
export const ReadinessBarChart = ({ breakdown = {} }) => {
  const data = [
    { name: 'Technical', points: breakdown.technical?.earned || 31.5, max: 35, color: '#C5F36B' },
    { name: 'Aptitude', points: breakdown.aptitude?.earned || 20.0, max: 25, color: '#5265E8' },
    { name: 'Communication', points: breakdown.communication?.earned || 18.0, max: 20, color: '#111827' },
    { name: 'Academic', points: breakdown.academic?.earned || 17.7, max: 20, color: '#94a3b8' }
  ];

  return (
    <div style={{ width: '100%', height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(17,24,39,0.08)" />
          <XAxis
            dataKey="name"
            tick={{ fontFamily: 'JetBrains Mono', fontSize: 11, fill: '#111827' }}
            axisLine={{ stroke: '#111827' }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 35]}
            tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="points" radius={[0, 0, 0, 0]} stroke="#111827" strokeWidth={1}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Skill Distribution Donut Chart (Recharts)
 */
export const SkillDistributionChart = ({ skills = [] }) => {
  const categories = {};
  skills.forEach(s => {
    const cat = s.skill?.category || s.category || 'General';
    categories[cat] = (categories[cat] || 0) + 1;
  });

  const data = Object.keys(categories).map(cat => ({
    name: cat,
    value: categories[cat]
  }));

  const COLORS = ['#111827', '#C5F36B', '#5265E8', '#F28B70', '#94a3b8', '#0284c7'];

  return (
    <div style={{ width: '100%', height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data.length > 0 ? data : [{ name: 'Technical', value: 1 }]}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            stroke="#111827"
            strokeWidth={1}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Placement Pipeline Progression Trend (Recharts)
 */
export const PlacementTrendLineChart = ({ trendData = [] }) => {
  const defaultData = [
    { month: 'Jul', offers: 12, avgLpa: 14.5 },
    { month: 'Aug', offers: 28, avgLpa: 16.2 },
    { month: 'Sep', offers: 45, avgLpa: 17.8 },
    { month: 'Oct', offers: 68, avgLpa: 19.5 },
    { month: 'Nov', offers: 85, avgLpa: 21.0 }
  ];

  const data = trendData.length > 0 ? trendData : defaultData;

  return (
    <div style={{ width: '100%', height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(17,24,39,0.08)" />
          <XAxis
            dataKey="month"
            tick={{ fontFamily: 'JetBrains Mono', fontSize: 11, fill: '#111827' }}
            axisLine={{ stroke: '#111827' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="offers"
            stroke="#111827"
            strokeWidth={2}
            dot={{ r: 4, fill: '#C5F36B', stroke: '#111827', strokeWidth: 1 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default {
  ReadinessBarChart,
  SkillDistributionChart,
  PlacementTrendLineChart
};

