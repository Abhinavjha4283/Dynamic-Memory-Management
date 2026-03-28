import React from 'react';
import { motion } from 'framer-motion';

export default function PageTableView({ pageTable = [], currentStepData }) {
  const activePage = currentStepData ? currentStepData.pageNumber : null;

  return (
    <div className="placeholder-table-preview" style={{ maxHeight: 300, overflowY: 'auto' }}>
      <div className="placeholder-table-header" style={{ position: 'sticky', top: 0, background: 'var(--bg2)', zIndex: 1 }}>
        <span>Page</span><span>Frame</span><span>Valid</span>
      </div>
      {pageTable.map((entry, i) => {
        const isActive = activePage === i;
        return (
          <motion.div
            key={i}
            className="placeholder-table-row"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.02 }}
            style={{
              background: isActive ? 'var(--bg3)' : 'transparent',
              borderColor: isActive ? '#a371f7' : 'var(--border)',
              borderWidth: isActive ? 2 : 1,
            }}
          >
            <span style={{ color: isActive ? '#a371f7' : 'inherit' }}>{entry.pageNumber}</span>
            <span>{entry.valid ? `F${entry.frameNumber}` : '—'}</span>
            <span style={{ color: entry.valid ? 'var(--hit)' : 'var(--fault)', fontWeight: isActive ? 600 : 400 }}>
              {entry.valid ? '✓' : '✗'}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
