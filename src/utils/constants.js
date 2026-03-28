// App-wide constants

export const ALGORITHMS = {
  FIFO: 'FIFO',
  LRU: 'LRU',
  OPT: 'OPT',
};

export const ALLOCATION_ALGORITHMS = {
  FIRST_FIT: 'FIRST_FIT',
  BEST_FIT: 'BEST_FIT',
  WORST_FIT: 'WORST_FIT',
  NEXT_FIT: 'NEXT_FIT',
};

export const SIMULATION_STATES = {
  IDLE: 'IDLE',
  LOADED: 'LOADED',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  STEPPING: 'STEPPING',
  COMPLETE: 'COMPLETE',
};

export const ANIMATION_STATES = {
  IDLE: 'idle',
  HIT: 'hit',
  FAULT: 'fault',
  EVICT: 'evict',
};

export const FRAME_LIMITS = {
  MIN: 1,
  MAX: 8,
  DEFAULT: 3,
};

export const SPEED_LIMITS = {
  MIN: 100,
  MAX: 2000,
  DEFAULT: 800,
  STEP: 50,
};

export const TLB_SIZE = 4;

export const WORKING_SET_WINDOW = 5;

export const ALGO_COLORS = {
  FIFO: { color: 'var(--fifo)', dim: 'var(--fifo-dim)', glow: 'var(--fifo-glow)' },
  LRU: { color: 'var(--lru)', dim: 'var(--lru-dim)', glow: 'var(--lru-glow)' },
  OPT: { color: 'var(--opt)', dim: 'var(--opt-dim)', glow: 'var(--opt-glow)' },
};

export const STATUS_COLORS = {
  HIT: { color: 'var(--hit)', dim: 'var(--hit-dim)', glow: 'var(--hit-glow)' },
  FAULT: { color: 'var(--fault)', dim: 'var(--fault-dim)', glow: 'var(--fault-glow)' },
  EVICT: { color: 'var(--evict)', dim: 'var(--evict-dim)', glow: 'var(--evict-glow)' },
};

export const SIMULATOR_COLORS = {
  'page-replacement': '#2f81f7',
  paging: '#a371f7',
  segmentation: '#39c5cf',
  'virtual-memory': '#3fb950',
  partitioning: '#d29922',
  thrashing: '#f85149',
};

export const DEFAULT_REF_STRING = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2];

export const PAGE_SIZES = [
  { value: 4, label: '4 KB' },
  { value: 8, label: '8 KB' },
  { value: 16, label: '16 KB' },
];

export const ADDRESS_BITS = [
  { value: 32, label: '32-bit' },
  { value: 48, label: '48-bit' },
];

export const SEGMENT_TYPES = ['Code', 'Data', 'Stack', 'Heap'];
