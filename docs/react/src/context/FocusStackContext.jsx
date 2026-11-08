import { createContext, useContext, useRef, useCallback } from "react";

const FocusStackContext = createContext(null);

export function FocusStackProvider({ children }) {
  const triggerStackRef = useRef([]);
  const activePortalsRef = useRef(new Map());

  const updateBackgroundState = useCallback(() => {
    const appRoot = document.getElementById("app-root") || document.getElementById("root");
    if (!appRoot) return;

    let hasModal = false;
    for (const portal of activePortalsRef.current.values()) {
      if (portal.isModal) {
        hasModal = true;
        break;
      }
    }

    if (hasModal) {
      appRoot.setAttribute("aria-hidden", "true");
      appRoot.setAttribute("inert", "");
    } else {
      appRoot.removeAttribute("aria-hidden");
      appRoot.removeAttribute("inert");
    }
  }, []);

  const pushTrigger = useCallback((triggerElement) => {
    const el = triggerElement || (typeof document !== "undefined" ? document.activeElement : null);
    if (el && el !== document.body) {
      triggerStackRef.current.push(el);
    }
  }, []);

  const popTrigger = useCallback(() => {
    return triggerStackRef.current.pop();
  }, []);

  const restoreFocus = useCallback((preferredEl) => {
    const target = preferredEl || triggerStackRef.current.pop();
    if (target && typeof target.focus === "function" && document.body.contains(target)) {
      try {
        target.focus();
        return true;
      } catch (_) {}
    }

    // Fallback: search for active taskbar buttons or focusable elements
    if (typeof document !== "undefined") {
      const taskbarBtn = document.querySelector(
        'div[role="button"][tabindex="0"], button:not([disabled]), [tabindex="0"]'
      );
      if (taskbarBtn && typeof taskbarBtn.focus === "function" && document.body.contains(taskbarBtn)) {
        try {
          taskbarBtn.focus();
          return true;
        } catch (_) {}
      }
    }
    return false;
  }, []);

  const registerPortal = useCallback((id, triggerElement, isModal = true) => {
    if (!id) return;
    activePortalsRef.current.set(id, { triggerElement, isModal });
    pushTrigger(triggerElement);
    updateBackgroundState();
  }, [pushTrigger, updateBackgroundState]);

  const unregisterPortal = useCallback((id, preferredTrigger) => {
    if (!id) return;
    const wasActive = activePortalsRef.current.has(id);
    activePortalsRef.current.delete(id);
    updateBackgroundState();
    if (wasActive) {
      restoreFocus(preferredTrigger);
    }
  }, [updateBackgroundState, restoreFocus]);

  const value = {
    pushTrigger,
    popTrigger,
    restoreFocus,
    registerPortal,
    unregisterPortal,
    activeCount: activePortalsRef.current.size
  };

  return (
    <FocusStackContext.Provider value={value}>
      {children}
    </FocusStackContext.Provider>
  );
}

export function useFocusStack() {
  const context = useContext(FocusStackContext);
  if (!context) {
    // Graceful fallback if component is used outside FocusStackProvider
    return {
      pushTrigger: () => {},
      popTrigger: () => null,
      restoreFocus: () => false,
      registerPortal: () => {},
      unregisterPortal: () => {},
      activeCount: 0
    };
  }
  return context;
}
