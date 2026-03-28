/**
 * Best Fit allocation algorithm.
 * Allocates the process to the smallest free partition that fits.
 *
 * @param {Array} partitions - Current partition state
 * @param {Object} process - { name, size, color }
 * @returns {{ success: boolean, partitions: Array, index: number }}
 */
export function bestFit(partitions, process) {
  const result = partitions.map((p) => ({ ...p }));
  let bestIdx = -1;
  let bestSize = Infinity;

  for (let i = 0; i < result.length; i++) {
    if (result[i].status === 'free' && result[i].size >= process.size) {
      if (result[i].size < bestSize) {
        bestSize = result[i].size;
        bestIdx = i;
      }
    }
  }

  if (bestIdx === -1) return { success: false, partitions, index: -1 };

  const remaining = result[bestIdx].size - process.size;
  result[bestIdx] = { ...process, status: 'allocated' };
  if (remaining > 0) {
    result.splice(bestIdx + 1, 0, { name: 'Free', size: remaining, color: 'transparent', status: 'free' });
  }
  return { success: true, partitions: result, index: bestIdx };
}
