import React, { useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

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
      animate={{ opacity: isFuture ? 0.4 : 1, scale: isCurrent ? 1.1 : 1 }}
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
          <div className="timeline-outcome-dot" style={{ background: outcome === 'HIT' ? 'var(--hit)' : 'var(--fault)' }} />
          <span className="timeline-outcome-label" style={{ color: outcome === 'HIT' ? 'var(--hit)' : 'var(--fault)' }}>
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

export default function ReferenceTimeline({
  referenceString, currentStep, currentResults, algoColor,
  hitCount, hitRate, onStepClick,
}) {
  const timelineContainerRef = useRef(null);

  useEffect(() => {
    if (timelineContainerRef.current) {
      const container = timelineContainerRef.current;
      const chipWidth = 60;
      const scrollTo = Math.max(0, (currentStep - 1) * chipWidth - container.clientWidth / 2 + chipWidth / 2);
      container.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  }, [currentStep]);

  return (
    <>
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
              key={i} page={page} index={i}
              currentStep={currentStep}
              stepData={currentResults?.steps[i]}
              algoColor={algoColor}
              onClick={onStepClick}
            />
          ))}
        </div>
      </div>
    </>
  );
}
