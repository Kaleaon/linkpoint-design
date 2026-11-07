import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import {
  SkeletonCardList,
  SkeletonTree,
  SkeletonDetail,
} from "../Skeletons.jsx";
import CardList from "../CardList.jsx";
import Inventory from "../../screens/Inventory.jsx";
import Search from "../../screens/Search.jsx";
import SplitDetail from "../SplitDetail.jsx";
import StateBlock from "../StateBlock.jsx";
import ScreenBody from "../ScreenBody.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import { ThemeContext, ThemeProvider } from "../../context/ThemeContext.jsx";

const mockThemeTokens = {
  V: {
    surf: "#111111",
    surf2: "#222222",
    outv: "#333333",
    bg: "#000000",
    pri: "#00f0ff",
    priC: "#003344",
    onpri: "#000000",
    onpriC: "#00ffff",
    sec2: "#aa88ff",
    ink: "#ffffff",
    ink2: "#aaaaaa",
    err: "#ff4444",
    rs: "4px",
    rp: "50%",
    tls: "0.05em",
  },
  LK: { card: "box", gap: "8px", head: "normal" },
  t: { font: "sans-serif", dfont: "sans-serif", nav: "TABS" },
  d: { split: false, desk: false, w: 393, h: 852 },
  scr: "Friends",
  norm: true,
  stateBlockActive: false,
};

describe("Modular Contextual Skeletons & Reserved Layout Geometry", () => {
  it("renders SkeletonCardList with shimmer animation and reserved container bounds", () => {
    const { container } = render(
      <ThemeContext.Provider value={mockThemeTokens}>
        <SkeletonCardList count={4} />
      </ThemeContext.Provider>
    );

    const cardListEl = screen.getByTestId("skeleton-card-list");
    expect(cardListEl).toBeInTheDocument();
    expect(cardListEl.style.minHeight).toBe("320px");
    expect(cardListEl).toHaveAttribute("role", "status");
    expect(cardListEl).toHaveAttribute("aria-busy", "true");
    expect(cardListEl).toHaveAttribute("aria-label", "Loading card items...");

    const srText = cardListEl.querySelector("span.sr-only");
    expect(srText).toBeInTheDocument();
    expect(srText).toHaveAttribute("aria-live", "polite");
    expect(srText).toHaveTextContent("Loading card items...");

    const items = screen.getAllByTestId("skeleton-card-item");
    expect(items.length).toBe(4);
    items.forEach((item) => {
      expect(item).toHaveClass("skeleton-shimmer");
    });
  });

  it("renders SkeletonTree with hierarchical shimmer rows and reserved container bounds", () => {
    render(
      <ThemeContext.Provider value={mockThemeTokens}>
        <SkeletonTree count={6} />
      </ThemeContext.Provider>
    );

    const treeEl = screen.getByTestId("skeleton-tree");
    expect(treeEl).toBeInTheDocument();
    expect(treeEl.style.minHeight).toBe("320px");
    expect(treeEl).toHaveAttribute("role", "status");
    expect(treeEl).toHaveAttribute("aria-busy", "true");
    expect(treeEl).toHaveAttribute("aria-label", "Loading tree hierarchy...");

    const srText = treeEl.querySelector("span.sr-only");
    expect(srText).toBeInTheDocument();
    expect(srText).toHaveAttribute("aria-live", "polite");
    expect(srText).toHaveTextContent("Loading tree hierarchy...");

    const rows = screen.getAllByTestId("skeleton-tree-row");
    expect(rows.length).toBe(6);
    rows.forEach((row) => {
      expect(row).toHaveClass("skeleton-shimmer");
    });
  });

  it("renders SkeletonDetail with header, body, and footer shimmer elements", () => {
    render(
      <ThemeContext.Provider value={mockThemeTokens}>
        <SkeletonDetail />
      </ThemeContext.Provider>
    );

    const detailEl = screen.getByTestId("skeleton-detail");
    expect(detailEl).toBeInTheDocument();
    expect(detailEl.style.minHeight).toBe("320px");
    expect(detailEl).toHaveAttribute("role", "status");
    expect(detailEl).toHaveAttribute("aria-busy", "true");
    expect(detailEl).toHaveAttribute("aria-label", "Loading detail pane...");

    const srText = detailEl.querySelector("span.sr-only");
    expect(srText).toBeInTheDocument();
    expect(srText).toHaveAttribute("aria-live", "polite");
    expect(srText).toHaveTextContent("Loading detail pane...");

    expect(screen.getByTestId("skeleton-detail-header")).toHaveClass(
      "skeleton-shimmer"
    );
    expect(screen.getByTestId("skeleton-detail-footer")).toHaveClass(
      "skeleton-shimmer"
    );
  });

  it("renders SkeletonCardList in CardList component when state.cond === 'loading'", () => {
    const mockAppContext = {
      state: {
        cond: "loading",
        screen: "Friends",
        layout: "default",
        palette: "default",
      },
      actions: {},
    };

    render(
      <AppContext.Provider value={mockAppContext}>
        <ThemeContext.Provider value={mockThemeTokens}>
          <CardList cards={[]} />
        </ThemeContext.Provider>
      </AppContext.Provider>
    );

    const skeletonEl = screen.getByTestId("skeleton-card-list");
    expect(skeletonEl).toBeInTheDocument();
    expect(skeletonEl.style.minHeight).toBe("320px");
  });

  it("renders SkeletonTree in Inventory screen when state.cond === 'loading'", () => {
    const mockAppContext = {
      state: { cond: "loading", screen: "Inventory", invOpen: {}, tabs: {} },
      actions: {},
    };

    render(
      <AppContext.Provider value={mockAppContext}>
        <ThemeContext.Provider value={{ ...mockThemeTokens, scr: "Inventory" }}>
          <Inventory />
        </ThemeContext.Provider>
      </AppContext.Provider>
    );

    const treeSkeleton = screen.getByTestId("skeleton-tree");
    expect(treeSkeleton).toBeInTheDocument();
    expect(treeSkeleton.style.minHeight).toBe("320px");
  });

  it("renders SkeletonCardList in Search screen results area when state.cond === 'loading'", () => {
    const mockAppContext = {
      state: {
        cond: "loading",
        screen: "Search",
        searchTab: "FRIENDS",
        searchQuery: "",
        searchState: {},
      },
      actions: {},
    };

    render(
      <AppContext.Provider value={mockAppContext}>
        <ThemeContext.Provider value={{ ...mockThemeTokens, scr: "Search" }}>
          <Search />
        </ThemeContext.Provider>
      </AppContext.Provider>
    );

    const skeletonEl = screen.getByTestId("skeleton-card-list");
    expect(skeletonEl).toBeInTheDocument();
    expect(skeletonEl.style.minHeight).toBe("300px");
  });

  it("renders SkeletonDetail in SplitDetail when split view is active and state.cond === 'loading'", () => {
    const splitThemeTokens = {
      ...mockThemeTokens,
      d: { split: true, desk: false, w: 1194, h: 834 },
      scr: "Chat",
    };

    const mockAppContext = {
      state: { cond: "loading", screen: "Chat" },
      actions: {},
    };

    render(
      <AppContext.Provider value={mockAppContext}>
        <ThemeContext.Provider value={splitThemeTokens}>
          <SplitDetail />
        </ThemeContext.Provider>
      </AppContext.Provider>
    );

    const skeletonDetail = screen.getByTestId("skeleton-detail");
    expect(skeletonDetail).toBeInTheDocument();
    expect(skeletonDetail.style.minHeight).toBe("320px");
  });

  it("renders StateBlock in reserved container dimensions when state.cond is empty or error", () => {
    const emptyThemeTokens = {
      ...mockThemeTokens,
      stateBlockActive: true,
      condPack: {
        icon: "inbox",
        title: "NO MESSAGES",
        body: "Your inbox is empty.",
        btn: "REFRESH",
      },
    };

    const mockAppContext = {
      state: { cond: "empty" },
      actions: { setCond: vi.fn() },
    };

    render(
      <AppContext.Provider value={mockAppContext}>
        <ThemeContext.Provider value={emptyThemeTokens}>
          <StateBlock />
        </ThemeContext.Provider>
      </AppContext.Provider>
    );

    const stateBlock = screen.getByTestId("state-block");
    expect(stateBlock).toBeInTheDocument();
    expect(stateBlock.style.minHeight).toBe("320px");
  });
});

describe("WCAG 2.2 SC 4.1.3 Status Messages & ARIA22 Semantic Enhancement", () => {
  it("supports configurable label and aria-live props on SkeletonCardList", () => {
    render(
      <ThemeContext.Provider value={mockThemeTokens}>
        <SkeletonCardList label="Loading friends list..." ariaLive="assertive" />
      </ThemeContext.Provider>
    );

    const cardListEl = screen.getByRole("status", { name: "Loading friends list..." });
    expect(cardListEl).toBeInTheDocument();
    expect(cardListEl).toHaveAttribute("aria-busy", "true");
    expect(cardListEl).toHaveAttribute("aria-label", "Loading friends list...");

    const srText = cardListEl.querySelector("span.sr-only");
    expect(srText).toHaveAttribute("aria-live", "assertive");
    expect(srText).toHaveTextContent("Loading friends list...");
  });

  it("supports configurable label and aria-live props on SkeletonTree", () => {
    render(
      <ThemeContext.Provider value={mockThemeTokens}>
        <SkeletonTree label="Loading inventory hierarchy..." aria-live="polite" />
      </ThemeContext.Provider>
    );

    const treeEl = screen.getByRole("status", { name: "Loading inventory hierarchy..." });
    expect(treeEl).toBeInTheDocument();
    expect(treeEl).toHaveAttribute("aria-busy", "true");
    expect(treeEl).toHaveAttribute("aria-label", "Loading inventory hierarchy...");

    const srText = treeEl.querySelector("span.sr-only");
    expect(srText).toHaveAttribute("aria-live", "polite");
    expect(srText).toHaveTextContent("Loading inventory hierarchy...");
  });

  it("supports configurable label and aria-live props on SkeletonDetail", () => {
    render(
      <ThemeContext.Provider value={mockThemeTokens}>
        <SkeletonDetail label="Loading inspector pane..." ariaLive="assertive" />
      </ThemeContext.Provider>
    );

    const detailEl = screen.getByRole("status", { name: "Loading inspector pane..." });
    expect(detailEl).toBeInTheDocument();
    expect(detailEl).toHaveAttribute("aria-busy", "true");
    expect(detailEl).toHaveAttribute("aria-label", "Loading inspector pane...");

    const srText = detailEl.querySelector("span.sr-only");
    expect(srText).toHaveAttribute("aria-live", "assertive");
    expect(srText).toHaveTextContent("Loading inspector pane...");
  });

  it("applies standard CSS clipping styles to visually-hidden status announcements", () => {
    render(
      <ThemeContext.Provider value={mockThemeTokens}>
        <SkeletonCardList />
      </ThemeContext.Provider>
    );

    const srText = screen.getByTestId("skeleton-card-list").querySelector("span.sr-only");
    expect(srText).toBeInTheDocument();
    expect(srText.style.position).toBe("absolute");
    expect(srText.style.width).toBe("1px");
    expect(srText.style.height).toBe("1px");
    expect(srText.style.overflow).toBe("hidden");
    expect(srText.style.clip).toBe("rect(0px, 0px, 0px, 0px)");
    expect(srText.style.whiteSpace).toBe("nowrap");
  });

  it("exposes role='status' and aria-busy='true' when consumer screens enter loading state", () => {
    const mockAppContext = {
      state: { cond: "loading", screen: "Inventory", invOpen: {}, tabs: {} },
      actions: {},
    };

    render(
      <AppContext.Provider value={mockAppContext}>
        <ThemeContext.Provider value={{ ...mockThemeTokens, scr: "Inventory" }}>
          <Inventory />
        </ThemeContext.Provider>
      </AppContext.Provider>
    );

    const inventoryStatus = screen.getByRole("status", { name: "Loading tree hierarchy..." });
    expect(inventoryStatus).toBeInTheDocument();
    expect(inventoryStatus).toHaveAttribute("aria-busy", "true");
  });
});
