import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import SystemDialog from "../SystemDialog.jsx";
import { AppProvider, useApp } from "../../context/AppContext.jsx";
import { FocusStackProvider } from "../../context/FocusStackContext.jsx";
import { ThemeProvider } from "../../context/ThemeContext.jsx";
import { KthemeProvider } from "@ktheme/react";
import { useEffect } from "react";

function SystemDialogTestHarness({ dialogKey = "Teleport lure" }) {
  const { actions } = useApp();

  useEffect(() => {
    if (dialogKey) {
      actions.setDialog(dialogKey);
    }
  }, [dialogKey]);

  return (
    <div id="app-root">
      <button id="main-trigger" onClick={() => actions.setDialog("Teleport lure")}>
        Trigger Teleport
      </button>
      <SystemDialog />
    </div>
  );
}

describe("SystemDialog Portal & Focus Management", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="modal-root"></div>';
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders SystemDialog content inside #modal-root via AccessibleDialogPortal", async () => {
    render(
      <AppProvider>
        <FocusStackProvider>
          <KthemeProvider themeId="navy-gold">
            <ThemeProvider>
              <SystemDialogTestHarness dialogKey="Teleport lure" />
            </ThemeProvider>
          </KthemeProvider>
        </FocusStackProvider>
      </AppProvider>
    );

    const modalRoot = document.getElementById("modal-root");
    expect(modalRoot.textContent).toContain("TELEPORT OFFER");
  });

  it("sets #app-root to aria-hidden='true' and inert when SystemDialog is active", async () => {
    render(
      <AppProvider>
        <FocusStackProvider>
          <KthemeProvider themeId="navy-gold">
            <ThemeProvider>
              <SystemDialogTestHarness dialogKey="Teleport lure" />
            </ThemeProvider>
          </KthemeProvider>
        </FocusStackProvider>
      </AppProvider>
    );

    const appRoot = document.getElementById("app-root");
    expect(appRoot.getAttribute("aria-hidden")).toBe("true");
    expect(appRoot.hasAttribute("inert")).toBe(true);
  });
});
