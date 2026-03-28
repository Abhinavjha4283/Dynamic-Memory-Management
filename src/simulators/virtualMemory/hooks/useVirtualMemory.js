import { useState, useCallback, useMemo, useEffect } from 'react';
import { useSimulation } from '../../../hooks/useSimulation';

const TOTAL_ACCESSES = 30;
const VIRTUAL_PAGES = 32;

/**
 * Virtual memory simulation state hook mapping the flow of an address translation.
 */
export function useVirtualMemory() {
  const [addressBits, setAddressBits] = useState(32);
  const [pageSize, setPageSize] = useState(4); // KB
  const [tlbEntries, setTlbEntries] = useState(4);

  const [tlbState, setTlbState] = useState([]); // Visual tracking state for components
  const [swapState, setSwapState] = useState([]); // Visual tracking state
  
  const [accessHistory, setAccessHistory] = useState([]);
  const [eventLog, setEventLog] = useState([]);

  const loadSimulation = useCallback(() => {
    const history = [];
    
    // Internal simulator state during generation
    let internalTLB = []; // { vpn, pfn }
    let pageTableMap = new Map(); // vpn -> { pfn, valid }
    let nextFreeFrame = 0;
    
    // Initialize Page Table (about half are in RAM initially, half in Swap)
    for (let i = 0; i < VIRTUAL_PAGES; i++) {
        const inRAM = Math.random() > 0.5;
        pageTableMap.set(i, {
            pfn: inRAM ? nextFreeFrame++ : null,
            valid: inRAM,
            swapBlock: inRAM ? null : Math.floor(Math.random() * 100)
        });
    }

    for (let i = 0; i < TOTAL_ACCESSES; i++) {
        let stepLog = '';
        
        // Pick a random VPN to access. Bias towards recently accessed (Temporal Locality)
        // 60% chance to pick from TLB if not empty, 40% chance random
        let vpn;
        if (internalTLB.length > 0 && Math.random() < 0.6) {
             vpn = internalTLB[Math.floor(Math.random() * internalTLB.length)].vpn;
        } else {
             vpn = Math.floor(Math.random() * VIRTUAL_PAGES);
        }
        
        const offset = Math.floor(Math.random() * (pageSize * 1024));
        const virtualAddress = (vpn * pageSize * 1024) + offset;
        
        const rTlbHit = internalTLB.find(entry => entry.vpn === vpn);
        let tlbMiss = !rTlbHit;
        let pageFault = false;
        let pfn = null;
        let swapAction = null;

        if (!tlbMiss) {
            pfn = rTlbHit.pfn;
            stepLog = `TLB Hit for Page ${vpn}.`;
        } else {
            // TLB Miss -> Page Walk
            const pte = pageTableMap.get(vpn);
            if (pte.valid) {
                pfn = pte.pfn;
                stepLog = `TLB Miss -> Page Walk -> Found in RAM (Frame ${pfn}).`;
            } else {
                // Page Fault
                pageFault = true;
                pfn = nextFreeFrame++;
                pte.valid = true;
                pte.pfn = pfn;
                swapAction = pte.swapBlock;
                stepLog = `TLB Miss -> Page Fault! Loading block ${swapAction} from Swap Space into Frame ${pfn}.`;
            }
            
            // Update TLB (FIFO approach)
            if (internalTLB.length >= tlbEntries) {
                internalTLB.shift();
            }
            internalTLB.push({ vpn, pfn });
            
            // Create a copy of TLB state for this step
        }

        const physicalAddress = (pfn * pageSize * 1024) + offset;

        history.push({
            virtualAddress,
            vpn,
            offset,
            tlbMiss,
            pageFault,
            pfn,
            swapAction,
            physicalAddress,
            currentTlb: [...internalTLB],
            log: stepLog
        });
    }

    setAccessHistory(history);
    setEventLog([]);
    // We can also initialize visual state safely here
  }, [tlbEntries, pageSize]);

  useEffect(() => {
    loadSimulation();
  }, [loadSimulation]);

  const sim = useSimulation({
    totalSteps: accessHistory.length,
    onStep: (nextStep) => {
      const stepData = accessHistory[nextStep - 1];
      if (stepData) {
        setTlbState(stepData.currentTlb); // update UI TLB
        if (stepData.swapAction !== null) {
            setSwapState(prev => [...prev.slice(-3), stepData.swapAction]); // show recent swaps
        }
        
        setEventLog(prev => [...prev, {
            step: nextStep,
            type: stepData.pageFault ? 'FAULT' : (stepData.tlbMiss ? 'WALK' : 'HIT'),
            details: stepData.log
        }]);
      }
    },
    onReset: () => {
        setEventLog([]);
        setTlbState([]);
        setSwapState([]);
    },
  });

  const currentStepData = useMemo(() => {
    if (!accessHistory || sim.currentStep === 0) return null;
    return accessHistory[sim.currentStep - 1];
  }, [accessHistory, sim.currentStep]);

  // Stats
  const tlbHits = useMemo(() => {
    if (!accessHistory || sim.currentStep === 0) return 0;
    return accessHistory.slice(0, sim.currentStep).filter(s => !s.tlbMiss).length;
  }, [accessHistory, sim.currentStep]);

  const pageWalks = useMemo(() => {
    if (!accessHistory || sim.currentStep === 0) return 0;
    return accessHistory.slice(0, sim.currentStep).filter(s => s.tlbMiss && !s.pageFault).length;
  }, [accessHistory, sim.currentStep]);

  const swapReads = useMemo(() => {
    if (!accessHistory || sim.currentStep === 0) return 0;
    return accessHistory.slice(0, sim.currentStep).filter(s => s.pageFault).length;
  }, [accessHistory, sim.currentStep]);

  return {
    ...sim,
    addressBits,
    setAddressBits,
    pageSize,
    setPageSize,
    tlbEntries,
    setTlbEntries,
    currentStepData,
    tlbState,
    swapState,
    eventLog,
    tlbHits,
    pageWalks,
    swapReads,
    loadSimulation,
  };
}
