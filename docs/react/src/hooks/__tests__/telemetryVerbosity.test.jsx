import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook, act, render, screen } from "@testing-library/react";
import React from "react";
import { useAppState } from "../useAppState.js";
import { AppProvider, useApp } from "../../context/AppContext.jsx";
import { ThemeProvider } from "../../context/ThemeContext.jsx";
import World3D from "../../screens/World3D.jsx";
import ConsoleFrame from "../../components/ConsoleFrame.jsx";

function TestControls() {
  const { state, actions } = useApp();
  return (
    <button
      data-testid="toggle-btn"
      onClick={() =>
        actions.setTelemetryVerbosity(
          state.prefs.telemetryVerbosity === "advanced" ? "simple" : "advanced",
        )
      }
    >
      Toggle
    </button>
  );
}

function TestWrapper({ children }) {
  return (
    <AppProvider>
      <ThemeProvider>
        <TestControls />
        {children}
      </ThemeProvider>
    </AppProvider>
  );
}

describe("telemetryVerbosity preference & persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("defaults telemetryVerbosity to 'simple' when localStorage is empty", () => {
    const { result } = renderHook(() => useAppState());
    expect(result.current.state.prefs.telemetryVerbosity).toBe("simple");
  });

  it("falls back safely to 'simple' if localStorage contains invalid or undefined value", () => {
    localStorage.setItem("telemetryVerbosity", "invalid_mode");
    const { result } = renderHook(() => useAppState());
    expect(result.current.state.prefs.telemetryVerbosity).toBe("simple");
  });

  it("initializes to 'advanced' when localStorage has 'advanced'", () => {
    localStorage.setItem("telemetryVerbosity", "advanced");
    const { result } = renderHook(() => useAppState());
    expect(result.current.state.prefs.telemetryVerbosity).toBe("advanced");
  });

  it("updates state and localStorage when setTelemetryVerbosity is called", () => {
    const { result } = renderHook(() => useAppState());
    expect(result.current.state.prefs.telemetryVerbosity).toBe("simple");

    act(() => {
      result.current.actions.setTelemetryVerbosity("advanced");
    });

    expect(result.current.state.prefs.telemetryVerbosity).toBe("advanced");
    expect(localStorage.getItem("telemetryVerbosity")).toBe("advanced");

    act(() => {
      result.current.actions.setTelemetryVerbosity("simple");
    });

    expect(result.current.state.prefs.telemetryVerbosity).toBe("simple");
    expect(localStorage.getItem("telemetryVerbosity")).toBe("simple");
  });

  it("routes setPref('telemetryVerbosity', mode) through setTelemetryVerbosity", () => {
    const { result } = renderHook(() => useAppState());

    act(() => {
      result.current.actions.setPref("telemetryVerbosity", "advanced");
    });

    expect(result.current.state.prefs.telemetryVerbosity).toBe("advanced");
    expect(localStorage.getItem("telemetryVerbosity")).toBe("advanced");
  });
});

describe("Telemetry verbosity component rendering", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders World3D overlay with plain-language labels in 'simple' mode and raw parameters in 'advanced' mode", () => {
    const { getByTestId, getByText } = render(
      <TestWrapper>
        <World3D />
      </TestWrapper>,
    );

    // In 'simple' mode (default):
    expect(getByText(/Da Boom \(Center\)/i)).toBeTruthy();
    expect(getByText(/View distance 96m · Smooth \(34 fps\)/i)).toBeTruthy();

    // Toggle to 'advanced':
    act(() => {
      getByTestId("toggle-btn").click();
    });

    // In 'advanced' mode:
    expect(getByText(/Da Boom <128,128,26>/i)).toBeTruthy();
    expect(getByText(/draw 96m · 34 fps/i)).toBeTruthy();
  });

  it("renders ConsoleFrame telemetry with plain-language labels in 'simple' mode and raw parameters in 'advanced' mode", () => {
    const { getByTestId, getAllByText } = render(
      <TestWrapper>
        <ConsoleFrame />
      </TestWrapper>,
    );

    // In 'simple' mode (default):
    expect(getAllByText(/RESPONSE/i).length).toBeGreaterThan(0);

    // Toggle to 'advanced':
    act(() => {
      getByTestId("toggle-btn").click();
    });

    // In 'advanced' mode:
    expect(getAllByText(/PING/i).length).toBeGreaterThan(0);
  });
});
