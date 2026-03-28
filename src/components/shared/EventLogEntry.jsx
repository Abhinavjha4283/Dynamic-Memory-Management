import React from 'react';
import { motion } from 'framer-motion';

/**
 * Single event log row component, reusable across simulators.
 *
 * @param {number} step - Step number
 * @param {'HIT'|'FAULT'|'EVICT'} type - Event type
 * @param {number|string} page - Page reference
 * @param {string} details - Detail text
 */
export default function EventLogEntry({ step, type, page, details }) {
  const typeClass = type.toLowerCase();
  const typeIcon = type === 'HIT' ? '✓' : type === 'EVICT' ? '↗' : '⚠';

  return (
    <motion.div
      className={`event-log-entry event-log-entry--${typeClass}`}
      initial={{ opacity: 0, y: -12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <span className="event-log-entry-step">
        [{String(step).padStart(2, '0')}]
      </span>
      <span className={`event-log-entry-type event-log-entry-type--${typeClass}`}>
        {typeIcon} {type}
      </span>
      <span className="event-log-entry-details">
        page:{page} {details}
      </span>
    </motion.div>
  );
}
