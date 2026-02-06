// PUBLIC_INTERFACE
export function computeAccuracy({ correctChars, totalTyped }) {
  /** Compute accuracy percentage based on correct characters divided by total typed characters. */
  if (!totalTyped || totalTyped <= 0) return 0;
  return (correctChars / totalTyped) * 100;
}

// PUBLIC_INTERFACE
export function computeWpm({ correctChars, elapsedSeconds }) {
  /**
   * Compute WPM using:
   *   words = correctChars / 5
   *   minutes = elapsedSeconds / 60
   *   WPM = words / minutes
   */
  if (!elapsedSeconds || elapsedSeconds <= 0) return 0;
  const minutes = elapsedSeconds / 60;
  const words = correctChars / 5;
  return words / minutes;
}

// PUBLIC_INTERFACE
export function formatNumber(n, digits = 0) {
  /** Format a number with fixed digits and safe fallback. */
  const x = Number.isFinite(n) ? n : 0;
  return x.toFixed(digits);
}
