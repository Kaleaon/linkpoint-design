import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import React, { useState } from "react";
import SearchCombobox from "../SearchCombobox.jsx";
import LiveRegionAnnouncer from "../LiveRegionAnnouncer.jsx";
import Search from "../../screens/Search.jsx";
import Inventory from "../../screens/Inventory.jsx";
import Friends from "../../screens/Friends.jsx";
import { AppProvider, AppContext, useApp } from "../../context/AppContext.jsx";
import { ThemeProvider } from "../../context/ThemeContext.jsx";

const mockThemeContext = {
  LK: { card: "box", gap: "8px" },
  V: {
    pri: "#00f0ff",
    onpri: "#000",
    surf: "#12141a",
    surf2: "#1c1f26",
    outv: "#333",
    ink: "#ffffff",
    ink2: "#aaa",
    rs: "4px",
    rp: "8px",
    ok: "#22c55e",
    sec2: "#00f0ff",
  },
  t: { font: "sans-serif", dfont: "sans-serif" },
  bleed: false,
  pad: "10px",
  C: { gap: 8 },
  ink: (c) => c,
};

describe("SearchCombobox Component & WCAG Compliance", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("exposes WCAG 2.2 SC 4.1.2 combobox attributes (role, autocomplete, controls, expanded, label)", () => {
    const announceMock = vi.fn();
    const mockAppContext = {
      state: {},
      actions: { announce: announceMock },
    };

    const { rerender } = render(
      <AppContext.Provider value={mockAppContext}>
        <SearchCombobox
          id="test-combo"
          controlsId="test-results"
          ariaLabel="Filter items"
          value=""
          resultCount={0}
          itemLabel="items"
          onChange={() => {}}
        />
      </AppContext.Provider>
    );

    const input = screen.getByRole("combobox");
    expect(input).toBeDefined();
    expect(input.getAttribute("type")).toBe("search");
    expect(input.getAttribute("aria-autocomplete")).toBe("list");
    expect(input.getAttribute("aria-controls")).toBe("test-results");
    expect(input.getAttribute("aria-label")).toBe("Filter items");
    expect(input.getAttribute("aria-expanded")).toBe("false");

    // When value is present and resultCount > 0, aria-expanded is true
    rerender(
      <AppContext.Provider value={mockAppContext}>
        <SearchCombobox
          id="test-combo"
          controlsId="test-results"
          ariaLabel="Filter items"
          value="foo"
          resultCount={3}
          itemLabel="items"
          onChange={() => {}}
        />
      </AppContext.Provider>
    );

    expect(screen.getByRole("combobox").getAttribute("aria-expanded")).toBe(
      "true"
    );

    // When value is present but resultCount is 0, aria-expanded is false
    rerender(
      <AppContext.Provider value={mockAppContext}>
        <SearchCombobox
          id="test-combo"
          controlsId="test-results"
          ariaLabel="Filter items"
          value="foo"
          resultCount={0}
          itemLabel="items"
          onChange={() => {}}
        />
      </AppContext.Provider>
    );

    expect(screen.getByRole("combobox").getAttribute("aria-expanded")).toBe(
      "false"
    );
  });

  it("debounces announcement messages by 300ms and announces matching result counts", () => {
    const announceMock = vi.fn();
    const mockAppContext = {
      state: {},
      actions: { announce: announceMock },
    };

    function StatefulCombobox() {
      const [val, setVal] = useState("");
      const [count, setCount] = useState(0);

      return (
        <div>
          <button
            onClick={() => {
              setVal("resident");
              setCount(5);
            }}
          >
            Search 5
          </button>
          <button
            onClick={() => {
              setVal("unknown");
              setCount(0);
            }}
          >
            Search 0
          </button>
          <SearchCombobox
            controlsId="results-list"
            ariaLabel="Search"
            value={val}
            resultCount={count}
            itemLabel="residents"
            onChange={(e) => setVal(e.target.value)}
          />
        </div>
      );
    }

    render(
      <AppContext.Provider value={mockAppContext}>
        <StatefulCombobox />
      </AppContext.Provider>
    );

    // Initial render should not announce
    expect(announceMock).not.toHaveBeenCalled();

    // Trigger search with 5 results
    fireEvent.click(screen.getByText("Search 5"));

    // Immediately before 300ms, no announcement yet
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(announceMock).not.toHaveBeenCalled();

    // After 300ms total, announcement is made
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(announceMock).toHaveBeenCalledWith("5 matching residents found");

    // Trigger search with 0 results
    announceMock.mockClear();
    fireEvent.click(screen.getByText("Search 0"));

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(announceMock).toHaveBeenCalledWith("No matching residents found");
  });
});

describe("LiveRegionAnnouncer Component & WCAG 2.2 SC 4.1.3", () => {
  it("renders status role with aria-live polite and announces dynamic messages", () => {
    const mockAppContext = {
      state: { toast: "", announcement: "4 matching residents found" },
      actions: {},
    };

    render(
      <AppContext.Provider value={mockAppContext}>
        <LiveRegionAnnouncer />
      </AppContext.Provider>
    );

    const liveRegion = screen.getByRole("status");
    expect(liveRegion).toBeDefined();
    expect(liveRegion.getAttribute("aria-live")).toBe("polite");
    expect(liveRegion.getAttribute("aria-atomic")).toBe("true");
    expect(liveRegion.textContent).toBe("4 matching residents found");
  });

  it("prioritizes toast notifications over search announcements when both exist", () => {
    const mockAppContext = {
      state: {
        toast: "Teleporting...",
        announcement: "4 matching residents found",
      },
      actions: {},
    };

    render(
      <AppContext.Provider value={mockAppContext}>
        <LiveRegionAnnouncer />
      </AppContext.Provider>
    );

    const liveRegion = screen.getByRole("status");
    expect(liveRegion.textContent).toBe("Teleporting...");
  });

  it("returns null when neither toast nor announcement is present", () => {
    const mockAppContext = {
      state: { toast: "", announcement: "" },
      actions: {},
    };

    const { container } = render(
      <AppContext.Provider value={mockAppContext}>
        <LiveRegionAnnouncer />
      </AppContext.Provider>
    );

    expect(container.firstChild).toBeNull();
  });
});

describe("Screen Integration: Search.jsx, Inventory.jsx, Friends.jsx", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("Search screen renders SearchCombobox wired to search-results-list container", () => {
    render(
      <AppProvider>
        <ThemeProvider>
          <Search />
          <LiveRegionAnnouncer />
        </ThemeProvider>
      </AppProvider>
    );

    const combobox = screen.getByRole("combobox");
    expect(combobox).toBeDefined();
    expect(combobox.getAttribute("aria-controls")).toBe("search-results-list");

    const resultsList = document.getElementById("search-results-list");
    expect(resultsList).not.toBeNull();

    // Type query to filter
    fireEvent.change(combobox, { target: { value: "Nyx" } });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    const statusMsg = screen.getByRole("status");
    expect(statusMsg.textContent).toContain("matching residents found");
  });

  it("Inventory screen renders interactive SearchCombobox wired to inventory-results-tree container", () => {
    render(
      <AppProvider>
        <ThemeProvider>
          <Inventory />
          <LiveRegionAnnouncer />
        </ThemeProvider>
      </AppProvider>
    );

    const combobox = screen.getByRole("combobox");
    expect(combobox).toBeDefined();
    expect(combobox.getAttribute("aria-controls")).toBe(
      "inventory-results-tree"
    );
    expect(combobox.getAttribute("placeholder")).toBe("filter inventory…");

    const tree = document.getElementById("inventory-results-tree");
    expect(tree).not.toBeNull();

    // Filter items with "mesh"
    fireEvent.change(combobox, { target: { value: "mesh" } });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    const statusMsg = screen.getByRole("status");
    expect(statusMsg.textContent).toContain("matching inventory items found");
  });

  it("Friends screen renders SearchCombobox wired to friends-results-list container", () => {
    render(
      <AppProvider>
        <ThemeProvider>
          <Friends />
          <LiveRegionAnnouncer />
        </ThemeProvider>
      </AppProvider>
    );

    const combobox = screen.getByRole("combobox");
    expect(combobox).toBeDefined();
    expect(combobox.getAttribute("aria-controls")).toBe("friends-results-list");

    const list = document.getElementById("friends-results-list");
    expect(list).not.toBeNull();

    // Filter friends with query
    fireEvent.change(combobox, { target: { value: "Nyx" } });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    const statusMsg = screen.getByRole("status");
    expect(statusMsg.textContent).toBe("1 matching friends found");
  });
});
