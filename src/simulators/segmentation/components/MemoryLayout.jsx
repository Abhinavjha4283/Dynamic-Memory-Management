import React from 'react';
import { motion } from 'framer-motion';

export default function MemoryLayout({ segments = [], currentStepData }) {
  const activeSegmentId = currentStepData?.segmentId ?? null;
  const isFault = currentStepData ? !currentStepData.isSuccess : false;

  return (
    <div className="placeholder-memory-bar">
      {segments.map((seg, i) => {
        const isActive = activeSegmentId === seg.id;
        
        return (
          <motion.div
            key={i}
            className="placeholder-memory-segment"
            style={{
              background: isActive ? (isFault ? 'var(--fault-bg, #f8514933)' : `${seg.color}66`) : `${seg.color}33`,
              borderColor: isActive ? (isFault ? 'var(--fault)' : seg.color) : seg.color,
              borderWidth: isActive ? 2 : 1,
              flex: (seg.limit + 1) / 1024, // Use limit to determine proportional size
              transform: isActive ? 'scale(1.02)' : 'scale(1)',
              transition: 'all 0.2s',
              zIndex: isActive ? 10 : 1
            }}
          >
            <span style={{ color: isActive ? 'var(--text)' : 'inherit' }}>{seg.name}</span>
            <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>
              0x{seg.base.toString(16).toUpperCase().padStart(4, '0')}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
