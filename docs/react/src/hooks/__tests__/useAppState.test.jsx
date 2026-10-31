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
      initialSyncedAt.getTime()
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
      initialTime.getTime()
    );
    expect(result.current.state.toast).toContain("Balance synced: L$ 4,250");
  });
});

describe("useAppState hook - Centralized Recovery State Machine & Auto-Reconnection", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("initializes recovery state machine properties with default values", () => {
    const { result } = renderHook(() => useAppState());
    expect(result.current.state.recoveryState).toBe("idle");
    expect(result.current.state.reconnectAttempts).toBe(0);
    expect(result.current.state.nextRetryDelay).toBe(1000);
    expect(result.current.state.asyncQueryState).toBeDefined();
    expect(result.current.state.asyncQueryState.search).toEqual({ status: "idle", loading: false, error: null });
    expect(result.current.state.asyncQueryState.inventory).toEqual({ status: "idle", loading: false, error: null });
  });

  it("triggers recovery and executes exponential backoff reconnect attempts when server drops", () => {
    const { result } = renderHook(() => useAppState());

    act(() => {
      result.current.actions.triggerRecovery("Test server disconnect");
    });

    expect(result.current.state.recoveryState).toBe("detecting");
    expect(result.current.state.toast).toContain("Test server disconnect");

    // Advance 500ms to trigger first reconnect attempt
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.state.recoveryState).toBe("recovered");
    expect(result.current.state.reconnectAttempts).toBe(0);
    expect(result.current.state.toast).toContain("Reconnected to OpenSim local grid");
  });

  it("handles reconnection failure and transitions to failed state after max retries when offline", () => {
    const { result } = renderHook(() => useAppState());

    act(() => {
      result.current.actions.toggleOfflineGrid(); // Set offlineRunning = false
    });

    act(() => {
      result.current.actions.attemptReconnection(1);
    });

    expect(result.current.state.recoveryState).toBe("reconnecting");
    expect(result.current.state.reconnectAttempts).toBe(1);

    // Advance timers for backoff retries 1->2->3->4->5
    for (let i = 1; i <= 5; i++) {
      act(() => {
        vi.advanceTimersByTime(20000);
      });
    }

    expect(result.current.state.recoveryState).toBe("failed");
    expect(result.current.state.reconnectAttempts).toBe(5);
    expect(result.current.state.consoleLogs.some((l) => l.msg.includes("Max reconnection attempts"))).toBe(true);
  });

  it("cancels recovery sequence when cancelRecovery is called", () => {
    const { result } = renderHook(() => useAppState());

    act(() => {
      result.current.actions.triggerRecovery("Testing cancellation");
    });

    act(() => {
      result.current.actions.cancelRecovery();
    });

    expect(result.current.state.recoveryState).toBe("idle");
    expect(result.current.state.reconnectAttempts).toBe(0);
    expect(result.current.state.toast).toContain("Auto-reconnection cancelled");
  });

  it("emits events to subscribers through event bus when recovery events occur", () => {
    const { result } = renderHook(() => useAppState());
    const eventHandler = vi.fn();

    act(() => {
      result.current.actions.subscribeRecoveryEvent(eventHandler);
    });

    act(() => {
      result.current.actions.triggerRecovery("Event bus test");
    });

    expect(eventHandler).toHaveBeenCalled();
    const lastEvent = eventHandler.mock.calls[0][0];
    expect(lastEvent.type).toBe("RECOVERY_STARTED");
    expect(lastEvent.reason).toBe("Event bus test");
  });

  it("manages async query timeout and injects recovery fallback state", async () => {
    const { result } = renderHook(() => useAppState());

    let queryPromise;
    act(() => {
      queryPromise = result.current.actions.runAsyncQuery(
        "search",
        () => new Promise((resolve) => setTimeout(resolve, 5000)),
        2000
      );
    });

    expect(result.current.state.asyncQueryState.search.status).toBe("loading");

    // Advance timer past timeout limit (2000ms)
    act(() => {
      vi.advanceTimersByTime(2500);
    });

    await expect(queryPromise).rejects.toThrow("Query timed out");
    expect(result.current.state.asyncQueryState.search.status).toBe("timeout");
    expect(result.current.state.toast).toContain("query timed out");
  });
});
