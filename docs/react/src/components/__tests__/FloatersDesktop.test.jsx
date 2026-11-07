import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import React, { useState } from "react";
import FloatersDesktop from "../FloatersDesktop.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import { ThemeContext } from "../../context/ThemeContext.jsx";
import * as contentModule from "../../data/content.js";

vi.mock("../ScreenBody.jsx", () => ({
  default: () => <div data-testid="screen-body-mock" />,
}));

const mockThemeContext = {
  LK: { card: "box", gap: "8px" },
  V: {
    bg: "#0a1112",
    surf: "#101a1c",
    surf2: "#1b2a2d",
    pri: "#6cff9a",
    onpri: "#000000",
    sec2: "#8ad0b0",
    ink: "#ffffff",
    ink2: "#a7c8bc",
    outv: "#365047",
    sky1: "#1c4a5c",
    sky2: "#12333a",
    gnd: "#10241d",
    gnd2: "#0a1112",
    rp: "4px",
    rs: "4px",
  },
  t: {
    font: 'system-ui, sans-serif',
    dfont: 'monospace',
  },
  ink: (bg) => "#ffffff",
  isSweepDesk: false,
};

const initialMockState = {
  layout: "terminal",
  palette: "ink",
  screen: "Chat",
  tabs: { Friends: "ALL" },
  loginMode: "grid",
  loginGrid: "agni",
  reconnecting: false,
  flOpen: { Chat: true, Radar: true },
  flMin: {},
  flShade: {},
  flRect: {
    Chat: { x: 20, y: 24, w: 424, h: 296 },
    Radar: { x: 462, y: 24, w: 372, h: 296 },
  },
  flZ: ["Chat", "Radar"],
  cDock: ["fly", "sit"],
  cTog: {},
  invOpen: {},
  cHdg: 214,
  cPitch: 0,
  cDrag: false,
  offlineRunning: false,
  offlineUser: { firstName: "Jane", lastName: "Doe" },
  consoleLogs: [],
  dismissed: {},
  toggles: { mediaAuto: false },
  pinned: {},
  dense: false,
  prefs: { cacheLimit: 512, cacheLoc: "Internal" },
  cacheCleared: {},
};

function TestWrapper({ children, onStateController }) {
  const [state, setState] = useState(initialMockState);
  const stateRef = React.useRef(state);
  stateRef.current = state;

  const actions = React.useMemo(
    () => ({
      sceneDown: vi.fn((e) => setState((s) => ({ ...s, cDrag: true }))),
      sceneMove: vi.fn((e) => setState((s) => ({ ...s, cHdg: s.cHdg + 10, cPitch: s.cPitch + 5 }))),
      sceneUp: vi.fn(() => setState((s) => ({ ...s, cDrag: false }))),
      flR: (id) => stateRef.current.flRect[id] || { x: 0, y: 0, w: 300, h: 200 },
      flDrag: vi.fn(),
      flFocus: vi.fn(),
      flToggle: vi.fn(),
      flToggleShade: vi.fn(),
      flClose: vi.fn(),
      dispatchIntent: vi.fn(),
      notify: vi.fn(),
      cPress: vi.fn(),
      cHold: vi.fn(),
      setScreen: vi.fn(),
      setTab: vi.fn(),
      setDialog: vi.fn(),
      setMenu: vi.fn(),
      allGrids: () => [{ key: "agni", label: "Agni (Main)", host: "login.agni.lindenlab.com" }],
    }),
    []
  );

  React.useEffect(() => {
    if (onStateController) {
      onStateController({
        updateState: (fn) => setState(fn),
        actions,
      });
    }
  }, [onStateController, actions]);

  return (
    <AppContext.Provider value={{ state, actions }}>
      <ThemeContext.Provider value={mockThemeContext}>
        {children}
      </ThemeContext.Provider>
    </AppContext.Provider>
  );
}

describe("FloatersDesktop memoization", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("memoizes buildCards across quick-chat typing, floater drags, and camera movements", () => {
    const buildCardsSpy = vi.spyOn(contentModule, "buildCards");

    let controller;
    const { container } = render(
      <TestWrapper onStateController={(c) => { controller = c; }}>
        <FloatersDesktop />
      </TestWrapper>
    );

    const initialCalls = buildCardsSpy.mock.calls.length;
    expect(initialCalls).toBe(1);

    // 1. Typing into quick-chat input bar triggers component re-render without re-executing buildCards
    const chatInput = screen.getByLabelText(/Nearby chat message/i);
    expect(chatInput).toBeDefined();

    fireEvent.change(chatInput, { target: { value: "Testing quick chat message" } });
    fireEvent.change(chatInput, { target: { value: "Second message draft" } });

    expect(buildCardsSpy.mock.calls.length).toBe(initialCalls);

    // 2. Camera orbit / dragging across the scene modifies cHdg/cPitch/cDrag without re-executing buildCards
    const scene = container.firstElementChild.firstElementChild;
    fireEvent.mouseDown(scene, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(scene, { clientX: 150, clientY: 120 });
    fireEvent.mouseMove(scene, { clientX: 200, clientY: 140 });
    fireEvent.mouseUp(scene);

    expect(buildCardsSpy.mock.calls.length).toBe(initialCalls);

    // 3. Floater repositioning/resizing (flRect) re-renders desktop without re-executing buildCards
    act(() => {
      controller.updateState((s) => ({
        ...s,
        flRect: { ...s.flRect, Chat: { x: 50, y: 50, w: 450, h: 320 } },
      }));
    });

    expect(buildCardsSpy.mock.calls.length).toBe(initialCalls);

    // 4. Updating a card-relevant dependency (layout) triggers buildCards execution
    act(() => {
      controller.updateState((s) => ({
        ...s,
        layout: "lcars",
      }));
    });

    expect(buildCardsSpy.mock.calls.length).toBe(initialCalls + 1);

    // 5. Updating palette triggers buildCards execution
    act(() => {
      controller.updateState((s) => ({
        ...s,
        palette: "metro",
      }));
    });

    expect(buildCardsSpy.mock.calls.length).toBe(initialCalls + 2);

    // 6. Updating toggles triggers buildCards execution
    act(() => {
      controller.updateState((s) => ({
        ...s,
        toggles: { ...s.toggles, mediaAuto: true },
      }));
    });

    expect(buildCardsSpy.mock.calls.length).toBe(initialCalls + 3);
  });

  it("renders floater preview lists correctly with memoized fBody", () => {
    render(
      <TestWrapper>
        <FloatersDesktop />
      </TestWrapper>
    );

    // Verify taskbar and floater preview buttons/headers exist
    expect(screen.getByText("CAM HUD")).toBeDefined();
    expect(screen.getAllByText("Local Chat").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Nearby").length).toBeGreaterThan(0);

    // Verify preview list content rendered from memoized fBody
    expect(screen.getByText("Nyx Vaher")).toBeDefined();
    expect(screen.getByText("8m")).toBeDefined();
  });
});
