import { useEffect, useState } from "react";

/**
 * Hook to manage global loading state
 * Shows loading screen until app is fully initialized
 */
export const useAppLoader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading phases
    const phases = [0, 25, 50, 75, 90, 100];
    let phaseIndex = 0;

    const loadInterval = setInterval(() => {
      if (phaseIndex < phases.length) {
        setProgress(phases[phaseIndex]);
        phaseIndex++;
      } else {
        setIsLoading(false);
        clearInterval(loadInterval);
      }
    }, 300);

    return () => clearInterval(loadInterval);
  }, []);

  return { isLoading, progress, setIsLoading };
};

export default useAppLoader;
