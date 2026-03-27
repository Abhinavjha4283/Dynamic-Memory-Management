import React, { useRef, useEffect } from 'react';
import heroImg from '../assets/vite.svg';

function Sparkline({ data, color, type = 'line', width = 60, height = 16 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const values = data.map((d) => d.rate ?? d.value ?? 0);
    const max = Math.max(...values, 0.01);
    const min = 0;
    const range = max - min || 1;
    const step = width / Math.max(values.length - 1, 1);

    ctx.beginPath();
    if (type === 'area') {
      ctx.moveTo(0, height);
    }

    values.forEach((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / range) * (height - 2) - 1;
      if (i === 0) {
        if (type === 'area') ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    if (type === 'area') {
      ctx.lineTo((values.length - 1) * step, height);
      ctx.closePath();
      ctx.fillStyle = color.replace(')', ', 0.3)').replace('rgb', 'rgba');
      ctx.fill();
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }, [data, color, type, width, height]);

  return (
    <canvas
      ref={canvasRef}
      className="sparkline-canvas"
      style={{ width, height }}
    />
  );
}

function LogoSVG() {
  return (
    <img src={heroImg} alt="DMMVisualiser" className="header-logo" style={{ width: 28, height: 28, objectFit: 'contain' }} />
  );
}

export default function Header({
  algorithm,
  algoColor,
  modeString,
  hitRateHistory,
  faultRateHistory,
  onHelpClick,
  onThemeClick,
  onBackClick,
}) {
  const modeClass =
    modeString === 'PLAYING'
      ? 'playing'
      : modeString === 'STEPPING'
      ? 'stepping'
      : modeString === 'COMPLETE'
      ? 'complete'
      : 'idle';

  return (
    <header className="header">
      <div className="header-left">
        {/* Back button to intro */}
        <button className="settings-btn" onClick={onBackClick} title="Back to Home">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M7.78 12.53a.75.75 0 01-1.06 0L2.47 8.28a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 1.06L4.81 7h7.44a.75.75 0 010 1.5H4.81l2.97 2.97a.75.75 0 010 1.06z" />
          </svg>
        </button>
        <LogoSVG />
        <span className="header-title">DMMVisualiser</span>
        <span className="header-version">v2.0</span>
      </div>

      <div className="header-divider" />

      <div className="header-center">
        <div className="algo-pill" style={{ borderLeft: `4px solid ${algoColor}` }}>
          <div className="algo-pill-dot" style={{ background: algoColor }} />
          {algorithm}
        </div>
        <div className="mode-chip">
          <div className={`mode-dot ${modeClass}`} />
          {modeString}
        </div>
      </div>

      <div className="header-divider" />

      <div className="header-right">
        <div className="sparkline-group">
          <div className="sparkline-item">
            <span className="sparkline-label">Hits</span>
            <Sparkline data={hitRateHistory} color="#3fb950" />
          </div>
          <div className="sparkline-item">
            <span className="sparkline-label">Faults</span>
            <Sparkline data={faultRateHistory} color="#f85149" />
          </div>
        </div>

        <div className="header-divider" />

        {/* Theme button */}
        <button className="settings-btn" onClick={onThemeClick} title="Theme (T)">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 13V2a6 6 0 010 12z" />
          </svg>
        </button>

        {/* Help button */}
        <button className="settings-btn" onClick={onHelpClick} title="Help (H)">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 14.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13zM7 11h2v2H7v-2zm1-9a3 3 0 00-3 3h2a1 1 0 112 0c0 .55-.45 1-1 1a1 1 0 00-1 1v1h2v-.5A3 3 0 008 2z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
