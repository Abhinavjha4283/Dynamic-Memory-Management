import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Glassmorphism tooltip with arrow positioning.
 *
 * @param {string} content - Tooltip text content
 * @param {'top'|'bottom'|'left'|'right'} position - Arrow position
 * @param {'hover'|'click'} trigger - How to trigger the tooltip
 */
export default function Tooltip({
  children,
  content,
  position = 'top',
  trigger = 'hover',
  className = '',
  maxWidth = 280,
}) {
  const [visible, setVisible] = useState(false);
  const wrapRef = useRef(null);

  // Close on outside click for click trigger
  useEffect(() => {
    if (trigger !== 'click' || !visible) return;
    const handleClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [trigger, visible]);

  const handlers =
    trigger === 'hover'
      ? { onMouseEnter: () => setVisible(true), onMouseLeave: () => setVisible(false) }
      : { onClick: () => setVisible((v) => !v) };

  return (
    <span className={`ui-tooltip-wrap ${className}`} ref={wrapRef} {...handlers}>
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            className={`ui-tooltip ui-tooltip--${position}`}
            initial={{ opacity: 0, scale: 0.9, y: position === 'top' ? 8 : -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: position === 'top' ? 8 : -8 }}
            transition={{ duration: 0.15 }}
            style={{ maxWidth }}
          >
            {typeof content === 'string' ? (
              <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{content}</pre>
            ) : (
              content
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
