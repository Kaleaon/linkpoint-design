import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import BlockKeypad from "../BlockKeypad.jsx";
import SegmentedMeter from "../SegmentedMeter.jsx";
import { ThemeContext } from "../../context/ThemeContext.jsx";

const mockThemeContext = {
  V: {
    surf: "#111",
    surf2: "#222",
    bg: "#000",
    ink: "#fff",
    ink2: "#aaa",
    pri: "#3b82f6",
    sec2: "#f59e0b",
    outv: "#333",
    rs: "4px",
    rp: "8px",
    err: "#ef4444",
  },
  t: {
    font: '"JetBrains Mono", monospace',
    dfont: '"JetBrains Mono", monospace',
    mfont: '"JetBrains Mono", monospace',
  },
  LK: { card: "box" },
  pad: "12px",
  ink: () => "#fff",
};

describe("Typography Token Binding in React UI Components", () => {
  it("renders BlockKeypad with CSS custom property font bindings", () => {
    const { container } = render(
      <ThemeContext.Provider value={mockThemeContext}>
        <BlockKeypad title="SECURITY CODE" systemCode="SEC-01-CODE" />
      </ThemeContext.Provider>
    );

    const dialog = screen.getByRole("dialog", { name: "SECURITY CODE" });
    expect(dialog).toBeTruthy();

    const titleEl = screen.getByText("SECURITY CODE");
    expect(titleEl.style.fontFamily).toContain("--ktheme-font-family");
    expect(titleEl.style.fontSize).toContain("--ktheme-font-size-base");

    const codeEl = screen.getByText("[SEC-01-CODE]");
    expect(codeEl.style.fontFamily).toContain("--ktheme-font-family");
  });

  it("renders SegmentedMeter with CSS custom property font bindings", () => {
    const { container } = render(
      <ThemeContext.Provider value={mockThemeContext}>
        <SegmentedMeter
          value={50}
          max={100}
          systemCode="SYS-01-PWR"
          showReadout={true}
        />
      </ThemeContext.Provider>
    );

    const codeEl = screen.getByText("SYS-01-PWR");
    expect(codeEl.style.fontFamily).toContain("--ktheme-font-family");

    const readoutEl = screen.getByText(/50 \/ 100/);
    expect(readoutEl.style.fontFamily).toContain("--ktheme-font-family");
  });
});
