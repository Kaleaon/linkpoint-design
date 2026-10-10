import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Inventory from "../Inventory.jsx";
import { AppProvider } from "../../context/AppContext.jsx";
import { ThemeProvider } from "../../context/ThemeContext.jsx";
import { KthemeProvider } from "@ktheme/react";

function renderInventory() {
  return render(
    <AppProvider>
      <KthemeProvider themeId="navy-gold">
        <ThemeProvider>
          <Inventory />
        </ThemeProvider>
      </KthemeProvider>
    </AppProvider>
  );
}

describe("Inventory Screen - Interactive Search Input", () => {
  it("renders controlled search input with correct placeholder and accessibility label", () => {
    renderInventory();
    const input = screen.getByPlaceholderText("filter inventory…");
    expect(input).toBeTruthy();
    expect(input.getAttribute("aria-label")).toBe("Filter inventory");
    expect(input.value).toBe("");
  });

  it("filters inventory items dynamically as user types", () => {
    renderInventory();
    const input = screen.getByPlaceholderText("filter inventory…");

    // Initially, top-level folders like "Objects", "Clothing" are present
    expect(screen.getByText("Objects")).toBeTruthy();
    expect(screen.getByText("Clothing")).toBeTruthy();

    // Type "lamp" into search box
    fireEvent.change(input, { target: { value: "lamp" } });

    // "Sunset Lamp v3" matches "lamp"
    expect(screen.getAllByText("Sunset Lamp v3").length).toBeGreaterThan(0);
    // Non-matching items/folders should not be visible
    expect(screen.queryByText("Clothing")).toBeNull();
  });

  it("handles case-insensitivity and whitespace trimming", () => {
    renderInventory();
    const input = screen.getByPlaceholderText("filter inventory…");

    // Type uppercase with surrounding spaces
    fireEvent.change(input, { target: { value: "   SUNSET LAMP   " } });

    expect(screen.getAllByText("Sunset Lamp v3").length).toBeGreaterThan(0);
    expect(screen.queryByText("Clothing")).toBeNull();
  });

  it("restores all initial inventory items when search query is cleared", () => {
    renderInventory();
    const input = screen.getByPlaceholderText("filter inventory…");

    fireEvent.change(input, { target: { value: "lamp" } });
    expect(screen.queryByText("Clothing")).toBeNull();

    // Clear input
    fireEvent.change(input, { target: { value: "" } });

    // Initial items/folders restored
    expect(screen.getByText("Objects")).toBeTruthy();
    expect(screen.getByText("Clothing")).toBeTruthy();
  });

  it("filters items when searching with non-matching query", () => {
    renderInventory();
    const input = screen.getByPlaceholderText("filter inventory…");

    fireEvent.change(input, { target: { value: "nonexistent_item_query" } });

    expect(screen.queryByText("Objects")).toBeNull();
    expect(screen.queryByText("Clothing")).toBeNull();
    expect(screen.queryByText("Landmarks")).toBeNull();
  });
});
