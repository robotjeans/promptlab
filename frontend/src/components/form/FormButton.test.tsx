import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { FormButton } from "./FormButton";

/**
 * Mock spinner so we don't depend on its implementation
 */
vi.mock("../LoadingSpinner", () => ({
  InlineSpinner: ({ size }: { size: string }) => (
    <span data-testid="spinner" data-size={size} />
  ),
}));

describe("FormButton", () => {
  it("renders children", () => {
    render(<FormButton>Submit</FormButton>);

    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("is enabled by default", () => {
    render(<FormButton>Submit</FormButton>);

    const button = screen.getByRole("button");
    expect(button).toBeEnabled();
  });

  it("is disabled when disabled prop is true", () => {
    render(<FormButton disabled>Submit</FormButton>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("is disabled when loading is true", () => {
    render(<FormButton loading>Submit</FormButton>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("shows spinner and processing text when loading", () => {
    render(<FormButton loading>Submit</FormButton>);

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /processing/i })
    ).toBeInTheDocument();
  });

  it("uses correct spinner size based on button size", () => {
    render(
      <FormButton loading size="sm">
        Save
      </FormButton>
    );

    const spinner = screen.getByTestId("spinner");
    expect(spinner).toHaveAttribute("data-size", "sm");
  });

  it("renders children instead of 'Processing...' when children are not a string", () => {
    render(
      <FormButton loading>
        <span>Custom Content</span>
      </FormButton>
    );

    expect(screen.getByText("Custom Content")).toBeInTheDocument();
  });

  it("applies variant classes", () => {
    render(<FormButton variant="secondary">Click</FormButton>);

    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-[rgb(94,145,226)]");
  });

  it("applies size classes", () => {
    render(<FormButton size="lg">Large</FormButton>);

    const button = screen.getByRole("button");
    expect(button.className).toContain("py-4");
    expect(button.className).toContain("px-6");
  });

  it("calls onClick when clicked and not disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<FormButton onClick={onClick}>Submit</FormButton>);

    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when loading", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <FormButton loading onClick={onClick}>
        Submit
      </FormButton>
    );

    await user.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("forwards ref to the button element", () => {
    const ref = React.createRef<HTMLButtonElement>();

    render(<FormButton ref={ref}>Ref Test</FormButton>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.type).toBe("submit");
  });
});
