import { describe, it, expect, vi } from "vitest";
import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  TabGroup,
  TabList,
  Tab,
  TabPanel,
  useTabContext,
} from "../TabGroup.jsx";
import SegmentedTabs from "../SegmentedTabs.jsx";
import BottomTabs from "../BottomTabs.jsx";
import ChipRow from "../ChipRow.jsx";
import ScreenBody from "../ScreenBody.jsx";
import Chat from "../../screens/Chat.jsx";
import { AppProvider, AppContext } from "../../context/AppContext.jsx";
import {
  ThemeProvider,
  ThemeTokensContext,
  ThemeRuntimeContext,
} from "../../context/ThemeContext.jsx";

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
  tabs: { Chat: "IM", Friends: "ALL" },
  chip: "Nyx Vaher",
  lures: {},
  lureState: {},
};

const mockAppActions = {
  setMenu: vi.fn(),
  setScreen: vi.fn(),
  notify: vi.fn(),
  setTab: vi.fn(),
  setChip: vi.fn(),
  openSearch: vi.fn(),
  allGrids: vi.fn(() => []),
  getEventBus: vi.fn(() => ({
    getLogs: () => [],
    dispatch: () => {},
    dispatchIntent: () => {},
  })),
};

const mockTokens = {
  LK: { seg: "fill", chips: true, card: "box", gap: "9px" },
  pad: "12px",
  C: { gap: 6 },
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
    rl: "8px",
  },
  t: {
    font: "Inter, sans-serif",
    dfont: "JetBrains Mono, monospace",
  },
  ink: (color) => color,
  isFloat: false,
  isSweepDesk: false,
  nav: "tabs",
  immersive: false,
};

const mockRuntime = {
  norm: true,
  scr: "Chat",
  split: false,
  d: { split: false },
};

function renderWithProviders(
  ui,
  {
    appState = mockAppState,
    actions = mockAppActions,
    tokens = mockTokens,
    runtime = mockRuntime,
  } = {}
) {
  return render(
    <AppContext.Provider value={{ state: appState, actions }}>
      <ThemeRuntimeContext.Provider value={runtime}>
        <ThemeTokensContext.Provider value={tokens}>
          {ui}
        </ThemeTokensContext.Provider>
      </ThemeRuntimeContext.Provider>
    </AppContext.Provider>
  );
}

describe("TabGroup Compound Component System", () => {
  it("automatically generates matching id, aria-controls, and aria-labelledby without explicit string ID props", () => {
    render(
      <TabGroup defaultIndex={0}>
        <TabList aria-label="Settings Tabs">
          <Tab>General</Tab>
          <Tab>Privacy</Tab>
          <Tab>Audio</Tab>
        </TabList>
        <TabPanel>General Content</TabPanel>
      </TabGroup>
    );

    const tablist = screen.getByRole("tablist", { name: "Settings Tabs" });
    expect(tablist).toBeTruthy();

    const tabs = screen.getAllByRole("tab");
    expect(tabs.length).toBe(3);

    const panel = screen.getByRole("tabpanel");
    expect(panel).toBeTruthy();
    expect(panel.textContent).toBe("General Content");

    // Dynamic ID binding checks
    const firstTab = tabs[0];
    const secondTab = tabs[1];

    expect(firstTab.id).toBeTruthy();
    expect(firstTab.getAttribute("aria-controls")).toBeTruthy();
    expect(firstTab.getAttribute("aria-selected")).toBe("true");
    expect(firstTab.getAttribute("tabindex")).toBe("0");

    expect(secondTab.getAttribute("aria-selected")).toBe("false");
    expect(secondTab.getAttribute("tabindex")).toBe("-1");

    // Matching linkage
    expect(firstTab.getAttribute("aria-controls")).toBe(panel.id);
    expect(panel.getAttribute("aria-labelledby")).toBe(firstTab.id);
    expect(panel.getAttribute("tabindex")).toBe("0");
  });

  it("supports roving tabindex and horizontal arrow navigation (ArrowRight, ArrowLeft, Home, End)", () => {
    function ControlledTest() {
      const [active, setActive] = useState(0);
      return (
        <TabGroup activeIndex={active} onSelect={setActive}>
          <TabList aria-label="Roving Nav">
            <Tab>Alpha</Tab>
            <Tab>Beta</Tab>
            <Tab>Gamma</Tab>
          </TabList>
          <TabPanel>Active is {active}</TabPanel>
        </TabGroup>
      );
    }

    render(<ControlledTest />);

    const tablist = screen.getByRole("tablist");
    const tabs = screen.getAllByRole("tab");

    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
    expect(tabs[0].getAttribute("tabindex")).toBe("0");
    expect(tabs[1].getAttribute("tabindex")).toBe("-1");

    // Focus first tab and press ArrowRight
    tabs[0].focus();
    fireEvent.keyDown(tablist, { key: "ArrowRight" });

    expect(tabs[1].getAttribute("aria-selected")).toBe("true");
    expect(tabs[1].getAttribute("tabindex")).toBe("0");
    expect(tabs[0].getAttribute("tabindex")).toBe("-1");

    // Press ArrowRight again
    fireEvent.keyDown(tablist, { key: "ArrowRight" });
    expect(tabs[2].getAttribute("aria-selected")).toBe("true");

    // ArrowRight on last tab wraps around to first tab
    fireEvent.keyDown(tablist, { key: "ArrowRight" });
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");

    // ArrowLeft wraps backwards to last tab
    fireEvent.keyDown(tablist, { key: "ArrowLeft" });
    expect(tabs[2].getAttribute("aria-selected")).toBe("true");

    // Home goes to first tab
    fireEvent.keyDown(tablist, { key: "Home" });
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");

    // End goes to last tab
    fireEvent.keyDown(tablist, { key: "End" });
    expect(tabs[2].getAttribute("aria-selected")).toBe("true");
  });

  it("supports vertical arrow navigation when orientation='vertical'", () => {
    function VerticalTest() {
      const [active, setActive] = useState(0);
      return (
        <TabGroup
          activeIndex={active}
          onSelect={setActive}
          orientation="vertical"
        >
          <TabList aria-label="Vertical Nav">
            <Tab>Top</Tab>
            <Tab>Middle</Tab>
            <Tab>Bottom</Tab>
          </TabList>
        </TabGroup>
      );
    }

    render(<VerticalTest />);

    const tablist = screen.getByRole("tablist");
    expect(tablist.getAttribute("aria-orientation")).toBe("vertical");

    const tabs = screen.getAllByRole("tab");
    tabs[0].focus();

    fireEvent.keyDown(tablist, { key: "ArrowDown" });
    expect(tabs[1].getAttribute("aria-selected")).toBe("true");

    fireEvent.keyDown(tablist, { key: "ArrowUp" });
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
  });

  it("accepts style overrides on TabGroup, TabList, Tab, and TabPanel wrappers", () => {
    render(
      <TabGroup style={{ margin: "20px" }} className="custom-group">
        <TabList
          style={{ padding: "10px" }}
          className="custom-list"
          aria-label="Custom Styled"
        >
          <Tab style={{ border: "2px dashed red" }} className="custom-tab">
            Custom Tab
          </Tab>
        </TabList>
        <TabPanel style={{ background: "purple" }} className="custom-panel">
          Custom Content
        </TabPanel>
      </TabGroup>
    );

    const group = document.querySelector(".custom-group");
    expect(group.style.margin).toBe("20px");

    const list = screen.getByRole("tablist");
    expect(list.style.padding).toBe("10px");
    expect(list.className).toContain("custom-list");

    const tab = screen.getByRole("tab");
    expect(tab.style.border).toBe("2px dashed red");
    expect(tab.className).toContain("custom-tab");

    const panel = screen.getByRole("tabpanel");
    expect(panel.style.background).toBe("purple");
    expect(panel.className).toContain("custom-panel");
  });

  it("SegmentedTabs renders TabList and Tab components with WAI-ARIA tab semantics", () => {
    renderWithProviders(<SegmentedTabs />);

    const tablist = screen.getByRole("tablist", { name: "View Filters" });
    expect(tablist).toBeTruthy();

    const tabs = screen.getAllByRole("tab");
    expect(tabs.length).toBe(3); // LOCAL, IM, GROUP for Chat

    // IM is active in mockAppState
    const imTab = tabs.find((t) => t.textContent.includes("IM"));
    expect(imTab).toBeTruthy();
    expect(imTab.getAttribute("aria-selected")).toBe("true");
    expect(imTab.getAttribute("tabindex")).toBe("0");

    const localTab = tabs.find((t) => t.textContent.includes("LOCAL"));
    expect(localTab.getAttribute("aria-selected")).toBe("false");
    expect(localTab.getAttribute("tabindex")).toBe("-1");

    // Clicking a tab calls setSub which invokes setTab
    fireEvent.click(localTab);
    expect(mockAppActions.setTab).toHaveBeenCalledWith("Chat", "LOCAL");
  });

  it("BottomTabs renders TabGroup, TabList, Tab items, and TabPanel with matching controls", () => {
    renderWithProviders(<BottomTabs />);

    const nav = screen.getByRole("navigation", {
      name: "Bottom Tabs Navigation",
    });
    expect(nav).toBeTruthy();

    const tablist = screen.getByRole("tablist", {
      name: "Bottom Tabs Navigation",
    });
    expect(tablist).toBeTruthy();

    const tabs = screen.getAllByRole("tab");
    expect(tabs.length).toBeGreaterThanOrEqual(4);

    const activeTab = tabs.find(
      (t) => t.getAttribute("aria-selected") === "true"
    );
    expect(activeTab).toBeTruthy();

    const panel = screen.getByRole("tabpanel");
    expect(panel).toBeTruthy();

    expect(activeTab.getAttribute("aria-controls")).toBe(panel.id);
    expect(panel.getAttribute("aria-labelledby")).toBe(activeTab.id);
  });

  it("ChipRow renders thread filter chips inside TabList and ALL contacts button as an external sibling control", () => {
    renderWithProviders(<ChipRow />);

    const tablist = screen.getByRole("tablist", { name: "Thread Selection" });
    expect(tablist).toBeTruthy();

    // Verify chips inside TabList have role="tab"
    const tabs = screen.getAllByRole("tab");
    expect(tabs.length).toBeGreaterThan(0);
    tabs.forEach((tab) => {
      expect(tablist.contains(tab)).toBe(true);
    });

    // Verify the "ALL contacts" chip is OUTSIDE TabList and is a button
    const allBtn = screen.getByRole("button", { name: /all.*contacts/i });
    expect(allBtn).toBeTruthy();
    expect(tablist.contains(allBtn)).toBe(false);

    // Clicking ALL contacts opens search
    fireEvent.click(allBtn);
    expect(mockAppActions.openSearch).toHaveBeenCalledWith("Chat");
  });

  it("ScreenBody coordinates SegmentedTabs and content panels inside TabGroup", () => {
    renderWithProviders(<ScreenBody />);

    const main = screen.getByRole("main", { name: "Main Content" });
    expect(main).toBeTruthy();

    // Verify tablist and tabpanel both exist inside ScreenBody
    const tablists = screen.getAllByRole("tablist");
    expect(tablists.length).toBeGreaterThanOrEqual(1);

    const panels = screen.getAllByRole("tabpanel");
    expect(panels.length).toBeGreaterThanOrEqual(1);

    // Active subnav tab controls the main tabpanel
    const subnavTablist = screen.getByRole("tablist", { name: "View Filters" });
    const tabs = subnavTablist.querySelectorAll('[role="tab"]');
    const activeSubTab = Array.from(tabs).find(
      (t) => t.getAttribute("aria-selected") === "true"
    );
    expect(activeSubTab).toBeTruthy();

    // Ensure activeSubTab aria-controls links to a real element in the document
    const controlledId = activeSubTab.getAttribute("aria-controls");
    const controlledEl = document.getElementById(controlledId);
    expect(controlledEl).toBeTruthy();
    expect(controlledEl.getAttribute("role")).toBe("tabpanel");
  });

  it("Chat message list container renders as TabPanel dynamically linked to thread tabs", () => {
    renderWithProviders(<Chat />);

    const panel = screen.getByRole("tabpanel");
    expect(panel).toBeTruthy();

    // On IM tab with Nyx Vaher active, panel id is bound to chat-threads
    expect(panel.id).toContain("chat-threads-panel");
    expect(panel.getAttribute("aria-labelledby")).toContain("chat-threads-tab");
  });
});
