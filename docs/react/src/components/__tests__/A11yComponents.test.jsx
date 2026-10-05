import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import RailNav from "../RailNav.jsx";
import BottomTabs from "../BottomTabs.jsx";
import FloatersDesktop from "../FloatersDesktop.jsx";
import ConsoleFrame from "../ConsoleFrame.jsx";
import MenuBar from "../MenuBar.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import { ThemeContext } from "../../context/ThemeContext.jsx";

const baseState = {
  screen: "Chat",
  layout: "terminal",
  palette: "ink",
  tabs: { Chat: "LOCAL", Friends: "ALL", Diagnostics: "AGNI" },
  invOpen: { Objects: true },
  dismissed: {},
  pinned: {},
  flOpen: { Chat: true, Radar: true },
  flMin: {},
  flZ: ["Chat", "Radar"],
  cDock: ["fly", "sit", "snap"],
  cTog: {},
  cEdit: false,
  cPad: true,
  cRun: false,
  cHeld: "",
  cCam: "ORBIT",
  cHdg: 0,
  cPitch: 0,
  cDrag: false,
  menu: null,
  prefs: { draw: "high", quality: "ultra", fps: "60fps", cacheLimit: 512, cacheLoc: "Internal storage" },
  toggles: {},
};

const baseTheme = {
  V: { surf: "#111", surf2: "#222", outv: "#333", pri: "#00f", priC: "#00a", onpriC: "#fff", ink: "#fff", ink2: "#aaa", rp: "8px", rs: "4px", navr: "4px", sec: "#555", sec2: "#444", bg: "#000", gnd: "#222", gnd2: "#111", sky1: "#003", sky2: "#005", err: "#f00" },
  t: { font: "sans-serif", dfont: "monospace" },
  d: { split: false },
  ink: () => "#ffffff",
  nav: "rail",
  immersive: false,
  isFloat: true,
  isSweepDesk: false,
  consoleScene: false,
  C: { bar: 32, wide: true, gap: 4, rail: 104, cur: 16, foot: 24, dock: 40, rad: 8 },
};

function renderComponent(ui, stateOverrides = {}, themeOverrides = {}, actionOverrides = {}) {
  const state = { ...baseState, ...stateOverrides };
  const theme = { ...baseTheme, ...themeOverrides };
  const setScreen = vi.fn();
  const setMenu = vi.fn();
  const flToggle = vi.fn();
  const flClose = vi.fn();
  const cPress = vi.fn();
  const cTap = vi.fn();
  const actions = {
    setScreen,
    setMenu,
    flToggle,
    flClose,
    cPress,
    cTap,
    flFocus: vi.fn(),
    flR: () => ({ x: 0, y: 0, w: 200, h: 200 }),
    notify: vi.fn(),
    allGrids: () => [{ key: "agni", label: "Agni" }],
    ...actionOverrides,
  };

  const utils = render(
    <AppContext.Provider value={{ state, actions }}>
      <ThemeContext.Provider value={theme}>
        {ui}
      </ThemeContext.Provider>
    </AppContext.Provider>
  );

  return { ...utils, actions };
}

describe("Keyboard Accessibility in Refactored Controls", () => {
  it("RailNav items have role=button, tabIndex=0, and trigger navigation on Enter/Space", () => {
    const { actions } = renderComponent(<RailNav />, {}, { nav: "rail" });
    const chatBtn = screen.getByRole("button", { name: "CHAT" });
    expect(chatBtn.getAttribute("tabindex")).toBe("0");

    fireEvent.keyDown(chatBtn, { key: "Enter" });
    expect(actions.setScreen).toHaveBeenCalledWith("Chat");

    fireEvent.keyDown(chatBtn, { key: " " });
    expect(actions.setScreen).toHaveBeenCalledWith("Chat");
  });

  it("BottomTabs items have role=button, tabIndex=0, and trigger navigation on Enter/Space", () => {
    const { actions } = renderComponent(<BottomTabs />, {}, { nav: "tabs" });
    const chatTab = screen.getByRole("button", { name: "CHAT" });
    expect(chatTab.getAttribute("tabindex")).toBe("0");

    fireEvent.keyDown(chatTab, { key: "Enter" });
    expect(actions.setScreen).toHaveBeenCalledWith("Chat");

    fireEvent.keyDown(chatTab, { key: " " });
    expect(actions.setScreen).toHaveBeenCalledWith("Chat");
  });

  it("FloatersDesktop HUD close button and window controls respond to keyboard focus and keypresses", () => {
    const { actions } = renderComponent(<FloatersDesktop />);
    const closeHudBtn = screen.getByRole("button", { name: "Close HUD" });
    expect(closeHudBtn.getAttribute("tabindex")).toBe("0");

    fireEvent.keyDown(closeHudBtn, { key: "Enter" });
    expect(screen.queryByText("CAMERA CONTROLS")).toBeNull();

    const minBtns = screen.getAllByRole("button", { name: "Minimize" });
    expect(minBtns[0].getAttribute("tabindex")).toBe("0");
    fireEvent.keyDown(minBtns[0], { key: "Enter" });
    expect(actions.flToggle).toHaveBeenCalled();
  });

  it("ConsoleFrame rail buttons and dock slots support keyboard focus and keypresses", () => {
    const { actions } = renderComponent(<ConsoleFrame />, {}, { isConsole: true });
    const chatRailBtn = screen.getByRole("button", { name: "CHAT" });
    expect(chatRailBtn.getAttribute("tabindex")).toBe("0");

    fireEvent.keyDown(chatRailBtn, { key: "Enter" });
    expect(actions.cTap).toHaveBeenCalledWith("Chat");
  });

  it("MenuBar headers and dropdown items support keyboard focus and state toggling", () => {
    const { actions } = renderComponent(<MenuBar />, { menu: "Edit" }, { isFloat: true });
    const editMenuBtn = screen.getByRole("button", { name: "Edit menu" });
    expect(editMenuBtn.getAttribute("tabindex")).toBe("0");
    expect(editMenuBtn.getAttribute("aria-expanded")).toBe("true");

    const preferenceItem = screen.getByRole("button", { name: "Preferences…" });
    expect(preferenceItem.getAttribute("tabindex")).toBe("0");

    fireEvent.keyDown(preferenceItem, { key: "Enter" });
    expect(actions.flFocus).toHaveBeenCalledWith("Settings");
  });
});
