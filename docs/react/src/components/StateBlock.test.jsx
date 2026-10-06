import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import StateBlock from "./StateBlock.jsx";
import { AppContext } from "../context/AppContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";

const mockThemeContext = {
  V: {
    rp: "8px",
    err: "#ff0000",
    outv: "#333",
    surf: "#111",
    pri: "#00f0ff",
    ink: "#fff",
    ink2: "#aaa",
    surf2: "#222",
    rs: "4px",
    onpri: "#000",
    tls: "0.05em",
  },
  t: { dfont: "sans-serif", font: "sans-serif" },
  condPack: {
    icon: "alert-triangle",
    title: "Connection Lost",
    body: "Unable to reach grid server.",
    btn: "RETRY CONNECTION",
  },
  stateBlockActive: true,
};

describe("StateBlock Component", () => {
  it("renders recovery button as native button element and calls actions.setCond('normal') on click", () => {
    const setCondMock = vi.fn();
    const mockAppContext = {
      state: { cond: "error" },
      actions: { setCond: setCondMock },
    };

    render(
      <AppContext.Provider value={mockAppContext}>
        <ThemeContext.Provider value={mockThemeContext}>
          <StateBlock />
        </ThemeContext.Provider>
      </AppContext.Provider>
    );

    const button = screen.getByRole("button", { name: "RETRY CONNECTION" });
    expect(button).toBeTruthy();
    expect(button.tagName.toLowerCase()).toBe("button");
    expect(button.getAttribute("type")).toBe("button");

    fireEvent.click(button);

    expect(setCondMock).toHaveBeenCalledTimes(1);
    expect(setCondMock).toHaveBeenCalledWith("normal");
  });

  it("handles empty condition button click and triggers recovery", () => {
    const setCondMock = vi.fn();
    const emptyThemeContext = {
      ...mockThemeContext,
      condPack: {
        icon: "inbox",
        title: "No Messages",
        body: "Your inbox is empty.",
        btn: "REFRESH",
      },
    };
    const mockAppContext = {
      state: { cond: "empty" },
      actions: { setCond: setCondMock },
    };

    render(
      <AppContext.Provider value={mockAppContext}>
        <ThemeContext.Provider value={emptyThemeContext}>
          <StateBlock />
        </ThemeContext.Provider>
      </AppContext.Provider>
    );

    const button = screen.getByRole("button", { name: "REFRESH" });
    expect(button).toBeTruthy();

    fireEvent.click(button);

    expect(setCondMock).toHaveBeenCalledWith("normal");
  });

  it("renders null when stateBlockActive or condPack is missing", () => {
    const mockAppContext = {
      state: { cond: "normal" },
      actions: { setCond: vi.fn() },
    };
    const inactiveThemeContext = {
      ...mockThemeContext,
      stateBlockActive: false,
      condPack: null,
    };

    const { container } = render(
      <AppContext.Provider value={mockAppContext}>
        <ThemeContext.Provider value={inactiveThemeContext}>
          <StateBlock />
        </ThemeContext.Provider>
      </AppContext.Provider>
    );

    expect(container.firstChild).toBeNull();
  });
});
