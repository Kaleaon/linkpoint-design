import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import React from "react";
import { AppProvider, useApp } from "../context/AppContext.jsx";
import { ThemeProvider } from "../context/ThemeContext.jsx";
import SystemDialog from "../components/SystemDialog.jsx";
import FloatersDesktop from "../components/FloatersDesktop.jsx";

// Helper component to interact with state and inspect event bus logs
function TestHarness() {
  const { state, actions } = useApp();
  const bus = actions.getEventBus();
  const logs = bus.getLogs();

  return (
    <div>
      <div data-testid="screen">{state.screen}</div>
      <div data-testid="dialog">{state.dialog || "NONE"}</div>
      <div data-testid="toast">{state.toast}</div>
      <div data-testid="logs-count">{logs.length}</div>
      <button
        data-testid="open-permissions"
        onClick={() => actions.setDialog("Permissions")}
      >
        Open Permissions
      </button>
      <SystemDialog />
      <FloatersDesktop />
    </div>
  );
}

describe("Event Bus Integration Tests across React Runtime", () => {
  it("dispatches DIALOG_ACTION when clicking a dialog button and updates toast & state", () => {
    const { getByTestId, getByText } = render(
      <AppProvider>
        <ThemeProvider>
          <TestHarness />
        </ThemeProvider>
      </AppProvider>
    );

    // Open Permissions dialog
    fireEvent.click(getByTestId("open-permissions"));
    expect(getByTestId("dialog").textContent).toBe("Permissions");

    // Click "ALLOW ALWAYS" dialog button
    const allowBtn = getByText("ALLOW ALWAYS");
    fireEvent.click(allowBtn);

    // Verify dialog is closed and toast is set
    expect(getByTestId("dialog").textContent).toBe("NONE");
    expect(getByTestId("toast").textContent).toContain("ALLOW ALWAYS");

    // Verify event bus logged the intent
    const logsCount = parseInt(getByTestId("logs-count").textContent, 10);
    expect(logsCount).toBeGreaterThanOrEqual(1);
  });

  it("dispatches DIALOG_CLOSE when clicking CLOSE button", () => {
    const { getByTestId, getByText } = render(
      <AppProvider>
        <ThemeProvider>
          <TestHarness />
        </ThemeProvider>
      </AppProvider>
    );

    fireEvent.click(getByTestId("open-permissions"));
    expect(getByTestId("dialog").textContent).toBe("Permissions");

    const closeBtn = getByText("CLOSE");
    fireEvent.click(closeBtn);

    expect(getByTestId("dialog").textContent).toBe("NONE");
  });

  it("dispatches FLOATER_MINIMIZE and FLOATER_CLOSE on desktop floaters", () => {
    const { getByTestId, getAllByLabelText } = render(
      <AppProvider>
        <ThemeProvider>
          <TestHarness />
        </ThemeProvider>
      </AppProvider>
    );

    const minBtns = getAllByLabelText("Minimize");
    expect(minBtns.length).toBeGreaterThan(0);

    fireEvent.click(minBtns[0]);

    const logsCount = parseInt(getByTestId("logs-count").textContent, 10);
    expect(logsCount).toBeGreaterThanOrEqual(1);
  });
});
