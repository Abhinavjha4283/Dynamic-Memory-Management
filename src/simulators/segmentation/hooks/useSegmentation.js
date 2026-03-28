import { useState, useCallback, useMemo, useEffect } from 'react';
import { useSimulation } from '../../../hooks/useSimulation';

const TOTAL_ACCESSES = 20;

const DEFAULT_SEGMENTS = [
  { id: 0, name: 'Code', base: 0x0000, limit: 0x0FFF, color: '#39c5cf' },
  { id: 1, name: 'Data', base: 0x1000, limit: 0x2FFF, color: '#a371f7' },
  { id: 2, name: 'Stack', base: 0x6000, limit: 0x0FFF, color: '#3fb950' }, // Notice the gap
  { id: 3, name: 'Heap', base: 0x4000, limit: 0x1FFF, color: '#d29922' },
];

/**
 * Segmentation simulation state hook.
 */
export function useSegmentation() {
  const [segments, setSegments] = useState(DEFAULT_SEGMENTS);
  const [accessHistory, setAccessHistory] = useState([]);
  const [eventLog, setEventLog] = useState([]);

  const loadSimulation = useCallback(() => {
    const history = [];
    
    for (let i = 0; i < TOTAL_ACCESSES; i++) {
        // Pick a random segment to access
        const targetSegIndex = Math.floor(Math.random() * segments.length);
        const segment = segments[targetSegIndex];
        
        // 30% chance to generate a segmentation fault (offset > limit)
        const isFault = Math.random() > 0.7;
        
        // Generate an offset
        const maxLimit = segment.limit;
        let offset;
        if (isFault) {
            // Pick an offset between limit + 1 and limit + 0x0FFF
            offset = maxLimit + Math.floor(Math.random() * 0x0FFF) + 1;
        } else {
            // Valid offset
            offset = Math.floor(Math.random() * (maxLimit + 1));
        }

        const physicalAddress = segment.base + offset;
        const success = !isFault;
        
        history.push({
            segmentId: segment.id,
            segmentName: segment.name,
            base: segment.base,
            limit: segment.limit,
            offset: offset,
            physicalAddress: success ? physicalAddress : null,
            isSuccess: success,
            log: `Accessing ${segment.name} (Seg ${segment.id}) at offset 0x${offset.toString(16).toUpperCase()}`
        });
    }

    setAccessHistory(history);
    setEventLog([]);
  }, [segments]);

  useEffect(() => {
    loadSimulation();
  }, [loadSimulation]);

  const sim = useSimulation({
    totalSteps: accessHistory.length,
    onStep: (nextStep) => {
      const stepData = accessHistory[nextStep - 1];
      if (stepData) {
        setEventLog(prev => [...prev, {
            step: nextStep,
            type: stepData.isSuccess ? 'ACCESS' : 'SEGV',
            details: stepData.log + (stepData.isSuccess 
                ? ` -> PA 0x${stepData.physicalAddress.toString(16).toUpperCase()}` 
                : ` -> SEGMENTATION FAULT (Exceeds Limit 0x${stepData.limit.toString(16).toUpperCase()})`)
        }]);
      }
    },
    onReset: () => setEventLog([]),
  });

  const totalUsed = useMemo(() => {
    return segments.reduce((acc, s) => acc + (s.limit + 1), 0) / 1024; // KB
  }, [segments]);

  const currentStepData = useMemo(() => {
    if (!accessHistory || sim.currentStep === 0) return null;
    return accessHistory[sim.currentStep - 1];
  }, [accessHistory, sim.currentStep]);

  const segmentationFaults = useMemo(() => {
    if (!accessHistory || sim.currentStep === 0) return 0;
    return accessHistory.slice(0, sim.currentStep).filter(s => !s.isSuccess).length;
  }, [accessHistory, sim.currentStep]);

  return {
    ...sim,
    segments,
    setSegments,
    totalUsed,
    currentStepData,
    segmentationFaults,
    eventLog,
    loadSimulation,
  };
}
