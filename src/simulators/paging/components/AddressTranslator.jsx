import React from 'react';

export default function AddressTranslator({ stepData, pageSize }) {
  if (!stepData) {
    return (
      <div className="placeholder-panel">
        <h4>Address Translation</h4>
        <div style={{ color: 'var(--text3)', fontSize: 12, textAlign: 'center', padding: '16px 0' }}>
          Waiting for simulation to start...
        </div>
      </div>
    );
  }

  return (
    <div className="placeholder-panel">
      <h4>Address Translation</h4>
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 12,
        fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text2)',
      }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ color: 'var(--text3)' }}>Logical:</span>
          <span style={{ color: '#a371f7', fontWeight: 600 }}>0x{stepData.logicalAddress.toString(16).toUpperCase()}</span>
        </div>
        <div style={{ paddingLeft: 12, borderLeft: '2px solid var(--border)', marginLeft: 4 }}>
          <div>Page: <span style={{ color: '#a371f7', fontWeight: 600 }}>{stepData.pageNumber}</span></div>
          <div>Offset: <span style={{ color: 'var(--text)' }}>0x{stepData.offset.toString(16).toUpperCase()}</span></div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>
            (Total {pageSize * 1024} bytes/page)
          </div>
        </div>
        
        <div style={{ fontSize: 18, textAlign: 'center', color: 'var(--text3)' }}>↓</div>
        
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ color: 'var(--text3)' }}>Physical:</span>
          {stepData.isHit ? (
            <span style={{ color: 'var(--hit)', fontWeight: 600 }}>0x{stepData.physicalAddress.toString(16).toUpperCase()}</span>
          ) : (
            <span style={{ color: 'var(--fault)', fontWeight: 600 }}>PAGE FAULT</span>
          )}
        </div>
        {stepData.isHit && (
          <div style={{ paddingLeft: 12, borderLeft: '2px solid var(--border)', marginLeft: 4 }}>
            <div>Frame: <span style={{ color: 'var(--hit)', fontWeight: 600 }}>{stepData.frameNumber}</span></div>
            <div>Offset: <span style={{ color: 'var(--text)' }}>0x{stepData.offset.toString(16).toUpperCase()}</span></div>
          </div>
        )}
      </div>
    </div>
  );
}
