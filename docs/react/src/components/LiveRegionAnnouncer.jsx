import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext.jsx";

/**
 * LiveRegionAnnouncer: Accessible ARIA live region for screen readers.
 * Automatically announces toasts, screen view transitions, dynamic search result counts, and system events.
 * WCAG 2.2 SC 4.1.3 (Status Messages): https://www.w3.org/TR/WCAG22/#status-messages
 * WCAG 2.2 SC 4.1.2 (Name, Role, Value): https://www.w3.org/TR/WCAG22/#name-role-value
 */
export default function LiveRegionAnnouncer() {
  const { state } = useApp();
  const [announcement, setAnnouncement] = useState("");
  const prevScreenRef = useRef(state?.screen);
  const prevToastRef = useRef("");
  const prevAnnouncementRef = useRef("");
  const queueRef = useRef([]);
  const isAnnouncingRef = useRef(false);
  const timerRef = useRef(null);

  const processQueue = () => {
    if (isAnnouncingRef.current) return;
    if (queueRef.current.length === 0) return;

    const nextMsg = queueRef.current.shift();
    isAnnouncingRef.current = true;
    setAnnouncement((prev) => {
      if (prev === nextMsg) {
        return nextMsg.endsWith(" ") ? nextMsg.trimEnd() : `${nextMsg} `;
      }
      return nextMsg;
    });

    timerRef.current = setTimeout(() => {
      isAnnouncingRef.current = false;
      if (queueRef.current.length > 0) {
        processQueue();
      }
    }, 1000);
  };

  const enqueueAnnouncement = (message) => {
    if (!message) return;
    queueRef.current.push(message);
    processQueue();
  };

  // Announce screen transitions
  useEffect(() => {
    if (!state) return;
    if (prevScreenRef.current !== state.screen) {
      const prev = prevScreenRef.current;
      prevScreenRef.current = state.screen;
      if (prev !== undefined && prev !== null) {
        const screenName = state.screenTitle || state.screen;
        enqueueAnnouncement(`Navigated to ${screenName}`);
      }
    }
  }, [state?.screen, state?.screenTitle]);

  // Announce toasts without dropping messages
  useEffect(() => {
    if (!state) return;
    if (state.toast && state.toast !== prevToastRef.current) {
      enqueueAnnouncement(state.toast);
    }
    prevToastRef.current = state.toast;
  }, [state?.toast]);

  // Announce dynamic search result counts and announcements
  useEffect(() => {
    if (!state) return;
    if (
      state.announcement &&
      state.announcement !== prevAnnouncementRef.current
    ) {
      enqueueAnnouncement(state.announcement);
    }
    prevAnnouncementRef.current = state.announcement;
  }, [state?.announcement]);

  // Cleanup pending queue timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-testid="live-region-announcer"
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
