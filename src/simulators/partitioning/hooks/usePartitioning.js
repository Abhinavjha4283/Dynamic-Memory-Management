import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useSimulation } from '../../../hooks/useSimulation';
import { computePartitioningSimulation } from '../algorithms';

const TOTAL_MEMORY = 1000; // 1000 KB

const DEFAULT_EVENTS = [
  { type: 'ALLOC', process: { name: 'P1', size: 120, color: '#2f81f7' } },
  { type: 'ALLOC', process: { name: 'P2', size: 200, color: '#a371f7' } },
  { type: 'ALLOC', process: { name: 'P3', size: 150, color: '#39c5cf' } },
  { type: 'DEALLOC', processName: 'P2' },
  { type: 'ALLOC', process: { name: 'P4', size: 90, color: '#d29922' } },
  { type: 'ALLOC', process: { name: 'P5', size: 60, color: '#f85149' } },
  { type: 'DEALLOC', processName: 'P1' },
  { type: 'ALLOC', process: { name: 'P6', size: 110, color: '#3fb950' } },
  { type: 'ALLOC', process: { name: 'P7', size: 200, color: '#2f81f7' } },
];

export function usePartitioning() {
  const [algorithm, setAlgorithm] = useState('First Fit');
  const [events, setEvents] = useState(DEFAULT_EVENTS);
  const [allResults, setAllResults] = useState(null);
  
  const [eventLog, setEventLog] = useState([]);

  // Compute results for all algorithms just like page replacement
  const loadSimulation = useCallback(() => {
    const results = {
      'First Fit': computePartitioningSimulation(events, TOTAL_MEMORY, 'First Fit'),
      'Best Fit': computePartitioningSimulation(events, TOTAL_MEMORY, 'Best Fit'),
      'Worst Fit': computePartitioningSimulation(events, TOTAL_MEMORY, 'Worst Fit'),
      'Next Fit': computePartitioningSimulation(events, TOTAL_MEMORY, 'Next Fit'),
    };
    setAllResults(results);
    setEventLog([]);
  }, [events]);

  useEffect(() => {
    loadSimulation();
  }, [loadSimulation]);

  const currentResults = useMemo(() => {
    if (!allResults) return null;
    return allResults[algorithm];
  }, [allResults, algorithm]);

  const totalSteps = currentResults ? currentResults.steps.length - 1 : 0;

  const sim = useSimulation({
    totalSteps,
    onStep: (nextStep) => {
      const stepData = currentResults.steps[nextStep];
      setEventLog(prev => [...prev, {
        step: nextStep,
        type: stepData.type,
        process: stepData.process?.name || '',
        details: stepData.success ? `Success: ${stepData.log}` : `Failed: ${stepData.log}`
      }]);
    },
    onReset: () => setEventLog([]),
  });

  const handleAlgorithmChange = useCallback((algo) => {
    setAlgorithm(algo);
    sim.reset();
  }, [sim]);

  // Derived state for the current step
  const currentStepData = useMemo(() => {
    if (!currentResults) return null;
    return currentResults.steps[sim.currentStep];
  }, [currentResults, sim.currentStep]);

  const partitions = currentStepData ? currentStepData.partitions : [{ name: 'Free', size: TOTAL_MEMORY, color: 'transparent', status: 'free' }];
  const processQueue = currentStepData ? currentStepData.queue : [];
  
  const totalMemory = TOTAL_MEMORY;
  const allocatedMemory = partitions
    .filter((p) => p.status === 'allocated')
    .reduce((sum, p) => sum + p.size, 0);
  const freeMemory = totalMemory - allocatedMemory;
  const utilization = ((allocatedMemory / totalMemory) * 100).toFixed(1);

  return {
    ...sim,
    algorithm,
    setAlgorithm: handleAlgorithmChange,
    partitions,
    processQueue,
    totalMemory,
    allocatedMemory,
    freeMemory,
    utilization,
    eventLog,
    currentStepData,
  };
}
