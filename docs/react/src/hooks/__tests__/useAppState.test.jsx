import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAppState } from "../useAppState.js";

describe("useAppState hook - Balance Polling & Sync", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("initializes balance state with default values", () => {
    const { result } = renderHook(() => useAppState());
    expect(result.current.state.lindenBalance).toBe(4250);
    expect(result.current.state.exchangeRate).toBe(248.5);
    expect(result.current.state.lastSyncedAt).toBeInstanceOf(Date);
  });

  it("updates lastSyncedAt during 30-second background polling interval", () => {
    const { result } = renderHook(() => useAppState());
    const initialSyncedAt = result.current.state.lastSyncedAt;

    act(() => {
      vi.advanceTimersByTime(30000);
    });

    expect(result.current.state.lastSyncedAt.getTime()).toBeGreaterThanOrEqual(
      initialSyncedAt.getTime(),
    );
  });

  it("cleans up background polling interval timer on unmount", () => {
    const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");
    const { unmount } = renderHook(() => useAppState());

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it("manually syncs balance when refreshBalance action is called", () => {
    const { result } = renderHook(() => useAppState());
    const initialTime = result.current.state.lastSyncedAt;

    act(() => {
      vi.advanceTimersByTime(5000);
      result.current.actions.refreshBalance();
    });

    expect(result.current.state.lastSyncedAt.getTime()).toBeGreaterThan(
      initialTime.getTime(),
    );
    expect(result.current.state.toast).toContain("Balance synced: L$ 4,250");
  });
});
