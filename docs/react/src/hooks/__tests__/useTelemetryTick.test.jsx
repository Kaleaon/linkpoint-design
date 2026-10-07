import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTelemetryTick } from "../useTelemetryTick.js";

describe("useTelemetryTick hook", () => {
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

  it("initializes with tick = 0 and increments every 1000ms when document is visible", () => {
    const { result } = renderHook(() => useTelemetryTick());
    expect(result.current).toBe(0);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current).toBe(1);

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current).toBe(3);
  });

  it("pauses interval execution when document becomes hidden", () => {
    let hidden = false;
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => hidden,
    });

    const { result } = renderHook(() => useTelemetryTick());

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current).toBe(1);

    // Hide document and trigger visibilitychange
    act(() => {
      hidden = true;
      document.dispatchEvent(new Event("visibilitychange"));
    });

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    // Should stay at 1 because timer is paused
    expect(result.current).toBe(1);

    // Resume visibility and trigger visibilitychange
    act(() => {
      hidden = false;
      document.dispatchEvent(new Event("visibilitychange"));
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current).toBe(2);
  });

  it("does not start timer if initialized when document is hidden", () => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => true,
    });

    const { result } = renderHook(() => useTelemetryTick());

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current).toBe(0);
  });

  it("cleans up interval handle and visibility listener on unmount", () => {
    const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");
    const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");

    const { unmount } = renderHook(() => useTelemetryTick());

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    expect(removeEventListenerSpy).toHaveBeenCalledWith("visibilitychange", expect.any(Function));
  });
});
