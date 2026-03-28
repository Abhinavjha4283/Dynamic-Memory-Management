import React from 'react';

export default function MultiLevelPageTable({ currentStepData }) {
  const isWalking = currentStepData?.tlbMiss;
  const isFault = currentStepData?.pageFault;
  
  return (
    <div className="placeholder-tree">
      <div 
        className="placeholder-tree-node root" 
        style={{ borderColor: isWalking ? '#a371f7' : '#3fb950', background: isWalking ? '#a371f733' : 'transparent', transition: 'all 0.3s' }}
      >
        <span style={{ fontSize: 10, position: 'absolute', top: -14, color: 'var(--text3)' }}>{isWalking ? 'Active' : ''}</span>
        PGD
      </div>
      <div className="placeholder-tree-level">
        <div className="placeholder-tree-node" style={{ borderColor: isWalking ? '#a371f7bb' : '#3fb95088', background: isWalking ? '#a371f722' : 'transparent' }}>PUD</div>
        <div className="placeholder-tree-node" style={{ borderColor: '#3fb95088', opacity: 0.5 }}>PUD</div>
      </div>
      <div className="placeholder-tree-level">
        <div className="placeholder-tree-node small" style={{ borderColor: isWalking ? '#a371f7' : '#3fb95044', background: isWalking ? '#a371f744' : 'transparent' }}>
            PMD
        </div>
        <div className="placeholder-tree-node small" style={{ borderColor: '#3fb95044', opacity: 0.5 }}>PMD</div>
      </div>
      <div className="placeholder-tree-level">
        <div className="placeholder-tree-node small" style={{ borderColor: isWalking ? (isFault ? 'var(--fault)' : 'var(--hit)') : '#3fb95044', background: isWalking ? (isFault ? 'var(--fault-bg)' : 'var(--hit-bg)') : 'transparent' }}>
            PTE
        </div>
        <div className="placeholder-tree-node small" style={{ borderColor: '#3fb95044', opacity: 0.5 }}>PTE</div>
      </div>
    </div>
  );
}
