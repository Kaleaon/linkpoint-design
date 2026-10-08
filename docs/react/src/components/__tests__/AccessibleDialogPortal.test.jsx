import { render, screen, fireEvent, act } from "@testing-library/react";
import { useState } from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import AccessibleDialogPortal from "../AccessibleDialogPortal.jsx";
import { AppProvider } from "../../context/AppContext.jsx";
import { FocusStackProvider } from "../../context/FocusStackContext.jsx";
import { ThemeProvider } from "../../context/ThemeContext.jsx";
import { KthemeProvider } from "@ktheme/react";

function TestApp({ defaultOpen = true, onClose, triggerId = "test-trigger" }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  return (
    <AppProvider>
      <FocusStackProvider>
        <KthemeProvider themeId="navy-gold">
          <ThemeProvider>
            <div id="app-root">
              <button id={triggerId} onClick={() => setIsOpen(true)}>
                Open Dialog Trigger
              </button>
              <div>Background Application Content</div>
            </div>
            <div id="modal-root"></div>

            <AccessibleDialogPortal
              isOpen={isOpen}
              onClose={handleClose}
              ariaLabel="Test Dialog"
              role="dialog"
            >
              <div>
                <h2 id="dlg-title">Test Modal Title</h2>
                <p>Test Modal Description</p>
                <button id="btn-cancel" onClick={handleClose}>
                  Cancel
                </button>
                <button id="btn-submit" data-primary="true" onClick={handleClose}>
                  Confirm Action
                </button>
              </div>
            </AccessibleDialogPortal>
          </ThemeProvider>
        </KthemeProvider>
      </FocusStackProvider>
    </AppProvider>
  );
}

describe("AccessibleDialogPortal Component", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("mounts overlay content into #modal-root via React Portal", () => {
    render(<TestApp defaultOpen={true} />);

    const modalRoot = document.getElementById("modal-root");
    expect(modalRoot).not.toBeNull();
    expect(modalRoot.textContent).toContain("Test Modal Title");
    expect(modalRoot.textContent).toContain("Confirm Action");
  });

  it("applies aria-hidden='true' and inert to #app-root while portal is open", () => {
    render(<TestApp defaultOpen={true} />);

    const appRoot = document.getElementById("app-root");
    expect(appRoot.getAttribute("aria-hidden")).toBe("true");
    expect(appRoot.hasAttribute("inert")).toBe(true);
  });

  it("renders top and bottom focus sentinels with tabIndex={0}", () => {
    render(<TestApp defaultOpen={true} />);

    const startSentinel = document.querySelector('[data-sentinel="start"]');
    const endSentinel = document.querySelector('[data-sentinel="end"]');

    expect(startSentinel).not.toBeNull();
    expect(endSentinel).not.toBeNull();
    expect(startSentinel.getAttribute("tabindex")).toBe("0");
    expect(endSentinel.getAttribute("tabindex")).toBe("0");
  });

  it("redirects focus when focus sentinels receive focus (Tab trap)", async () => {
    render(<TestApp defaultOpen={true} />);

    const startSentinel = document.querySelector('[data-sentinel="start"]');
    const endSentinel = document.querySelector('[data-sentinel="end"]');
    const submitBtn = document.getElementById("btn-submit");
    const cancelBtn = document.getElementById("btn-cancel");

    // Focus end sentinel -> redirects to first focusable element (cancelBtn or submitBtn)
    act(() => {
      endSentinel.focus();
      fireEvent.focus(endSentinel);
    });
    expect([cancelBtn, submitBtn]).toContain(document.activeElement);

    // Focus start sentinel -> redirects to last focusable element
    act(() => {
      startSentinel.focus();
      fireEvent.focus(startSentinel);
    });
    expect([cancelBtn, submitBtn]).toContain(document.activeElement);
  });

  it("closes portal and restores background interactivity when Escape key is pressed", async () => {
    render(<TestApp defaultOpen={true} />);

    const appRoot = document.getElementById("app-root");
    expect(appRoot.getAttribute("aria-hidden")).toBe("true");

    act(() => {
      fireEvent.keyDown(window, { key: "Escape" });
    });

    expect(appRoot.hasAttribute("aria-hidden")).toBe(false);
    expect(appRoot.hasAttribute("inert")).toBe(false);
  });

  it("restores focus to trigger element when portal closes", async () => {
    render(<TestApp defaultOpen={true} />);

    const triggerBtn = document.getElementById("test-trigger");
    triggerBtn.focus();

    act(() => {
      fireEvent.keyDown(window, { key: "Escape" });
    });

    expect(document.activeElement).toBe(triggerBtn);
  });
});
