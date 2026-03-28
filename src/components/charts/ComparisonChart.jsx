import React from 'react';

/**
 * Algorithm comparison table component.
 *
 * @param {Array} algorithms - Array of { name, color, faults, hits, hitRate }
 * @param {string} highlightMetric - Which metric determines "best" ('faults' or 'hitRate')
 */
export default function ComparisonChart({
  algorithms = [],
  highlightMetric = 'faults',
}) {
  if (algorithms.length === 0) return null;

  const bestValue = highlightMetric === 'faults'
    ? Math.min(...algorithms.map((a) => a.faults))
    : Math.max(...algorithms.map((a) => a.hitRate));

  const isBest = (algo) => {
    if (highlightMetric === 'faults') return algo.faults === bestValue;
    return algo.hitRate === bestValue;
  };

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
        {algorithms.map((algo) => (
          <tr key={algo.name} className={isBest(algo) ? 'best' : ''}>
            <td style={{ color: algo.color }}>
              {isBest(algo) ? '★ ' : ''}
              {algo.name}
            </td>
            <td>{algo.faults}</td>
            <td>{algo.hits}</td>
            <td>{(algo.hitRate * 100).toFixed(1)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
