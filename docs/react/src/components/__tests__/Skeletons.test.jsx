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
      </ThemeContext.Provider>,
    );

    const cardListEl = screen.getByTestId("skeleton-card-list");
    expect(cardListEl).toBeInTheDocument();
    expect(cardListEl.style.minHeight).toBe("320px");

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
      </ThemeContext.Provider>,
    );

    const treeEl = screen.getByTestId("skeleton-tree");
    expect(treeEl).toBeInTheDocument();
    expect(treeEl.style.minHeight).toBe("320px");

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
      </ThemeContext.Provider>,
    );

    const detailEl = screen.getByTestId("skeleton-detail");
    expect(detailEl).toBeInTheDocument();
    expect(detailEl.style.minHeight).toBe("320px");

    expect(screen.getByTestId("skeleton-detail-header")).toHaveClass(
      "skeleton-shimmer",
    );
    expect(screen.getByTestId("skeleton-detail-footer")).toHaveClass(
      "skeleton-shimmer",
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
      </AppContext.Provider>,
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
      </AppContext.Provider>,
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
      </AppContext.Provider>,
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
      </AppContext.Provider>,
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
      </AppContext.Provider>,
    );

    const stateBlock = screen.getByTestId("state-block");
    expect(stateBlock).toBeInTheDocument();
    expect(stateBlock.style.minHeight).toBe("320px");
  });
});
