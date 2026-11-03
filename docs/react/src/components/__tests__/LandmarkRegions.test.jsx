import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MenuBar from "../MenuBar.jsx";
import ScreenBody from "../ScreenBody.jsx";
import RailNav from "../RailNav.jsx";
import BottomTabs from "../BottomTabs.jsx";
import TileNav from "../TileNav.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import { ThemeTokensContext, ThemeRuntimeContext } from "../../context/ThemeContext.jsx";

const mockAppState = {
  screen: "Chat",
  layout: "terminal",
  palette: "ink",
  menu: null,
  flOpen: {},
  flMin: {},
  dialog: null,
  unreads: { Chat: 0, Radar: 0 },
  lindenBalance: 4250,
  exchangeRate: 248.5,
  cacheCleared: {},
  prefs: { cacheLimit: 512, cacheLoc: "Internal" },
  toggles: { mediaAuto: false, autoresponse: false },
  pinned: {},
  dismissed: {},
  tabs: { Friends: "ALL" },
  lures: {},
  lureState: {},
};

const mockAppActions = {
  setMenu: () => {},
  setScreen: () => {},
  notify: () => {},
  flFocus: () => {},
  flToggle: () => {},
  allGrids: () => [],
};

const mockTokens = {
  LK: { seg: "fill", chips: true, card: "box", gap: "9px" },
  pad: "12px",
  V: {
    surf: "#1e1e2e",
    surf2: "#2a2a3c",
    pri: "#ffb703",
    priC: "rgba(255, 183, 3, 0.2)",
    onpri: "#000000",
    onpriC: "#ffb703",
    sec: "#fb8500",
    sec2: "#3a3a4c",
    onsec: "#ffffff",
    bg: "#0f0f17",
    ink: "#ffffff",
    ink2: "#a0a0b0",
    outv: "#333344",
    bdg: "#e63946",
    onbdg: "#ffffff",
    rs: "4px",
    rp: "8px",
    navr: "4px",
  },
  t: {
    font: "Inter, sans-serif",
    dfont: "JetBrains Mono, monospace",
  },
  ink: (color) => color,
  isFloat: true,
  isSweepDesk: false,
  nav: "rail",
  immersive: false,
};

const mockRuntime = {
  norm: true,
  scr: "Chat",
  split: false,
  d: { split: false },
};

describe("Semantic HTML5 Landmark Region Wrappers", () => {
  it("MenuBar renders <header aria-label='Desktop Menu Bar'> landmark banner region", () => {
    const floatTokens = { ...mockTokens, isFloat: true };
    render(
      <AppContext.Provider value={{ state: mockAppState, actions: mockAppActions }}>
        <ThemeTokensContext.Provider value={floatTokens}>
          <MenuBar />
        </ThemeTokensContext.Provider>
      </AppContext.Provider>
    );

    const banner = screen.getByRole("banner", { name: "Desktop Menu Bar" });
    expect(banner).toBeTruthy();
    expect(banner.tagName).toBe("HEADER");
  });

  it("ScreenBody renders <main aria-label='Main Content'> landmark main region", () => {
    render(
      <AppContext.Provider value={{ state: mockAppState, actions: mockAppActions }}>
        <ThemeRuntimeContext.Provider value={mockRuntime}>
          <ThemeTokensContext.Provider value={mockTokens}>
            <ScreenBody />
          </ThemeTokensContext.Provider>
        </ThemeRuntimeContext.Provider>
      </AppContext.Provider>
    );

    const main = screen.getByRole("main", { name: "Main Content" });
    expect(main).toBeTruthy();
    expect(main.tagName).toBe("MAIN");
  });

  it("RailNav renders <nav aria-label='Rail Navigation'> landmark region", () => {
    const railTokens = { ...mockTokens, nav: "rail", immersive: false };
    render(
      <AppContext.Provider value={{ state: mockAppState, actions: mockAppActions }}>
        <ThemeTokensContext.Provider value={railTokens}>
          <RailNav />
        </ThemeTokensContext.Provider>
      </AppContext.Provider>
    );

    const nav = screen.getByRole("navigation", { name: "Rail Navigation" });
    expect(nav).toBeTruthy();
    expect(nav.tagName).toBe("NAV");
  });

  it("BottomTabs renders <nav aria-label='Bottom Tabs Navigation'> landmark region", () => {
    const tabsTokens = { ...mockTokens, nav: "tabs", immersive: false };
    render(
      <AppContext.Provider value={{ state: mockAppState, actions: mockAppActions }}>
        <ThemeTokensContext.Provider value={tabsTokens}>
          <BottomTabs />
        </ThemeTokensContext.Provider>
      </AppContext.Provider>
    );

    const nav = screen.getByRole("navigation", { name: "Bottom Tabs Navigation" });
    expect(nav).toBeTruthy();
    expect(nav.tagName).toBe("NAV");
  });

  it("TileNav renders <nav aria-label='Tile Navigation'> landmark region", () => {
    const tileTokens = { ...mockTokens, nav: "tiles", immersive: false };
    render(
      <AppContext.Provider value={{ state: mockAppState, actions: mockAppActions }}>
        <ThemeTokensContext.Provider value={tileTokens}>
          <TileNav />
        </ThemeTokensContext.Provider>
      </AppContext.Provider>
    );

    const nav = screen.getByRole("navigation", { name: "Tile Navigation" });
    expect(nav).toBeTruthy();
    expect(nav.tagName).toBe("NAV");
  });
});
