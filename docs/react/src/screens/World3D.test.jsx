import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import World3D from "./World3D.jsx";
import { AppContext } from "../context/AppContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { useAppState } from "../hooks/useAppState.js";

function TestWrapper({ children }) {
  const appState = useAppState();
  const mockThemeContext = {
    V: {
      pri: "#00f0ff",
      onpri: "#000000",
      priC: "#00f0ff",
      onpriC: "#000000",
      surf: "#111111",
      surf2: "#222222",
      outv: "#333333",
      ink: "#ffffff",
      ink2: "#aaaaaa",
      bg: "#000000",
      rs: "4px",
      rl: "8px",
      bdg: "#ff0000",
      onbdg: "#ffffff",
      sec: "#ff00ff",
      sec2: "#880088",
    },
    t: { font: "sans-serif", dfont: "monospace" },
  };

  return (
    <AppContext.Provider value={appState}>
      <ThemeContext.Provider value={mockThemeContext}>
        {children}
      </ThemeContext.Provider>
    </AppContext.Provider>
  );
}

describe("World3D - Interactive Touch Joystick Overlay", () => {
  let mockSetPointerCapture;
  let mockReleasePointerCapture;

  beforeEach(() => {
    mockSetPointerCapture = vi.fn();
    mockReleasePointerCapture = vi.fn();

    if (!Element.prototype.setPointerCapture) {
      Element.prototype.setPointerCapture = mockSetPointerCapture;
    }
    if (!Element.prototype.releasePointerCapture) {
      Element.prototype.releasePointerCapture = mockReleasePointerCapture;
    }
  });

  it("renders virtual joystick container and knob in initial center position", () => {
    render(
      <TestWrapper>
        <World3D />
      </TestWrapper>
    );

    const joystick = screen.getByTestId("virtual-joystick");
    const knob = screen.getByTestId("joystick-knob");

    expect(joystick).toBeTruthy();
    expect(knob).toBeTruthy();
    expect(knob.style.transform).toBe("translate(0px, 0px)");
  });

  it("updates knob position and avatar movement state on pointer press and drag", () => {
    let appActions;
    let appStateRef;

    function StateInspector() {
      const { state, actions } = useAppState();
      appStateRef = state;
      appActions = actions;
      const mockThemeContext = {
        V: { pri: "#00f0ff", onpri: "#000", surf: "#111", outv: "#333", ink: "#fff", ink2: "#aaa", rs: "4px" },
        t: { font: "sans-serif", dfont: "monospace" },
      };
      return (
        <AppContext.Provider value={{ state, actions }}>
          <ThemeContext.Provider value={mockThemeContext}>
            <World3D />
          </ThemeContext.Provider>
        </AppContext.Provider>
      );
    }

    render(<StateInspector />);

    const joystick = screen.getByTestId("virtual-joystick");
    const knob = screen.getByTestId("joystick-knob");

    // Mock getBoundingClientRect: center at (150, 150)
    joystick.getBoundingClientRect = () => ({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      right: 200,
      bottom: 200,
      x: 100,
      y: 100,
      toJSON: () => {},
    });

    // Initial state
    expect(appStateRef.cHeld).toBe("");
    expect(appStateRef.joystickVector).toEqual({ x: 0, y: 0 });

    // Pointer down drag forward (dy = -30)
    act(() => {
      fireEvent.pointerDown(joystick, { clientX: 150, clientY: 120, pointerId: 1 });
    });

    expect(knob.style.transform).toBe("translate(0px, -30px)");
    expect(appStateRef.cHeld).toBe("fwd");
    expect(appStateRef.joystickVector.y).toBeLessThan(0);

    // Pointer move drag right (dx = 30, dy = 0)
    act(() => {
      fireEvent.pointerMove(joystick, { clientX: 180, clientY: 150, pointerId: 1 });
    });

    expect(knob.style.transform).toBe("translate(30px, 0px)");
    expect(appStateRef.cHeld).toBe("rgt");
    expect(appStateRef.joystickVector.x).toBeGreaterThan(0);
  });

  it("resets joystick knob to center and clears movement state on pointer release or cancel", () => {
    let appStateRef;

    function StateInspector() {
      const { state, actions } = useAppState();
      appStateRef = state;
      const mockThemeContext = {
        V: { pri: "#00f0ff", onpri: "#000", surf: "#111", outv: "#333", ink: "#fff", ink2: "#aaa", rs: "4px" },
        t: { font: "sans-serif", dfont: "monospace" },
      };
      return (
        <AppContext.Provider value={{ state, actions }}>
          <ThemeContext.Provider value={mockThemeContext}>
            <World3D />
          </ThemeContext.Provider>
        </AppContext.Provider>
      );
    }

    render(<StateInspector />);

    const joystick = screen.getByTestId("virtual-joystick");
    const knob = screen.getByTestId("joystick-knob");

    joystick.getBoundingClientRect = () => ({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      right: 200,
      bottom: 200,
      x: 100,
      y: 100,
      toJSON: () => {},
    });

    // Press and drag
    act(() => {
      fireEvent.pointerDown(joystick, { clientX: 150, clientY: 120, pointerId: 1 });
    });
    expect(appStateRef.cHeld).toBe("fwd");

    // Pointer up / release
    act(() => {
      fireEvent.pointerUp(joystick, { pointerId: 1 });
    });

    expect(knob.style.transform).toBe("translate(0px, 0px)");
    expect(appStateRef.cHeld).toBe("");
    expect(appStateRef.joystickVector).toEqual({ x: 0, y: 0 });
  });
});
