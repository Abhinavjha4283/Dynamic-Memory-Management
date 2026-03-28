import React from 'react';
import { motion } from 'framer-motion';

export default function SegmentTable({ segments = [], currentStepData }) {
  const activeSegmentId = currentStepData?.segmentId ?? null;

  return (
    <div className="placeholder-table-preview">
      <div className="placeholder-table-header">
        <span>Segment</span><span>Base</span><span>Limit</span>
      </div>
      {segments.map((s, i) => {
        const isActive = activeSegmentId === s.id;
        return (
          <motion.div
            key={i}
            className="placeholder-table-row"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              background: isActive ? 'var(--bg3)' : 'transparent',
              borderColor: isActive ? s.color : 'var(--border)',
              borderWidth: isActive ? 2 : 1,
            }}
          >
            <span style={{ color: isActive ? s.color : s.color }}>{s.name} (Seg {s.id})</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>0x{s.base.toString(16).toUpperCase().padStart(4, '0')}</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>0x{s.limit.toString(16).toUpperCase().padStart(4, '0')}</span>
          </motion.div>
        );
      })}
    </div>
  );
}
