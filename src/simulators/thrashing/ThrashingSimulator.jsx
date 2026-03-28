import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Zap } from 'lucide-react';
import WorkingSetMonitor from './components/WorkingSetMonitor';
import PageFaultRateChart from './components/PageFaultRateChart';
import ProcessTimeline from './components/ProcessTimeline';
import MultiprogrammingLevel from './components/MultiprogrammingLevel';
import { useThrashing } from './hooks/useThrashing';

export default function ThrashingSimulator() {
  const {
    processCount, setProcessCount,
    frameCount, setFrameCount,
    processes,
    totalWss,
    cpuUtilization,
    pageFaultRate,
    isThrashing,
    thrashingRatio
  } = useThrashing();

  return (
    <div className="placeholder-simulator">
      <motion.header className="simulator-hero" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="simulator-hero-icon flex items-center justify-center text-white" style={{ background: isThrashing ? 'linear-gradient(135deg, #f85149, #5a1a18)' : 'linear-gradient(135deg, #3fb950, #1a4a22)' }}>
          {isThrashing ? <AlertTriangle size={28} /> : <Zap size={28} />}
        </div>
        <div>
          <h1 className="simulator-hero-title">Thrashing Visualization</h1>
          <p className="simulator-hero-sub">Working Set Analysis &amp; CPU Utilization</p>
        </div>
      </motion.header>

      <div className="placeholder-layout">
        <aside className="placeholder-sidebar">
          <div className="placeholder-config">
            <h3>Configuration</h3>
            <label><span>Multiprogramming Level (Processes)</span><input type="range" value={processCount} min={2} max={20} onChange={(e) => setProcessCount(Number(e.target.value))} /> <span style={{marginLeft:8,fontWeight:600}}>{processCount}</span></label>
            <label><span>Physical Frames</span><input type="range" value={frameCount} min={20} max={100} onChange={(e) => setFrameCount(Number(e.target.value))} /> <span style={{marginLeft:8,fontWeight:600}}>{frameCount}</span></label>
          </div>

          <div style={{ padding: '16px 0' }}>
            <MultiprogrammingLevel level={processCount} maxLevel={20} />
          </div>
        </aside>

        <main className="placeholder-main">
          <div className="placeholder-panels">
            <motion.div className="placeholder-panel wide" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
               <h4>CPU Utilization vs Degree of Multiprogramming</h4>
               <ProcessTimeline cpuUtilization={cpuUtilization} processCount={processCount} isThrashing={isThrashing} />
            </motion.div>

            <motion.div className="placeholder-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h4>Working Set Size</h4>
              <WorkingSetMonitor processes={processes} isThrashing={isThrashing} totalWss={totalWss} frameCount={frameCount} />
            </motion.div>

            <motion.div className="placeholder-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h4>Page Fault Rate</h4>
              <PageFaultRateChart pageFaultRate={pageFaultRate} isThrashing={isThrashing} />
            </motion.div>
          </div>
        </main>

        <aside className="placeholder-sidebar right">
          <div className="placeholder-stats">
            <h3>Metrics</h3>
            <div className="placeholder-stat"><span>CPU Utilization</span><span style={{ color: isThrashing ? 'var(--fault)' : '#3fb950', fontSize: 18 }}>{cpuUtilization}%</span></div>
            <div className="placeholder-stat"><span>Page Fault Rate</span><span style={{ color: isThrashing ? '#f85149' : 'var(--text)', fontSize: 18 }}>{pageFaultRate}/s</span></div>
            <div className="placeholder-stat"><span>Total WSS</span><span style={{ color: 'var(--text)' }}>{totalWss} Frames</span></div>
            <div className="placeholder-stat"><span>Status</span><span style={{ color: isThrashing ? 'var(--fault)' : 'var(--hit)', fontWeight: 600 }}>{isThrashing ? 'THRASHING' : 'Healthy'}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
