import { describe, it, expect } from "vitest";
import React from "react";
import ReactDOMServer from "react-dom/server";

// Mock window for Node execution
if (typeof globalThis.window === "undefined") {
  globalThis.window = {
    location: { search: "", href: "http://localhost/" },
    innerWidth: 1024,
    addEventListener: () => {},
    removeEventListener: () => {},
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  };
}

import { computeTheme, computeThemeTokens, computeThemeRuntime } from "../theme/computeTheme.js";
import { ThemeTokensContext, ThemeRuntimeContext, ThemeProvider, useThemeTokens, useThemeRuntime, useTheme } from "../context/ThemeContext.jsx";
import { AppProvider } from "../context/AppContext.jsx";

describe("Split Theme Context Architecture", () => {
  it("exports all split context objects and hooks", () => {
    expect(ThemeTokensContext).toBeDefined();
    expect(ThemeRuntimeContext).toBeDefined();
    expect(typeof useThemeTokens).toBe("function");
    expect(typeof useThemeRuntime).toBe("function");
    expect(typeof useTheme).toBe("function");
    expect(typeof ThemeProvider).toBe("function");
  });

  it("computes design tokens and runtime properties correctly", () => {
    const mockState = {
      layout: "terminal",
      palette: "ink",
      customTheme: null,
      dense: false,
      device: "and",
      screen: "Chat",
      cond: "normal",
    };
    const mockCf = () => ({ gap: 4, cur: 40, rad: 36, rail: 84, bar: 70, dock: 52, foot: 30, wide: false });

    const tokens = computeThemeTokens(mockState);
    expect(tokens.V).toBeDefined();
    expect(tokens.t).toBeDefined();
    expect(tokens.pad).toBeDefined();
    expect(tokens.LK).toBeDefined();
    expect(typeof tokens.ink).toBe("function");

    const runtime = computeThemeRuntime(mockState, mockCf, tokens);
    expect(runtime.d).toBeDefined();
    expect(runtime.nav).toBeDefined();
    expect(runtime.scr).toBeDefined();
    expect(typeof runtime.sel).toBe("function");
    expect("condPack" in runtime).toBe(true);
    expect("bare" in runtime).toBe(true);
    expect("immersive" in runtime).toBe(true);
    expect("headLook" in runtime).toBe(true);

    const composite = computeTheme(mockState, mockCf);
    expect(composite.V).toBeDefined();
    expect(composite.scr).toBeDefined();
  });

  it("verifies slice isolation across screen navigation", () => {
    const state1 = { layout: "terminal", palette: "ink", customTheme: null, dense: false, device: "and", screen: "Chat", cond: "normal" };
    const state2 = { ...state1, screen: "Profile" };
    const mockCf = () => ({ gap: 4, cur: 40, rad: 36, rail: 84, bar: 70, dock: 52, foot: 30, wide: false });

    const tokens1 = computeThemeTokens(state1);
    const tokens2 = computeThemeTokens(state2);

    expect(tokens1.V).toEqual(tokens2.V);
    expect(tokens1.t).toEqual(tokens2.t);
    expect(tokens1.pad).toBe(tokens2.pad);
    expect(tokens1.LK).toBe(tokens2.LK);

    const runtime1 = computeThemeRuntime(state1, mockCf, tokens1);
    const runtime2 = computeThemeRuntime(state2, mockCf, tokens2);

    expect(runtime1.scr).toBe("Chat");
    expect(runtime2.scr).toBe("Profile");
    expect(runtime1.scr).not.toBe(runtime2.scr);
  });

  it("renders components using ThemeProvider correctly", () => {
    let tokenComponentRenders = 0;
    let runtimeComponentRenders = 0;
    let compositeComponentRenders = 0;

    function TokenComponent() {
      const { V, t } = useThemeTokens();
      tokenComponentRenders++;
      return React.createElement("div", null, `Token: ${t.font}`);
    }

    function RuntimeComponent() {
      const { scr } = useThemeRuntime();
      runtimeComponentRenders++;
      return React.createElement("div", null, `Screen: ${scr}`);
    }

    function CompositeComponent() {
      const { V, scr } = useTheme();
      compositeComponentRenders++;
      return React.createElement("div", null, `Composite: ${scr}`);
    }

    function TestContainer() {
      return React.createElement(
        ThemeProvider,
        null,
        React.createElement(TokenComponent),
        React.createElement(RuntimeComponent),
        React.createElement(CompositeComponent)
      );
    }

    const html1 = ReactDOMServer.renderToString(
      React.createElement(AppProvider, null, React.createElement(TestContainer))
    );
    expect(html1).toContain("Chat");
    expect(tokenComponentRenders).toBe(1);
    expect(runtimeComponentRenders).toBe(1);
    expect(compositeComponentRenders).toBe(1);
  });

  it("resolves all canonical layout variations and legacy aliases without error", () => {
    const canonicalLayouts = [
      "terminal",
      "lcars",
      "metro",
      "frutiger_aero",
      "art_deco",
      "press",
      "modern_glass",
      "material3",
      "cyberpunk",
    ];
    const legacyAliases = ["sweep", "tiles", "glass", "rules"];
    const allKeys = [...canonicalLayouts, ...legacyAliases];
    const mockCf = () => ({ gap: 4, cur: 40, rad: 36, rail: 84, bar: 70, dock: 52, foot: 30, wide: false });

    for (const key of allKeys) {
      const state = {
        layout: key,
        palette: "ink",
        customTheme: null,
        dense: false,
        device: "and",
        screen: "Chat",
        cond: "normal",
      };

      const tokens = computeThemeTokens(state);
      expect(tokens).toBeDefined();
      expect(tokens.V).toBeDefined();
      expect(tokens.t.name).toBeDefined();
      expect(tokens.LK.card).toBeDefined();
      expect(tokens.LK.head).toBeDefined();

      const runtime = computeThemeRuntime(state, mockCf, tokens);
      expect(runtime).toBeDefined();
      expect(runtime.nav).toBeDefined();

      // Check specific layout design invariants
      if (key === "lcars" || key === "sweep") {
        expect(runtime.nav).toBe("sweep");
        expect(tokens.V.rs).toBe("999px");
        expect(tokens.LK.card).toBe("cap");
      }
      if (key === "metro" || key === "tiles") {
        expect(runtime.nav).toBe("tiles");
        expect(tokens.V.rs).toBe("0px");
        expect(tokens.LK.card).toBe("flat");
        expect(tokens.LK.head).toBe("pivot");
      }
      if (key === "frutiger_aero" || key === "glass") {
        expect(runtime.nav).toBe("tabs");
        expect(tokens.V.rs).toBe("12px");
        expect(tokens.LK.card).toBe("soft");
      }
      if (key === "art_deco" || key === "rules") {
        expect(tokens.V.rs).toBe("0px");
        expect(tokens.LK.card).toBe("rule");
        expect(tokens.LK.head).toBe("rule");
      }
      if (key === "material3") {
        expect(tokens.LK.card).toBe("tonal");
        expect(tokens.V.rs).toBe("12px");
        expect(runtime.nav).toBe("tabs");
      }
      if (key === "cyberpunk") {
        expect(tokens.LK.card).toBe("chamfer");
        expect(tokens.V.rs).toBe("0px");
        expect(tokens.t.nav.toLowerCase()).toBe("rail");
        expect(runtime.nav).toBe("tabs");
      }
      if (key === "press") {
        expect(tokens.LK.card).toBe("quiet");
        expect(tokens.LK.head).toBe("editorial");
        expect(runtime.nav).toBe("tabs");
      }
      if (key === "modern_glass") {
        expect(tokens.LK.card).toBe("soft");
        expect(tokens.V.rs).toBe("14px");
        expect(runtime.nav).toBe("tabs");
      }
    }
  });

  it("verifies isSweepDesk desktop adaptation on both lcars and sweep keys", () => {
    const mockCf = () => ({ gap: 4, cur: 40, rad: 36, rail: 84, bar: 70, dock: 52, foot: 30, wide: false });

    for (const key of ["lcars", "sweep"]) {
      const state = {
        layout: key,
        palette: "lcars",
        customTheme: null,
        dense: false,
        device: "desk",
        screen: "Chat",
        cond: "normal",
      };
      const tokens = computeThemeTokens(state);
      const runtime = computeThemeRuntime(state, mockCf, tokens);
      expect(runtime.isFloat).toBe(true);
      expect(runtime.isSweepDesk).toBe(true);
    }

    // Metro desktop floater is NOT sweep desk
    const metroState = {
      layout: "metro",
      palette: "metro",
      customTheme: null,
      dense: false,
      device: "desk",
      screen: "Chat",
      cond: "normal",
    };
    const metroTokens = computeThemeTokens(metroState);
    const metroRuntime = computeThemeRuntime(metroState, mockCf, metroTokens);
    expect(metroRuntime.isFloat).toBe(true);
    expect(metroRuntime.isSweepDesk).toBe(false);
  });
});
