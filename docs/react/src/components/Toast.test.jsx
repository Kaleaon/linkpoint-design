import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import Toast from "./Toast.jsx";
import { AppContext } from "../context/AppContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";

const mockThemeContext = {
  V: { rs: "4px", priC: "#000", onpriC: "#fff", pri: "#333" },
  t: { font: "sans-serif" },
  isFloat: false,
};

function renderToastWithState(toastText = "") {
  const mockState = { toast: toastText };
  return render(
    <AppContext.Provider value={{ state: mockState, actions: {} }}>
      <ThemeContext.Provider value={mockThemeContext}>
        <Toast />
      </ThemeContext.Provider>
    </AppContext.Provider>,
  );
}

describe("Toast Component Accessibility and ARIA Live Announcer", () => {
  it("renders a persistent live container element with status role and polite attributes when empty", () => {
    renderToastWithState("");

    const statusEl = screen.getByRole("status");
    expect(statusEl).toBeTruthy();
    expect(statusEl.getAttribute("role")).toBe("status");
    expect(statusEl.getAttribute("aria-live")).toBe("polite");
    expect(statusEl.getAttribute("aria-atomic")).toBe("true");
    expect(statusEl.textContent).toBe("");
  });

  it("renders status text inside the persistent live container when toast is set", () => {
    renderToastWithState("Copied to clipboard");

    const statusEl = screen.getByRole("status");
    expect(statusEl).toBeTruthy();
    expect(statusEl.getAttribute("aria-live")).toBe("polite");
    expect(statusEl.getAttribute("aria-atomic")).toBe("true");
    expect(statusEl.textContent).toBe("Copied to clipboard");
  });

  it("updates status text dynamically while retaining ARIA live region attributes", () => {
    const mockState = { toast: "" };
    const { rerender } = render(
      <AppContext.Provider value={{ state: mockState, actions: {} }}>
        <ThemeContext.Provider value={mockThemeContext}>
          <Toast />
        </ThemeContext.Provider>
      </AppContext.Provider>,
    );

    const initialStatusEl = screen.getByRole("status");
    expect(initialStatusEl.textContent).toBe("");

    // Rerender with active toast
    mockState.toast = "Settings saved";
    rerender(
      <AppContext.Provider value={{ state: mockState, actions: {} }}>
        <ThemeContext.Provider value={mockThemeContext}>
          <Toast />
        </ThemeContext.Provider>
      </AppContext.Provider>,
    );

    const updatedStatusEl = screen.getByRole("status");
    expect(updatedStatusEl).toBe(initialStatusEl); // Same DOM node
    expect(updatedStatusEl.textContent).toBe("Settings saved");
    expect(updatedStatusEl.getAttribute("aria-live")).toBe("polite");
    expect(updatedStatusEl.getAttribute("aria-atomic")).toBe("true");

    // Clear toast
    mockState.toast = "";
    rerender(
      <AppContext.Provider value={{ state: mockState, actions: {} }}>
        <ThemeContext.Provider value={mockThemeContext}>
          <Toast />
        </ThemeContext.Provider>
      </AppContext.Provider>,
    );

    expect(updatedStatusEl.textContent).toBe("");
  });
});
