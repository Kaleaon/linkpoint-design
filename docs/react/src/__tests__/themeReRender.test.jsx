import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";
import React, { useRef, useEffect } from "react";
import { KthemeProvider, batchSetCssVariables, flushCssVariables } from "@ktheme/react";
import ThemeStudio from "../components/ThemeStudio.jsx";

describe("Theme Token Update Re-render Optimization", () => {
  it("confirms zero unwanted component re-renders during active theme token updates", () => {
    const renderSpy = vi.fn();

    function TrackedComponent() {
      const rendersRef = useRef(0);
      rendersRef.current += 1;
      useEffect(() => {
        renderSpy(rendersRef.current);
      });

      return (
        <div
          data-testid="themed-box"
          style={{
            color: "var(--ktheme-pri)",
            background: "var(--ktheme-surf)",
          }}
        >
          Tracked Content
        </div>
      );
    }

    const { getByTestId } = render(
      <KthemeProvider themeId="navy-gold">
        <TrackedComponent />
      </KthemeProvider>
    );

    // Initial render count should be 1
    expect(renderSpy).toHaveBeenCalledTimes(1);

    // Perform batched CSS custom property updates via requestAnimationFrame
    act(() => {
      batchSetCssVariables(document.documentElement, {
        "--ktheme-pri": "#FF0055",
        "--ktheme-surf": "#00FF22",
      });
      flushCssVariables();
    });

    // Check that DOM CSS variable properties were updated
    expect(document.documentElement.style.getPropertyValue("--ktheme-pri")).toBe("#FF0055");
    expect(document.documentElement.style.getPropertyValue("--ktheme-surf")).toBe("#00FF22");

    // Component render count should still be 1 (zero React re-renders triggered!)
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it("handles active slider movement in ThemeStudio via batchSetCssVariables without re-rendering", () => {
    const renderSpy = vi.fn();

    function MonitoredTree() {
      renderSpy();
      return (
        <div>
          <ThemeStudio />
        </div>
      );
    }

    const { container } = render(
      <KthemeProvider themeId="navy-gold">
        <MonitoredTree />
      </KthemeProvider>
    );

    const initialRenders = renderSpy.mock.calls.length;

    const colorInput = container.querySelector('input[type="color"]');
    if (colorInput) {
      act(() => {
        fireEvent.input(colorInput, { target: { value: "#123456" } });
        flushCssVariables();
      });

      // CSS variable on document element should be updated
      expect(document.documentElement.style.getPropertyValue("--ktheme-pri")).toBe("#123456");

      // Active input should not trigger whole tree re-render before commit
      expect(renderSpy.mock.calls.length).toBe(initialRenders);
    }
  });
});
