import React from 'react';

/**
 * Degree of multiprogramming control and display (stub).
 */
export default function MultiprogrammingLevel({ level = 5, maxLevel = 20 }) {
  const percent = (level / maxLevel) * 100;
  const isThrashing = level > maxLevel * 0.6;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 8,
      padding: 12, background: 'var(--bg3)', borderRadius: 8,
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)',
        textTransform: 'uppercase',
      }}>
        <span>MPL</span>
        <span>{level}/{maxLevel}</span>
      </div>
      <div style={{
        height: 6, background: 'var(--bg2)', borderRadius: 3, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', borderRadius: 3,
          width: `${percent}%`,
          background: isThrashing ? 'var(--fault)' : 'var(--hit)',
          transition: 'width 0.3s ease',
        }} />
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 10,
        color: isThrashing ? 'var(--fault)' : 'var(--hit)',
      }}>
        {isThrashing ? '⚠ HIGH — Thrashing risk' : '◉ Normal operation'}
      </div>
    </div>
  );
}
