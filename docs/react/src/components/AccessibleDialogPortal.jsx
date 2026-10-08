import { useEffect, useRef, useState, useId } from "react";
import { createPortal } from "react-dom";
import { useFocusStack } from "../context/FocusStackContext.jsx";
import { useThemeTokens } from "../context/ThemeContext.jsx";

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[role="button"]:not([tabindex="-1"])'
].join(", ");

function getFocusableElements(container) {
  if (!container) return [];
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter((el) => {
    if (el.getAttribute("data-sentinel")) return false;
    if (el.getAttribute("aria-hidden") === "true") return false;
    const style = typeof window !== "undefined" ? window.getComputedStyle(el) : null;
    if (style && (style.display === "none" || style.visibility === "hidden")) return false;
    return true;
  });
}

function getModalRootNode() {
  if (typeof document === "undefined") return null;
  let modalRoot = document.getElementById("modal-root");
  if (!modalRoot) {
    modalRoot = document.createElement("div");
    modalRoot.id = "modal-root";
    document.body.appendChild(modalRoot);
  }
  return modalRoot;
}

export default function AccessibleDialogPortal({
  isOpen = true,
  onClose,
  triggerElement,
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  role = "dialog",
  children,
  style,
  className
}) {
  const portalId = useId();
  const contentRef = useRef(null);
  const focusStack = useFocusStack();
  const themeTokens = useThemeTokens();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Register with FocusStackContext & manage background inert / aria-hidden state
  useEffect(() => {
    if (!isOpen) return;

    const recordedTrigger = triggerElement || (typeof document !== "undefined" ? document.activeElement : null);
    focusStack.registerPortal(portalId, recordedTrigger);

    return () => {
      focusStack.unregisterPortal(portalId, recordedTrigger);
    };
  }, [isOpen, portalId, triggerElement]);

  // Initial focus scheduling when portal opens
  useEffect(() => {
    if (!isOpen || !mounted) return;

    const scheduleFocus = typeof requestAnimationFrame === "function" ? requestAnimationFrame : (cb) => setTimeout(cb, 0);
    const cancelSchedule = typeof cancelAnimationFrame === "function" ? cancelAnimationFrame : clearTimeout;

    const timerId = scheduleFocus(() => {
      if (!contentRef.current) return;
      const primaryEl = contentRef.current.querySelector('[data-primary="true"]');
      const focusables = getFocusableElements(contentRef.current);

      if (primaryEl && typeof primaryEl.focus === "function") {
        primaryEl.focus();
      } else if (focusables.length > 0 && typeof focusables[0].focus === "function") {
        focusables[0].focus();
      } else if (typeof contentRef.current.focus === "function") {
        contentRef.current.focus();
      }
    });

    return () => {
      cancelSchedule(timerId);
    };
  }, [isOpen, mounted]);

  // Escape key handling
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape" || e.key === "Esc") {
        e.preventDefault();
        e.stopPropagation();
        if (typeof onClose === "function") {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const targetNode = getModalRootNode();
  if (!targetNode) return null;

  const focusFirst = () => {
    if (!contentRef.current) return;
    const focusables = getFocusableElements(contentRef.current);
    if (focusables.length > 0) {
      focusables[0].focus();
    } else if (typeof contentRef.current.focus === "function") {
      contentRef.current.focus();
    }
  };

  const focusLast = () => {
    if (!contentRef.current) return;
    const focusables = getFocusableElements(contentRef.current);
    if (focusables.length > 0) {
      focusables[focusables.length - 1].focus();
    } else if (typeof contentRef.current.focus === "function") {
      contentRef.current.focus();
    }
  };

  const handleStartSentinelFocus = (e) => {
    e.preventDefault();
    focusLast();
  };

  const handleEndSentinelFocus = (e) => {
    e.preventDefault();
    focusFirst();
  };

  const V = themeTokens.V || {};
  const t = themeTokens.t || {};

  const sentinelStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: 0,
    opacity: 0,
    pointerEvents: "none"
  };

  const portalWrapperStyle = {
    color: V.ink || "inherit",
    fontFamily: t.font || "sans-serif",
    ...style
  };

  const portalContent = (
    <div className={`accessible-dialog-portal ${className || ""}`.trim()} style={portalWrapperStyle}>
      {/* Top Focus Sentinel */}
      <div
        tabIndex={0}
        aria-hidden="true"
        data-sentinel="start"
        onFocus={handleStartSentinelFocus}
        style={sentinelStyle}
      />

      {/* Main Dialog Overlay Container */}
      <div
        ref={contentRef}
        role={role}
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        tabIndex={-1}
        style={{ outline: "none" }}
      >
        {children}
      </div>

      {/* Bottom Focus Sentinel */}
      <div
        tabIndex={0}
        aria-hidden="true"
        data-sentinel="end"
        onFocus={handleEndSentinelFocus}
        style={sentinelStyle}
      />
    </div>
  );

  return createPortal(portalContent, targetNode);
}
