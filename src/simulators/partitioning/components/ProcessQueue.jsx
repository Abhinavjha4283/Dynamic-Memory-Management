import React from 'react';

/**
 * Waiting processes queue display.
 */
export default function ProcessQueue({ processes = [] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {processes.map((p, i) => (
        <div
          key={i}
          className="placeholder-process-item"
          style={{ borderLeftColor: p.color }}
        >
          <span>{p.name}</span>
          <span>{p.size} KB</span>
        </div>
      ))}
    </div>
  );
}
