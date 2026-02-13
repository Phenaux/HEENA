export const useHaptic = () => {
  const vibrate = (pattern: number | number[] = 10) => {
    if ("vibrate" in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
      }
    }
  };

  const tap = () => vibrate(10);
  const double = () => vibrate([10, 20, 10]);
  const success = () => vibrate([10, 20, 10]);
  const warning = () => vibrate([30, 20, 30]);
  const error = () => vibrate([50, 30, 50]);

  return {
    vibrate,
    tap,
    double,
    success,
    warning,
    error,
  };
};

// Global haptic feedback function for quick access
export const triggerHaptic = (pattern: number | number[] = 10) => {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
    }
  }
};
