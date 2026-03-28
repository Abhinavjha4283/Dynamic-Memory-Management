import React from 'react';

/**
 * Dynamic partition visualization.
 */
export default function MemoryPartitions({ partitions = [] }) {
  return (
    <div className="placeholder-memory-bar vertical">
      {partitions.map((p, i) => (
        <div
          key={i}
          className={`placeholder-partition ${p.status}`}
          style={{
            flex: p.size,
            background: p.status === 'free' ? 'var(--bg3)' : p.color + '33',
            borderColor: p.status === 'free' ? 'var(--border)' : p.color,
          }}
        >
          <span className="placeholder-partition-name">{p.name}</span>
          <span className="placeholder-partition-size">{p.size} KB</span>
        </div>
      ))}
    </div>
  );
}
