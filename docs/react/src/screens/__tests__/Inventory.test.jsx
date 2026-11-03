import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Inventory from "../Inventory.jsx";
import { AppProvider } from "../../context/AppContext.jsx";
import { ThemeProvider } from "../../context/ThemeContext.jsx";

function renderInventory() {
  return render(
    <AppProvider>
      <ThemeProvider>
        <Inventory />
      </ThemeProvider>
    </AppProvider>
  );
}

describe("Inventory - Search Input & Node Filtering", () => {
  it("renders search input element with correct placeholder and aria-label", () => {
    renderInventory();
    const input = screen.getByPlaceholderText("filter inventory…");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("aria-label", "Filter inventory");
  });

  it("updates local input state when typing in search query", () => {
    renderInventory();
    const input = screen.getByPlaceholderText("filter inventory…");
    fireEvent.change(input, { target: { value: "Jacket" } });
    expect(input.value).toBe("Jacket");
  });

  it("filters inventory items case-insensitively based on search query", () => {
    renderInventory();
    const input = screen.getByPlaceholderText("filter inventory…");

    // Initially "Objects" and "Clothing" are visible
    expect(screen.getByText("Objects")).toBeInTheDocument();
    expect(screen.getByText("Clothing")).toBeInTheDocument();

    // Type "jacket"
    fireEvent.change(input, { target: { value: "jacket" } });

    // Matching item "Urban Jacket" should be shown
    expect(screen.getByText("Urban Jacket")).toBeInTheDocument();

    // Non-matching folder "Objects" should not be shown
    expect(screen.queryByText("Objects")).not.toBeInTheDocument();
  });

  it("displays clear button when search query is non-empty and resets on click", () => {
    renderInventory();
    const input = screen.getByPlaceholderText("filter inventory…");

    // Clear button should not exist initially
    expect(screen.queryByLabelText("Clear search")).not.toBeInTheDocument();

    // Type query
    fireEvent.change(input, { target: { value: "Landmark" } });

    // Clear button appears
    const clearBtn = screen.getByLabelText("Clear search");
    expect(clearBtn).toBeInTheDocument();

    // Click clear button
    fireEvent.click(clearBtn);

    // Input resets and clear button disappears
    expect(input.value).toBe("");
    expect(screen.queryByLabelText("Clear search")).not.toBeInTheDocument();

    // Default items return
    expect(screen.getByText("Objects")).toBeInTheDocument();
  });

  it("displays empty state message when no items match search query", () => {
    renderInventory();
    const input = screen.getByPlaceholderText("filter inventory…");

    fireEvent.change(input, { target: { value: "nonexistentxyz123" } });

    expect(screen.getByText("No inventory items match 'nonexistentxyz123'")).toBeInTheDocument();
  });

  it("resets local search query on unmount and remount", () => {
    const { unmount } = renderInventory();
    const input = screen.getByPlaceholderText("filter inventory…");

    fireEvent.change(input, { target: { value: "shirt" } });
    expect(input.value).toBe("shirt");

    unmount();

    // Remounting resets component state
    renderInventory();
    const newInput = screen.getByPlaceholderText("filter inventory…");
    expect(newInput.value).toBe("");
  });
});
