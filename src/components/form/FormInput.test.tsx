import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FormInput } from "./FormInput";
import type { UseFormRegisterReturn } from "react-hook-form";

/**
 * Mock icons so we don’t depend on SVG internals
 */
vi.mock("../icons", () => ({
  OpenEyeIcon: () => <svg data-testid="open-eye" />,
  ClosedEyeIcon: () => <svg data-testid="closed-eye" />,
  EmailIcon: () => <svg data-testid="email-icon" />,
}));

/**
 * Minimal react-hook-form registration mock
 */
const mockRegistration = {
  name: "test",
  onChange: vi.fn(),
  onBlur: vi.fn(),
  ref: vi.fn(),
};

describe("FormInput", () => {
  it("renders label and input", () => {
    render(
      <FormInput
        label="Email"
        type="email"
        registration={mockRegistration as UseFormRegisterReturn}
      />
    );

    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders an email icon for email inputs", () => {
    render(
      <FormInput
        label="Email"
        type="email"
        registration={mockRegistration as UseFormRegisterReturn}
      />
    );

    expect(screen.getByTestId("email-icon")).toBeInTheDocument();
  });

  it("renders error message when error is provided", () => {
    render(
      <FormInput
        label="Username"
        type="text"
        error="This field is required"
        registration={mockRegistration as UseFormRegisterReturn}
      />
    );

    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("applies error styles when error exists", () => {
    render(
      <FormInput
        label="Username"
        type="text"
        error="Invalid"
        registration={mockRegistration as UseFormRegisterReturn}
      />
    );

    const input = screen.getByRole("textbox");
    expect(input.className).toContain("border-red-300");
  });

  it("renders password toggle icon for password inputs", () => {
    render(
      <FormInput
        label="Password"
        type="password"
        registration={mockRegistration as UseFormRegisterReturn}
      />
    );

    expect(screen.getByTestId("closed-eye")).toBeInTheDocument();
  });

  it("toggles password visibility when clicking the icon", () => {
    render(
      <FormInput
        label="Password"
        type="password"
        registration={mockRegistration as UseFormRegisterReturn}
      />
    );

    const input = screen.getByLabelText("Password") as HTMLInputElement;
    const toggleButton = screen.getByRole("button");

    // Initially password
    expect(input.type).toBe("password");

    fireEvent.click(toggleButton);
    expect(input.type).toBe("text");
    expect(screen.getByTestId("open-eye")).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(input.type).toBe("password");
    expect(screen.getByTestId("closed-eye")).toBeInTheDocument();
  });

  it("renders a custom icon when provided", () => {
    render(
      <FormInput
        label="Custom"
        type="text"
        icon={<span data-testid="custom-icon" />}
        registration={mockRegistration as UseFormRegisterReturn}
      />
    );

    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });
});
