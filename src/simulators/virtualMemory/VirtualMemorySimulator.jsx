import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { HardDrive } from 'lucide-react';
import TLBSimulation from './components/TLBSimulation';
import MultiLevelPageTable from './components/MultiLevelPageTable';
import SwapSpace from './components/SwapSpace';
import AddressTranslationPath from './components/AddressTranslationPath';
import { useVirtualMemory } from './hooks/useVirtualMemory';

export default function VirtualMemorySimulator() {
  const sim = useVirtualMemory();

  // Keyboard shortcuts
  const simRef = useRef(sim);
  simRef.current = sim;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
      const s = simRef.current;
      switch (e.key) {
        case ' ':
          e.preventDefault();
          s.togglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (!s.isPlaying) s.stepForward();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (!s.isPlaying) s.stepBackward();
          break;
        case 'r':
        case 'R':
          if (!e.ctrlKey && !e.metaKey) { s.reset(); s.loadSimulation(); }
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="placeholder-simulator">
      <motion.header className="simulator-hero" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="simulator-hero-icon flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #3fb950, #1a4a22)' }}>
          <HardDrive size={28} />
        </div>
        <div>
          <h1 className="simulator-hero-title">Virtual Memory</h1>
          <p className="simulator-hero-sub">TLB, Multi-level Page Tables &amp; Demand Paging</p>
        </div>
      </motion.header>

      <div className="placeholder-layout">
        <aside className="placeholder-sidebar">
          <div className="placeholder-config">
            <h3>VM Configuration</h3>
            <label>
              <span>Address Bits</span>
              <select value={sim.addressBits} onChange={(e) => sim.setAddressBits(Number(e.target.value))}>
                <option value={32}>32-bit</option>
                <option value={48}>48-bit</option>
              </select>
            </label>
            <label>
              <span>Page Size</span>
              <select value={sim.pageSize} onChange={(e) => sim.setPageSize(Number(e.target.value))}>
                <option value={4}>4 KB</option>
                <option value={2048}>2 MB</option>
              </select>
            </label>
            <label>
              <span>TLB Entries</span>
              <input type="number" value={sim.tlbEntries} min={4} max={64} onChange={(e) => sim.setTlbEntries(Number(e.target.value))} />
            </label>

            <h3 style={{ marginTop: 24, marginBottom: 8 }}>Controls</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
              <button className="ref-action-btn" onClick={() => sim.stepBackward()} disabled={sim.currentStep === 0 || sim.isPlaying}>
                ◀ Step Back
              </button>
              <button className="ref-action-btn" onClick={() => sim.togglePlay()} disabled={sim.isComplete}>
                {sim.isPlaying ? '❚❚ Pause' : '▶ Play'}
              </button>
              <button className="ref-action-btn" onClick={() => sim.stepForward()} disabled={sim.isComplete || sim.isPlaying}>
                Step Fwd ▶
              </button>
              <button className="ref-action-btn" onClick={() => { sim.reset(); sim.loadSimulation(); }}>
                ↺ Randomize
              </button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 10, color: 'var(--text3)' }}>{sim.currentStep} / {sim.totalSteps} STEPS</span>
              <div className="metric-bar">
                <div className="metric-bar-fill" style={{ width: `${sim.progress}%`, background: '#3fb950' }} />
              </div>
            </div>

            <AddressTranslationPath currentStepData={sim.currentStepData} />
          </div>
        </aside>

        <main className="placeholder-main">
          <div className="placeholder-panels">
            <motion.div className="placeholder-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h4>Translation Lookaside Buffer</h4>
              <TLBSimulation tlbState={sim.tlbState} maxEntries={sim.tlbEntries} />
            </motion.div>

            <motion.div className="placeholder-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h4>Multi-level Page Table</h4>
              <MultiLevelPageTable currentStepData={sim.currentStepData} />
            </motion.div>

            <motion.div className="placeholder-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h4>Swap Space (Disk)</h4>
              <SwapSpace swapState={sim.swapState} currentStepData={sim.currentStepData} />
            </motion.div>
          </div>
        </main>

        <aside className="placeholder-sidebar right">
          <div className="placeholder-stats">
            <h3>Statistics</h3>
            <div className="placeholder-stat"><span>TLB Hits</span><span style={{ color: 'var(--hit)' }}>{sim.tlbHits}</span></div>
            <div className="placeholder-stat"><span>Page Walks</span><span style={{ color: '#3fb950' }}>{sim.pageWalks}</span></div>
            <div className="placeholder-stat"><span>Swap Reads</span><span style={{ color: 'var(--fault)' }}>{sim.swapReads}</span></div>
          </div>

          <div className="placeholder-stats" style={{ marginTop: 16 }}>
            <h3>Event Log</h3>
            <div style={{ 
                maxHeight: 250, 
                overflowY: 'auto', 
                background: 'var(--bg2)', 
                padding: 12, 
                borderRadius: 6,
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8 
              }}>
                {sim.eventLog.length === 0 ? <div style={{color:'var(--text3)', fontSize:12}}>No accesses yet. Press play to trace.</div> : null}
                {sim.eventLog.slice(-10).map((idx, i) => (
                  <div key={i} style={{
                    fontSize: 11, 
                    fontFamily: 'var(--font-mono)', 
                    color: idx.type === 'FAULT' ? 'var(--fault)' : (idx.type === 'HIT' ? 'var(--text)' : '#3fb950'),
                    borderLeft: `2px solid ${idx.type === 'FAULT' ? '#f85149' : (idx.type === 'HIT' ? '#a371f7' : '#3fb950')}`,
                    paddingLeft: 8
                  }}>
                    <span style={{ color: 'var(--text3)' }}>[{idx.step}]</span> {idx.details}
                  </div>
                ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
