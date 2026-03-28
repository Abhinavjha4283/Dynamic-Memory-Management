/**
 * Worst Fit allocation algorithm.
 * Allocates the process to the largest free partition.
 *
 * @param {Array} partitions - Current partition state
 * @param {Object} process - { name, size, color }
 * @returns {{ success: boolean, partitions: Array, index: number }}
 */
export function worstFit(partitions, process) {
  const result = partitions.map((p) => ({ ...p }));
  let worstIdx = -1;
  let worstSize = -1;

  for (let i = 0; i < result.length; i++) {
    if (result[i].status === 'free' && result[i].size >= process.size) {
      if (result[i].size > worstSize) {
        worstSize = result[i].size;
        worstIdx = i;
      }
    }
  }

  if (worstIdx === -1) return { success: false, partitions, index: -1 };

  const remaining = result[worstIdx].size - process.size;
  result[worstIdx] = { ...process, status: 'allocated' };
  if (remaining > 0) {
    result.splice(worstIdx + 1, 0, { name: 'Free', size: remaining, color: 'transparent', status: 'free' });
  }
  return { success: true, partitions: result, index: worstIdx };
}
