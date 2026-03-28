import { useState, useMemo } from 'react';

/**
 * Thrashing simulation state hook calculating CPU Utilization and Fault Rate.
 */
export function useThrashing() {
  const [processCount, setProcessCount] = useState(5);
  const [frameCount, setFrameCount] = useState(32);
  const [cpuBaseSpeed, setCpuBaseSpeed] = useState(100);

  // Generate deterministic processes based on count so they don't jump around
  const processes = useMemo(() => {
    const list = [];
    let randomSeed = 12345;
    const random = () => {
      randomSeed = (randomSeed * 9301 + 49297) % 233280;
      return randomSeed / 233280;
    };

    for (let i = 0; i < processCount; i++) {
      list.push({
        id: i + 1,
        name: `P${i + 1}`,
        wss: Math.floor(random() * 6) + 3 // WSS between 3 to 8 frames
      });
    }
    return list;
  }, [processCount]);

  const totalWss = processes.reduce((sum, p) => sum + p.wss, 0);
  
  // Calculate Thrashing State
  const thrashingRatio = totalWss / frameCount;
  const isThrashing = thrashingRatio > 1.0;

  // CPU Utilization drops precipitously when WSS > frameCount
  let cpuUtilization = 0;
  if (!isThrashing) {
      // Linear increase with multiprogramming until thrashing
      cpuUtilization = Math.min(95, processCount * 15);
  } else {
      // Exponential decay
      const overload = thrashingRatio - 1.0;
      cpuUtilization = Math.max(5, 95 * Math.exp(-overload * 4));
  }

  // Page Faults spike exponentially
  let pageFaultRate = 0;
  if (!isThrashing) {
      pageFaultRate = processCount * 2; // base faults
  } else {
      const overload = thrashingRatio - 1.0;
      pageFaultRate = Math.min(1000, 20 + 500 * (1 - Math.exp(-overload * 3)));
  }

  return {
    processCount,
    setProcessCount,
    frameCount,
    setFrameCount,
    processes,
    totalWss,
    cpuUtilization: Math.round(cpuUtilization),
    pageFaultRate: Math.round(pageFaultRate),
    isThrashing,
    thrashingRatio
  };
}
