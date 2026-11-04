import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import React from "react";
import { AppProvider, useApp } from "../../context/AppContext.jsx";
import { ThemeProvider } from "../../context/ThemeContext.jsx";
import Login from "../Login.jsx";
import { LINKPOINT_ACCOUNTS_KEY, obscureToken, unobscureToken } from "../../hooks/useAppState.js";

function LoginHarness() {
  return (
    <AppProvider>
      <ThemeProvider>
        <Login />
      </ThemeProvider>
    </AppProvider>
  );
}

describe("LocalStorage Account Manager & Login Profile Selector", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("stores and unobscures credentials correctly with obscureToken / unobscureToken", () => {
    const plain = "SecretPassword123!";
    const token = obscureToken(plain);
    expect(token).not.toBe(plain);
    expect(unobscureToken(token)).toBe(plain);
  });

  it("renders profile selector dropdown when saved accounts exist in LocalStorage", () => {
    const testAccounts = [
      {
        id: "acc-alt-1",
        profileLabel: "Alt Resident (OSGrid)",
        avatarName: "Alt Resident",
        gridKey: "osgrid",
        token: obscureToken("altpass123"),
      },
    ];
    localStorage.setItem(LINKPOINT_ACCOUNTS_KEY, JSON.stringify(testAccounts));

    render(<LoginHarness />);

    const selectEl = screen.getByLabelText("Select saved account profile");
    expect(selectEl).toBeTruthy();
    expect(screen.getByText("Alt Resident (OSGrid)")).toBeTruthy();
  });

  it("populates avatar name, password, and target grid state when selecting a saved profile", () => {
    const testAccounts = [
      {
        id: "acc-main",
        profileLabel: "Main Avatar (Agni)",
        avatarName: "Main Avatar",
        gridKey: "agni",
        token: obscureToken("mainpass"),
      },
      {
        id: "acc-alt",
        profileLabel: "Alt Avatar (OSGrid)",
        avatarName: "Alt Avatar",
        gridKey: "osgrid",
        token: obscureToken("altpass"),
      },
    ];
    localStorage.setItem(LINKPOINT_ACCOUNTS_KEY, JSON.stringify(testAccounts));

    render(<LoginHarness />);

    const selectEl = screen.getByLabelText("Select saved account profile");
    const avatarInput = screen.getByLabelText("Avatar Name");
    const passwordInput = screen.getByLabelText("Password");

    // Select Alt Avatar from dropdown
    fireEvent.change(selectEl, { target: { value: "acc-alt" } });

    expect(avatarInput.value).toBe("Alt Avatar");
    expect(passwordInput.value).toBe("altpass");
  });

  it("persists new credentials to LocalStorage when clicking 'Save Profile'", () => {
    render(<LoginHarness />);

    const avatarInput = screen.getByLabelText("Avatar Name");
    const passwordInput = screen.getByLabelText("Password");
    const saveBtn = screen.getByLabelText("Save Profile");

    fireEvent.change(avatarInput, { target: { value: "New Avatar" } });
    fireEvent.change(passwordInput, { target: { value: "newsecret123" } });
    fireEvent.click(saveBtn);

    const storedRaw = localStorage.getItem(LINKPOINT_ACCOUNTS_KEY);
    expect(storedRaw).toBeTruthy();

    const storedAccounts = JSON.parse(storedRaw);
    const saved = storedAccounts.find((a) => a.avatarName === "New Avatar");

    expect(saved).toBeDefined();
    expect(saved.avatarName).toBe("New Avatar");
    expect(unobscureToken(saved.token)).toBe("newsecret123");
  });

  it("deletes selected entry from LocalStorage and resets fields when clicking 'Remove Profile'", () => {
    const testAccounts = [
      {
        id: "acc-to-delete",
        profileLabel: "Delete Me (Agni)",
        avatarName: "Delete Me",
        gridKey: "agni",
        token: obscureToken("delpass"),
      },
    ];
    localStorage.setItem(LINKPOINT_ACCOUNTS_KEY, JSON.stringify(testAccounts));

    render(<LoginHarness />);

    const removeBtn = screen.getByLabelText("Remove Profile");
    fireEvent.click(removeBtn);

    const storedRaw = localStorage.getItem(LINKPOINT_ACCOUNTS_KEY);
    const storedAccounts = JSON.parse(storedRaw || "[]");
    expect(storedAccounts.find((a) => a.id === "acc-to-delete")).toBeUndefined();

    const avatarInput = screen.getByLabelText("Avatar Name");
    expect(avatarInput.value).toBe("");
  });

  it("degrades gracefully if LocalStorage throws an exception when setting item", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });

    render(<LoginHarness />);

    const avatarInput = screen.getByLabelText("Avatar Name");
    const saveBtn = screen.getByLabelText("Save Profile");

    fireEvent.change(avatarInput, { target: { value: "Graceful Test" } });

    expect(() => fireEvent.click(saveBtn)).not.toThrow();
  });

  it("retains saved accounts in LocalStorage when switching between grid and offline mode", () => {
    const testAccounts = [
      {
        id: "acc-persist",
        profileLabel: "Persist Avatar (Agni)",
        avatarName: "Persist Avatar",
        gridKey: "agni",
        token: obscureToken("persistpass"),
      },
    ];
    localStorage.setItem(LINKPOINT_ACCOUNTS_KEY, JSON.stringify(testAccounts));

    render(<LoginHarness />);

    const offlineTab = screen.getByLabelText("OFFLINE");
    fireEvent.click(offlineTab);

    const storedRaw = localStorage.getItem(LINKPOINT_ACCOUNTS_KEY);
    expect(storedRaw).toBeTruthy();
    expect(JSON.parse(storedRaw).length).toBe(1);
  });
});
