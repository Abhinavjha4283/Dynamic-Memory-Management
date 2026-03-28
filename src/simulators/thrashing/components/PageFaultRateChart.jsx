import React from 'react';

export default function PageFaultRateChart({ pageFaultRate, isThrashing }) {
  // Normalize visually
  const maxVisual = 1000;
  const heightPercent = Math.min(100, Math.max(5, (pageFaultRate / maxVisual) * 100));
  
  return (
    <div className="placeholder-chart">
      <div style={{ height: 100, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{
              width: 40,
              height: `${heightPercent}%`,
              background: isThrashing ? '#f85149' : '#3fb950',
              borderRadius: '4px 4px 0 0',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              paddingTop: 8
          }}>
              {pageFaultRate > 100 && (
                  <span style={{color: '#fff', fontSize: 10, fontWeight: 'bold'}}>
                      {pageFaultRate}
                  </span>
              )}
          </div>
      </div>
      <div style={{ borderTop: '1px solid var(--border2)', width: '100%', textAlign: 'center', paddingTop: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--text3)' }}>Faults / sec</span>
      </div>
    </div>
  );
}
