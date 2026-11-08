import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CardList from "../CardList.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import { ThemeContext } from "../../context/ThemeContext.jsx";
import { buildCards } from "../../data/content.js";

const mockThemeContext = {
  LK: { card: "box", gap: "8px" },
  V: { pri: "#00f0ff", ink: "#ffffff", ink2: "#aaa", outv: "#333" },
  t: { font: "sans-serif" },
};

describe("CardList - Pull-to-refresh & Receipt Dialogs", () => {
  it("triggers refreshBalance action on downward pull swipe release", () => {
    const refreshBalanceMock = vi.fn();
    const mockAppContext = {
      state: { lindenBalance: 4250, exchangeRate: 248.5, dialog: null },
      actions: { refreshBalance: refreshBalanceMock, setDialog: vi.fn() },
    };

    const dummyCards = [{ title: "Test Card", body: "Sample body" }];

    render(
      <AppContext.Provider value={mockAppContext}>
        <ThemeContext.Provider value={mockThemeContext}>
          <CardList cards={dummyCards} />
        </ThemeContext.Provider>
      </AppContext.Provider>
    );

    const container = screen
      .getByText("Test Card")
      .closest("div").parentElement;

    fireEvent.touchStart(container, { touches: [{ clientY: 100 }] });
    fireEvent.touchMove(container, { touches: [{ clientY: 250 }] });
    fireEvent.touchEnd(container);

    expect(refreshBalanceMock).toHaveBeenCalled();
  });

  it("opens itemized receipt dialog when clicking VIEW RECEIPT on a transaction card", () => {
    const setDialogMock = vi.fn();
    const mockState = {
      lindenBalance: 4250,
      exchangeRate: 248.5,
      cacheCleared: {},
      prefs: { cacheLimit: 512, cacheLoc: "Internal" },
      toggles: { mediaAuto: false, autoresponse: false },
      pinned: {},
      dismissed: {},
      tabs: { Friends: "ALL" },
    };
    const mockActions = {
      setDialog: setDialogMock,
      notify: vi.fn(),
      allGrids: () => [],
    };

    const cards = buildCards({
      state: mockState,
      actions: mockActions,
      layoutName: "Terminal",
      paletteName: "Ink",
    });
    const transactionCards = cards.Transactions;

    render(
      <AppContext.Provider value={{ state: mockState, actions: mockActions }}>
        <ThemeContext.Provider value={mockThemeContext}>
          <CardList cards={transactionCards} />
        </ThemeContext.Provider>
      </AppContext.Provider>
    );

    const receiptButtons = screen.getAllByText("VIEW RECEIPT");
    expect(receiptButtons.length).toBeGreaterThan(0);

    fireEvent.click(receiptButtons[0]);

    expect(setDialogMock).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: "ITEMIZED RECEIPT",
        title: "Received L$ 1,200",
      })
    );
  });
});
