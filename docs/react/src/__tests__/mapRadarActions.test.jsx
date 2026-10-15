import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";
import React from "react";
import { AppProvider, useApp } from "../context/AppContext.jsx";
import { ThemeProvider } from "../context/ThemeContext.jsx";
import Map from "../screens/Map.jsx";
import Radar from "../screens/Radar.jsx";

function MapTestHarness() {
  const { state } = useApp();
  return (
    <div>
      <div data-testid="screen">{state.screen}</div>
      <div data-testid="toast">{state.toast}</div>
      <Map />
    </div>
  );
}

function RadarTestHarness({ mode = "AV", openItem = null, menuItem = null }) {
  const { state, actions } = useApp();

  React.useEffect(() => {
    actions.setRMode(mode);
    if (openItem) actions.radarTap(openItem);
    if (menuItem) actions.radarHold(menuItem);
  }, [mode, openItem, menuItem]);

  return (
    <div>
      <div data-testid="screen">{state.screen}</div>
      <div data-testid="toast">{state.toast}</div>
      <div data-testid="chat-chip">{state.chip}</div>
      <div data-testid="search-tab">{state.searchTab}</div>
      <Radar />
    </div>
  );
}

describe("Map and Radar Action Handlers", () => {
  describe("Map Component", () => {
    it("triggers teleportToRegion on Teleport button click and keypress", () => {
      const { getByTestId, getByLabelText } = render(
        <AppProvider>
          <ThemeProvider>
            <MapTestHarness />
          </ThemeProvider>
        </AppProvider>
      );

      const teleportBtn = getByLabelText("Teleport to region");
      fireEvent.click(teleportBtn);
      expect(getByTestId("toast").textContent).toContain("Teleporting to Da Boom");

      // Test keypress (Enter)
      fireEvent.keyDown(teleportBtn, { key: "Enter" });
      expect(getByTestId("toast").textContent).toContain("Teleporting to Da Boom");

      // Test keypress (Space)
      fireEvent.keyDown(teleportBtn, { key: " " });
      expect(getByTestId("toast").textContent).toContain("Teleporting to Da Boom");
    });

    it("triggers saveLandmark on Bookmark star button click and keypress", () => {
      const { getByTestId, getByLabelText } = render(
        <AppProvider>
          <ThemeProvider>
            <MapTestHarness />
          </ThemeProvider>
        </AppProvider>
      );

      const bookmarkBtn = getByLabelText("Bookmark location");
      fireEvent.click(bookmarkBtn);
      expect(getByTestId("toast").textContent).toContain("Landmark saved to Inventory: Da Boom");

      // Toggle off via Space keypress
      fireEvent.keyDown(bookmarkBtn, { key: " " });
      expect(getByTestId("toast").textContent).toContain("Landmark removed: Da Boom");
    });

    it("triggers feedback notifications on Zoom and Locate controls", () => {
      const { getByTestId, getByLabelText } = render(
        <AppProvider>
          <ThemeProvider>
            <MapTestHarness />
          </ThemeProvider>
        </AppProvider>
      );

      const plusBtn = getByLabelText("Map plus");
      const minusBtn = getByLabelText("Map minus");
      const locateBtn = getByLabelText("Map locate-fixed");

      fireEvent.click(plusBtn);
      expect(getByTestId("toast").textContent).toBe("Zoomed in map view");

      fireEvent.click(minusBtn);
      expect(getByTestId("toast").textContent).toBe("Zoomed out map view");

      fireEvent.click(locateBtn);
      expect(getByTestId("toast").textContent).toBe("Centered on current location");
    });
  });

  describe("Radar Component", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("dispatches avatar action chips (PROFILE, IM, TRACK, TELEPORT TO)", () => {
      const { getByTestId, getByLabelText } = render(
        <AppProvider>
          <ThemeProvider>
            <RadarTestHarness mode="AV" openItem="Nyx Vaher" />
          </ThemeProvider>
        </AppProvider>
      );

      // PROFILE chip triggers openSearch
      const profileChip = getByLabelText("PROFILE");
      fireEvent.click(profileChip);
      expect(getByTestId("screen").textContent).toBe("Search");
      expect(getByTestId("search-tab").textContent).toBe("SEARCH");

      // IM chip triggers startIm
      const imChip = getByLabelText("IM");
      fireEvent.click(imChip);
      expect(getByTestId("screen").textContent).toBe("Chat");
      expect(getByTestId("chat-chip").textContent).toBe("Nyx Vaher");

      // TRACK chip triggers notification
      const trackChip = getByLabelText("TRACK");
      fireEvent.click(trackChip);
      expect(getByTestId("toast").textContent).toContain("Tracking avatar: Nyx Vaher");

      // TELEPORT TO chip triggers teleportToRegion
      const tpChip = getByLabelText("TELEPORT TO");
      fireEvent.click(tpChip);
      expect(getByTestId("toast").textContent).toContain("Teleporting to Nyx Vaher");
    });

    it("dispatches object action chips (INSPECT, TOUCH, DERENDER, TRACK)", () => {
      const { getByTestId, getByLabelText } = render(
        <AppProvider>
          <ThemeProvider>
            <RadarTestHarness mode="OBJ" openItem="Vendor — Sunset Lamp v3" />
          </ThemeProvider>
        </AppProvider>
      );

      const inspectChip = getByLabelText("INSPECT");
      fireEvent.click(inspectChip);
      expect(getByTestId("toast").textContent).toContain("Inspecting object: Vendor — Sunset Lamp v3");

      const touchChip = getByLabelText("TOUCH");
      fireEvent.click(touchChip);
      expect(getByTestId("toast").textContent).toContain("Touched Vendor — Sunset Lamp v3");

      const derenderChip = getByLabelText("DERENDER");
      fireEvent.click(derenderChip);
      expect(getByTestId("toast").textContent).toContain("Derendered object: Vendor — Sunset Lamp v3");

      const trackChip = getByLabelText("TRACK");
      fireEvent.click(trackChip);
      expect(getByTestId("toast").textContent).toContain("Tracking object: Vendor — Sunset Lamp v3");
    });

    it("dispatches moderation chips for avatars and objects", () => {
      const { getByTestId, getByLabelText, rerender } = render(
        <AppProvider>
          <ThemeProvider>
            <RadarTestHarness mode="AV" menuItem="Nyx Vaher" />
          </ThemeProvider>
        </AppProvider>
      );

      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Avatar moderation chips
      const muteChip = getByLabelText("MUTE");
      fireEvent.click(muteChip);
      expect(getByTestId("toast").textContent).toContain("Muted avatar: Nyx Vaher");

      const ejectChip = getByLabelText("EJECT");
      fireEvent.click(ejectChip);
      expect(getByTestId("toast").textContent).toContain("Ejected avatar: Nyx Vaher");

      // Object moderation chips
      rerender(
        <AppProvider>
          <ThemeProvider>
            <RadarTestHarness mode="OBJ" menuItem="Vendor — Sunset Lamp v3" />
          </ThemeProvider>
        </AppProvider>
      );

      act(() => {
        vi.advanceTimersByTime(500);
      });

      const returnChip = getByLabelText("RETURN");
      fireEvent.click(returnChip);
      expect(getByTestId("toast").textContent).toContain("Returned object: Vendor — Sunset Lamp v3");
    });
  });
});
