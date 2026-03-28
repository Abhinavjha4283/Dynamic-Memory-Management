import React from 'react';
import { motion } from 'framer-motion';

export default function WorkingSetMonitor({ processes = [], isThrashing, totalWss, frameCount }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text2)' }}>Total Demand vs Capacity:</span>
            <span style={{ 
                fontFamily: 'var(--font-mono)', 
                fontSize: 14, 
                color: isThrashing ? 'var(--fault)' : 'var(--hit)',
                fontWeight: 600
            }}>
                {totalWss} / {frameCount} Frames
            </span>
        </div>
        <div className="placeholder-visual" style={{ gap: 6, flexWrap: 'wrap', overflowY: 'auto' }}>
        {processes.map((p, i) => (
            <motion.div
            key={i}
            className="placeholder-block wide"
            style={{
                borderColor: isThrashing ? 'var(--fault)' : 'var(--border)',
                background: isThrashing ? 'var(--fault-bg)' : 'var(--bg3)',
                padding: '6px 12px',
                minWidth: 100
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            >
            <span className="placeholder-block-label" style={{ color: 'var(--text)' }}>{p.name}</span>
            <span className="placeholder-block-addr" style={{ color: 'var(--text3)' }}>WSS: <span style={{color: 'var(--text)'}}>{p.wss}</span></span>
            </motion.div>
        ))}
        </div>
    </div>
  );
}
