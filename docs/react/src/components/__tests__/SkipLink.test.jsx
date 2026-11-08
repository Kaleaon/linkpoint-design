import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { KthemeProvider } from "@ktheme/react";
import SkipLink from "../SkipLink.jsx";
import DeviceFrame from "../DeviceFrame.jsx";
import { AppProvider } from "../../context/AppContext.jsx";
import { ThemeProvider } from "../../context/ThemeContext.jsx";

describe("SkipLink Component and Focus Order", () => {
  it("renders an accessible skip navigation link pointing to #main-content", () => {
    render(<SkipLink />);
    const link = screen.getByRole("link", { name: "Skip to main content" });
    expect(link).toBeTruthy();
    expect(link.getAttribute("href")).toBe("#main-content");
    expect(link.className).toBe("skip-link");
  });

  it("invokes focus() on #main-content when clicked", () => {
    render(
      <div>
        <SkipLink />
        <main id="main-content" tabIndex={-1} aria-label="Main Content">
          Content
        </main>
      </div>
    );

    const link = screen.getByRole("link", { name: "Skip to main content" });
    const main = screen.getByRole("main", { name: "Main Content" });

    const focusSpy = vi.spyOn(main, "focus");
    fireEvent.click(link);

    expect(focusSpy).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(main);
    focusSpy.mockRestore();
  });

  it("moves focus to #main-content when Enter key is pressed on skip link", () => {
    render(
      <div>
        <SkipLink />
        <main id="main-content" tabIndex={-1} aria-label="Main Content">
          Content
        </main>
      </div>
    );

    const link = screen.getByRole("link", { name: "Skip to main content" });
    const main = screen.getByRole("main", { name: "Main Content" });

    const focusSpy = vi.spyOn(main, "focus");
    fireEvent.keyDown(link, { key: "Enter" });

    expect(focusSpy).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(main);
    focusSpy.mockRestore();
  });

  it("moves focus to #main-content and prevents default when Space key is pressed on skip link", () => {
    render(
      <div>
        <SkipLink />
        <main id="main-content" tabIndex={-1} aria-label="Main Content">
          Content
        </main>
      </div>
    );

    const link = screen.getByRole("link", { name: "Skip to main content" });
    const main = screen.getByRole("main", { name: "Main Content" });

    const focusSpy = vi.spyOn(main, "focus");
    const keyDownEvent = new KeyboardEvent("keydown", {
      key: " ",
      bubbles: true,
      cancelable: true,
    });
    const preventSpy = vi.spyOn(keyDownEvent, "preventDefault");

    link.dispatchEvent(keyDownEvent);

    expect(preventSpy).toHaveBeenCalled();
    expect(focusSpy).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(main);
    focusSpy.mockRestore();
  });

  it("renders SkipLink as the first interactive element inside DeviceFrame", () => {
    render(
      <AppProvider>
        <KthemeProvider themeId="navy-gold">
          <ThemeProvider>
            <DeviceFrame />
          </ThemeProvider>
        </KthemeProvider>
      </AppProvider>
    );

    const link = screen.getByRole("link", { name: "Skip to main content" });
    expect(link).toBeTruthy();

    const frame = document.querySelector(".device-frame");
    expect(frame).toBeTruthy();
    expect(frame.firstChild).toBe(link);

    // Verify main landmark has id="main-content" and tabIndex="-1"
    const main = screen.getByRole("main", { name: "Main Content" });
    expect(main).toBeTruthy();
    expect(main.getAttribute("id")).toBe("main-content");
    expect(main.getAttribute("tabindex")).toBe("-1");

    // Click skip link inside full DeviceFrame tree
    fireEvent.click(link);
    expect(document.activeElement).toBe(main);
  });
});
