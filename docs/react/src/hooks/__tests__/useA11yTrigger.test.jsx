import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import React from "react";
import useA11yTrigger from "../useA11yTrigger.js";

function TestComponent({ onClick, onKeyDown, options = {} }) {
  const triggerProps = useA11yTrigger(onClick, { onKeyDown, ...options });
  return <div data-testid="trigger-el" {...triggerProps}>Click or Press</div>;
}

describe("useA11yTrigger hook", () => {
  it("provides default role, tabIndex, and aria-label when supplied", () => {
    const { getByTestId } = render(
      <TestComponent options={{ ariaLabel: "Test Control", role: "button" }} />
    );
    const el = getByTestId("trigger-el");
    expect(el.getAttribute("role")).toBe("button");
    expect(el.getAttribute("tabindex")).toBe("0");
    expect(el.getAttribute("aria-label")).toBe("Test Control");
  });

  it("triggers onClick when clicked", () => {
    const handleClick = vi.fn();
    const { getByTestId } = render(<TestComponent onClick={handleClick} />);
    const el = getByTestId("trigger-el");
    fireEvent.click(el);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("triggers onClick on Enter and Space keypresses with preventDefault", () => {
    const handleClick = vi.fn();
    const { getByTestId } = render(<TestComponent onClick={handleClick} />);
    const el = getByTestId("trigger-el");

    const enterEvent = fireEvent.keyDown(el, { key: "Enter" });
    expect(handleClick).toHaveBeenCalledTimes(1);

    const spaceEvent = fireEvent.keyDown(el, { key: " " });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it("does not trigger onClick when disabled", () => {
    const handleClick = vi.fn();
    const { getByTestId } = render(
      <TestComponent onClick={handleClick} options={{ disabled: true }} />
    );
    const el = getByTestId("trigger-el");
    expect(el.getAttribute("tabindex")).toBe("-1");

    fireEvent.click(el);
    expect(handleClick).not.toHaveBeenCalled();

    fireEvent.keyDown(el, { key: "Enter" });
    expect(handleClick).not.toHaveBeenCalled();
  });
});
