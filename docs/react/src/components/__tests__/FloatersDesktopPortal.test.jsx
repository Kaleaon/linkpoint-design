import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import FloatersDesktop from "../FloatersDesktop.jsx";
import { AppProvider, useApp } from "../../context/AppContext.jsx";
import { FocusStackProvider } from "../../context/FocusStackContext.jsx";
import { ThemeProvider } from "../../context/ThemeContext.jsx";
import { KthemeProvider } from "@ktheme/react";
import { useEffect } from "react";

function FloatersDesktopHarness() {
  const { actions } = useApp();

  useEffect(() => {
    // Open chat floater by default
    actions.flFocus("Chat");
  }, []);

  return (
    <div id="app-root">
      <FloatersDesktop />
    </div>
  );
}

describe("FloatersDesktop Portal Focus Containment", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="modal-root"></div>';
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders active desktop floater inside #modal-root via AccessibleDialogPortal", () => {
    render(
      <AppProvider>
        <FocusStackProvider>
          <KthemeProvider themeId="navy-gold">
            <ThemeProvider>
              <FloatersDesktopHarness />
            </ThemeProvider>
          </KthemeProvider>
        </FocusStackProvider>
      </AppProvider>
    );

    const modalRoot = document.getElementById("modal-root");
    expect(modalRoot).not.toBeNull();
    expect(modalRoot.querySelector(".accessible-dialog-portal")).not.toBeNull();
  });

  it("contains focus sentinels in portaled desktop floater", () => {
    render(
      <AppProvider>
        <FocusStackProvider>
          <KthemeProvider themeId="navy-gold">
            <ThemeProvider>
              <FloatersDesktopHarness />
            </ThemeProvider>
          </KthemeProvider>
        </FocusStackProvider>
      </AppProvider>
    );

    const startSentinel = document.querySelector('[data-sentinel="start"]');
    const endSentinel = document.querySelector('[data-sentinel="end"]');

    expect(startSentinel).not.toBeNull();
    expect(endSentinel).not.toBeNull();
  });
});
