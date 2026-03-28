import React from 'react';
import { motion } from 'framer-motion';

export default function PhysicalMemory({ frameCount = 8, pageTable = [], currentStepData }) {
  const activeFrame = currentStepData?.isHit ? currentStepData.frameNumber : null;
  const errorFrame = (currentStepData && !currentStepData.isHit) ? null : null; // We might want a shake animation if page fault, but we'll just flash fault color on translator
  const mappedFrames = new Set(pageTable.filter(p => p.valid).map(p => p.frameNumber));

  return (
    <div className="placeholder-visual" style={{ flexWrap: 'wrap', gap: 6 }}>
      {Array.from({ length: frameCount }, (_, i) => {
        const isMapped = mappedFrames.has(i);
        const isActive = activeFrame === i;

        return (
          <motion.div
            key={i}
            className="placeholder-block small"
            style={{
              borderColor: isActive ? 'var(--hit)' : (isMapped ? 'var(--hit-muted, #3fb95040)' : 'var(--border)'),
              background: isActive ? 'var(--hit-bg, #3fb95033)' : 'transparent',
              transform: isActive ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.2s ease',
              minWidth: 50
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.02 }}
          >
            <span className="placeholder-block-label" style={{ color: isActive ? 'var(--hit)' : (isMapped ? 'var(--text)' : 'var(--text3)')}}>F{i}</span>
          </motion.div>
        );
      })}
    </div>
  );
}
