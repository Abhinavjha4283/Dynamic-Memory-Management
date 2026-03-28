import React from 'react';

/**
 * Status badge with color variants.
 *
 * @param {string} variant - 'default' | 'success' | 'warning' | 'danger' | 'info'
 * @param {string} size - 'sm' | 'md'
 */
export default function Badge({
  children,
  variant = 'default',
  size = 'sm',
  color,
  className = '',
  style = {},
}) {
  const variantColors = {
    default: { bg: 'var(--bg4)', text: 'var(--text2)', border: 'var(--border)' },
    success: { bg: 'var(--hit-dim)', text: 'var(--hit)', border: 'var(--hit-dim)' },
    warning: { bg: 'var(--evict-dim)', text: 'var(--evict)', border: 'var(--evict-dim)' },
    danger: { bg: 'var(--fault-dim)', text: 'var(--fault)', border: 'var(--fault-dim)' },
    info: { bg: 'var(--fifo-dim)', text: 'var(--fifo)', border: 'var(--fifo-dim)' },
  };

  const colors = variantColors[variant] || variantColors.default;

  return (
    <span
      className={`ui-badge ui-badge--${size} ${className}`}
      style={{
        background: color ? `${color}22` : colors.bg,
        color: color || colors.text,
        borderColor: color ? `${color}44` : colors.border,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
