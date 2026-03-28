import { firstFit } from './firstFit';
import { bestFit } from './bestFit';
import { worstFit } from './worstFit';
import { nextFit } from './nextFit';

/**
 * Merges adjacent free memory blocks in the partitions array.
 * @param {Array} partitions - Array of partition objects
 * @returns {Array} Coalesced partitions array
 */
export function coalesceFreeBlocks(partitions) {
  const coalesced = [];
  let currentFree = null;

  for (const p of partitions) {
    if (p.status === 'free') {
      if (currentFree) {
        currentFree.size += p.size;
      } else {
        currentFree = { ...p };
      }
    } else {
      if (currentFree) {
        coalesced.push(currentFree);
        currentFree = null;
      }
      coalesced.push({ ...p });
    }
  }

  if (currentFree) {
    coalesced.push(currentFree);
  }

  return coalesced;
}

/**
 * Pre-computes the full step-by-step state for dynamic partitioning simulation.
 * @param {Array} events - Order of ALLOC/DEALLOC actions
 * @param {number} totalMemory - Total size of memory initially free
 * @param {string} algorithmName - Name of the algorithm
 * @returns {Object} { steps: Array of state snapshots, isSuccess: boolean }
 */
export function computePartitioningSimulation(events, totalMemory, algorithmName) {
  let initialPartitions = [{ name: 'Free', size: totalMemory, color: 'transparent', status: 'free' }];
  let currentPartitions = [...initialPartitions];
  let lastIndex = 0; // For next fit
  let activeProcesses = []; // To keep track of colors and sizes for dealloc
  
  const steps = [];
  
  // Step 0 implies just the initial state
  steps.push({
    step: 0,
    type: 'INIT',
    partitions: currentPartitions.map(p => ({ ...p })),
    queue: events.filter(e => e.type === 'ALLOC').map(e => e.process),
    log: 'Simulation initialized.',
    allocatedCount: 0,
    failedCount: 0,
  });

  let allocatedCount = 0;
  let failedCount = 0;
  let remainingQueue = events.filter(e => e.type === 'ALLOC').map(e => e.process);

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    let stepLog = '';
    let success = true;

    if (event.type === 'ALLOC') {
      const process = event.process;
      let result;
      // Filter it out of the displayed queue
      remainingQueue = remainingQueue.filter(p => p.name !== process.name);

      switch (algorithmName) {
        case 'First Fit':
          result = firstFit(currentPartitions, process);
          break;
        case 'Best Fit':
          result = bestFit(currentPartitions, process);
          break;
        case 'Worst Fit':
          result = worstFit(currentPartitions, process);
          break;
        case 'Next Fit':
          result = nextFit(currentPartitions, process, lastIndex);
          lastIndex = result.lastIndex || 0;
          break;
        default:
          result = firstFit(currentPartitions, process);
      }

      if (result.success) {
        currentPartitions = result.partitions;
        activeProcesses.push(process);
        allocatedCount++;
        stepLog = `Allocated ${process.name} (${process.size} KB)`;
      } else {
        success = false;
        failedCount++;
        stepLog = `Failed to allocate ${process.name} (${process.size} KB) - Free space fragmented`;
        // Put back into queue? Usually in batch jobs, if it fails we just log it and move on
        // But for visualizer, we just log a failure
      }
    } else if (event.type === 'DEALLOC') {
      const processName = event.processName;
      let found = false;
      
      currentPartitions = currentPartitions.map((p) => {
        if (p.status === 'allocated' && p.name === processName) {
          found = true;
          return { name: 'Free', size: p.size, color: 'transparent', status: 'free' };
        }
        return p;
      });

      if (found) {
        // Coalesce adjacent free blocks immediately upon freeing
        currentPartitions = coalesceFreeBlocks(currentPartitions);
        activeProcesses = activeProcesses.filter(p => p.name !== processName);
        stepLog = `Deallocated ${processName}`;
      } else {
        stepLog = `Deallocation failed: ${processName} not found in memory`;
      }
    }

    steps.push({
      step: i + 1,
      type: event.type,
      process: event.process || { name: event.processName },
      success,
      partitions: currentPartitions.map(p => ({ ...p })),
      queue: remainingQueue.map(p => ({ ...p })),
      log: stepLog,
      allocatedCount,
      failedCount,
    });
  }

  return { steps };
}

export { firstFit, bestFit, worstFit, nextFit };
