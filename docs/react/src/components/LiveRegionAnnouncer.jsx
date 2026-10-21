import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext.jsx";

/**
 * LiveRegionAnnouncer: Accessible ARIA live region for screen readers.
 * Automatically announces toasts, teleport updates, and system events.
 * WCAG 4.1.3 (Status Messages) compliance.
 */
export default function LiveRegionAnnouncer() {
  const { state } = useApp();
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    if (state.toast) {
      setAnnouncement(state.toast);
    }
  }, [state.toast]);

  if (!announcement) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        margin: "-1px",
        padding: 0,
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        border: 0,
      }}
    >
      {announcement}
    </div>
  );
}
