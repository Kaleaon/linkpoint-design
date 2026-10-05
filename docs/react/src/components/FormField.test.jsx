import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import FormField from "./FormField.jsx";
import FormInput from "./FormInput.jsx";
import FormSwitch from "./FormSwitch.jsx";

describe("Linkpoint React FormField & Controls", () => {
  it("binds label htmlFor to input id automatically", () => {
    render(
      <FormField label="AVATAR NAME">
        <FormInput placeholder="Avatar Name" />
      </FormField>
    );

    const label = screen.getByText("AVATAR NAME");
    const input = screen.getByPlaceholderText("Avatar Name");

    expect(label.getAttribute("for")).toBeTruthy();
    expect(input.id).toBe(label.getAttribute("for"));
  });

  it("links description to input via aria-describedby", () => {
    render(
      <FormField label="LOGIN URI" description="e.g. login.example.com:8002">
        <FormInput placeholder="URI" />
      </FormField>
    );

    const input = screen.getByPlaceholderText("URI");
    const desc = screen.getByText("e.g. login.example.com:8002");

    expect(desc.id).toBeTruthy();
    expect(input.getAttribute("aria-describedby")).toBe(desc.id);
  });

  it("links error message via aria-errormessage and aria-describedby", () => {
    render(
      <FormField label="GRID NAME" error="Grid name already exists">
        <FormInput placeholder="Grid Name" />
      </FormField>
    );

    const input = screen.getByPlaceholderText("Grid Name");
    const errorMsg = screen.getByText("> Grid name already exists");

    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(errorMsg.id).toBeTruthy();
    expect(input.getAttribute("aria-errormessage")).toBe(errorMsg.id);
  });

  it("renders FormSwitch with role='switch' and correct aria-checked", () => {
    render(
      <FormField label="ANIMATED LOGO">
        <FormSwitch checked={true} />
      </FormField>
    );

    const switchEl = screen.getByRole("switch");
    expect(switchEl.getAttribute("aria-checked")).toBe("true");
  });
});
