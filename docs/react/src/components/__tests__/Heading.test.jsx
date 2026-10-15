import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Heading from "../Heading.jsx";

describe("Heading Component", () => {
  it("renders <h1> element by default when level is omitted", () => {
    render(<Heading>Primary Title</Heading>);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeDefined();
    expect(heading.tagName).toBe("H1");
    expect(heading.textContent).toBe("Primary Title");
  });

  it("renders correct heading levels from 1 to 6", () => {
    const { rerender } = render(<Heading level={2}>Level 2</Heading>);
    expect(screen.getByRole("heading", { level: 2 }).tagName).toBe("H2");

    rerender(<Heading level={3}>Level 3</Heading>);
    expect(screen.getByRole("heading", { level: 3 }).tagName).toBe("H3");

    rerender(<Heading level={6}>Level 6</Heading>);
    expect(screen.getByRole("heading", { level: 6 }).tagName).toBe("H6");
  });

  it("clamps level to range 1-6 when invalid level is passed", () => {
    const { rerender } = render(<Heading level={0}>Too Low</Heading>);
    expect(screen.getByRole("heading", { level: 1 }).tagName).toBe("H1");

    rerender(<Heading level={10}>Too High</Heading>);
    expect(screen.getByRole("heading", { level: 6 }).tagName).toBe("H6");
  });

  it("applies reset styles and custom inline styles", () => {
    render(
      <Heading level={2} style={{ color: "red", fontSize: "20px" }}>
        Styled Heading
      </Heading>
    );
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.style.margin).toBe("0px");
    expect(heading.style.padding).toBe("0px");
    expect(heading.style.color).toBe("red");
    expect(heading.style.fontSize).toBe("20px");
  });

  it("forwards extra HTML attributes", () => {
    render(
      <Heading level={1} id="main-heading" data-testid="custom-heading" aria-label="Accessible Title">
        Accessible Title
      </Heading>
    );
    const heading = screen.getByTestId("custom-heading");
    expect(heading.id).toBe("main-heading");
    expect(heading.getAttribute("aria-label")).toBe("Accessible Title");
  });
});
