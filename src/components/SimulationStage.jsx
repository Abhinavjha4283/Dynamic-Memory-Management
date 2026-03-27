import React, { useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function FrameCell({ index, page, animState, algorithm, stepData, currentStep, referenceString, algoColor, frameCount }) {
  const isEmpty = page === null;
  const isHit = animState === 'hit';
  const isFault = animState === 'fault';

  let metaText = '';
  let agePercent = 0;

  if (!isEmpty && stepData) {
    if (algorithm === 'FIFO') {
      const queue = stepData.queue || [];
      const pos = queue.indexOf(page);
      if (pos !== -1) {
        metaText = `QUEUE:${pos + 1}`;
        agePercent = ((pos + 1) / frameCount) * 100;
      }
    } else if (algorithm === 'LRU') {
      const ts = stepData.timestamps;
      if (ts && ts.get(page) !== undefined) {
        const age = currentStep - ts.get(page);
        metaText = `AGE:${age}`;
        agePercent = Math.min((age / Math.max(currentStep, 1)) * 100 * 3, 100);
      }
    } else if (algorithm === 'OPT') {
      const nextUseIdx = referenceString.indexOf(page, currentStep);
      if (nextUseIdx === -1) {
        metaText = 'NEXT:∞';
        agePercent = 100;
      } else {
        const dist = nextUseIdx - currentStep + 1;
        metaText = `NEXT:+${dist}`;
        agePercent = Math.min((dist / referenceString.length) * 100 * 2, 100);
      }
    }
  }

  const animVariants = {
    idle: {
      backgroundColor: 'var(--bg3)',
      borderColor: isEmpty ? 'var(--border)' : 'var(--border)',
      scale: 1,
      boxShadow: '0 0 0 transparent',
      rotate: 0,
      y: 0,
    },
    hit: {
      backgroundColor: 'var(--hit-dim)',
      borderColor: 'var(--hit)',
      scale: 1.05,
      boxShadow: '0 0 24px var(--hit-glow)',
      rotate: 0,
      y: 0,
    },
    fault: {
      backgroundColor: 'var(--fault-dim)',
      borderColor: 'var(--fault)',
      scale: 1.08,
      boxShadow: '0 0 32px var(--fault-glow)',
      rotate: 0,
      y: 0,
    },
  };

  const currentVariant = isHit ? 'hit' : isFault ? 'fault' : 'idle';

  return (
    <motion.div
      className={`frame-cell ${isEmpty ? 'empty' : ''} ${!animState ? 'breathing' : ''}`}
      variants={animVariants}
      animate={currentVariant}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      layout
    >
      <div className="frame-cell-header">
        <span className="frame-index">F{index}</span>
        {(isHit || isFault) && (
          <motion.span
            className="frame-activity"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            style={{ color: isHit ? 'var(--hit)' : 'var(--fault)' }}
          >
            ⚡
          </motion.span>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={page ?? 'empty'}
          className={`frame-page ${isEmpty ? 'empty-dash' : ''}`}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          {isEmpty ? '—' : page}
        </motion.div>
      </AnimatePresence>

      {!isEmpty && (
        <>
          <div className="frame-meta">{metaText}</div>
          <div className="frame-age-bar">
            <motion.div
              className="frame-age-fill"
              style={{ background: algoColor }}
              animate={{ width: `${agePercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </>
      )}

      <span className={`frame-status ${isEmpty ? 'empty-status' : 'resident'}`}>
        {isEmpty ? 'EMPTY' : 'RESIDENT'}
      </span>
    </motion.div>
  );
}

const MemoizedFrameCell = React.memo(FrameCell, (prev, next) => {
  return (
    prev.page === next.page &&
    prev.animState === next.animState &&
    prev.currentStep === next.currentStep &&
    prev.algorithm === next.algorithm
  );
});

function VirtualMemoryView({ referenceString, currentFrames, currentStep, algoColor }) {
  const allPages = useMemo(() => {
    const pages = [...new Set(referenceString)].sort((a, b) => a - b);
    return pages;
  }, [referenceString]);

  const currentPage = currentStep > 0 ? referenceString[currentStep - 1] : null;

  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
      {allPages.map((page) => {
        const isLoaded = currentFrames.includes(page);
        const isCurrent = page === currentPage;

        return (
          <motion.div
            key={page}
            animate={{
              boxShadow: isCurrent
                ? `0 0 16px ${algoColor}88`
                : '0 0 0 transparent',
              borderColor: isCurrent
                ? algoColor
                : isLoaded
                ? 'var(--hit)'
                : 'var(--border)',
            }}
            transition={{ duration: 0.3 }}
            style={{
              width: 52,
              height: 52,
              background: isLoaded ? 'var(--bg4)' : 'var(--bg3)',
              border: '1px solid',
              borderRadius: 6,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: 3,
                right: 5,
                fontFamily: 'var(--font-mono)',
                fontSize: 7,
                color: 'var(--text4)',
                textTransform: 'uppercase',
              }}
            >
              V
            </span>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 18,
                fontWeight: 700,
                color: isCurrent ? algoColor : 'var(--text)',
              }}
            >
              {page}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 7,
                color: isLoaded ? 'var(--hit)' : 'var(--text4)',
                textTransform: 'uppercase',
                marginTop: 1,
              }}
            >
              {isLoaded ? 'LOADED' : 'NOT RES.'}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

function TimelineChip({ page, index, currentStep, stepData, algoColor, onClick }) {
  const isPast = index < currentStep;
  const isCurrent = index === currentStep - 1;
  const isFuture = index >= currentStep;

  let outcome = null;
  if (isPast || isCurrent) {
    outcome = stepData?.type;
  }

  const chipClass = isCurrent ? 'current' : isFuture ? 'future' : '';

  return (
    <motion.div
      className="timeline-chip"
      onClick={() => onClick(index + 1)}
      initial={false}
      animate={{
        opacity: isFuture ? 0.4 : 1,
        scale: isCurrent ? 1.1 : 1,
      }}
      transition={{ duration: 0.2 }}
      style={{ cursor: isPast || isCurrent ? 'pointer' : 'default' }}
    >
      <div
        className={`timeline-chip-box ${chipClass}`}
        style={{
          borderColor: isCurrent ? algoColor : undefined,
          boxShadow: isCurrent ? `0 0 16px ${algoColor}44` : undefined,
        }}
      >
        {page}
      </div>
      {outcome ? (
        <>
          <div
            className="timeline-outcome-dot"
            style={{
              background: outcome === 'HIT' ? 'var(--hit)' : 'var(--fault)',
            }}
          />
          <span
            className="timeline-outcome-label"
            style={{
              color: outcome === 'HIT' ? 'var(--hit)' : 'var(--fault)',
            }}
          >
            {outcome}
          </span>
        </>
      ) : (
        <div style={{ height: 22 }} />
      )}
    </motion.div>
  );
}

function LocalityHeatmap({ referenceString, currentStep }) {
  const cells = useMemo(() => {
    const lastSeen = new Map();
    return referenceString.map((page, i) => {
      let heat = 0;
      if (lastSeen.has(page)) {
        const dist = i - lastSeen.get(page);
        heat = Math.max(0, 1 - dist / 8);
      }
      lastSeen.set(page, i);
      return { heat, active: i < currentStep };
    });
  }, [referenceString, currentStep]);

  return (
    <div className="locality-heatmap">
      {cells.map((cell, i) => (
        <div
          key={i}
          className="locality-cell"
          style={{
            background: cell.active
              ? `hsl(${120 * cell.heat}, 70%, ${20 + cell.heat * 30}%)`
              : 'var(--bg3)',
            opacity: cell.active ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  );
}

function PageTableView({ pageTableData, currentStepData, algorithm, algoColor }) {
  const currentPage = currentStepData?.page;

  return (
    <table className="page-table">
      <thead>
        <tr>
          <th>VPN</th>
          <th>Frame</th>
          <th>Valid</th>
          <th>{algorithm === 'FIFO' ? 'Queue' : algorithm === 'LRU' ? 'Time' : 'Next'}</th>
        </tr>
      </thead>
      <tbody>
        {pageTableData.map((row) => (
          <tr
            key={row.vpn}
            className={row.vpn === currentPage ? 'current-row' : ''}
            style={
              row.vpn === currentPage
                ? { boxShadow: `inset 3px 0 0 ${algoColor}` }
                : undefined
            }
          >
            <td>{row.vpn}</td>
            <td>{row.frame !== null ? `F${row.frame}` : '—'}</td>
            <td>
              {row.valid ? (
                <span className="valid-check">✓</span>
              ) : (
                <span className="valid-x">✗</span>
              )}
            </td>
            <td>{row.meta}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TLBView({ tlb, tlbHits, tlbMisses }) {
  const entries = [...tlb];
  while (entries.length < 4) entries.push(null);

  return (
    <div>
      <div className="sim-section-header">
        <span className="sim-section-title">TLB ({tlbHits}H / {tlbMisses}M)</span>
      </div>
      <div className="tlb-grid">
        {entries.map((entry, i) => (
          <motion.div
            key={i}
            className={`tlb-entry ${!entry ? 'empty' : ''}`}
            layout
            initial={false}
            animate={{ opacity: entry ? 1 : 0.4 }}
          >
            <span>V:{entry ? entry.vpn : '—'}</span>
            <span>F:{entry ? entry.frame : '—'}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ConnectionLines({ currentFrames, referenceString, algoColor }) {
  const allPages = useMemo(() => [...new Set(referenceString)].sort((a, b) => a - b), [referenceString]);

  const connections = useMemo(() => {
    const conns = [];
    currentFrames.forEach((page, frameIdx) => {
      if (page === null) return;
      const vpnIdx = allPages.indexOf(page);
      if (vpnIdx === -1) return;
      conns.push({ vpnIdx, frameIdx, page });
    });
    return conns;
  }, [currentFrames, allPages]);

  if (connections.length === 0) return null;

  const vpnCount = allPages.length;
  const frameCount = currentFrames.length;

  return (
    <svg
      style={{
        width: '100%',
        height: 40,
        overflow: 'visible',
      }}
    >
      {connections.map((conn, i) => {
        const startX = ((conn.vpnIdx + 0.5) / vpnCount) * 100;
        const endX = ((conn.frameIdx + 0.5) / frameCount) * 100;

        return (
          <g key={`${conn.page}-${conn.frameIdx}`}>
            <line
              x1={`${startX}%`}
              y1="0"
              x2={`${endX}%`}
              y2="40"
              stroke={algoColor}
              strokeWidth="1.5"
              strokeOpacity="0.35"
              strokeDasharray="4 3"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-14"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </line>
            <circle
              cx={`${startX}%`}
              cy="0"
              r="2.5"
              fill={algoColor}
              opacity="0.6"
            />
            <circle
              cx={`${endX}%`}
              cy="40"
              r="2.5"
              fill={algoColor}
              opacity="0.6"
            />
          </g>
        );
      })}
    </svg>
  );
}

export default function SimulationStage({
  referenceString,
  currentStep,
  currentFrames,
  currentStepData,
  frameCount,
  algorithm,
  algoColor,
  animatingFrames,
  allResults,
  isLoaded,
  locality,
  workingSet,
  timelineRef,
  pageTableData,
  tlb,
  tlbHits,
  tlbMisses,
  onStepClick,
}) {
  const currentResults = allResults ? allResults[algorithm] : null;
  const hitCount = currentStepData ? currentStepData.hits : 0;
  const faultCount = currentStepData ? currentStepData.faults : 0;
  const hitRate =
    currentStep > 0
      ? ((hitCount / currentStep) * 100).toFixed(1)
      : '0.0';
  const utilization = currentFrames.filter((f) => f !== null).length;

  // Auto-scroll timeline
  const timelineContainerRef = useRef(null);
  useEffect(() => {
    if (timelineContainerRef.current) {
      const container = timelineContainerRef.current;
      const chipWidth = 60;
      const scrollTo = Math.max(0, (currentStep - 1) * chipWidth - container.clientWidth / 2 + chipWidth / 2);
      container.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  }, [currentStep]);

  if (!isLoaded) {
    return (
      <div className="panel simulation-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text3)' }}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ opacity: 0.3, marginBottom: 16 }}>
            <rect x="4" y="12" width="24" height="24" rx="4" stroke="currentColor" strokeWidth="2" />
            <rect x="36" y="12" width="24" height="24" rx="4" stroke="currentColor" strokeWidth="2" />
            <rect x="4" y="40" width="24" height="12" rx="3" stroke="currentColor" strokeWidth="2" />
            <rect x="36" y="40" width="24" height="12" rx="3" stroke="currentColor" strokeWidth="2" />
            <line x1="16" y1="36" x2="48" y2="40" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
          </svg>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
            Initialize Simulation
          </div>
          <div style={{ fontSize: 13, color: 'var(--text3)' }}>
            Configure parameters and hit Initialize to begin
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="panel simulation-panel">
      {/* Virtual Address Space */}
      <div className="sim-section" style={{ flex: '0 0 auto' }}>
        <div className="sim-section-header">
          <span className="sim-section-title">Virtual Address Space</span>
          <span className="sim-section-info">
            PID:1337 · {new Set(referenceString).size} pages allocated
          </span>
        </div>
        <VirtualMemoryView
          referenceString={referenceString}
          currentFrames={currentFrames}
          currentStep={currentStep}
          algoColor={algoColor}
        />
      </div>

      {/* Connection Lines */}
      <div style={{ padding: '0 20px' }}>
        <ConnectionLines
          currentFrames={currentFrames}
          referenceString={referenceString}
          algoColor={algoColor}
        />
      </div>

      {/* Physical Frames */}
      <div className="sim-section" style={{ flex: '0 0 auto' }}>
        <div className="sim-section-header">
          <span className="sim-section-title">Physical Frames</span>
          <span className="sim-section-info">
            CAPACITY: {utilization}/{frameCount} · UTILIZATION: {frameCount > 0 ? Math.round((utilization / frameCount) * 100) : 0}%
          </span>
        </div>
        <div className="frames-grid">
          {currentFrames.map((page, i) => (
            <MemoizedFrameCell
              key={i}
              index={i}
              page={page}
              animState={animatingFrames[i]}
              algorithm={algorithm}
              stepData={currentStepData}
              currentStep={currentStep}
              referenceString={referenceString}
              algoColor={algoColor}
              frameCount={frameCount}
            />
          ))}
        </div>
      </div>

      {/* Page Table & TLB */}
      <div className="sim-section" style={{ flex: '0 0 auto' }}>
        <div className="sim-section-header">
          <span className="sim-section-title">Address Translation</span>
          <span className="sim-section-info">
            TLB: {tlbHits}H/{tlbMisses}M
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <PageTableView
              pageTableData={pageTableData}
              currentStepData={currentStepData}
              algorithm={algorithm}
              algoColor={algoColor}
            />
          </div>
          <div>
            <TLBView tlb={tlb} tlbHits={tlbHits} tlbMisses={tlbMisses} />
            {/* Working Set */}
            {currentStep > 0 && (
              <div style={{ marginTop: 12 }}>
                <div className="sim-section-title" style={{ marginBottom: 6 }}>Working Set</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {[...workingSet].map((p) => (
                    <motion.div
                      key={p}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      style={{
                        width: 28,
                        height: 28,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--bg4)',
                        border: `1px solid ${workingSet.size > frameCount ? 'var(--thrash)' : 'var(--working)'}`,
                        borderRadius: 4,
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        fontWeight: 600,
                        color: workingSet.size > frameCount ? 'var(--thrash)' : 'var(--working)',
                      }}
                    >
                      {p}
                    </motion.div>
                  ))}
                </div>
                {workingSet.size > frameCount && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      fontSize: 10,
                      color: 'var(--thrash)',
                      marginTop: 4,
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    ⚠ WSS ({workingSet.size}) &gt; frames ({frameCount})
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Locality Heatmap */}
      <div className="sim-section" style={{ flex: '0 0 auto', padding: '8px 20px' }}>
        <div className="sim-section-title" style={{ marginBottom: 4, fontSize: 9 }}>Temporal Locality</div>
        <LocalityHeatmap referenceString={referenceString} currentStep={currentStep} />
      </div>

      {/* Reference Timeline */}
      <div className="sim-section" style={{ flex: '1 1 auto', minHeight: 0 }}>
        <div className="sim-section-header">
          <span className="sim-section-title">Reference Timeline</span>
          <span className="sim-section-info">
            HIT RATE: {hitCount}/{currentStep} ({hitRate}%)
          </span>
        </div>
        <div className="timeline-strip" ref={timelineContainerRef}>
          {referenceString.map((page, i) => (
            <TimelineChip
              key={i}
              page={page}
              index={i}
              currentStep={currentStep}
              stepData={currentResults?.steps[i]}
              algoColor={algoColor}
              onClick={onStepClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
