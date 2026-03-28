import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import LogicalMemory from './components/LogicalMemory';
import PhysicalMemory from './components/PhysicalMemory';
import PageTableView from './components/PageTableView';
import AddressTranslator from './components/AddressTranslator';
import { usePaging } from './hooks/usePaging';

export default function PagingSimulator() {
  const sim = usePaging();

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
        <div className="simulator-hero-icon flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #a371f7, #4a2b8a)' }}>
          <FileText size={28} />
        </div>
        <div>
          <h1 className="simulator-hero-title">Paging</h1>
          <p className="simulator-hero-sub">Logical to Physical Address Translation</p>
        </div>
      </motion.header>

      <div className="placeholder-layout">
        <aside className="placeholder-sidebar">
          <div className="placeholder-config">
            <h3>Memory Configuration</h3>
            <label>
              <span>Page Size</span>
              <select value={sim.pageSize} onChange={(e) => sim.setPageSize(Number(e.target.value))}>
                <option value={4}>4 KB</option>
                <option value={8}>8 KB</option>
                <option value={16}>16 KB</option>
              </select>
            </label>
            <label>
              <span>Physical Frames</span>
              <input type="number" min={4} max={16} value={sim.frameCount} onChange={(e) => sim.setFrameCount(Number(e.target.value))} />
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
                <div className="metric-bar-fill" style={{ width: `${sim.progress}%`, background: '#a371f7' }} />
              </div>
            </div>

            <AddressTranslator stepData={sim.currentStepData} pageSize={sim.pageSize} />
          </div>
        </aside>

        <main className="placeholder-main">
          <div className="placeholder-panels">
            <motion.div className="placeholder-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h4>Logical Address Space</h4>
              <LogicalMemory pageCount={sim.pageCount} pageSize={sim.pageSize} currentStepData={sim.currentStepData} />
            </motion.div>

            <motion.div className="placeholder-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h4>Page Table</h4>
              <PageTableView pageTable={sim.pageTable} currentStepData={sim.currentStepData} />
            </motion.div>

            <motion.div className="placeholder-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h4>Physical Memory</h4>
              <PhysicalMemory frameCount={sim.frameCount} pageTable={sim.pageTable} currentStepData={sim.currentStepData} />
            </motion.div>
          </div>
        </main>

        <aside className="placeholder-sidebar right">
          <div className="placeholder-stats">
            <h3>Statistics</h3>
            <div className="placeholder-stat"><span>Translations</span><span style={{ color: '#a371f7' }}>{sim.currentStep}</span></div>
            <div className="placeholder-stat"><span>Page Faults</span><span style={{ color: 'var(--fault)' }}>{sim.pageFaults}</span></div>
            <div className="placeholder-stat"><span>Hit Rate</span><span style={{ color: 'var(--hit)' }}>{sim.currentStep > 0 ? ((1 - (sim.pageFaults / sim.currentStep)) * 100).toFixed(1) : 0}%</span></div>
            <div className="placeholder-stat"><span>Memory Used</span><span>{sim.mappedPagesCount * sim.pageSize} KB</span></div>
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
                {sim.eventLog.length === 0 ? <div style={{color:'var(--text3)', fontSize:12}}>No events yet. Press play to begin translation.</div> : null}
                {sim.eventLog.slice(-10).map((idx, i) => (
                  <div key={i} style={{
                    fontSize: 11, 
                    fontFamily: 'var(--font-mono)', 
                    color: idx.type === 'HIT' ? 'var(--text)' : 'var(--fault)',
                    borderLeft: `2px solid ${idx.type === 'HIT' ? '#3fb950' : '#f85149'}`,
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
