import React from 'react';
import { motion } from 'framer-motion';

/**
 * Logical address space visualization showing pages.
 */
export default function LogicalMemory({ pageCount = 8, pageSize = 4, accentColor = '#a371f7', currentStepData }) {
  const activePage = currentStepData ? currentStepData.pageNumber : null;

  return (
    <div className="placeholder-visual" style={{ flexWrap: 'wrap', gap: 6 }}>
      {Array.from({ length: pageCount }, (_, i) => {
        const isActive = activePage === i;
        return (
          <motion.div
            key={i}
            className="placeholder-block"
            style={{ 
              borderColor: isActive ? accentColor : 'var(--border)',
              background: isActive ? `${accentColor}33` : 'transparent',
              transform: isActive ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.2s ease',
              minWidth: 80
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <span className="placeholder-block-label" style={{ color: isActive ? accentColor : 'var(--text)' }}>Page {i}</span>
            <span className="placeholder-block-addr" style={{ color: isActive ? accentColor : 'var(--text3)' }}>
              0x{(i * pageSize * 1024).toString(16).toUpperCase()}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
