import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ANIMATION_VARIANTS = {
  idle: {
    backgroundColor: 'var(--bg3)',
    borderColor: 'var(--border)',
    scale: 1,
    boxShadow: '0 0 0 transparent',
    y: 0,
  },
  hit: {
    backgroundColor: 'var(--hit-dim)',
    borderColor: 'var(--hit)',
    scale: 1.06,
    boxShadow: '0 0 24px var(--hit-glow), 0 4px 12px rgba(0,0,0,0.4)',
    y: 0,
  },
  fault: {
    backgroundColor: 'var(--fault-dim)',
    borderColor: 'var(--fault)',
    scale: 1.1,
    boxShadow: '0 0 32px var(--fault-glow), 0 8px 16px rgba(0,0,0,0.5)',
    y: -4,
  },
  evict: {
    backgroundColor: 'var(--evict-dim)',
    borderColor: 'var(--evict)',
    scale: 0.94,
    boxShadow: '0 0 16px var(--evict-glow)',
    y: -8,
  },
};

const SIZE_CLASSES = {
  small: 'frame-box--sm',
  medium: 'frame-box--md',
  large: 'frame-box--lg',
};

/**
 * Reusable memory frame cell with animation states.
 *
 * @param {number} index - Frame index
 * @param {number|null} page - Page number or null if empty
 * @param {'empty'|'resident'} status
 * @param {'idle'|'hit'|'fault'|'evict'} animationState
 * @param {React.ReactNode} metadata - Optional metadata to display
 * @param {'small'|'medium'|'large'} size
 */
export default function FrameBox({
  index,
  page,
  status = 'empty',
  animationState = 'idle',
  metadata = null,
  size = 'medium',
}) {
  const isEmpty = page === null || page === undefined;
  const variant = ANIMATION_VARIANTS[animationState] || ANIMATION_VARIANTS.idle;
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.medium;

  return (
    <motion.div
      className={`frame-box ${sizeClass} ${isEmpty ? 'frame-box--empty' : ''}`}
      animate={variant}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="frame-box-header">
        <span className="frame-box-index">F{index}</span>
        {animationState !== 'idle' && (
          <motion.div
            className="frame-box-activity"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 0.6, repeat: 2 }}
          >
            ⚡
          </motion.div>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={page ?? 'empty'}
          className={`frame-box-page ${isEmpty ? 'frame-box-page--empty' : ''}`}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          {isEmpty ? '—' : page}
        </motion.div>
      </AnimatePresence>

      {metadata && <div className="frame-box-metadata">{metadata}</div>}

      <span className={`frame-box-status ${status === 'resident' ? 'frame-box-status--resident' : ''}`}>
        {status === 'resident' ? 'RESIDENT' : 'EMPTY'}
      </span>
    </motion.div>
  );
}
