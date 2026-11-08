import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import World3D from "../World3D.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import { ThemeContext } from "../../context/ThemeContext.jsx";

function renderWorld3D({ stateOverrides = {}, actionsOverrides = {} } = {}) {
  const defaultState = {
    screen: "3D View",
    layout: "terminal",
    palette: "ink",
    tabs: {},
    hudOn: {},
    hudPicker: false,
    target: null,
    targetPicker: false,
    cPad: false,
    cHeld: "",
    cCam: "ORBIT",
    ...stateOverrides,
  };

  const defaultActions = {
    flyUpDown: vi.fn(),
    flyDnDown: vi.fn(),
    flyRelease: vi.fn(),
    cHold: vi.fn(),
    holdEnd: vi.fn(),
    notify: vi.fn(),
    setHudPicker: vi.fn(),
    setTargetPicker: vi.fn(),
    setTarget: vi.fn(),
    setCamPreset: vi.fn(),
    ...actionsOverrides,
  };

  const defaultTheme = {
    V: {
      surf: "#101A1C",
      surf2: "#182426",
      pri: "#6CFF9A",
      onpri: "#03240F",
      ink: "#D7F5E6",
      ink2: "#7DA895",
      outv: "#365047",
      rs: "4px",
      rl: "12px",
      rp: "16px",
      bdg: "#FF6584",
      onbdg: "#FFFFFF",
    },
    t: { font: "sans-serif", dfont: "monospace" },
    ink: (bg, [dark, light]) => light || "#FFFFFF",
  };

  const renderResult = render(
    <AppContext.Provider
      value={{ state: defaultState, actions: defaultActions }}
    >
      <ThemeContext.Provider value={defaultTheme}>
        <World3D />
      </ThemeContext.Provider>
    </AppContext.Provider>
  );

  return {
    ...renderResult,
    actions: defaultActions,
    state: defaultState,
  };
}

describe("World3D Overlay Controls Accessibility and Interaction", () => {
  it("renders all overlay triggers with role='button', tabIndex=0, and aria-label", () => {
    renderWorld3D();

    const flyUp = screen.getByLabelText("Fly up");
    const flyDown = screen.getByLabelText("Fly down");
    const snapshot = screen.getByLabelText("Take snapshot");
    const moveFwd = screen.getByLabelText("Move forward");
    const moveBck = screen.getByLabelText("Move backward");
    const moveLft = screen.getByLabelText("Move left");
    const moveRgt = screen.getByLabelText("Move right");

    const controls = [
      flyUp,
      flyDown,
      snapshot,
      moveFwd,
      moveBck,
      moveLft,
      moveRgt,
    ];
    controls.forEach((control) => {
      expect(control).toBeTruthy();
      expect(control.getAttribute("role")).toBe("button");
      expect(control.getAttribute("tabindex")).toBe("0");
      expect(control.getAttribute("aria-label")).toBeTruthy();
    });
  });

  describe("Vertical Fly and Snapshot controls", () => {
    it("triggers flyUpDown on press/down and flyRelease on release for Fly Up button", () => {
      const { actions } = renderWorld3D();
      const flyUp = screen.getByLabelText("Fly up");

      fireEvent.mouseDown(flyUp);
      expect(actions.flyUpDown).toHaveBeenCalledTimes(1);

      fireEvent.mouseUp(flyUp);
      expect(actions.flyRelease).toHaveBeenCalledTimes(1);

      fireEvent.touchStart(flyUp);
      expect(actions.flyUpDown).toHaveBeenCalledTimes(2);

      fireEvent.touchEnd(flyUp);
      expect(actions.flyRelease).toHaveBeenCalledTimes(2);
    });

    it("triggers flyDnDown on press/down and flyRelease on release for Fly Down button", () => {
      const { actions } = renderWorld3D();
      const flyDown = screen.getByLabelText("Fly down");

      fireEvent.mouseDown(flyDown);
      expect(actions.flyDnDown).toHaveBeenCalledTimes(1);

      fireEvent.mouseUp(flyDown);
      expect(actions.flyRelease).toHaveBeenCalledTimes(1);

      fireEvent.touchStart(flyDown);
      expect(actions.flyDnDown).toHaveBeenCalledTimes(2);

      fireEvent.touchEnd(flyDown);
      expect(actions.flyRelease).toHaveBeenCalledTimes(2);
    });

    it("triggers flyUpDown and flyRelease on click and keyboard activation", () => {
      const { actions } = renderWorld3D();
      const flyUp = screen.getByLabelText("Fly up");

      fireEvent.click(flyUp);
      expect(actions.flyUpDown).toHaveBeenCalled();
      expect(actions.flyRelease).toHaveBeenCalled();

      fireEvent.keyDown(flyUp, { key: "Enter" });
      expect(actions.flyUpDown).toHaveBeenCalled();

      fireEvent.keyUp(flyUp, { key: "Enter" });
      expect(actions.flyRelease).toHaveBeenCalled();

      fireEvent.keyDown(flyUp, { key: " " });
      expect(actions.flyUpDown).toHaveBeenCalled();

      fireEvent.keyUp(flyUp, { key: " " });
      expect(actions.flyRelease).toHaveBeenCalled();
    });

    it("triggers snapshot notification on click and keyboard activation", () => {
      const { actions } = renderWorld3D();
      const snapshot = screen.getByLabelText("Take snapshot");

      fireEvent.click(snapshot);
      expect(actions.notify).toHaveBeenCalledWith(
        "Snapshot captured to inventory"
      );

      fireEvent.keyDown(snapshot, { key: "Enter" });
      expect(actions.notify).toHaveBeenCalledWith(
        "Snapshot captured to inventory"
      );

      fireEvent.keyDown(snapshot, { key: " " });
      expect(actions.notify).toHaveBeenCalledWith(
        "Snapshot captured to inventory"
      );
    });

    it("displays visual active styling when cHeld is up or dn", () => {
      const { rerender } = renderWorld3D({ stateOverrides: { cHeld: "up" } });
      const flyUp = screen.getByLabelText("Fly up");
      expect(flyUp.style.background).toBe("rgb(108, 255, 154)"); // V.pri

      rerender(
        <AppContext.Provider
          value={{
            state: { screen: "3D View", cHeld: "dn", tabs: {}, hudOn: {} },
            actions: {},
          }}
        >
          <ThemeContext.Provider
            value={{
              V: {
                surf: "#101A1C",
                pri: "#6CFF9A",
                onpri: "#03240F",
                outv: "#365047",
                rs: "4px",
              },
              t: { font: "sans-serif" },
            }}
          >
            <World3D />
          </ThemeContext.Provider>
        </AppContext.Provider>
      );
      const flyDown = screen.getByLabelText("Fly down");
      expect(flyDown.style.background).toBe("rgb(108, 255, 154)");
    });
  });

  describe("Directional D-pad controls", () => {
    it("triggers cHold and holdEnd on directional chevron interactions", () => {
      const { actions } = renderWorld3D();
      const moveFwd = screen.getByLabelText("Move forward");
      const moveBck = screen.getByLabelText("Move backward");
      const moveLft = screen.getByLabelText("Move left");
      const moveRgt = screen.getByLabelText("Move right");

      // Forward
      fireEvent.mouseDown(moveFwd);
      expect(actions.cHold).toHaveBeenCalledWith("fwd");
      fireEvent.mouseUp(moveFwd);
      expect(actions.holdEnd).toHaveBeenCalled();

      // Backward
      fireEvent.mouseDown(moveBck);
      expect(actions.cHold).toHaveBeenCalledWith("bck");
      fireEvent.mouseUp(moveBck);
      expect(actions.holdEnd).toHaveBeenCalled();

      // Left
      fireEvent.mouseDown(moveLft);
      expect(actions.cHold).toHaveBeenCalledWith("lft");
      fireEvent.mouseUp(moveLft);
      expect(actions.holdEnd).toHaveBeenCalled();

      // Right
      fireEvent.mouseDown(moveRgt);
      expect(actions.cHold).toHaveBeenCalledWith("rgt");
      fireEvent.mouseUp(moveRgt);
      expect(actions.holdEnd).toHaveBeenCalled();
    });

    it("supports keyboard activation via Enter and Space keys for D-pad", () => {
      const { actions } = renderWorld3D();
      const moveFwd = screen.getByLabelText("Move forward");

      fireEvent.keyDown(moveFwd, { key: "Enter" });
      expect(actions.cHold).toHaveBeenCalledWith("fwd");
      fireEvent.keyUp(moveFwd, { key: "Enter" });
      expect(actions.holdEnd).toHaveBeenCalled();

      fireEvent.keyDown(moveFwd, { key: " " });
      expect(actions.cHold).toHaveBeenCalledWith("fwd");
      fireEvent.keyUp(moveFwd, { key: " " });
      expect(actions.holdEnd).toHaveBeenCalled();
    });
  });
});
