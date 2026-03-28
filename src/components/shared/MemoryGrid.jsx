import React from 'react';

/**
 * Generic memory grid layout for displaying cells.
 *
 * @param {React.ReactNode} children - Cell components
 * @param {number} columns - Number of columns (0 for auto-fit)
 * @param {number} gap - Gap in pixels
 * @param {string} minCellWidth - CSS min width for auto-fit
 */
export default function MemoryGrid({
  children,
  columns = 0,
  gap = 12,
  minCellWidth = '120px',
  className = '',
  style = {},
}) {
  const gridStyle = columns > 0
    ? { gridTemplateColumns: `repeat(${columns}, 1fr)` }
    : { gridTemplateColumns: `repeat(auto-fit, minmax(${minCellWidth}, 1fr))` };

  return (
    <div
      className={`memory-grid ${className}`}
      style={{
        display: 'grid',
        gap: `${gap}px`,
        justifyItems: 'center',
        ...gridStyle,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
