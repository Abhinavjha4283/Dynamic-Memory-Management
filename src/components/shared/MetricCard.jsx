import React from 'react';
import { motion } from 'framer-motion';

/**
 * Animated metric display card.
 *
 * @param {string} label - Metric label
 * @param {string|number} value - Display value
 * @param {string} color - CSS color for value
 * @param {string} sublabel - Optional sub-text
 * @param {string} icon - Optional emoji/icon
 * @param {'up'|'down'|null} trend - Optional trend indicator
 * @param {number} bar - Optional bar fill (0–1)
 * @param {string} barColor - Optional bar color
 */
export default function MetricCard({
  label,
  value,
  color = 'var(--text)',
  sublabel = null,
  icon = null,
  trend = null,
  bar,
  barColor,
}) {
  return (
    <div className="shared-metric-card">
      <div className="shared-metric-header">
        {icon && <span className="shared-metric-icon">{icon}</span>}
        <span className="shared-metric-label">{label}</span>
      </div>

      <motion.div
        key={value}
        className="shared-metric-value"
        style={{ color }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {value}
      </motion.div>

      {bar !== undefined && (
        <div className="shared-metric-bar">
          <div
            className="shared-metric-bar-fill"
            style={{
              width: `${Math.min(bar * 100, 100)}%`,
              background: barColor || color,
            }}
          />
        </div>
      )}

      {sublabel && (
        <div className="shared-metric-sublabel">
          {trend && (
            <span className={`shared-metric-trend shared-metric-trend--${trend}`}>
              {trend === 'up' ? '▲' : '▼'}
            </span>
          )}
          {sublabel}
        </div>
      )}
    </div>
  );
}
