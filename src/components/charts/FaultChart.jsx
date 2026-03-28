import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';

/**
 * Recharts area chart wrapper for fault/hit accumulation.
 *
 * @param {Array} data - Array of { step, faults, hits } objects
 * @param {Object} themeColors - { text3, border, glass, border2, text, text2 }
 */
export default function FaultChart({ data = [], themeColors = {} }) {
  if (data.length === 0) {
    return (
      <div className="chart-container chart-container--empty">
        No data yet
      </div>
    );
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="faultGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--fault)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--fault)" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="hitGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--hit)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--hit)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="step"
            tick={{ fontSize: 9, fontFamily: 'var(--font-mono)', fill: themeColors.text3 || '#6e7681' }}
            axisLine={{ stroke: themeColors.border || '#21262d' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 9, fontFamily: 'var(--font-mono)', fill: themeColors.text3 || '#6e7681' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: themeColors.glass || 'rgba(22,27,34,0.95)',
              border: `1px solid ${themeColors.border2 || '#30363d'}`,
              borderRadius: 8,
              backdropFilter: 'blur(12px)',
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              color: themeColors.text || '#e6edf3',
            }}
            labelStyle={{ color: themeColors.text2 || '#8b949e' }}
          />
          <Area
            type="monotone"
            dataKey="faults"
            stroke="#f85149"
            strokeWidth={2}
            fill="url(#faultGrad)"
            name="Faults"
            dot={false}
            activeDot={{ r: 4, fill: '#f85149' }}
          />
          <Area
            type="monotone"
            dataKey="hits"
            stroke="#3fb950"
            strokeWidth={2}
            fill="url(#hitGrad)"
            name="Hits"
            dot={false}
            activeDot={{ r: 4, fill: '#3fb950' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
