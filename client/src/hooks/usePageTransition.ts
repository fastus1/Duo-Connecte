import { useState, useCallback, useEffect } from 'react';
import { useSession } from '@/contexts/SessionContext';

export function usePageTransition() {
  const { goToStep, session } = useSession();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const transitionDelay = prefersReducedMotion ? 0 : 1200;

  useEffect(() => {
    setIsTransitioning(false);
    setProgress(0);
  }, [session.currentStep]);

  const transitionToStep = useCallback((step: number) => {
    setIsTransitioning(true);
    
    if (transitionDelay === 0) {
      setProgress(100);
      goToStep(step);
      setTimeout(() => {
        setIsTransitioning(false);
        setProgress(0);
      }, 50);
      return;
    }
    
    setProgress(0);
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / transitionDelay) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsTransitioning(false);
          setProgress(0);
          setTimeout(() => {
            goToStep(step);
          }, 50);
        }, 200);
      }
    }, 16);
  }, [goToStep, transitionDelay]);

  return {
    isTransitioning,
    transitionToStep,
    progress,
  };
}
