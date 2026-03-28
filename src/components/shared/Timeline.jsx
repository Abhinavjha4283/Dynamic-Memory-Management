import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Horizontal scrolling timeline with chip-based visualization.
 *
 * @param {Array} items - Array of { value, label?, status? } objects
 * @param {number} currentIndex - Currently active item index (1-based)
 * @param {string} accentColor - CSS color for active item
 * @param {Function} onItemClick - Callback with item index (1-based)
 * @param {Function} renderChip - Optional custom chip renderer (item, index, isActive, isPast) => ReactNode
 */
export default function Timeline({
  items = [],
  currentIndex = 0,
  accentColor = 'var(--fifo)',
  onItemClick,
  renderChip,
  className = '',
}) {
  const containerRef = useRef(null);

  // Auto-scroll to current item
  useEffect(() => {
    if (containerRef.current && currentIndex > 0) {
      const chipWidth = 60;
      const scrollTo = Math.max(
        0,
        (currentIndex - 1) * chipWidth - containerRef.current.clientWidth / 2 + chipWidth / 2
      );
      containerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  }, [currentIndex]);

  return (
    <div className={`shared-timeline ${className}`} ref={containerRef}>
      {items.map((item, i) => {
        const isPast = i < currentIndex;
        const isCurrent = i === currentIndex - 1;
        const isFuture = i >= currentIndex;

        if (renderChip) {
          return (
            <div key={i} onClick={() => onItemClick?.(i + 1)} style={{ cursor: isPast || isCurrent ? 'pointer' : 'default' }}>
              {renderChip(item, i, isCurrent, isPast)}
            </div>
          );
        }

        return (
          <motion.div
            key={i}
            className="shared-timeline-chip"
            onClick={() => (isPast || isCurrent) && onItemClick?.(i + 1)}
            animate={{ opacity: isFuture ? 0.4 : 1, scale: isCurrent ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
            style={{ cursor: isPast || isCurrent ? 'pointer' : 'default' }}
          >
            <div
              className={`shared-timeline-chip-box ${isCurrent ? 'current' : isFuture ? 'future' : ''}`}
              style={{
                borderColor: isCurrent ? accentColor : undefined,
                boxShadow: isCurrent ? `0 0 16px ${accentColor}44` : undefined,
              }}
            >
              {item.value ?? item}
            </div>
            {item.status && (
              <>
                <div
                  className="shared-timeline-dot"
                  style={{
                    background: item.status === 'HIT' ? 'var(--hit)' : 'var(--fault)',
                  }}
                />
                <span
                  className="shared-timeline-label"
                  style={{
                    color: item.status === 'HIT' ? 'var(--hit)' : 'var(--fault)',
                  }}
                >
                  {item.status}
                </span>
              </>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
