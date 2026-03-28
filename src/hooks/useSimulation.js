import { useState, useCallback, useRef, useEffect } from 'react';
import { SIMULATION_STATES, SPEED_LIMITS } from '../utils/constants';

/**
 * Generic simulation state machine hook.
 * Provides play/pause/step/reset lifecycle for any simulator.
 *
 * @param {Object} options
 * @param {number} options.totalSteps - Total number of steps in the simulation
 * @param {Function} options.onStep - Callback invoked on each step forward (receives currentStep)
 * @param {Function} options.onReset - Callback invoked on reset
 * @param {Function} options.onComplete - Callback invoked when simulation completes
 */
export function useSimulation({
  totalSteps = 0,
  onStep = () => {},
  onReset = () => {},
  onComplete = () => {},
} = {}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [speed, setSpeed] = useState(SPEED_LIMITS.DEFAULT);
  const timerRef = useRef(null);

  // FIX BUG-8: Store callbacks in refs to prevent re-creation of stepForward on every render
  const onStepRef = useRef(onStep);
  const onResetRef = useRef(onReset);
  const onCompleteRef = useRef(onComplete);
  onStepRef.current = onStep;
  onResetRef.current = onReset;
  onCompleteRef.current = onComplete;

  const state = isLoaded
    ? currentStep >= totalSteps && totalSteps > 0
      ? SIMULATION_STATES.COMPLETE
      : isPlaying
        ? SIMULATION_STATES.PLAYING
        : currentStep > 0
          ? SIMULATION_STATES.STEPPING
          : SIMULATION_STATES.LOADED
    : SIMULATION_STATES.IDLE;

  const isComplete = state === SIMULATION_STATES.COMPLETE;
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  const stepForward = useCallback(() => {
    if (currentStep >= totalSteps) return;
    const next = currentStep + 1;
    onStepRef.current(next);
    setCurrentStep(next);
    if (next >= totalSteps) {
      setIsPlaying(false);
      onCompleteRef.current();
    }
  }, [currentStep, totalSteps]);

  // FIX BUG-5: Guard inside functional updater to avoid stale closure
  const stepBackward = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev <= 0) return prev;
      return prev - 1;
    });
  }, []);

  const play = useCallback(() => {
    if (currentStep >= totalSteps) return;
    setIsPlaying(true);
  }, [currentStep, totalSteps]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, pause, play]);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    onResetRef.current();
  }, []);

  const load = useCallback(() => {
    reset();
    setIsLoaded(true);
  }, [reset]);

  // Auto-play timer
  useEffect(() => {
    if (isPlaying && currentStep < totalSteps) {
      timerRef.current = setTimeout(() => {
        requestAnimationFrame(() => stepForward());
      }, speed);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStep, speed, stepForward, totalSteps]);

  return {
    // State
    currentStep,
    isPlaying,
    isLoaded,
    isComplete,
    speed,
    state,
    progress,
    totalSteps,

    // Actions
    setCurrentStep,
    setSpeed,
    stepForward,
    stepBackward,
    play,
    pause,
    togglePlay,
    reset,
    load,
    setIsLoaded,
  };
}
