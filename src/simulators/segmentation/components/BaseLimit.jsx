import React from 'react';
import { motion } from 'framer-motion';

export default function BaseLimit({ segments = [], currentStepData }) {
  const activeSegmentId = currentStepData?.segmentId ?? null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {segments.map((seg, i) => {
        const isActive = activeSegmentId === seg.id;
        return (
          <motion.div
            key={i}
            className="placeholder-segment-item"
            style={{ 
              borderLeftColor: seg.color,
              background: isActive ? 'var(--bg3)' : 'transparent',
              borderColor: isActive ? seg.color : 'transparent',
              borderWidth: 1,
              borderStyle: 'solid',
              borderLeftWidth: 4,
              padding: 8,
              borderRadius: 4
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="placeholder-segment-name" style={{ color: isActive ? seg.color : 'var(--text)' }}>{seg.name}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text3)' }}>
                Base: <strong style={{ color: 'var(--text)' }}>0x{seg.base.toString(16).toUpperCase().padStart(4, '0')}</strong>
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
              <span style={{ fontSize: 11, color: 'var(--text3)' }}>Max Offset</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text3)' }}>
                Limit: <strong style={{ color: 'var(--text)' }}>0x{seg.limit.toString(16).toUpperCase().padStart(4, '0')}</strong>
              </span>
            </div>
            {isActive && currentStepData && (
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border)', fontSize: 11 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text3)' }}>Req: 0x{currentStepData.offset.toString(16).toUpperCase().padStart(4, '0')}</span>
                  <span style={{ color: currentStepData.isSuccess ? 'var(--hit)' : 'var(--fault)' }}>
                    {currentStepData.isSuccess ? 'VALID' : 'OFFSET > LIMIT'}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
