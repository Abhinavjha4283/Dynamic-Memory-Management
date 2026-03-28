// Number and text formatting utilities

/**
 * Format a number as a percentage string
 */
export function formatPercent(value, decimals = 1) {
  if (typeof value !== 'number' || isNaN(value)) return '0.0%';
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format a number as a hex address string
 */
export function formatHexAddress(value, width = 4) {
  if (typeof value !== 'number') return '0x' + '0'.repeat(width);
  return '0x' + value.toString(16).toUpperCase().padStart(width, '0');
}

/**
 * Format memory size in human-readable form
 */
export function formatMemorySize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

/**
 * Format step number with zero padding
 */
export function formatStep(step, total) {
  const pad = String(total).length;
  return `${String(step).padStart(pad, '0')}/${String(total).padStart(pad, '0')}`;
}

/**
 * Pad a number with zeros
 */
export function zeroPad(num, width = 2) {
  return String(num).padStart(width, '0');
}

/**
 * Format a hit/fault rate as a fraction
 */
export function formatRate(hits, total) {
  if (total === 0) return '0/0 (0.0%)';
  const rate = ((hits / total) * 100).toFixed(1);
  return `${hits}/${total} (${rate}%)`;
}

/**
 * Format locality level to display text
 */
export function formatLocality(level) {
  switch (level) {
    case 'HIGH': return 'High Locality';
    case 'MEDIUM': return 'Moderate';
    case 'LOW': return 'Low Locality';
    default: return 'Unknown';
  }
}

/**
 * Clamp a value between min and max
 */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Format an address with segment:offset notation
 */
export function formatSegmentAddress(segment, offset) {
  return `${segment}:${formatHexAddress(offset, 4)}`;
}
