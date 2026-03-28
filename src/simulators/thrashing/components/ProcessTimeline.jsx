import React from 'react';

export default function ProcessTimeline({ cpuUtilization, processCount, isThrashing }) {
  // Using an SVG path to represent the current dot on the assumed static curve
  const cx = 30 + (processCount * 12.5); // Range up to 280 (20 * 12.5 = 250 + 30)
  const cy = 130 - (cpuUtilization * 1.2); // Range up to 10 (100 * 1.2 = 120, 130-120=10)

  return (
    <div className="placeholder-chart" style={{position:'relative'}}>
      <svg viewBox="0 0 300 150" style={{ width: '100%', height: 150 }}>
        <line x1="30" y1="130" x2="280" y2="130" stroke="var(--border2)" strokeWidth="1" />
        <line x1="30" y1="10" x2="30" y2="130" stroke="var(--border2)" strokeWidth="1" />
        
        {/* Draw a static curve of what typical thrashing looks like for reference */}
        <path
          d="M30,120 C60,100 90,60 130,30 C160,15 180,20 200,50 C240,110 270,120 280,120"
          fill="none"
          stroke="var(--border)"
          strokeDasharray="4 4"
          strokeWidth="1"
        />

        {/* The actual dot showing current state */}
        <circle cx={cx} cy={cy} r="6" fill={isThrashing ? "var(--fault)" : "var(--hit)"} />
        <line x1={cx} y1={cy} x2={cx} y2="130" stroke={isThrashing ? "var(--fault)" : "var(--hit)"} strokeWidth="1" strokeDasharray="2 2" />
        
        {isThrashing && (
            <>
                <text x="140" y="20" fill="var(--fault)" fontSize="10" fontWeight="bold">THRASHING REGION</text>
            </>
        )}

        <text x="155" y="145" fill="var(--text3)" fontSize="8">
          Degree of Multiprogramming
        </text>
        <text x="10" y="70" fill="var(--text3)" fontSize="8" transform="rotate(-90, 10, 70)">
          CPU %
        </text>
      </svg>
    </div>
  );
}

