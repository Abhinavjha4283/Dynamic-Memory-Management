import React from 'react';
import { motion } from 'framer-motion';

/**
 * Generic card component with hover effects and optional gradient border.
 */
export default function Card({
  children,
  className = '',
  onClick,
  hoverable = true,
  accentColor,
  style = {},
  ...props
}) {
  const Component = hoverable ? motion.div : 'div';
  const motionProps = hoverable
    ? {
        whileHover: { y: -4, transition: { duration: 0.2 } },
        whileTap: onClick ? { scale: 0.98 } : {},
      }
    : {};

  return (
    <Component
      className={`ui-card ${className}`}
      onClick={onClick}
      style={{
        ...style,
        cursor: onClick ? 'pointer' : undefined,
        '--card-accent': accentColor || 'var(--border)',
      }}
      {...motionProps}
      {...props}
    >
      {accentColor && <div className="ui-card-accent-bar" />}
      {children}
    </Component>
  );
}
