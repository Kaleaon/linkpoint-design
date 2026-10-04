import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "../Header.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import { ThemeContext } from "../../context/ThemeContext.jsx";
import { HEAD } from "../../data/content.js";

describe("Header & HEAD Balance Formatting", () => {
  it("formats Linden balance totals and USD estimates in HEAD helper", () => {
    const headData = HEAD("Terminal", "Ink", {}, { lindenBalance: 4250, exchangeRate: 248.5 });
    expect(headData.Transactions[0]).toBe("L$ TRANSACTIONS");
    expect(headData.Transactions[1]).toContain("balance L$ 4,250 (~$17.10 USD)");
  });

  it("renders transaction balance header in Header component", () => {
    const mockState = {
      layout: "terminal",
      palette: "ink",
      lindenBalance: 4250,
      exchangeRate: 248.5,
      cacheCleared: {},
      prefs: { cacheLimit: 512, cacheLoc: "Internal" },
    };

    const mockThemeContext = {
      V: { pri: "#00f0ff", ink: "#ffffff", ink2: "#aaa", outv: "#333", tls: "0.1em" },
      t: { font: "sans-serif", dfont: "monospace" },
      headLook: "stack",
      condPack: null,
      scr: "Transactions",
      isConsole: false,
    };

    render(
      <AppContext.Provider value={{ state: mockState, actions: {} }}>
        <ThemeContext.Provider value={mockThemeContext}>
          <Header />
        </ThemeContext.Provider>
      </AppContext.Provider>
    );

    expect(screen.getByText("L$ TRANSACTIONS")).toBeTruthy();
    expect(screen.getByText("> balance L$ 4,250 (~$17.10 USD) · 14 in the last 30 days")).toBeTruthy();
  });
});
