import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import Header from "../Header.jsx";
import SplitDetail from "../SplitDetail.jsx";
import Profile from "../../screens/Profile.jsx";
import OfflineGrid from "../../screens/OfflineGrid.jsx";
import { AppProvider } from "../../context/AppContext.jsx";
import { ThemeProvider, ThemeContext } from "../../context/ThemeContext.jsx";

describe("Heading Hierarchy Integration Tests", () => {
  it("renders <h1> element for primary titles in Header", () => {
    render(
      <AppProvider>
        <ThemeProvider>
          <Header />
        </ThemeProvider>
      </AppProvider>
    );

    const h1Elements = screen.getAllByRole("heading", { level: 1 });
    expect(h1Elements.length).toBeGreaterThanOrEqual(1);
  });

  it("renders <h2> title and <h3> detail row headers in SplitDetail", () => {
    const mockThemeValue = {
      V: { pri: "#00f0ff", ink: "#ffffff", ink2: "#aaa", outv: "#333", surf: "#111", bg: "#000", rs: "4px" },
      t: { font: "sans-serif", dfont: "monospace" },
      d: { split: true },
      isFloat: false,
      scr: "Chat",
    };

    render(
      <AppProvider>
        <ThemeContext.Provider value={mockThemeValue}>
          <SplitDetail />
        </ThemeContext.Provider>
      </AppProvider>
    );

    const h2Elements = screen.getAllByRole("heading", { level: 2 });
    expect(h2Elements.length).toBeGreaterThanOrEqual(1);

    const h3Elements = screen.getAllByRole("heading", { level: 3 });
    expect(h3Elements.length).toBeGreaterThanOrEqual(1);
  });

  it("renders <h1> for user name and <h2> for block titles in Profile", () => {
    render(
      <AppProvider>
        <ThemeProvider>
          <Profile />
        </ThemeProvider>
      </AppProvider>
    );

    const h1Elements = screen.getAllByRole("heading", { level: 1 });
    expect(h1Elements.some((el) => el.textContent === "Nyx Vaher")).toBe(true);

    const h2Elements = screen.getAllByRole("heading", { level: 2 });
    expect(h2Elements.length).toBeGreaterThanOrEqual(1);
  });

  it("renders <h2> section headers and <h3> sub-headers in OfflineGrid", () => {
    render(
      <AppProvider>
        <ThemeProvider>
          <OfflineGrid />
        </ThemeProvider>
      </AppProvider>
    );

    const h2Elements = screen.getAllByRole("heading", { level: 2 });
    expect(h2Elements.length).toBeGreaterThanOrEqual(4);
    expect(h2Elements.some((el) => el.textContent === "LOCAL GRID ENGINE")).toBe(true);
    expect(h2Elements.some((el) => el.textContent === "OAR REGION BACKUP IMPORTER")).toBe(true);
    expect(h2Elements.some((el) => el.textContent === "LOCAL ASSET & SL UPLOAD CENTER")).toBe(true);
    expect(h2Elements.some((el) => el.textContent === "STORAGE & CACHE SIZING MANAGER")).toBe(true);

    const h3Elements = screen.getAllByRole("heading", { level: 3 });
    expect(h3Elements.some((el) => el.textContent === "OpenSim Local Server")).toBe(true);
  });
});
