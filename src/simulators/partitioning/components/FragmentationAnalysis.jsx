import React from 'react';

/**
 * Internal/external fragmentation analysis display.
 */
export default function FragmentationAnalysis({
  external = { amount: 250, percent: 35 },
  internal = { amount: 0, percent: 0 },
}) {
  return (
    <div className="placeholder-frag-grid">
      <div className="placeholder-frag-item">
        <span className="placeholder-frag-label">External</span>
        <div className="placeholder-frag-bar">
          <div style={{ width: `${external.percent}%`, background: 'var(--evict)' }} />
        </div>
        <span className="placeholder-frag-value" style={{ color: 'var(--evict)' }}>
          {external.amount} KB ({external.percent}%)
        </span>
      </div>
      <div className="placeholder-frag-item">
        <span className="placeholder-frag-label">Internal</span>
        <div className="placeholder-frag-bar">
          <div style={{ width: `${internal.percent}%`, background: 'var(--fault)' }} />
        </div>
        <span className="placeholder-frag-value" style={{ color: 'var(--fault)' }}>
          {internal.amount} KB ({internal.percent}%)
        </span>
      </div>
    </div>
  );
}
