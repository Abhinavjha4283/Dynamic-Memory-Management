import React from 'react';
import { motion } from 'framer-motion';

/**
 * Styled button with multiple variants.
 *
 * @param {string} variant - 'primary' | 'secondary' | 'ghost' | 'danger'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {string} accentColor - CSS color for primary variant background
 */
export default function Button({
  children,
  variant = 'secondary',
  size = 'md',
  accentColor,
  className = '',
  disabled = false,
  onClick,
  title,
  style = {},
  ...props
}) {
  return (
    <motion.button
      className={`ui-btn ui-btn--${variant} ui-btn--${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      style={{
        ...style,
        '--btn-accent': accentColor,
        ...(variant === 'primary' && accentColor
          ? { background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)` }
          : {}),
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
