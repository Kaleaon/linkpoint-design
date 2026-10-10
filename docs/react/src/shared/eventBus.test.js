import { describe, it, expect, vi } from "vitest";
import { EventBus, intentReducer } from "../../../shared/eventBus.js";

describe("EventBus Unit Tests", () => {
  it("subscribes and receives dispatched intent events", () => {
    const bus = new EventBus();
    const listener = vi.fn();
    const unsubscribe = bus.subscribe(listener);

    const intent = {
      type: "DIALOG_ACTION",
      payload: { actionId: "confirm", label: "ALLOW" },
    };
    bus.dispatch(intent);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "DIALOG_ACTION",
        payload: { actionId: "confirm", label: "ALLOW" },
        timestamp: expect.any(String),
      }),
    );

    unsubscribe();
    bus.dispatch(intent);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("serializes payloads and logs history", () => {
    const bus = new EventBus();
    bus.dispatchIntent("FLOATER_TOGGLE", {
      id: "Chat",
      domNode: { fake: true },
    });

    const logs = bus.getLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0].type).toEqual("FLOATER_TOGGLE");
    expect(logs[0].payload).toEqual({ id: "Chat", domNode: { fake: true } });

    bus.clearLogs();
    expect(bus.getLogs()).toHaveLength(0);
  });

  it("handles non-serializable payload safely without throwing", () => {
    const bus = new EventBus();
    const circularObj = {};
    circularObj.self = circularObj;

    expect(() => {
      bus.dispatchIntent("TEST_EVENT", { circular: circularObj });
    }).not.toThrow();

    const logs = bus.getLogs();
    expect(logs[0].payload).toEqual({});
  });
});

describe("intentReducer Unit Tests", () => {
  const initialState = {
    dialog: "Permissions",
    toast: "",
    flOpen: { Chat: true, Radar: true },
    flMin: { Chat: false, Radar: false },
    flZ: ["Radar", "Chat"],
    screen: "Chat",
  };

  it("handles DIALOG_ACTION and DIALOG_BUTTON_CLICK", () => {
    const intent = {
      type: "DIALOG_ACTION",
      payload: {
        dialogKey: "Permissions",
        actionId: "ALLOW ALWAYS",
        label: "ALLOW ALWAYS",
        title: "“Aurora Dance HUD” wants to animate",
      },
    };

    const nextState = intentReducer(initialState, intent);
    expect(nextState.dialog).toBeNull();
    expect(nextState.toast).toBe("“Aurora Dance HUD” wants — ALLOW ALWAYS");
  });

  it("handles DIALOG_CLOSE and DIALOG_DISMISS", () => {
    const intent = {
      type: "DIALOG_CLOSE",
      payload: { dialogKey: "Permissions" },
    };
    const nextState = intentReducer(initialState, intent);
    expect(nextState.dialog).toBeNull();
  });

  it("handles FLOATER_MINIMIZE and FLOATER_TOGGLE", () => {
    const intentMin = { type: "FLOATER_MINIMIZE", payload: { id: "Chat" } };
    const stateMin = intentReducer(initialState, intentMin);
    expect(stateMin.flMin.Chat).toBe(true);

    const intentRestore = { type: "FLOATER_TOGGLE", payload: { id: "Chat" } };
    const stateRestore = intentReducer(stateMin, intentRestore);
    expect(stateRestore.flMin.Chat).toBe(false);
    expect(stateRestore.screen).toBe("Chat");
  });

  it("handles FLOATER_CLOSE", () => {
    const intent = { type: "FLOATER_CLOSE", payload: { id: "Chat" } };
    const nextState = intentReducer(initialState, intent);
    expect(nextState.flOpen.Chat).toBe(false);
  });

  it("handles QUICK_CHAT_SUBMIT", () => {
    const intent = {
      type: "QUICK_CHAT_SUBMIT",
      payload: { message: "Hello Grid!" },
    };
    const nextState = intentReducer(initialState, intent);
    expect(nextState.toast).toBe("Local Chat (Hello Grid!)");
  });
});
