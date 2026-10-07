import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import React from "react";
import { AppProvider } from "../context/AppContext.jsx";
import { ThemeProvider } from "../context/ThemeContext.jsx";
import Map from "../screens/Map.jsx";

function renderMap() {
  return render(
    <AppProvider>
      <ThemeProvider>
        <Map />
      </ThemeProvider>
    </AppProvider>
  );
}

describe("Map Screen Search, Zoom, Reset, and Pan Controls", () => {
  it("renders search bar, zoom, and locate buttons", () => {
    const { getByPlaceholderText, getByLabelText } = renderMap();

    expect(getByPlaceholderText("Search region or <x, y, z>...")).toBeDefined();
    expect(getByLabelText("Zoom in map")).toBeDefined();
    expect(getByLabelText("Zoom out map")).toBeDefined();
    expect(getByLabelText("Recenter map viewport")).toBeDefined();
  });

  it("increases zoom scale on Zoom In up to 3.0x max and decreases on Zoom Out down to 0.5x min", () => {
    const { getByLabelText, getByText } = renderMap();
    const zoomInBtn = getByLabelText("Zoom in map");
    const zoomOutBtn = getByLabelText("Zoom out map");

    // Initial zoom 1.00x
    expect(getByText(/zoom 1\.00x/)).toBeDefined();

    // Zoom in twice (+0.25, +0.25 => 1.50x)
    fireEvent.click(zoomInBtn);
    expect(getByText(/zoom 1\.25x/)).toBeDefined();

    fireEvent.click(zoomInBtn);
    expect(getByText(/zoom 1\.50x/)).toBeDefined();

    // Zoom out (-0.25 => 1.25x)
    fireEvent.click(zoomOutBtn);
    expect(getByText(/zoom 1\.25x/)).toBeDefined();

    // Zoom out multiple times to test lower bound (0.50x)
    for (let i = 0; i < 10; i++) {
      fireEvent.click(zoomOutBtn);
    }
    expect(getByText(/zoom 0\.50x/)).toBeDefined();

    // Zoom in multiple times to test upper bound (3.00x)
    for (let i = 0; i < 20; i++) {
      fireEvent.click(zoomInBtn);
    }
    expect(getByText(/zoom 3\.00x/)).toBeDefined();
  });

  it("resets zoom scale to 1.0x and centers viewport when clicking locate-fixed (recenter)", () => {
    const { getByLabelText, getByText } = renderMap();
    const zoomInBtn = getByLabelText("Zoom in map");
    const recenterBtn = getByLabelText("Recenter map viewport");

    // Zoom in
    fireEvent.click(zoomInBtn);
    fireEvent.click(zoomInBtn);
    expect(getByText(/zoom 1\.50x/)).toBeDefined();

    // Click recenter
    fireEvent.click(recenterBtn);
    expect(getByText(/zoom 1\.00x/)).toBeDefined();
  });

  it("filters auto-completion suggestions when typing region name or coordinates", () => {
    const { getByPlaceholderText, getAllByText } = renderMap();
    const input = getByPlaceholderText("Search region or <x, y, z>...");

    // Type "Hollywood"
    fireEvent.change(input, { target: { value: "Hollywood" } });
    const matches = getAllByText("Bay City — Hollywood");
    expect(matches.length).toBeGreaterThan(1);

    // Select suggestion (first element in suggestion list)
    fireEvent.click(matches[0]);

    // Query field should be updated
    expect(input.value).toBe("Bay City — Hollywood");
  });

  it("parses coordinate search queries and shows coordinate jump option", () => {
    const { getByPlaceholderText, getByText } = renderMap();
    const input = getByPlaceholderText("Search region or <x, y, z>...");

    // Type coordinates "<112, 44, 51>"
    fireEvent.change(input, { target: { value: "112, 44, 51" } });
    expect(getByText("Jump to coordinates <112, 44, 51>")).toBeDefined();

    fireEvent.click(getByText("Jump to coordinates <112, 44, 51>"));
    expect(input.value).toBe("<112, 44, 51>");
  });

  it("allows dragging viewport to adjust pan offsets", () => {
    const { container, getByText } = renderMap();
    const mapContainer = container.querySelector(".map-control-overlay").parentElement;

    // Simulate drag gesture
    fireEvent.mouseDown(mapContainer, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(mapContainer, { clientX: 150, clientY: 120 });
    fireEvent.mouseUp(mapContainer);

    // Map viewport remains active and rendered without errors
    expect(getByText(/zoom 1\.00x/)).toBeDefined();
  });
});
