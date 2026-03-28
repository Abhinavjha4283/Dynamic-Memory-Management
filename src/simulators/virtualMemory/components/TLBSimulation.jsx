import React from 'react';
import { motion } from 'framer-motion';

export default function TLBSimulation({ tlbState = [], maxEntries = 4 }) {
  // Pad with empty entries if needed for visual sizing
  const displayEntries = [...tlbState];
  while (displayEntries.length < maxEntries) {
    displayEntries.push(null);
  }

  return (
    <div className="placeholder-visual" style={{ flexDirection: 'column', gap: 6 }}>
      {displayEntries.map((entry, i) => (
        <motion.div
          key={entry ? `tlb-${entry.vpn}` : `empty-${i}`}
          className="placeholder-block wide"
          style={{ 
              borderColor: entry ? '#3fb950' : 'var(--border)',
              background: entry ? '#3fb95011' : 'transparent',
              padding: '6px 12px',
              minHeight: 32,
              justifyContent: 'space-between'
          }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          {entry ? (
              <>
                <span className="placeholder-block-label" style={{ color: '#a371f7' }}>VPN {entry.vpn}</span>
                <span className="placeholder-block-label" style={{ color: 'var(--text3)' }}>→</span>
                <span className="placeholder-block-addr" style={{ color: '#3fb950' }}>PFN {entry.pfn}</span>
              </>
          ) : (
              <span style={{ color: 'var(--text3)', fontSize: 11, fontStyle: 'italic', margin: '0 auto' }}>Empty</span>
          )}
        </motion.div>
      ))}
    </div>
  );
}
