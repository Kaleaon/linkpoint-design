import { useEffect, useState } from "react";

/**
 * Localized custom hook to manage a 1-second interval telemetry timer.
 * Subscribes to the Page Visibility API (`document.visibilitychange`)
 * to pause interval execution when the browser hides the document.
 *
 * @returns {number} Current tick count
 */
export function useTelemetryTick() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let intervalId = null;

    const startTimer = () => {
      if (!intervalId && typeof document !== "undefined" && !document.hidden) {
        intervalId = setInterval(() => {
          setTick((t) => t + 1);
        }, 1000);
      }
    };

    const stopTimer = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const handleVisibilityChange = () => {
      if (typeof document !== "undefined" && document.hidden) {
        stopTimer();
      } else {
        startTimer();
      }
    };

    if (typeof document !== "undefined" && !document.hidden) {
      startTimer();
    }

    if (typeof document !== "undefined" && typeof document.addEventListener === "function") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      stopTimer();
      if (typeof document !== "undefined" && typeof document.removeEventListener === "function") {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
    };
  }, []);

  return tick;
}
