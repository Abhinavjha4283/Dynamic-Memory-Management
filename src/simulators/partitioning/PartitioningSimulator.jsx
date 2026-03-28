import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import MemoryPartitions from './components/MemoryPartitions';
import ProcessQueue from './components/ProcessQueue';
import AllocationVisualizer from './components/AllocationVisualizer';
import FragmentationAnalysis from './components/FragmentationAnalysis';
import { usePartitioning } from './hooks/usePartitioning';
import EventLogEntry from '../../components/shared/EventLogEntry';

export default function PartitioningSimulator() {
  const sim = usePartitioning();

  const algorithms = ['First Fit', 'Best Fit', 'Worst Fit', 'Next Fit'];

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
          if (!e.ctrlKey && !e.metaKey) s.reset();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="placeholder-simulator">
      <motion.header className="simulator-hero" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="simulator-hero-icon flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #d29922, #5a3e0a)' }}>
          <Layers size={28} />
        </div>
        <div>
          <h1 className="simulator-hero-title">Dynamic Partitioning</h1>
          <p className="simulator-hero-sub">First Fit, Best Fit, Worst Fit &amp; Next Fit</p>
        </div>
      </motion.header>

      <div className="placeholder-layout">
        <aside className="placeholder-sidebar">
          <div className="placeholder-config">
            <h3>Algorithm</h3>
            {algorithms.map((algo) => (
              <div
                key={algo}
                className="placeholder-algo-option"
                onClick={() => sim.setAlgorithm(algo)}
                style={sim.algorithm === algo ? { borderColor: '#d29922', background: 'var(--bg4)', color: '#d29922' } : {}}
              >
                {algo}
              </div>
            ))}

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
              <button className="ref-action-btn" onClick={() => sim.reset()}>
                ↺ Reset
              </button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 10, color: 'var(--text3)' }}>{sim.currentStep} / {sim.totalSteps} STEPS</span>
              <div className="metric-bar">
                <div className="metric-bar-fill" style={{ width: `${sim.progress}%`, background: '#d29922' }} />
              </div>
            </div>

            <h3 style={{ marginTop: 16 }}>Pending Queue</h3>
            <ProcessQueue processes={sim.processQueue} />

            <AllocationVisualizer algorithm={sim.algorithm} />
          </div>
        </aside>

        <main className="placeholder-main">
          <div className="placeholder-panels" style={{ gridTemplateColumns: '1fr' }}>
            <motion.div className="placeholder-panel wide" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h4>Memory Partitions</h4>
                <div style={{ fontSize: 13, color: 'var(--text3)' }}>CAPACITY: {sim.utilization}% ({sim.allocatedMemory}/{sim.totalMemory} KB)</div>
              </div>
              <MemoryPartitions partitions={sim.partitions} />
            </motion.div>

            <motion.div className="placeholder-panel wide" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h4>Event Log</h4>
                <div style={{ fontSize: 12, color: sim.isPlaying ? 'var(--hit)' : 'var(--text2)' }}>
                  {sim.isPlaying ? '● LIVE' : '○ PAUSED'}
                </div>
              </div>
              <div style={{ 
                maxHeight: 200, 
                overflowY: 'auto', 
                background: 'var(--bg2)', 
                padding: 12, 
                borderRadius: 6,
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8 
              }}>
                {sim.eventLog.length === 0 ? <div style={{color:'var(--text3)', fontSize:12}}>No events yet. Press step or play to begin.</div> : null}
                {sim.eventLog.slice(-10).map((idx, i) => (
                  <div key={i} style={{
                    fontSize: 12, 
                    fontFamily: 'var(--font-mono)', 
                    color: idx.type === 'ALLOC' ? 'var(--text)' : 'var(--evict)',
                    borderLeft: `2px solid ${idx.type === 'ALLOC' ? '#2f81f7' : '#d29922'}`,
                    paddingLeft: 8
                  }}>
                    <span style={{ color: 'var(--text3)' }}>[{idx.step}]</span> {idx.type}: {idx.details}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </main>

        <aside className="placeholder-sidebar right">
          <div className="placeholder-stats">
            <h3>Statistics</h3>
            <div className="placeholder-stat"><span>Total Memory</span><span>{sim.totalMemory} KB</span></div>
            <div className="placeholder-stat"><span>Allocated</span><span style={{ color: 'var(--hit)' }}>{sim.allocatedMemory} KB</span></div>
            <div className="placeholder-stat"><span>Free</span><span style={{ color: 'var(--text)' }}>{sim.freeMemory} KB</span></div>
            <div className="placeholder-stat"><span>Utilization</span><span style={{ color: '#d29922' }}>{sim.utilization}%</span></div>
          </div>
          
          <div className="placeholder-stats" style={{ marginTop: 16 }}>
            <h3>Fragmentation</h3>
            <FragmentationAnalysis
              external={{ amount: sim.freeMemory, percent: Math.round((sim.freeMemory / sim.totalMemory) * 100) }}
              internal={{ amount: 0, percent: 0 }}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
