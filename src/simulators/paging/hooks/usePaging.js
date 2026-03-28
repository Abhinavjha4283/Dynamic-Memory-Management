import { useState, useCallback, useMemo, useEffect } from 'react';
import { useSimulation } from '../../../hooks/useSimulation';

const LOGICAL_PAGES = 8;
const TOTAL_ACCESSES = 20;

export function usePaging() {
  const [pageSize, setPageSize] = useState(4); // KB (options: 4, 8, 16)
  const [frameCount, setFrameCount] = useState(8); // Physical frames (4 - 16)
  
  const [pageTable, setPageTable] = useState([]);
  const [accessHistory, setAccessHistory] = useState([]);
  const [allResults, setAllResults] = useState(null);
  const [eventLog, setEventLog] = useState([]);

  // Setup initial mappings and pre-compute accesses
  const loadSimulation = useCallback(() => {
    // 1. Generate random page table (Logical Pages -> Physical Frames)
    // About 60% chance to be valid (mapped)
    const newTable = [];
    const availableFrames = Array.from({ length: frameCount }, (_, i) => i);
    // Shuffle available frames
    availableFrames.sort(() => Math.random() - 0.5);
    
    let frameIdx = 0;
    for (let i = 0; i < LOGICAL_PAGES; i++) {
      const isValid = Math.random() > 0.4 && frameIdx < availableFrames.length;
      newTable.push({
        pageNumber: i,
        frameNumber: isValid ? availableFrames[frameIdx++] : null,
        valid: isValid
      });
    }
    setPageTable(newTable);

    // 2. Generate random 16-bit-ish access trace
    // Max address = LOGICAL_PAGES * pageSize * 1024 - 1
    const maxAddress = LOGICAL_PAGES * pageSize * 1024 - 1;
    const history = [];
    
    for (let i = 0; i < TOTAL_ACCESSES; i++) {
      const addr = Math.floor(Math.random() * maxAddress);
      
      const byteSize = pageSize * 1024;
      const pageNum = Math.floor(addr / byteSize);
      const offset = addr % byteSize;
      
      const entry = newTable[pageNum];
      const isHit = entry.valid;
      const physAddr = isHit ? (entry.frameNumber * byteSize) + offset : null;
      
      history.push({
        logicalAddress: addr,
        pageNumber: pageNum,
        offset: offset,
        isHit,
        frameNumber: entry.frameNumber,
        physicalAddress: physAddr,
        log: `Address 0x${addr.toString(16).toUpperCase()}: Page ${pageNum}, Offset 0x${offset.toString(16).toUpperCase()}`
      });
    }
    
    setAllResults({ steps: history });
    setEventLog([]);
  }, [pageSize, frameCount]);

  useEffect(() => {
    loadSimulation();
  }, [loadSimulation]);

  const totalSteps = allResults ? allResults.steps.length : 0;

  const sim = useSimulation({
    totalSteps: totalSteps,
    onStep: (nextStep) => {
      const stepData = allResults.steps[nextStep - 1]; // nextStep is 1-indexed here relative to playing, but we want the one that correlates
      if (stepData) {
        setEventLog(prev => [...prev, {
          step: nextStep,
          type: stepData.isHit ? 'HIT' : 'FAULT',
          details: stepData.log + (stepData.isHit ? ` -> Physical 0x${stepData.physicalAddress.toString(16).toUpperCase()}` : ` -> Page Fault!`)
        }]);
      }
    },
    onReset: () => setEventLog([]),
  });

  const currentStepData = useMemo(() => {
    if (!allResults || sim.currentStep === 0) return null;
    return allResults.steps[sim.currentStep - 1];
  }, [allResults, sim.currentStep]);

  // Derived stats
  const pageFaults = useMemo(() => {
    if (!allResults || sim.currentStep === 0) return 0;
    return allResults.steps.slice(0, sim.currentStep).filter(s => !s.isHit).length;
  }, [allResults, sim.currentStep]);

  const mappedPagesCount = pageTable.filter(p => p.valid).length;

  return {
    ...sim,
    pageSize,
    setPageSize,
    frameCount,
    setFrameCount,
    pageCount: LOGICAL_PAGES,
    mappedPagesCount,
    pageTable,
    currentStepData,
    pageFaults,
    eventLog,
    loadSimulation, // Expose manually if needed
  };
}
