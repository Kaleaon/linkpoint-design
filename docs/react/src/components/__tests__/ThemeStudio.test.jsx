import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeStudio from "../ThemeStudio.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import "@testing-library/jest-dom";

const mockTheme = {
  version: 1,
  active: true,
  name: "Default Test Theme",
  colors: {
    pri: "#112233",
    sec: "#223344",
    sec2: "#334455",
    bg: "#445566",
    surf: "#556677",
    surf2: "#667788",
    ink: "#778899",
    ink2: "#8899AA",
    ok: "#99AABB",
    warn: "#AABBCC",
    err: "#BBCCDD",
  },
};

function renderThemeStudio(customActions = {}) {
  const actions = {
    importTheme: vi.fn().mockResolvedValue(true),
    resetTheme: vi.fn(),
    saveTheme: vi.fn(),
    shareTheme: vi.fn(),
    downloadTheme: vi.fn(),
    renameTheme: vi.fn(),
    setThemeColor: vi.fn(),
    ...customActions,
  };

  const contextValue = {
    state: { customTheme: mockTheme },
    actions,
  };

  const renderResult = render(
    <AppContext.Provider value={contextValue}>
      <ThemeStudio />
    </AppContext.Provider>
  );

  return { ...renderResult, actions };
}

describe("ThemeStudio Component with Schema Validation Alert Banner", () => {
  it("renders trigger and expands ThemeStudio body on click", () => {
    renderThemeStudio();

    const trigger = screen.getByRole("button", { name: /THEME STUDIO/i });
    expect(trigger).toBeTruthy();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByDisplayValue("Default Test Theme")).toBeTruthy();
  });

  it("displays inline diagnostic alert banner on invalid file upload", async () => {
    const user = userEvent.setup();
    const { container } = renderThemeStudio();

    // Expand panel
    const trigger = screen.getByRole("button", { name: /THEME STUDIO/i });
    fireEvent.click(trigger);

    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput).toBeTruthy();

    const invalidFile = new File(['{"version": 1, "colors": { "pri": "not-a-color" }}'], "invalid-theme.json", {
      type: "application/json",
    });

    await user.upload(fileInput, invalidFile);

    const alertBanner = await screen.findByRole("alert");
    expect(alertBanner).toBeTruthy();
    expect(alertBanner.textContent).toContain("Invalid hex color format");

    // File input value is reset
    expect(fileInput.value).toBe("");
  });

  it("dismisses inline diagnostic alert banner when dismiss button is clicked", async () => {
    const user = userEvent.setup();
    const { container } = renderThemeStudio();

    const trigger = screen.getByRole("button", { name: /THEME STUDIO/i });
    fireEvent.click(trigger);

    const fileInput = container.querySelector('input[type="file"]');
    const invalidFile = new File(["not valid json"], "bad.json", { type: "application/json" });

    await user.upload(fileInput, invalidFile);

    const alertBanner = await screen.findByRole("alert");
    expect(alertBanner).toBeTruthy();

    const dismissBtn = screen.getByRole("button", { name: /dismiss error/i });
    fireEvent.click(dismissBtn);

    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("successfully imports valid theme file and calls actions.importTheme", async () => {
    const user = userEvent.setup();
    const { actions, container } = renderThemeStudio();

    const trigger = screen.getByRole("button", { name: /THEME STUDIO/i });
    fireEvent.click(trigger);

    const fileInput = container.querySelector('input[type="file"]');
    const validJsonString = JSON.stringify(mockTheme);
    const validFile = new File([validJsonString], "valid-theme.json", { type: "application/json" });

    await user.upload(fileInput, validFile);

    await waitFor(() => {
      expect(actions.importTheme).toHaveBeenCalledWith(validJsonString);
    });

    expect(screen.queryByRole("alert")).toBeNull();
    expect(fileInput.value).toBe("");
  });
});
