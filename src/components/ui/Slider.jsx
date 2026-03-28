import React from 'react';

/**
 * Custom slider with label and value display.
 */
export default function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  displayValue,
  leftLabel,
  rightLabel,
  className = '',
}) {
  return (
    <div className={`ui-slider ${className}`}>
      {(label || displayValue) && (
        <div className="ui-slider-header">
          {label && <span className="ui-slider-label">{label}</span>}
          {displayValue && <span className="ui-slider-value">{displayValue}</span>}
        </div>
      )}
      <input
        type="range"
        className="ui-slider-input"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
      />
      {(leftLabel || rightLabel) && (
        <div className="ui-slider-labels">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      )}
    </div>
  );
}
