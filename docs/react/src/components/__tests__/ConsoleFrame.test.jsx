import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import React from "react";
import ConsoleFrame from "../ConsoleFrame.jsx";
import { AppProvider } from "../../context/AppContext.jsx";
import { ThemeProvider } from "../../context/ThemeContext.jsx";

describe("ConsoleFrame component telemetry", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => false,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders live telemetry readouts and updates them as tick advances", () => {
    const { container } = render(
      <AppProvider>
        <ThemeProvider>
          <ConsoleFrame />
        </ThemeProvider>
      </AppProvider>
    );

    // Initial tick = 0
    // Plate text: String(4471 + 0) + "-" + String(0).padStart(2, "0") = "4471-00"
    expect(container.textContent).toContain("4471-00");

    // Advance 1 second (tick = 1)
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Plate text: String(4471 + 1) + "-" + String(1).padStart(2, "0") = "4472-01"
    expect(container.textContent).toContain("4472-01");
  });
});
