import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { AppProvider, useApp } from "../context/AppContext.jsx";
import { ThemeProvider } from "../context/ThemeContext.jsx";
import { KthemeProvider } from "@ktheme/react";
import DeviceFrame from "../components/DeviceFrame.jsx";
import LiveRegionAnnouncer from "../components/LiveRegionAnnouncer.jsx";

// Helper component inside AppProvider to exercise actions directly
function NavigationTester() {
  const { state, actions } = useApp();

  return (
    <div data-testid="nav-tester">
      <button data-testid="btn-inventory" onClick={() => actions.setScreen("Inventory")}>
        Go to Inventory
      </button>
      <button data-testid="btn-radar" onClick={() => actions.setScreen("Radar")}>
        Go to Radar
      </button>
      <button data-testid="btn-chat-im" onClick={() => actions.startIm("Nyx Vaher")}>
        Chat Nyx
      </button>
      <button data-testid="btn-toast" onClick={() => actions.notify("Teleport initiated")}>
        Send Toast
      </button>
      <span data-testid="current-screen">{state.screen}</span>
    </div>
  );
}

function TestApp() {
  return (
    <AppProvider>
      <KthemeProvider themeId="navy-gold">
        <ThemeProvider>
          <LiveRegionAnnouncer />
          <DeviceFrame />
          <NavigationTester />
        </ThemeProvider>
      </KthemeProvider>
    </AppProvider>
  );
}

describe("App End-to-End Navigation & Live Region Accessibility", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.title = "Linkpoint Mobile";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("dynamically updates document.title and live region across view transitions", () => {
    render(<TestApp />);

    // Initial state
    expect(document.title).toBe("Chat | Linkpoint Mobile");
    const liveRegion = screen.getByTestId("live-region-announcer");
    expect(liveRegion).toBeTruthy();
    expect(liveRegion.getAttribute("role")).toBe("status");
    expect(liveRegion.getAttribute("aria-live")).toBe("polite");
    expect(liveRegion.textContent).toBe("");

    // Navigate to Inventory
    act(() => {
      fireEvent.click(screen.getByTestId("btn-inventory"));
    });

    expect(document.title).toBe("Inventory | Linkpoint Mobile");
    expect(liveRegion.textContent).toBe("Navigated to Inventory");

    // Advance linger time
    act(() => {
      vi.advanceTimersByTime(1100);
    });

    // Navigate to Radar
    act(() => {
      fireEvent.click(screen.getByTestId("btn-radar"));
    });

    expect(document.title).toBe("Radar | Linkpoint Mobile");
    expect(liveRegion.textContent).toBe("Navigated to Radar");

    // Advance linger time
    act(() => {
      vi.advanceTimersByTime(1100);
    });

    // Start IM with Nyx Vaher
    act(() => {
      fireEvent.click(screen.getByTestId("btn-chat-im"));
    });

    expect(document.title).toBe("Chat with Nyx Vaher | Linkpoint Mobile");
    expect(liveRegion.textContent).toBe("Navigated to Chat with Nyx Vaher");
  });

  it("handles simultaneous screen transition and toast notification without dropping either message", () => {
    render(<TestApp />);

    const liveRegion = screen.getByTestId("live-region-announcer");

    // Fire screen change and toast in immediate sequence
    act(() => {
      fireEvent.click(screen.getByTestId("btn-inventory"));
      fireEvent.click(screen.getByTestId("btn-toast"));
    });

    // Navigation announcement is displayed first
    expect(document.title).toBe("Inventory | Linkpoint Mobile");
    expect(liveRegion.textContent).toBe("Navigated to Inventory");

    // Advance 1000ms queue linger to process queued toast
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(liveRegion.textContent).toBe("Teleport initiated");
  });
});
