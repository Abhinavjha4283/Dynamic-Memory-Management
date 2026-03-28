import React from 'react';

export default function AddressTranslationPath({ currentStepData }) {
  if (!currentStepData) {
    return <div style={{ color: 'var(--text3)', fontSize: 12, padding: 16 }}>Waiting for memory trace to start...</div>;
  }

  const { virtualAddress, tlbMiss, pageFault, pfn, physicalAddress, swapAction } = currentStepData;

  const steps = [
    { label: 'Virtual Address', value: `0x${virtualAddress.toString(16).toUpperCase().padStart(8, '0')}`, color: '#a371f7' },
    { label: 'TLB Lookup', value: tlbMiss ? 'MISS' : 'HIT', color: tlbMiss ? 'var(--fault)' : '#3fb950' },
  ];

  if (tlbMiss) {
      steps.push({ label: 'Page Walk', value: 'PGD → PUD → PMD → PTE', color: '#a371f7' });
      if (pageFault) {
          steps.push({ label: 'PTE Valid Bit', value: '0 (Page Fault)', color: 'var(--fault)' });
          steps.push({ label: 'Demand Paging', value: `Load Swap Block ${swapAction} → Frame ${pfn}`, color: '#d29922' });
      } else {
          steps.push({ label: 'PTE Valid Bit', value: `1 (Frame ${pfn})`, color: 'var(--hit)' });
      }
      steps.push({ label: 'TLB Update', value: `Store VPN → Frame ${pfn}`, color: 'var(--text)' });
  }

  steps.push({ label: 'Physical Address', value: `0x${physicalAddress.toString(16).toUpperCase().padStart(8, '0')}`, color: 'var(--text)' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {steps.map((step, i) => (
        <div key={i} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '8px 12px', background: 'var(--bg3)', borderRadius: 6,
          fontFamily: 'var(--font-mono)', fontSize: 11,
          borderLeft: `2px solid ${step.color}`
        }}>
          <span style={{ color: 'var(--text3)' }}>{step.label}</span>
          <span style={{ color: step.color, fontWeight: 600 }}>{step.value}</span>
        </div>
      ))}
    </div>
  );
}
