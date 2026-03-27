import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
} from 'recharts';

/** Read computed CSS variable values so Recharts SVG attrs work with themes */
function useThemeColors() {
  const [colors, setColors] = useState({});
  const read = useCallback(() => {
    const s = getComputedStyle(document.documentElement);
    setColors({
      text: s.getPropertyValue('--text').trim() || '#e6edf3',
      text2: s.getPropertyValue('--text2').trim() || '#8b949e',
      text3: s.getPropertyValue('--text3').trim() || '#484f58',
      border: s.getPropertyValue('--border').trim() || '#21262d',
      border2: s.getPropertyValue('--border2').trim() || '#30363d',
      bg2: s.getPropertyValue('--bg2').trim() || '#0d1117',
      bg3: s.getPropertyValue('--bg3').trim() || '#161b22',
      glass: s.getPropertyValue('--glass').trim() || 'rgba(22,27,34,0.95)',
    });
  }, []);
  useEffect(() => {
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
    return () => observer.disconnect();
  }, [read]);
  return colors;
}

function MetricCard({ label, value, color, sub, bar, barColor }) {
  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <motion.div
        className="metric-value"
        style={{ color }}
        key={value}
        initial={{ rotateX: -30, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {value}
      </motion.div>
      {bar !== undefined && (
        <div className="metric-bar">
          <div
            className="metric-bar-fill"
            style={{ width: `${Math.min(bar * 100, 100)}%`, background: barColor || color }}
          />
        </div>
      )}
      {sub && <div className="metric-sub">{sub}</div>}
    </div>
  );
}

function FaultChart({ faultHistory, algoColor, themeColors }) {
  if (faultHistory.length === 0) {
    return (
      <div className="fault-chart-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text4)' }}>
        No data yet
      </div>
    );
  }

  return (
    <div className="fault-chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={faultHistory} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="faultGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--fault)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--fault)" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="hitGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--hit)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--hit)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="step"
            tick={{ fontSize: 9, fontFamily: 'var(--font-mono)', fill: themeColors.text3 }}
            axisLine={{ stroke: themeColors.border }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 9, fontFamily: 'var(--font-mono)', fill: themeColors.text3 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: themeColors.glass,
              border: `1px solid ${themeColors.border2}`,
              borderRadius: 8,
              backdropFilter: 'blur(12px)',
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              color: themeColors.text,
            }}
            labelStyle={{ color: themeColors.text2 }}
          />
          <Area
            type="monotone"
            dataKey="faults"
            stroke="#f85149"
            strokeWidth={2}
            fill="url(#faultGrad)"
            name="Faults"
            dot={false}
            activeDot={{ r: 4, fill: '#f85149' }}
          />
          <Area
            type="monotone"
            dataKey="hits"
            stroke="#3fb950"
            strokeWidth={2}
            fill="url(#hitGrad)"
            name="Hits"
            dot={false}
            activeDot={{ r: 4, fill: '#3fb950' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function AlgoRadarChart({ allResults, themeColors }) {
  if (!allResults) return null;

  const maxFaults = Math.max(
    allResults.FIFO.faults,
    allResults.LRU.faults,
    allResults.OPT.faults,
    1
  );
  const totalSteps = allResults.FIFO.steps.length || 1;

  const data = [
    {
      metric: 'Hit Rate',
      FIFO: allResults.FIFO.hitRate * 100,
      LRU: allResults.LRU.hitRate * 100,
      OPT: allResults.OPT.hitRate * 100,
    },
    {
      metric: 'Low Faults',
      FIFO: ((1 - allResults.FIFO.faults / totalSteps) * 100),
      LRU: ((1 - allResults.LRU.faults / totalSteps) * 100),
      OPT: ((1 - allResults.OPT.faults / totalSteps) * 100),
    },
    {
      metric: 'Efficiency',
      FIFO: (allResults.FIFO.hitRate / Math.max(allResults.OPT.hitRate, 0.01)) * 100,
      LRU: (allResults.LRU.hitRate / Math.max(allResults.OPT.hitRate, 0.01)) * 100,
      OPT: 100,
    },
    {
      metric: 'Predictability',
      FIFO: 90,
      LRU: 70,
      OPT: 40,
    },
    {
      metric: 'Simplicity',
      FIFO: 95,
      LRU: 60,
      OPT: 20,
    },
  ];

  return (
    <div className="radar-chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 16, right: 32, bottom: 16, left: 32 }}>
          <PolarGrid stroke={themeColors.border} />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fontSize: 9, fontFamily: 'var(--font-mono)', fill: themeColors.text2 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="FIFO"
            dataKey="FIFO"
            stroke="#2f81f7"
            fill="#2f81f7"
            fillOpacity={0.1}
            strokeWidth={2}
          />
          <Radar
            name="LRU"
            dataKey="LRU"
            stroke="#a371f7"
            fill="#a371f7"
            fillOpacity={0.1}
            strokeWidth={2}
          />
          <Radar
            name="OPT"
            dataKey="OPT"
            stroke="#39c5cf"
            fill="#39c5cf"
            fillOpacity={0.1}
            strokeWidth={2}
          />
          <Legend
            wrapperStyle={{
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

function EventLog({ eventLog, isPlaying }) {
  const logRef = React.useRef(null);

  React.useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [eventLog.length]);

  const exportLog = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('DMMVisualiser — Simulation Report', 14, 20);

    // Timestamp
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

    // Summary stats
    const faults = eventLog.filter((e) => e.type === 'FAULT').length;
    const hits = eventLog.filter((e) => e.type === 'HIT').length;
    const evictions = eventLog.filter((e) => e.type === 'EVICT').length;
    const total = faults + hits;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40);
    doc.text('Summary', 14, 38);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Steps: ${total}`, 14, 46);
    doc.text(`Page Faults: ${faults}`, 14, 52);
    doc.text(`Cache Hits: ${hits}`, 80, 52);
    doc.text(`Evictions: ${evictions}`, 140, 52);
    doc.text(`Hit Rate: ${total > 0 ? ((hits / total) * 100).toFixed(1) : 0}%`, 14, 58);

    // Divider
    doc.setDrawColor(200);
    doc.line(14, 63, 196, 63);

    // Event log table
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Event Log', 14, 71);

    // Table header
    let y = 78;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(240, 240, 240);
    doc.rect(14, y - 4, 182, 8, 'F');
    doc.setTextColor(60);
    doc.text('Step', 16, y);
    doc.text('Type', 36, y);
    doc.text('Page', 62, y);
    doc.text('Details', 82, y);
    y += 8;

    // Table rows
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    eventLog.forEach((entry) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }

      // Row color based on type
      if (entry.type === 'FAULT') doc.setTextColor(220, 60, 50);
      else if (entry.type === 'HIT') doc.setTextColor(50, 160, 70);
      else if (entry.type === 'EVICT') doc.setTextColor(190, 140, 30);
      else doc.setTextColor(60);

      doc.text(String(entry.step).padStart(2, '0'), 16, y);
      doc.text(entry.type, 36, y);
      doc.text(String(entry.page), 62, y);
      doc.setTextColor(80);
      doc.text(entry.details, 82, y);
      y += 6;
    });

    // Footer
    doc.setFontSize(7);
    doc.setTextColor(160);
    doc.text('DMMVisualiser — Dynamic Memory Management Visualiser', 14, 290);

    doc.save('dmm-simulation-report.pdf');
  };

  return (
    <>
      <div className="event-log-header">
        <span className="panel-section-title" style={{ margin: 0 }}>Event Log</span>
        <div className="live-indicator">
          <div className={`live-dot ${isPlaying ? 'active' : ''}`} />
          {isPlaying ? 'LIVE' : 'PAUSED'}
        </div>
      </div>

      <div className="event-log-container" ref={logRef}>
        <AnimatePresence initial={false}>
          {eventLog.slice(-50).map((entry, i) => (
            <motion.div
              key={`${entry.step}-${entry.type}-${i}`}
              className={`event-entry ${entry.type.toLowerCase()}`}
              initial={{ opacity: 0, y: -12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <span className="event-step">[{String(entry.step).padStart(2, '0')}]</span>
              <span className={`event-type ${entry.type.toLowerCase()}`}>
                {entry.type === 'HIT' ? '✓' : entry.type === 'EVICT' ? '↗' : '⚠'}{' '}
                {entry.type}
              </span>
              <span className="event-details">
                page:{entry.page} {entry.details}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="event-log-actions">
        <button className="ref-action-btn" onClick={exportLog}>
          Export PDF
        </button>
      </div>
    </>
  );
}

function ComparisonTable({ allResults }) {
  if (!allResults) return null;

  const algos = [
    { name: 'FIFO', color: 'var(--fifo)', data: allResults.FIFO },
    { name: 'LRU', color: 'var(--lru)', data: allResults.LRU },
    { name: 'OPT', color: 'var(--opt)', data: allResults.OPT },
  ];

  const bestFaults = Math.min(...algos.map((a) => a.data.faults));

  return (
    <table className="comparison-table">
      <thead>
        <tr>
          <th>Algorithm</th>
          <th>Faults</th>
          <th>Hits</th>
          <th>Hit Rate</th>
        </tr>
      </thead>
      <tbody>
        {algos.map((algo) => (
          <tr
            key={algo.name}
            className={algo.data.faults === bestFaults ? 'best' : ''}
          >
            <td style={{ color: algo.color }}>
              {algo.data.faults === bestFaults ? '★ ' : ''}{algo.name}
            </td>
            <td>{algo.data.faults}</td>
            <td>{algo.data.hits}</td>
            <td>{(algo.data.hitRate * 100).toFixed(1)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Recommendation({ recommendation }) {
  if (!recommendation) return null;

  return (
    <div className="recommendation-card">
      <div className="recommendation-title">Recommendation</div>
      <div className="recommendation-text">
        Best algorithm: <span className="recommendation-highlight">{recommendation.best}</span>
        <br />
        <br />
        {recommendation.suggestion}
      </div>
    </div>
  );
}

export default function StatsPanel({
  currentStep,
  currentStepData,
  faultHistory,
  allResults,
  algorithm,
  algoColor,
  efficiencyGrade,
  thrashingInfo,
  eventLog,
  isPlaying,
  referenceString,
  frameCount,
  recommendation,
  beladyAnomaly,
  isLoaded,
}) {
  const themeColors = useThemeColors();
  const faultCount = currentStepData ? currentStepData.faults : 0;
  const hitCount = currentStepData ? currentStepData.hits : 0;
  const hitRate = currentStep > 0 ? hitCount / currentStep : 0;

  const faultDelta = useMemo(() => {
    if (currentStep <= 1 || !currentStepData) return 0;
    const prevStep = allResults?.[algorithm]?.steps[currentStep - 2];
    if (!prevStep) return 0;
    return currentStepData.faults - prevStep.faults;
  }, [currentStep, currentStepData, allResults, algorithm]);

  return (
    <div className="panel stats-panel">
      {/* Metric Cards */}
      <div className="panel-section">
        <div className="metrics-grid">
          <MetricCard
            label="Page Faults"
            value={faultCount}
            color="var(--fault)"
            sub={faultDelta > 0 ? `▲ +${faultDelta} from prev` : currentStep > 0 ? '● no change' : ''}
          />
          <MetricCard
            label="Cache Hits"
            value={hitCount}
            color="var(--hit)"
            bar={hitRate}
            barColor="var(--hit)"
            sub={`${(hitRate * 100).toFixed(1)}%`}
          />
          <MetricCard
            label="Efficiency"
            value={efficiencyGrade}
            color={
              efficiencyGrade.startsWith('A')
                ? 'var(--hit)'
                : efficiencyGrade.startsWith('B')
                ? 'var(--fifo)'
                : efficiencyGrade.startsWith('C')
                ? 'var(--evict)'
                : 'var(--fault)'
            }
            sub={allResults ? `vs OPT: ${allResults.OPT.faults}F` : ''}
          />
          <MetricCard
            label="Thrashing"
            value={thrashingInfo.index.toFixed(2)}
            color={thrashingInfo.thrashing ? 'var(--thrash)' : 'var(--text2)'}
            sub={thrashingInfo.thrashing ? '⚠ THRASHING' : '◉ NORMAL'}
          />
        </div>
      </div>

      {/* Belady's Anomaly Warning */}
      {beladyAnomaly && (
        <div className="panel-section" style={{ padding: '8px 16px' }}>
          <div className="thrashing-warning" style={{ background: 'rgba(248, 81, 73, 0.1)', borderColor: 'var(--fault-dim)' }}>
            <span style={{ color: 'var(--fault)' }}>
              ⚠ <strong>Belady's Anomaly detected!</strong> Adding more frames could increase faults with FIFO.
            </span>
          </div>
        </div>
      )}

      {/* Fault Chart */}
      <div className="panel-section">
        <div className="panel-section-title">Fault Accumulation</div>
        <FaultChart faultHistory={faultHistory} algoColor={algoColor} themeColors={themeColors} />
      </div>

      {/* Comparison Table */}
      {isLoaded && (
        <div className="panel-section">
          <div className="panel-section-title">Algorithm Comparison</div>
          <ComparisonTable allResults={allResults} />
        </div>
      )}

      {/* Radar Chart */}
      {isLoaded && allResults && (
        <div className="panel-section">
          <div className="panel-section-title">Performance Analysis</div>
          <AlgoRadarChart allResults={allResults} themeColors={themeColors} />
        </div>
      )}

      {/* Recommendation */}
      {recommendation && (
        <div className="panel-section">
          <Recommendation recommendation={recommendation} />
        </div>
      )}

      {/* Event Log */}
      <div className="panel-section" style={{ flex: 1 }}>
        <EventLog eventLog={eventLog} isPlaying={isPlaying} />
      </div>
    </div>
  );
}
