import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen, act } from "@testing-library/react";
import LiveRegionAnnouncer from "../LiveRegionAnnouncer.jsx";
import { AppContext } from "../../context/AppContext.jsx";

describe("LiveRegionAnnouncer Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders a persistent live container element with status role and polite attributes", () => {
    const mockState = { screen: "Chat", toast: "" };
    render(
      <AppContext.Provider value={{ state: mockState, actions: {} }}>
        <LiveRegionAnnouncer />
      </AppContext.Provider>
    );

    const statusEl = screen.getByTestId("live-region-announcer");
    expect(statusEl).toBeTruthy();
    expect(statusEl.getAttribute("role")).toBe("status");
    expect(statusEl.getAttribute("aria-live")).toBe("polite");
    expect(statusEl.getAttribute("aria-atomic")).toBe("true");
    expect(statusEl.textContent).toBe("");
  });

  it("triggers ARIA live region announcement formatted as 'Navigated to <Screen Name>' on screen transition", () => {
    let mockState = { screen: "Chat", toast: "" };
    const { rerender } = render(
      <AppContext.Provider value={{ state: mockState, actions: {} }}>
        <LiveRegionAnnouncer />
      </AppContext.Provider>
    );

    const statusEl = screen.getByTestId("live-region-announcer");
    expect(statusEl.textContent).toBe("");

    // Transition to Inventory
    mockState = { screen: "Inventory", screenTitle: "Inventory", toast: "" };
    rerender(
      <AppContext.Provider value={{ state: mockState, actions: {} }}>
        <LiveRegionAnnouncer />
      </AppContext.Provider>
    );

    expect(statusEl.textContent).toBe("Navigated to Inventory");

    // Transition to Settings
    act(() => {
      vi.advanceTimersByTime(1100);
    });
    mockState = { screen: "Settings", screenTitle: "Settings", toast: "" };
    rerender(
      <AppContext.Provider value={{ state: mockState, actions: {} }}>
        <LiveRegionAnnouncer />
      </AppContext.Provider>
    );

    expect(statusEl.textContent).toBe("Navigated to Settings");
  });

  it("announces toasts without dropping messages", () => {
    let mockState = { screen: "Chat", toast: "" };
    const { rerender } = render(
      <AppContext.Provider value={{ state: mockState, actions: {} }}>
        <LiveRegionAnnouncer />
      </AppContext.Provider>
    );

    const statusEl = screen.getByTestId("live-region-announcer");

    // Post a toast
    mockState = { screen: "Chat", toast: "Teleport completed" };
    rerender(
      <AppContext.Provider value={{ state: mockState, actions: {} }}>
        <LiveRegionAnnouncer />
      </AppContext.Provider>
    );

    expect(statusEl.textContent).toBe("Teleport completed");
  });

  it("queues screen navigation and toast announcements cleanly without dropping updates (Guardrail 1)", () => {
    let mockState = { screen: "Chat", toast: "" };
    const { rerender } = render(
      <AppContext.Provider value={{ state: mockState, actions: {} }}>
        <LiveRegionAnnouncer />
      </AppContext.Provider>
    );

    const statusEl = screen.getByTestId("live-region-announcer");

    // Simulate switching screen to Profile and firing toast in close succession
    mockState = {
      screen: "Profile",
      screenTitle: "Profile",
      toast: "Opened profile: Nyx Vaher",
    };
    rerender(
      <AppContext.Provider value={{ state: mockState, actions: {} }}>
        <LiveRegionAnnouncer />
      </AppContext.Provider>
    );

    // First announcement displayed immediately
    expect(statusEl.textContent).toBe("Navigated to Profile");

    // Advance 1000ms queue linger to process queued toast
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(statusEl.textContent).toBe("Opened profile: Nyx Vaher");
  });

  it("handles multiple rapid screen transitions sequentially via queue", () => {
    let mockState = { screen: "Chat", toast: "" };
    const { rerender } = render(
      <AppContext.Provider value={{ state: mockState, actions: {} }}>
        <LiveRegionAnnouncer />
      </AppContext.Provider>
    );

    const statusEl = screen.getByTestId("live-region-announcer");

    // Switch to Map
    mockState = { screen: "Map", screenTitle: "Map", toast: "" };
    rerender(
      <AppContext.Provider value={{ state: mockState, actions: {} }}>
        <LiveRegionAnnouncer />
      </AppContext.Provider>
    );

    expect(statusEl.textContent).toBe("Navigated to Map");

    // Switch immediately to Radar before 1000ms expires
    mockState = { screen: "Radar", screenTitle: "Radar", toast: "" };
    rerender(
      <AppContext.Provider value={{ state: mockState, actions: {} }}>
        <LiveRegionAnnouncer />
      </AppContext.Provider>
    );

    // "Navigated to Map" is still active
    expect(statusEl.textContent).toBe("Navigated to Map");

    // Advance 1000ms
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // "Navigated to Radar" is processed next
    expect(statusEl.textContent).toBe("Navigated to Radar");
  });

  it("cleans up active timers on unmount without errors", () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");
    let mockState = { screen: "Chat", toast: "" };
    const { rerender, unmount } = render(
      <AppContext.Provider value={{ state: mockState, actions: {} }}>
        <LiveRegionAnnouncer />
      </AppContext.Provider>
    );

    mockState = { screen: "Inventory", screenTitle: "Inventory", toast: "" };
    rerender(
      <AppContext.Provider value={{ state: mockState, actions: {} }}>
        <LiveRegionAnnouncer />
      </AppContext.Provider>
    );

    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
