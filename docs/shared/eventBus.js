/**
 * Shared Event Bus and Intent Reducer for Linkpoint
 * Centralized dispatch pipeline for user interaction events.
 */

export class EventBus {
  constructor() {
    this.listeners = new Set();
    this.logs = [];
  }

  subscribe(listener) {
    if (typeof listener !== "function") {
      throw new Error("EventBus listener must be a function");
    }
    this.listeners.add(listener);
    return () => this.unsubscribe(listener);
  }

  unsubscribe(listener) {
    this.listeners.delete(listener);
  }

  dispatch(intent) {
    if (!intent || typeof intent !== "object" || !intent.type) {
      throw new Error("Intent event must be an object with a 'type' property");
    }

    // Ensure payload is JSON serializable (strips non-serializable data)
    let serializablePayload = {};
    if (intent.payload !== undefined) {
      try {
        serializablePayload = JSON.parse(JSON.stringify(intent.payload));
      } catch (err) {
        console.warn("EventBus: payload contains non-serializable data", err);
        serializablePayload = {};
      }
    }

    const intentEvent = {
      type: intent.type,
      payload: serializablePayload,
      timestamp: new Date().toISOString()
    };

    this.logs.push(intentEvent);

    this.listeners.forEach((listener) => {
      try {
        listener(intentEvent);
      } catch (err) {
        console.error("EventBus: error in listener handler", err);
      }
    });

    return intentEvent;
  }

  dispatchIntent(type, payload = {}) {
    return this.dispatch({ type, payload });
  }

  getLogs() {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export function intentReducer(state, intent) {
  if (!state || !intent || !intent.type) return state;

  const { type, payload = {} } = intent;

  switch (type) {
    case "DIALOG_BUTTON_CLICK":
    case "DIALOG_ACTION": {
      const { actionId, label, title } = payload;
      const buttonLabel = label || actionId || "";
      const dlgTitle = title || "";
      let toastMsg = "";

      if (dlgTitle && buttonLabel) {
        toastMsg = dlgTitle.split(" ").slice(0, 4).join(" ") + " — " + buttonLabel;
      } else if (buttonLabel) {
        toastMsg = buttonLabel;
      }

      return {
        ...state,
        dialog: null,
        ...(toastMsg ? { toast: toastMsg } : {})
      };
    }

    case "DIALOG_CLOSE":
    case "DIALOG_DISMISS": {
      return {
        ...state,
        dialog: null
      };
    }

    case "FLOATER_MINIMIZE":
    case "FLOATER_TOGGLE": {
      const { id } = payload;
      if (!id) return state;
      const flOpen = state.flOpen || {};
      const flMin = state.flMin || {};
      const flZ = state.flZ || [];

      const isMin = flOpen[id] && !flMin[id];
      if (isMin) {
        return {
          ...state,
          flMin: { ...flMin, [id]: true },
          menu: null
        };
      } else {
        return {
          ...state,
          flOpen: { ...flOpen, [id]: true },
          flMin: { ...flMin, [id]: false },
          flZ: flZ.filter((x) => x !== id).concat(id),
          screen: id,
          menu: null
        };
      }
    }

    case "FLOATER_CLOSE": {
      const { id } = payload;
      if (!id) return state;
      const flOpen = state.flOpen || {};
      return {
        ...state,
        flOpen: { ...flOpen, [id]: false },
        menu: null
      };
    }

    case "NAVIGATE_SCREEN": {
      const { screen } = payload;
      if (!screen) return state;
      return {
        ...state,
        screen,
        dialog: null
      };
    }

    case "QUICK_CHAT_SUBMIT": {
      const { message } = payload;
      if (!message) return state;
      return {
        ...state,
        toast: `Local Chat (${message})`
      };
    }

    default:
      return state;
  }
}

// Attach to globalThis for traditional browser script tag inclusion
if (typeof globalThis !== "undefined") {
  globalThis.LinkpointEventBus = { EventBus, intentReducer };
  if (typeof window !== "undefined") {
    window.EventBus = EventBus;
    window.intentReducer = intentReducer;
  }
}
