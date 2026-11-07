import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext.jsx";

/**
 * LiveRegionAnnouncer: Accessible ARIA live region for screen readers.
 * Automatically announces toasts, teleport updates, dynamic search result counts, and system events.
 * WCAG 2.2 SC 4.1.3 (Status Messages): https://www.w3.org/TR/WCAG22/#status-messages
 * WCAG 2.2 SC 4.1.2 (Name, Role, Value): https://www.w3.org/TR/WCAG22/#name-role-value
 */
export default function LiveRegionAnnouncer() {
  const { state } = useApp();
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    if (state.toast) {
      setAnnouncement(state.toast);
    } else if (state.announcement) {
      setAnnouncement(state.announcement);
    }
  }, [state.toast, state.announcement]);

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
