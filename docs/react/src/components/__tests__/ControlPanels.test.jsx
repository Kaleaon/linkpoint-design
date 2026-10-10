import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import ControlPanels from "../ControlPanels.jsx";
import { AppProvider } from "../../context/AppContext.jsx";
import { ThemeProvider } from "../../context/ThemeContext.jsx";

describe("ControlPanels Component", () => {
  it("binds active button inline styles to dynamic ThemeContext tokens and hexToRgba", () => {
    render(
      <AppProvider>
        <ThemeProvider>
          <ControlPanels />
        </ThemeProvider>
      </AppProvider>
    );

    // Default active screen is "Chat" (first item in SCREENS)
    const activeScreenBtn = screen.getByRole("button", { pressed: true, name: "Chat" });
    expect(activeScreenBtn).toBeTruthy();

    // Default primary token is #6CFF9A -> rgb(108, 255, 154)
    // hexToRgba(#6CFF9A, 0.12) -> rgba(108, 255, 154, 0.12)
    expect(activeScreenBtn.style.borderColor).toBe("rgb(108, 255, 154)");
    expect(activeScreenBtn.style.color).toBe("rgb(108, 255, 154)");
    expect(activeScreenBtn.style.backgroundColor).toBe("rgba(108, 255, 154, 0.12)");
  });

  it("renders safely outside ThemeProvider with fallback tokens", () => {
    render(
      <AppProvider>
        <ControlPanels />
      </AppProvider>
    );

    const activeScreenBtn = screen.getByRole("button", { pressed: true, name: "Chat" });
    expect(activeScreenBtn.style.borderColor).toBe("rgb(108, 255, 154)");
    expect(activeScreenBtn.style.color).toBe("rgb(108, 255, 154)");
    expect(activeScreenBtn.style.backgroundColor).toBe("rgba(108, 255, 154, 0.12)");
  });
});
