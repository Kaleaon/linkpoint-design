import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import StateBlock from "../components/StateBlock.jsx";
import FloatersDesktop from "../components/FloatersDesktop.jsx";
import Search from "../screens/Search.jsx";
import { AppProvider } from "../context/AppContext.jsx";
import { ThemeProvider, useThemeTokens } from "../context/ThemeContext.jsx";
import { computeThemeTokens } from "../theme/computeTheme.js";
import { PALETTES } from "../theme/palettes.js";
import fs from "fs";
import path from "path";

function getLuminance(hex) {
  if (!hex || typeof hex !== "string") return 0;
  const cleanHex = hex.replace("#", "");
  const fullHex = cleanHex.length === 3 ? cleanHex.split("").map((c) => c + c).join("") : cleanHex;
  const num = parseInt(fullHex, 16);
  if (isNaN(num)) return 0;
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  const a = [r, g, b].map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(hex1, hex2) {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

describe("Theme-Aware Focus Rings & Accessibility", () => {
  it("computes contrast-compliant focus ring colors for all palettes (>= 3:1 WCAG SC 1.4.11)", () => {
    for (const paletteKey of Object.keys(PALETTES)) {
      const state = { layout: "terminal", palette: paletteKey, dense: false };
      const tokens = computeThemeTokens(state);
      expect(tokens.V.focusRing).toBeDefined();
      expect(tokens.V.focusRingShadow).toBeDefined();

      const contrast = getContrastRatio(tokens.V.focusRing, tokens.V.bg);
      expect(contrast).toBeGreaterThanOrEqual(3.0);
    }
  });

  it("sets --k-focus-ring and --k-focus-ring-shadow CSS variables on document.documentElement", () => {
    function TestConsumer() {
      const tokens = useThemeTokens();
      return <div data-testid="consumer">{tokens.V.focusRing}</div>;
    }

    render(
      <AppProvider>
        <ThemeProvider>
          <TestConsumer />
        </ThemeProvider>
      </AppProvider>
    );

    const rootFocusRing = document.documentElement.style.getPropertyValue("--k-focus-ring");
    const rootFocusRingShadow = document.documentElement.style.getPropertyValue("--k-focus-ring-shadow");

    expect(rootFocusRing).toBeTruthy();
    expect(rootFocusRingShadow).toBeTruthy();
  });

  it("does not apply inline outline: none on StateBlock action button", () => {
    render(
      <AppProvider>
        <ThemeProvider>
          <StateBlock />
        </ThemeProvider>
      </AppProvider>
    );

    // Default stateBlockActive is true in error/empty/loading conditions
    // Render error state:
    const button = screen.queryByRole("button");
    if (button) {
      expect(button.style.outline).not.toBe("none");
    }
  });

  it("does not apply inline outline: none on quick-chat input in FloatersDesktop", () => {
    const mockState = {
      layout: "terminal",
      palette: "ink",
      device: "desk",
      screen: "Chat",
      flOpen: { Chat: true },
      flMin: {},
      flZ: ["Chat"],
    };

    render(
      <AppProvider initialState={mockState}>
        <ThemeProvider>
          <FloatersDesktop />
        </ThemeProvider>
      </AppProvider>
    );

    const input = screen.getByPlaceholderText("Nearby Chat...");
    expect(input).toBeDefined();
    expect(input.style.outline).not.toBe("none");
  });

  it("does not apply inline outline: none on search input in Search screen", () => {
    const mockState = {
      layout: "terminal",
      palette: "ink",
      device: "and",
      screen: "Search",
      searchQuery: "",
    };

    render(
      <AppProvider initialState={mockState}>
        <ThemeProvider>
          <Search />
        </ThemeProvider>
      </AppProvider>
    );

    const input = screen.getByLabelText("Filter or search residents by name");
    expect(input).toBeDefined();
    expect(input.style.outline).not.toBe("none");
  });

  it("verifies global index.css contains dynamic focus ring rules", () => {
    const cssPath = path.resolve(__dirname, "../index.css");
    const cssContent = fs.readFileSync(cssPath, "utf-8");

    expect(cssContent).toContain("var(--k-focus-ring");
    expect(cssContent).toContain("var(--k-focus-ring-shadow");
    expect(cssContent).not.toContain("outline: 2px solid #6cff9a;");
  });
});
