import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { useState } from "react";
import MenuBar from "../MenuBar.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import { ThemeContext } from "../../context/ThemeContext.jsx";

const mockThemeContext = {
  V: {
    surf: "#181a1f",
    pri: "#6cff9a",
    priC: "rgba(108, 255, 154, 0.15)",
    onpri: "#000000",
    bg: "#0d0e11",
    ink: "#ffffff",
    ink2: "#8b949e",
    outv: "#30363d",
    rs: "4px",
    rp: "6px",
  },
  t: {
    font: "Inter, sans-serif",
    dfont: "JetBrains Mono, monospace",
  },
  ink: (color) => color,
  isFloat: true,
  isSweepDesk: false,
};

function StatefulMenuBarWrapper({ initialMenu = null, customActions = {} }) {
  const [menu, setMenu] = useState(initialMenu);
  const [screenName, setScreenName] = useState("Chat");
  const [flOpen, setFlOpen] = useState({ Chat: true, Settings: false });
  const [flMin, setFlMin] = useState({});

  const state = {
    menu,
    screen: screenName,
    flOpen,
    flMin,
  };

  const actions = {
    setMenu: vi.fn((m) => {
      setMenu(m);
      if (customActions.setMenu) customActions.setMenu(m);
    }),
    setScreen: vi.fn((s) => {
      setScreenName(s);
      if (customActions.setScreen) customActions.setScreen(s);
    }),
    notify: customActions.notify || vi.fn(),
    flFocus: customActions.flFocus || vi.fn(),
    flToggle: vi.fn((id) => {
      setFlOpen((prev) => ({ ...prev, [id]: !prev[id] }));
      if (customActions.flToggle) customActions.flToggle(id);
    }),
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      <ThemeContext.Provider value={mockThemeContext}>
        <MenuBar />
      </ThemeContext.Provider>
    </AppContext.Provider>
  );
}

describe("MenuBar Component Accessibility & Keyboard Navigation", () => {
  it("renders top-level container with role='menubar' and aria-label='Desktop Menu Bar'", () => {
    render(<StatefulMenuBarWrapper />);

    const menubar = screen.getByRole("menubar", { name: "Desktop Menu Bar" });
    expect(menubar).toBeInTheDocument();
    expect(menubar).toHaveAttribute("aria-label", "Desktop Menu Bar");

    // Also verify header banner region is preserved
    const header = screen.getByRole("banner", { name: "Desktop Menu Bar" });
    expect(header).toBeInTheDocument();
    expect(header.tagName).toBe("HEADER");
  });

  it("renders all top-level headers with role='menuitem', aria-haspopup='true', and roving tabindex", () => {
    render(<StatefulMenuBarWrapper />);

    const menubar = screen.getByRole("menubar", { name: "Desktop Menu Bar" });
    const headers = within(menubar).getAllByRole("menuitem");

    expect(headers).toHaveLength(6);
    const expectedLabels = ["File", "Edit", "View", "World", "Build", "Help"];

    headers.forEach((header, i) => {
      expect(header).toHaveTextContent(expectedLabels[i]);
      expect(header).toHaveAttribute("role", "menuitem");
      expect(header).toHaveAttribute("aria-haspopup", "true");
      expect(header).toHaveAttribute("aria-expanded", "false");

      // Roving tabindex: 0 for first header ("File"), -1 for all others
      if (i === 0) {
        expect(header).toHaveAttribute("tabindex", "0");
      } else {
        expect(header).toHaveAttribute("tabindex", "-1");
      }
    });
  });

  it("supports roving focus across headers using ArrowRight, ArrowLeft, Home, and End", () => {
    render(<StatefulMenuBarWrapper />);

    const menubar = screen.getByRole("menubar", { name: "Desktop Menu Bar" });
    const headers = within(menubar).getAllByRole("menuitem");
    const [fileH, editH, viewH, worldH, buildH, helpH] = headers;

    fileH.focus();
    expect(document.activeElement).toBe(fileH);

    // ArrowRight moves focus forward
    fireEvent.keyDown(fileH, { key: "ArrowRight" });
    expect(document.activeElement).toBe(editH);
    expect(editH).toHaveAttribute("tabindex", "0");
    expect(fileH).toHaveAttribute("tabindex", "-1");

    // ArrowRight wraps to first when on last
    fireEvent.keyDown(editH, { key: "End" });
    expect(document.activeElement).toBe(helpH);
    fireEvent.keyDown(helpH, { key: "ArrowRight" });
    expect(document.activeElement).toBe(fileH);

    // ArrowLeft wraps backwards to last
    fireEvent.keyDown(fileH, { key: "ArrowLeft" });
    expect(document.activeElement).toBe(helpH);

    // Home jumps to first
    fireEvent.keyDown(helpH, { key: "Home" });
    expect(document.activeElement).toBe(fileH);
  });

  it("opens dropdown and focuses the first item when pressing ArrowDown, Space, or Enter on a header", () => {
    render(<StatefulMenuBarWrapper />);

    const menubar = screen.getByRole("menubar", { name: "Desktop Menu Bar" });
    const fileH = within(menubar).getAllByRole("menuitem")[0];

    fileH.focus();
    fireEvent.keyDown(fileH, { key: "ArrowDown" });

    // Dropdown container should render with role="menu" and aria-label="File"
    const dropdown = screen.getByRole("menu", { name: "File" });
    expect(dropdown).toBeInTheDocument();
    expect(fileH).toHaveAttribute("aria-expanded", "true");

    // First item inside File menu should be focused
    const items = within(dropdown).getAllByRole("menuitem");
    expect(items.length).toBeGreaterThan(0);
    expect(items[0]).toHaveTextContent("Upload Image…");
    expect(items[0]).toHaveAttribute("tabindex", "-1");
    expect(document.activeElement).toBe(items[0]);
  });

  it("navigates vertically inside open dropdown with ArrowDown and ArrowUp wrapping around", () => {
    render(<StatefulMenuBarWrapper />);

    const fileH = screen.getByText("File");
    fireEvent.keyDown(fileH, { key: "ArrowDown" });

    const dropdown = screen.getByRole("menu", { name: "File" });
    const items = within(dropdown).getAllByRole("menuitem");
    const [item0, item1, item2, item3] = items;

    expect(document.activeElement).toBe(item0);

    // ArrowDown moves down
    fireEvent.keyDown(item0, { key: "ArrowDown" });
    expect(document.activeElement).toBe(item1);

    fireEvent.keyDown(item1, { key: "ArrowDown" });
    expect(document.activeElement).toBe(item2);

    fireEvent.keyDown(item2, { key: "ArrowDown" });
    expect(document.activeElement).toBe(item3);

    // Wrap-around from last to first
    fireEvent.keyDown(item3, { key: "ArrowDown" });
    expect(document.activeElement).toBe(item0);

    // Wrap-around backwards from first to last
    fireEvent.keyDown(item0, { key: "ArrowUp" });
    expect(document.activeElement).toBe(item3);
  });

  it("closes dropdown and restores focus to parent header when pressing Escape key", () => {
    render(<StatefulMenuBarWrapper />);

    const fileH = screen.getByText("File");
    fireEvent.keyDown(fileH, { key: "ArrowDown" });

    const dropdown = screen.getByRole("menu", { name: "File" });
    expect(dropdown).toBeInTheDocument();

    const items = within(dropdown).getAllByRole("menuitem");
    fireEvent.keyDown(items[0], { key: "ArrowDown" }); // on item 1

    fireEvent.keyDown(items[1], { key: "Escape" });

    // Menu should be closed and focus restored to "File" header
    expect(screen.queryByRole("menu", { name: "File" })).not.toBeInTheDocument();
    expect(document.activeElement).toBe(fileH);
    expect(fileH).toHaveAttribute("aria-expanded", "false");
  });

  it("executes menu item action on Enter, closes dropdown, and returns focus to header", () => {
    const notifyMock = vi.fn();
    const setScreenMock = vi.fn();

    render(<StatefulMenuBarWrapper customActions={{ notify: notifyMock, setScreen: setScreenMock }} />);

    const fileH = screen.getByText("File");
    fireEvent.keyDown(fileH, { key: "ArrowDown" });

    const dropdown = screen.getByRole("menu", { name: "File" });
    const items = within(dropdown).getAllByRole("menuitem");

    // Move to "Quit" (item 3)
    fireEvent.keyDown(items[0], { key: "ArrowUp" });
    expect(document.activeElement).toHaveTextContent("Quit");

    // Press Enter to activate Quit
    fireEvent.keyDown(document.activeElement, { key: "Enter" });

    expect(setScreenMock).toHaveBeenCalledWith("Login");
    expect(screen.queryByRole("menu", { name: "File" })).not.toBeInTheDocument();
    expect(document.activeElement).toBe(fileH);
  });

  it("executes menu item action on Space, closes dropdown, and returns focus to header", () => {
    const notifyMock = vi.fn();
    const setScreenMock = vi.fn();

    render(<StatefulMenuBarWrapper customActions={{ notify: notifyMock, setScreen: setScreenMock }} />);

    // Open World menu
    const worldH = screen.getByText("World");
    fireEvent.keyDown(worldH, { key: "ArrowDown" });

    const dropdown = screen.getByRole("menu", { name: "World" });
    const items = within(dropdown).getAllByRole("menuitem");
    expect(items[0]).toHaveTextContent("Teleport Home");

    // Press Space to activate "Teleport Home"
    fireEvent.keyDown(items[0], { key: " " });

    expect(setScreenMock).toHaveBeenCalledWith("Map");
    expect(notifyMock).toHaveBeenCalledWith("Teleporting Home...");
    expect(screen.queryByRole("menu", { name: "World" })).not.toBeInTheDocument();
    expect(document.activeElement).toBe(worldH);
  });

  it("navigating with ArrowRight inside open dropdown closes current and opens/focuses adjacent header", () => {
    render(<StatefulMenuBarWrapper />);

    const fileH = screen.getByText("File");
    fireEvent.keyDown(fileH, { key: "ArrowDown" });

    const dropdownFile = screen.getByRole("menu", { name: "File" });
    const firstItem = within(dropdownFile).getAllByRole("menuitem")[0];

    fireEvent.keyDown(firstItem, { key: "ArrowRight" });

    // File menu should be closed, Edit menu opened, and Edit header focused
    expect(screen.queryByRole("menu", { name: "File" })).not.toBeInTheDocument();
    expect(screen.getByRole("menu", { name: "Edit" })).toBeInTheDocument();

    const editH = screen.getByText("Edit");
    expect(document.activeElement).toBe(editH);
  });

  it("navigating with ArrowLeft inside open dropdown closes current and opens/focuses previous header", () => {
    render(<StatefulMenuBarWrapper />);

    const fileH = screen.getByText("File");
    fireEvent.keyDown(fileH, { key: "ArrowDown" });

    const dropdownFile = screen.getByRole("menu", { name: "File" });
    const firstItem = within(dropdownFile).getAllByRole("menuitem")[0];

    fireEvent.keyDown(firstItem, { key: "ArrowLeft" });

    // File menu should be closed, Help (prev) menu opened, and Help header focused
    expect(screen.queryByRole("menu", { name: "File" })).not.toBeInTheDocument();
    expect(screen.getByRole("menu", { name: "Help" })).toBeInTheDocument();

    const helpH = screen.getByText("Help");
    expect(document.activeElement).toBe(helpH);
  });

  it("supports WINDOWS floater toggling for View menu items", () => {
    const flToggleMock = vi.fn();
    render(<StatefulMenuBarWrapper customActions={{ flToggle: flToggleMock }} />);

    const viewH = screen.getByText("View");
    fireEvent.keyDown(viewH, { key: "ArrowDown" });

    const dropdownView = screen.getByRole("menu", { name: "View" });
    const chatItem = within(dropdownView).getByText("Local Chat");

    fireEvent.keyDown(chatItem.closest('[role="menuitem"]'), { key: "Enter" });

    expect(flToggleMock).toHaveBeenCalledWith("Chat");
    expect(document.activeElement).toBe(viewH);
  });

  it("returns null when isFloat is false", () => {
    const notFloatTheme = { ...mockThemeContext, isFloat: false };
    render(
      <AppContext.Provider value={{ state: { menu: null, flOpen: {}, flMin: {} }, actions: {} }}>
        <ThemeContext.Provider value={notFloatTheme}>
          <MenuBar />
        </ThemeContext.Provider>
      </AppContext.Provider>
    );

    expect(screen.queryByRole("menubar")).not.toBeInTheDocument();
  });
});
