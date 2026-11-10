import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { AppProvider } from "../../context/AppContext.jsx";
import { ThemeProvider } from "../../context/ThemeContext.jsx";
import { KthemeProvider } from "@ktheme/react";
import ConsoleFrame from "../ConsoleFrame.jsx";

function setupMatchMedia(reducedMotion = false) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches:
      query === "(prefers-reduced-motion: reduce)" ? reducedMotion : false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe("ConsoleFrame DTCG Motion Token Integration", () => {
  beforeEach(() => {
    setupMatchMedia(false);
  });

  it("applies DTCG motion tokens to console navigation transitions under standard motion settings", () => {
    const { container } = render(
      <AppProvider>
        <KthemeProvider themeId="navy-gold">
          <ThemeProvider>
            <ConsoleFrame />
          </ThemeProvider>
        </KthemeProvider>
      </AppProvider>,
    );

    // Look for rail nav items which have transition styles
    const navItems = container.querySelectorAll("[style*='cursor: pointer']");
    expect(navItems.length).toBeGreaterThan(0);

    // Find nav item with background transition
    const animatedItem = Array.from(navItems).find(
      (el) => el.style.transition && el.style.transition.includes("background"),
    );
    expect(animatedItem).toBeDefined();
    expect(animatedItem.style.transition).toMatch(
      /--ktheme-motion-duration|150ms|300ms/,
    );
    expect(animatedItem.style.transition).toMatch(
      /--ktheme-motion-easing|cubic-bezier/,
    );
  });

  it("disables transitions when user prefers reduced motion (WCAG 2.3.3)", () => {
    setupMatchMedia(true);

    const { container } = render(
      <AppProvider>
        <KthemeProvider themeId="navy-gold">
          <ThemeProvider>
            <ConsoleFrame />
          </ThemeProvider>
        </KthemeProvider>
      </AppProvider>,
    );

    const navItems = container.querySelectorAll("[style*='cursor: pointer']");
    expect(navItems.length).toBeGreaterThan(0);

    const animatedItem = Array.from(navItems).find(
      (el) => el.style.transition && el.style.transition !== "none",
    );
    // Under reduced motion, animatedItem should be none or undefined
    expect(animatedItem).toBeUndefined();
  });

  it("gracefully falls back to DTCG defaults when rendered outside KthemeProvider", () => {
    setupMatchMedia(false);

    const { container } = render(
      <AppProvider>
        <ThemeProvider>
          <ConsoleFrame />
        </ThemeProvider>
      </AppProvider>,
    );

    const navItems = container.querySelectorAll("[style*='cursor: pointer']");
    expect(navItems.length).toBeGreaterThan(0);

    const animatedItem = Array.from(navItems).find(
      (el) => el.style.transition && el.style.transition.includes("background"),
    );
    expect(animatedItem).toBeDefined();
    expect(animatedItem.style.transition).toMatch(
      /--ktheme-motion-duration|150ms|300ms/,
    );
  });
});
