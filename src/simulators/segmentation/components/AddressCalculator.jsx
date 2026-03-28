import React from 'react';

export default function AddressCalculator({ currentStepData }) {
  if (!currentStepData) {
    return (
      <>
        <h4 style={{ marginTop: 24, marginBottom: 16 }}>Address Calculation</h4>
        <div style={{ color: 'var(--text3)', fontSize: 12, textAlign: 'center' }}>
          Waiting for simulation to start...
        </div>
      </>
    );
  }

  const { segmentName, segmentId, base, limit, offset, physicalAddress, isSuccess } = currentStepData;

  return (
    <>
      <h4 style={{ marginTop: 24, marginBottom: 16 }}>Address Calculation</h4>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text2)',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ color: 'var(--text3)' }}>Segment:</span>
          <span style={{ color: '#39c5cf', fontWeight: 600 }}>{segmentName} (Seg {segmentId})</span>
        </div>
        <div style={{ paddingLeft: 12, borderLeft: '2px solid var(--border)', marginLeft: 4 }}>
          <div style={{ color: 'var(--text3)' }}>Base: 0x{base.toString(16).toUpperCase().padStart(4, '0')}</div>
          <div style={{ color: 'var(--text3)' }}>Limit: <span style={{ color: isSuccess ? 'var(--text)' : 'var(--fault)' }}>0x{limit.toString(16).toUpperCase().padStart(4, '0')}</span></div>
        </div>
        
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ color: 'var(--text3)' }}>Offset:</span>
          <span style={{ color: isSuccess ? 'var(--text)' : 'var(--fault)' }}>0x{offset.toString(16).toUpperCase().padStart(4, '0')}</span>
        </div>
        
        <div style={{ fontSize: 16, textAlign: 'center', color: 'var(--text3)' }}>↓</div>
        
        <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: 'var(--text3)' }}>Check:</span>
            {isSuccess ? 
              <span style={{ color: 'var(--hit)' }}>0x{offset.toString(16).toUpperCase()} &lt;= 0x{limit.toString(16).toUpperCase()} ✓</span> : 
              <span style={{ color: 'var(--fault)' }}>0x{offset.toString(16).toUpperCase()} &gt; 0x{limit.toString(16).toUpperCase()} ✗</span>
            }
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: 'var(--text3)' }}>Physical:</span>
            {isSuccess ? 
              <span style={{ color: 'var(--hit)', fontWeight: 600 }}>
                0x{base.toString(16).toUpperCase()} + 0x{offset.toString(16).toUpperCase()} = 0x{physicalAddress.toString(16).toUpperCase().padStart(4, '0')}
              </span> : 
              <span style={{ color: 'var(--fault)', fontWeight: 600 }}>SECURITY VIOLATION</span>
            }
          </div>
        </div>
      </div>
    </>
  );
}
