import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("renders checkbox with label", () => {
    render(<Checkbox label="Accept terms" />);

    const checkbox = screen.getByLabelText("Accept terms");

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute("type", "checkbox");
  });

  it("toggles checked state when clicked", async () => {
    const user = userEvent.setup();

    render(<Checkbox label="Subscribe" />);

    const checkbox = screen.getByLabelText("Subscribe") as HTMLInputElement;

    expect(checkbox.checked).toBe(false);

    await user.click(checkbox);
    expect(checkbox.checked).toBe(true);

    await user.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  it("respects controlled checked prop", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Checkbox label="Controlled" checked={true} onChange={onChange} />);

    const checkbox = screen.getByLabelText("Controlled") as HTMLInputElement;

    expect(checkbox.checked).toBe(true);

    await user.click(checkbox);
    expect(onChange).toHaveBeenCalled();
  });

  it("applies custom class names", () => {
    render(
      <Checkbox
        label="Custom classes"
        containerClassName="container-class"
        labelClassName="label-class"
        className="input-class"
      />
    );

    const checkbox = screen.getByLabelText("Custom classes");
    const label = screen.getByText("Custom classes");

    expect(checkbox.className).toContain("input-class");
    expect(label.className).toContain("label-class");
    expect(label.parentElement?.className).toContain("container-class");
  });

  it("uses provided id when passed", () => {
    render(<Checkbox label="With ID" id="custom-id" />);

    const checkbox = screen.getByLabelText("With ID");
    const label = screen.getByText("With ID");

    expect(checkbox).toHaveAttribute("id", "custom-id");
    expect(label).toHaveAttribute("for", "custom-id");
  });

  it("forwards ref to the input element", () => {
    const ref = React.createRef<HTMLInputElement>();

    render(<Checkbox label="Ref test" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.type).toBe("checkbox");
  });
});
