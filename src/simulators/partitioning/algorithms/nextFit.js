/**
 * Next Fit allocation algorithm.
 * Like First Fit, but starts searching from the last allocated position.
 *
 * @param {Array} partitions - Current partition state
 * @param {Object} process - { name, size, color }
 * @param {number} lastIndex - Index to start searching from
 * @returns {{ success: boolean, partitions: Array, index: number, lastIndex: number }}
 */
export function nextFit(partitions, process, lastIndex = 0) {
  const result = partitions.map((p) => ({ ...p }));
  const len = result.length;
  const start = lastIndex % len;

  for (let count = 0; count < len; count++) {
    const i = (start + count) % len;
    if (result[i].status === 'free' && result[i].size >= process.size) {
      const remaining = result[i].size - process.size;
      result[i] = { ...process, status: 'allocated' };
      if (remaining > 0) {
        result.splice(i + 1, 0, { name: 'Free', size: remaining, color: 'transparent', status: 'free' });
        return { success: true, partitions: result, index: i, lastIndex: i + 2 };
      }
      return { success: true, partitions: result, index: i, lastIndex: i + 1 };
    }
  }

  return { success: false, partitions, index: -1, lastIndex };
}
