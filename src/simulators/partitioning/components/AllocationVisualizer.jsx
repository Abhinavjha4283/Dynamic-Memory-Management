import React from 'react';

/**
 * Allocation algorithm visualizer (stub).
 */
export default function AllocationVisualizer({ algorithm = 'First Fit' }) {
  return (
    <div style={{
      padding: 16, background: 'var(--bg3)', borderRadius: 8,
      fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text2)',
      textAlign: 'center',
    }}>
      <div style={{ marginBottom: 8, color: 'var(--text3)', fontSize: 10, textTransform: 'uppercase' }}>
        Active Algorithm
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, color: '#d29922' }}>
        {algorithm}
      </div>
    </div>
  );
}
