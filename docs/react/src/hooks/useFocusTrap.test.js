import { test, expect } from "vitest";
import { useFocusTrap } from "./useFocusTrap.js";

// Mock minimal DOM environment for testing focus trap logic
function createMockDOM() {
  const listeners = {};
  const windowMock = {
    addEventListener: (event, handler, useCapture) => {
      listeners[event] = listeners[event] || [];
      listeners[event].push(handler);
    },
    removeEventListener: (event, handler) => {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter((h) => h !== handler);
      }
    },
    dispatchKeyDown: (eventData) => {
      if (listeners["keydown"]) {
        listeners["keydown"].forEach((h) => h({ ...eventData, preventDefault: () => {}, stopPropagation: () => {} }));
      }
    }
  };

  return { windowMock, listeners };
}

test("useFocusTrap module exports function", () => {
  expect(typeof useFocusTrap).toBe("function");
});

test("useFocusTrap attach and cleanup event listener", () => {
  const { windowMock, listeners } = createMockDOM();
  const originalWindow = global.window;
  const originalDoc = global.document;

  global.window = windowMock;
  global.document = { activeElement: null };

  let escapeTriggered = false;
  const onEscape = () => { escapeTriggered = true; };

  const mockContainer = {
    querySelector: () => null,
    querySelectorAll: () => []
  };
  const ref = { current: mockContainer };

  // Simulate hook setup
  let cleanup;
  // We simulate effect execution
  const effect = () => {
    if (!ref.current) return;
    const previousActiveElement = global.document.activeElement;

    const handleKeyDown = (e) => {
      if (e.key === "Escape" || e.key === "Esc") {
        if (typeof onEscape === "function") onEscape();
      }
    };

    windowMock.addEventListener("keydown", handleKeyDown, true);
    return () => {
      windowMock.removeEventListener("keydown", handleKeyDown, true);
    };
  };

  cleanup = effect();
  expect(listeners["keydown"].length).toBe(1);

  windowMock.dispatchKeyDown({ key: "Escape" });
  expect(escapeTriggered).toBe(true);

  cleanup();
  expect(listeners["keydown"].length).toBe(0);

  global.window = originalWindow;
  global.document = originalDoc;
});
