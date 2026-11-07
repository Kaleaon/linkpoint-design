import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMenuNavigation } from "../useMenuNavigation.js";

const sampleMenus = [
  {
    label: "File",
    items: [["Upload Image", "⌘U"], ["Take Snapshot", "⌘`"], ["Quit", "⌘Q"]],
  },
  {
    label: "Edit",
    items: [["Undo", "⌘Z"], ["Redo", "⇧⌘Z"], ["Preferences", "⌘,"]],
  },
  {
    label: "View",
    items: [["Chat", ""], ["Radar", ""], ["Inventory", ""]],
  },
];

function TestMenubar({ menus = sampleMenus, onSelect, openMenu: controlledOpenMenu, onOpenMenu }) {
  const {
    menubarProps,
    getHeaderProps,
    getDropdownProps,
    getItemProps,
    focusedMenuIndex,
    openMenu,
  } = useMenuNavigation({
    menus,
    openMenu: controlledOpenMenu,
    onOpenMenu,
    onSelect,
    ariaLabel: "Desktop Menu Bar",
  });

  return (
    <div {...menubarProps} data-testid="menubar">
      {menus.map((menu, mIdx) => {
        const isOpen = openMenu === menu.label;
        const headerProps = getHeaderProps(mIdx, menu.label);
        const dropdownProps = getDropdownProps(mIdx, menu.label);

        return (
          <div key={menu.label} style={{ position: "relative" }}>
            <button {...headerProps} data-testid={`header-${menu.label}`}>
              {menu.label}
            </button>
            {isOpen && (
              <div {...dropdownProps} data-testid={`menu-${menu.label}`}>
                {menu.items.map((item, iIdx) => {
                  const itemProps = getItemProps(mIdx, iIdx, item);
                  return (
                    <div key={iIdx} {...itemProps} data-testid={`item-${menu.label}-${iIdx}`}>
                      {item[0]}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

describe("useMenuNavigation Hook", () => {
  it("initializes with roving tabindex (0 for first header, -1 for others)", () => {
    render(<TestMenubar />);

    const fileHeader = screen.getByTestId("header-File");
    const editHeader = screen.getByTestId("header-Edit");
    const viewHeader = screen.getByTestId("header-View");

    expect(fileHeader).toHaveAttribute("tabindex", "0");
    expect(fileHeader).toHaveAttribute("role", "menuitem");
    expect(fileHeader).toHaveAttribute("aria-haspopup", "true");
    expect(fileHeader).toHaveAttribute("aria-expanded", "false");

    expect(editHeader).toHaveAttribute("tabindex", "-1");
    expect(viewHeader).toHaveAttribute("tabindex", "-1");
  });

  it("supports roving focus across headers via ArrowRight, ArrowLeft, Home, and End", () => {
    render(<TestMenubar />);

    const fileHeader = screen.getByTestId("header-File");
    const editHeader = screen.getByTestId("header-Edit");
    const viewHeader = screen.getByTestId("header-View");

    fileHeader.focus();
    expect(document.activeElement).toBe(fileHeader);

    // ArrowRight moves to next header
    fireEvent.keyDown(fileHeader, { key: "ArrowRight" });
    expect(document.activeElement).toBe(editHeader);
    expect(editHeader).toHaveAttribute("tabindex", "0");
    expect(fileHeader).toHaveAttribute("tabindex", "-1");

    // ArrowRight moves to next header
    fireEvent.keyDown(editHeader, { key: "ArrowRight" });
    expect(document.activeElement).toBe(viewHeader);

    // ArrowRight wraps around to first header
    fireEvent.keyDown(viewHeader, { key: "ArrowRight" });
    expect(document.activeElement).toBe(fileHeader);

    // ArrowLeft wraps around to last header
    fireEvent.keyDown(fileHeader, { key: "ArrowLeft" });
    expect(document.activeElement).toBe(viewHeader);

    // Home jumps to first header
    fireEvent.keyDown(viewHeader, { key: "Home" });
    expect(document.activeElement).toBe(fileHeader);

    // End jumps to last header
    fireEvent.keyDown(fileHeader, { key: "End" });
    expect(document.activeElement).toBe(viewHeader);
  });

  it("opens dropdown and focuses first item on ArrowDown from header", () => {
    render(<TestMenubar />);

    const fileHeader = screen.getByTestId("header-File");
    fileHeader.focus();

    fireEvent.keyDown(fileHeader, { key: "ArrowDown" });

    const dropdown = screen.getByTestId("menu-File");
    expect(dropdown).toBeInTheDocument();
    expect(dropdown).toHaveAttribute("role", "menu");
    expect(dropdown).toHaveAttribute("aria-label", "File");

    const firstItem = screen.getByTestId("item-File-0");
    expect(firstItem).toHaveAttribute("role", "menuitem");
    expect(firstItem).toHaveAttribute("tabindex", "-1");
    expect(document.activeElement).toBe(firstItem);
  });

  it("opens dropdown and focuses first item on Space or Enter from header", () => {
    render(<TestMenubar />);

    const fileHeader = screen.getByTestId("header-File");
    fileHeader.focus();

    fireEvent.keyDown(fileHeader, { key: " " });

    const firstItem = screen.getByTestId("item-File-0");
    expect(firstItem).toBeInTheDocument();
    expect(document.activeElement).toBe(firstItem);
  });

  it("navigates vertically inside open dropdown with ArrowDown and ArrowUp wrapping around", () => {
    render(<TestMenubar />);

    const fileHeader = screen.getByTestId("header-File");
    fireEvent.keyDown(fileHeader, { key: "ArrowDown" });

    const item0 = screen.getByTestId("item-File-0");
    const item1 = screen.getByTestId("item-File-1");
    const item2 = screen.getByTestId("item-File-2");

    expect(document.activeElement).toBe(item0);

    // ArrowDown moves down
    fireEvent.keyDown(item0, { key: "ArrowDown" });
    expect(document.activeElement).toBe(item1);

    // ArrowDown moves down
    fireEvent.keyDown(item1, { key: "ArrowDown" });
    expect(document.activeElement).toBe(item2);

    // ArrowDown wraps around to item 0
    fireEvent.keyDown(item2, { key: "ArrowDown" });
    expect(document.activeElement).toBe(item0);

    // ArrowUp wraps around to item 2
    fireEvent.keyDown(item0, { key: "ArrowUp" });
    expect(document.activeElement).toBe(item2);

    // Home jumps to item 0
    fireEvent.keyDown(item2, { key: "Home" });
    expect(document.activeElement).toBe(item0);

    // End jumps to item 2
    fireEvent.keyDown(item0, { key: "End" });
    expect(document.activeElement).toBe(item2);
  });

  it("closes dropdown and restores focus to parent header on Escape key inside dropdown", () => {
    render(<TestMenubar />);

    const fileHeader = screen.getByTestId("header-File");
    fireEvent.keyDown(fileHeader, { key: "ArrowDown" });

    const item1 = screen.getByTestId("item-File-1");
    fireEvent.keyDown(screen.getByTestId("item-File-0"), { key: "ArrowDown" });
    expect(document.activeElement).toBe(item1);

    fireEvent.keyDown(item1, { key: "Escape" });

    expect(screen.queryByTestId("menu-File")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(fileHeader);
  });

  it("executes item on Enter or Space, closes dropdown, and restores focus to header", () => {
    const handleSelect = vi.fn();
    render(<TestMenubar onSelect={handleSelect} />);

    const fileHeader = screen.getByTestId("header-File");
    fireEvent.keyDown(fileHeader, { key: "ArrowDown" });

    const item1 = screen.getByTestId("item-File-1");
    fireEvent.keyDown(screen.getByTestId("item-File-0"), { key: "ArrowDown" });

    fireEvent.keyDown(item1, { key: "Enter" });

    expect(handleSelect).toHaveBeenCalledWith("File", ["Take Snapshot", "⌘`"], 1);
    expect(screen.queryByTestId("menu-File")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(fileHeader);
  });

  it("closes current dropdown and opens/focuses adjacent header on ArrowRight inside dropdown", () => {
    render(<TestMenubar />);

    const fileHeader = screen.getByTestId("header-File");
    fireEvent.keyDown(fileHeader, { key: "ArrowDown" });

    const item0 = screen.getByTestId("item-File-0");
    expect(document.activeElement).toBe(item0);

    fireEvent.keyDown(item0, { key: "ArrowRight" });

    // File menu closed, Edit menu opened, and Edit header focused
    expect(screen.queryByTestId("menu-File")).not.toBeInTheDocument();
    expect(screen.getByTestId("menu-Edit")).toBeInTheDocument();
    const editHeader = screen.getByTestId("header-Edit");
    expect(document.activeElement).toBe(editHeader);
  });

  it("closes current dropdown and opens/focuses adjacent header on ArrowLeft inside dropdown", () => {
    render(<TestMenubar />);

    const fileHeader = screen.getByTestId("header-File");
    fireEvent.keyDown(fileHeader, { key: "ArrowDown" });

    const item0 = screen.getByTestId("item-File-0");
    expect(document.activeElement).toBe(item0);

    fireEvent.keyDown(item0, { key: "ArrowLeft" });

    // File menu closed, View (prev wrapped) opened, and View header focused
    expect(screen.queryByTestId("menu-File")).not.toBeInTheDocument();
    expect(screen.getByTestId("menu-View")).toBeInTheDocument();
    const viewHeader = screen.getByTestId("header-View");
    expect(document.activeElement).toBe(viewHeader);
  });
});
