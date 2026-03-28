import React from 'react';
import { motion } from 'framer-motion';

export default function SwapSpace({ slots = 8, swapState = [], currentStepData }) {
  const activeSwap = currentStepData?.pageFault ? currentStepData.swapAction : null;

  return (
    <div className="placeholder-visual" style={{ gap: 4, flexWrap: 'wrap' }}>
      {Array.from({ length: slots }, (_, i) => {
          
        // For visual sake, map slot roughly to recent swap values
        const isRecent = swapState.includes(i);
        const isActive = activeSwap !== null && (activeSwap % slots === i);

        return (
          <motion.div
            key={i}
            className="placeholder-block small"
            style={{
              borderColor: isActive ? 'var(--fault)' : (isRecent ? '#d29922' : 'var(--border)'),
              background: isActive ? 'var(--fault-bg)' : 'transparent',
              opacity: isActive ? 1 : (isRecent ? 0.8 : 0.4),
              transform: isActive ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.2s'
            }}
          >
            <span className="placeholder-block-label" style={{ color: isActive ? 'var(--fault)' : (isRecent ? '#d29922' : 'inherit') }}>
              {isActive ? `Load ${activeSwap}` : (isRecent ? 'Loaded' : '—')}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
