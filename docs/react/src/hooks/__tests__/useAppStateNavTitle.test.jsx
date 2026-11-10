import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  useAppState,
  computeScreenTitle,
  formatDocumentTitle,
} from "../useAppState.js";
import { SCREENS } from "../../theme/constants.js";

describe("useAppState hook - Dynamic Navigation Title Synchronization (WCAG 2.4.2 SC)", () => {
  beforeEach(() => {
    document.title = "Linkpoint Mobile";
  });

  it("exports computeScreenTitle and formatDocumentTitle helper functions", () => {
    expect(computeScreenTitle("Inventory")).toBe("Inventory");
    expect(computeScreenTitle("Chat", { Chat: "LOCAL" }, "Nyx Vaher")).toBe(
      "Chat",
    );
    expect(computeScreenTitle("Chat", { Chat: "IM" }, "Nyx Vaher")).toBe(
      "Chat with Nyx Vaher",
    );
    expect(
      computeScreenTitle("Chat", { Chat: "GROUP" }, "Bay City Builders"),
    ).toBe("Chat with Bay City Builders");
    expect(formatDocumentTitle("Inventory")).toBe(
      "Inventory | Linkpoint Mobile",
    );
  });

  it("initializes document.title with the active screen format on mount", () => {
    const { result } = renderHook(() => useAppState());

    expect(result.current.state.screen).toBe("Chat");
    expect(result.current.state.screenTitle).toBe("Chat");
    expect(result.current.state.title).toBe("Chat | Linkpoint Mobile");
    expect(document.title).toBe("Chat | Linkpoint Mobile");
  });

  it("updates document.title and state.screenTitle when navigating across all 22 screens", () => {
    const { result } = renderHook(() => useAppState());

    expect(SCREENS.length).toBe(22);

    for (const scr of SCREENS) {
      act(() => {
        result.current.actions.setScreen(scr);
      });

      expect(result.current.state.screen).toBe(scr);
      const expectedScreenTitle = scr === "Chat" ? "Chat" : scr;
      expect(result.current.state.screenTitle).toBe(expectedScreenTitle);
      expect(result.current.state.title).toBe(
        `${expectedScreenTitle} | Linkpoint Mobile`,
      );
      expect(document.title).toBe(`${expectedScreenTitle} | Linkpoint Mobile`);
    }
  });

  it("dynamically reflects sub-tabs and active entity chip focus in Chat", () => {
    const { result } = renderHook(() => useAppState());

    // Switch to IM tab with default chip "Nyx Vaher"
    act(() => {
      result.current.actions.setTab("Chat", "IM");
    });

    expect(result.current.state.screenTitle).toBe("Chat with Nyx Vaher");
    expect(result.current.state.title).toBe(
      "Chat with Nyx Vaher | Linkpoint Mobile",
    );
    expect(document.title).toBe("Chat with Nyx Vaher | Linkpoint Mobile");

    // Change chip to Kit Sandalwood
    act(() => {
      result.current.actions.setChip("Kit Sandalwood");
    });

    expect(result.current.state.screenTitle).toBe("Chat with Kit Sandalwood");
    expect(result.current.state.title).toBe(
      "Chat with Kit Sandalwood | Linkpoint Mobile",
    );
    expect(document.title).toBe("Chat with Kit Sandalwood | Linkpoint Mobile");

    // Change tab to GROUP with Bay City Builders
    act(() => {
      result.current.actions.setTab("Chat", "GROUP");
      result.current.actions.setChip("Bay City Builders");
    });

    expect(result.current.state.screenTitle).toBe(
      "Chat with Bay City Builders",
    );
    expect(result.current.state.title).toBe(
      "Chat with Bay City Builders | Linkpoint Mobile",
    );
    expect(document.title).toBe(
      "Chat with Bay City Builders | Linkpoint Mobile",
    );

    // Return to LOCAL chat
    act(() => {
      result.current.actions.setTab("Chat", "LOCAL");
    });

    expect(result.current.state.screenTitle).toBe("Chat");
    expect(result.current.state.title).toBe("Chat | Linkpoint Mobile");
    expect(document.title).toBe("Chat | Linkpoint Mobile");
  });

  it("updates title when startIm action is dispatched", () => {
    const { result } = renderHook(() => useAppState());

    // Navigate away first
    act(() => {
      result.current.actions.setScreen("Friends");
    });
    expect(document.title).toBe("Friends | Linkpoint Mobile");

    // Start IM with someone
    act(() => {
      result.current.actions.startIm("Kit Sandalwood");
    });

    expect(result.current.state.screen).toBe("Chat");
    expect(result.current.state.tabs.Chat).toBe("IM");
    expect(result.current.state.chip).toBe("Kit Sandalwood");
    expect(result.current.state.screenTitle).toBe("Chat with Kit Sandalwood");
    expect(result.current.state.title).toBe(
      "Chat with Kit Sandalwood | Linkpoint Mobile",
    );
    expect(document.title).toBe("Chat with Kit Sandalwood | Linkpoint Mobile");
  });
});
