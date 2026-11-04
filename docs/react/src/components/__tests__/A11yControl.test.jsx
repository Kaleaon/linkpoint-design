import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import React from "react";
import A11yControl from "../A11yControl.jsx";

describe("A11yControl component", () => {
  it("renders with default props (role=button, tabIndex=0, as=div)", () => {
    const { getByTestId } = render(
      <A11yControl data-testid="a11y-control" aria-label="A11y Control">
        Control Content
      </A11yControl>
    );
    const el = getByTestId("a11y-control");
    expect(el.tagName).toBe("DIV");
    expect(el.getAttribute("role")).toBe("button");
    expect(el.getAttribute("tabindex")).toBe("0");
    expect(el.getAttribute("aria-label")).toBe("A11y Control");
  });

  it("renders with custom tag using 'as' prop", () => {
    const { getByTestId } = render(
      <A11yControl as="span" data-testid="a11y-span" aria-label="Span Control">
        Span Content
      </A11yControl>
    );
    const el = getByTestId("a11y-span");
    expect(el.tagName).toBe("SPAN");
  });

  it("handles mouse click and keydown (Enter and Space)", () => {
    const handleClick = vi.fn();
    const { getByTestId } = render(
      <A11yControl data-testid="a11y-control" onClick={handleClick} aria-label="Action">
        Action
      </A11yControl>
    );
    const el = getByTestId("a11y-control");

    fireEvent.click(el);
    expect(handleClick).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(el, { key: "Enter" });
    expect(handleClick).toHaveBeenCalledTimes(2);

    fireEvent.keyDown(el, { key: " " });
    expect(handleClick).toHaveBeenCalledTimes(3);
  });
});
