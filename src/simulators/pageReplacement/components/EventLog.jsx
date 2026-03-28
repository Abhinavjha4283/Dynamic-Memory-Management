import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EventLog({ eventLog, isPlaying }) {
  const logRef = React.useRef(null);

  React.useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [eventLog.length]);

  const exportLog = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('DMMVisualiser — Simulation Report', 14, 20);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

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

    doc.setDrawColor(200);
    doc.line(14, 63, 196, 63);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Event Log', 14, 71);

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

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    eventLog.forEach((entry) => {
      if (y > 280) { doc.addPage(); y = 20; }
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
              <span className="event-details">page:{entry.page} {entry.details}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="event-log-actions">
        <button className="ref-action-btn" onClick={exportLog}>Export PDF</button>
      </div>
    </>
  );
}
