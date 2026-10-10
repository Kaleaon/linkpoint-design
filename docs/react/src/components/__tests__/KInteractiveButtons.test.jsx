import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import KInteractive, { KButton } from "../KInteractive.jsx";
import RailNav from "../RailNav.jsx";
import MenuBar from "../MenuBar.jsx";
import FloatersDesktop from "../FloatersDesktop.jsx";
import { AppContext, AppProvider } from "../../context/AppContext.jsx";
import { ThemeContext } from "../../context/ThemeContext.jsx";

describe("KInteractive & Standard Button Controls Accessibility", () => {
  it("renders native button by default with type='button'", () => {
    render(<KInteractive label="Test Button">Click Me</KInteractive>);
    const btn = screen.getByRole("button", { name: "Test Button" });
    expect(btn.tagName).toBe("BUTTON");
    expect(btn.getAttribute("type")).toBe("button");
    expect(btn.getAttribute("aria-label")).toBe("Test Button");
  });

  it("handles Enter and Space keydown events on non-button KInteractive", async () => {
    const handleClick = vi.fn();
    render(
      <KInteractive as="div" label="Div Button" onClick={handleClick}>
        Custom Div Button
      </KInteractive>
    );

    const control = screen.getByRole("button", { name: "Div Button" });
    expect(control.tagName).toBe("DIV");

    control.focus();
    expect(document.activeElement).toBe(control);

    fireEvent.keyDown(control, { key: "Enter", code: "Enter" });
    expect(handleClick).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(control, { key: " ", code: "Space" });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it("renders KButton as native button element", () => {
    render(<KButton label="KButton Action">Press</KButton>);
    const btn = screen.getByRole("button", { name: "KButton Action" });
    expect(btn.tagName).toBe("BUTTON");
  });

  it("renders RailNav controls as native buttons", () => {
    const mockState = { screen: "Chat" };
    const setScreen = vi.fn();
    const mockTheme = {
      V: { surf: "#111", outv: "#222", navr: "4px", onpriC: "#fff", ink2: "#888", priC: "#333" },
      t: { font: "sans-serif", dfont: "monospace" },
      nav: "rail",
      immersive: false,
    };

    render(
      <AppContext.Provider value={{ state: mockState, actions: { setScreen } }}>
        <ThemeContext.Provider value={mockTheme}>
          <RailNav />
        </ThemeContext.Provider>
      </AppContext.Provider>
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
    buttons.forEach((btn) => {
      expect(btn.tagName).toBe("BUTTON");
      expect(btn.getAttribute("aria-label")).toBeTruthy();
    });

    const chatBtn = screen.getByRole("button", { name: /chat/i });
    fireEvent.click(chatBtn);
    expect(setScreen).toHaveBeenCalledWith("Chat");
  });

  it("renders MenuBar controls with proper aria-expanded and menuitem roles", () => {
    const mockState = { menu: "File", flOpen: { Chat: true }, flMin: {} };
    const setMenu = vi.fn();
    const mockTheme = {
      V: { surf: "#111", outv: "#222", pri: "#00f", bg: "#000", onpri: "#fff", ink: "#fff", ink2: "#888", rs: "4px", rp: "8px" },
      t: { font: "sans-serif", dfont: "monospace" },
      ink: (bg, arr) => arr[0],
      isFloat: true,
      isSweepDesk: false,
    };

    render(
      <AppContext.Provider value={{ state: mockState, actions: { setMenu } }}>
        <ThemeContext.Provider value={mockTheme}>
          <MenuBar />
        </ThemeContext.Provider>
      </AppContext.Provider>
    );

    const fileMenuBtn = screen.getByRole("button", { name: "File" });
    expect(fileMenuBtn.tagName).toBe("BUTTON");
    expect(fileMenuBtn.getAttribute("aria-expanded")).toBe("true");

    const menuItems = screen.getAllByRole("menuitem");
    expect(menuItems.length).toBeGreaterThan(0);
    menuItems.forEach((item) => {
      expect(item.tagName).toBe("BUTTON");
      expect(item.getAttribute("aria-label")).toBeTruthy();
    });
  });

  it("renders FloatersDesktop taskbar and dock controls as native buttons", () => {
    const mockTheme = {
      V: { bg: "#000", sky1: "#111", sky2: "#222", gnd: "#333", gnd2: "#444", outv: "#555", surf: "#666", surf2: "#777", sec2: "#888", pri: "#999", rp: "8px", rs: "4px", ink: "#fff", ink2: "#aaa" },
      t: { font: "sans-serif", dfont: "monospace" },
      d: { split: false },
      ink: (bg, arr) => arr[0],
      isSweepDesk: false,
    };

    render(
      <AppProvider>
        <ThemeContext.Provider value={mockTheme}>
          <FloatersDesktop />
        </ThemeContext.Provider>
      </AppProvider>
    );

    const camHudClose = screen.getByRole("button", { name: "Close Camera HUD" });
    expect(camHudClose.tagName).toBe("BUTTON");

    const camHudToggle = screen.getByRole("button", { name: /CAM HUD/i });
    expect(camHudToggle.tagName).toBe("BUTTON");

    const orbitUp = screen.getByRole("button", { name: "Orbit Up" });
    expect(orbitUp.tagName).toBe("BUTTON");
  });
});
