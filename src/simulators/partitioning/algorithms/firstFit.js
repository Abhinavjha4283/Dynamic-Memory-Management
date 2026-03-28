/**
 * First Fit allocation algorithm.
 * Allocates the process to the first free partition that is large enough.
 *
 * @param {Array} partitions - Current partition state
 * @param {Object} process - { name, size, color }
 * @returns {{ success: boolean, partitions: Array, index: number }}
 */
export function firstFit(partitions, process) {
  const result = partitions.map((p) => ({ ...p }));
  for (let i = 0; i < result.length; i++) {
    if (result[i].status === 'free' && result[i].size >= process.size) {
      const remaining = result[i].size - process.size;
      result[i] = { ...process, status: 'allocated' };
      if (remaining > 0) {
        result.splice(i + 1, 0, { name: 'Free', size: remaining, color: 'transparent', status: 'free' });
      }
      return { success: true, partitions: result, index: i };
    }
  }
  return { success: false, partitions, index: -1 };
}
