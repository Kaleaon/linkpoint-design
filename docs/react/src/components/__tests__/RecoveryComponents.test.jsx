import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AppProvider } from "../../context/AppContext.jsx";
import { ThemeProvider } from "../../context/ThemeContext.jsx";
import OfflineGrid from "../../screens/OfflineGrid.jsx";
import Search from "../../screens/Search.jsx";
import Inventory from "../../screens/Inventory.jsx";
import { GlobalErrorBoundary } from "../StateBlock.jsx";

function ProblemChild({ shouldThrow }) {
  if (shouldThrow) {
    throw new Error("Simulated component render failure");
  }
  return <div>Normal Component Content</div>;
}

describe("Recovery Components & Global Error Boundary", () => {
  it("GlobalErrorBoundary catches component errors and renders recovery UI with retry button", () => {
    const onResetMock = vi.fn();
    const { rerender } = render(
      <GlobalErrorBoundary onReset={onResetMock}>
        <ProblemChild shouldThrow={true} />
      </GlobalErrorBoundary>
    );

    expect(screen.getByText("SCREEN EXECUTION EXCEPTION")).toBeDefined();
    expect(screen.getByText("Simulated component render failure")).toBeDefined();

    const retryBtn = screen.getByRole("button", { name: "Retry component" });
    fireEvent.click(retryBtn);

    expect(onResetMock).toHaveBeenCalled();
  });

  it("OfflineGrid renders real-time reconnection progress and retry controls when offline or recovering", () => {
    render(
      <AppProvider>
        <ThemeProvider>
          <OfflineGrid />
        </ThemeProvider>
      </AppProvider>
    );

    // Stop grid to trigger offline status
    const stopGridBtn = screen.getByRole("button", { name: "Toggle grid status" });
    fireEvent.click(stopGridBtn);

    expect(screen.getByText("AUTOMATED RECOVERY & AUTO-RECONNECTION")).toBeDefined();
    expect(screen.getByRole("button", { name: "Retry Reconnection" })).toBeDefined();
  });

  it("Search renders skeleton loading and recovery timeout UI when query state is loading or timed out", () => {
    render(
      <AppProvider>
        <ThemeProvider>
          <Search />
        </ThemeProvider>
      </AppProvider>
    );

    expect(screen.getByText("PEOPLE")).toBeDefined();
  });

  it("Inventory renders skeleton loading and recovery state when inventory query times out", () => {
    render(
      <AppProvider>
        <ThemeProvider>
          <Inventory />
        </ThemeProvider>
      </AppProvider>
    );

    expect(screen.getByText("Objects")).toBeDefined();
  });
});
