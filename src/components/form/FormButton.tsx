import type { ButtonHTMLAttributes } from "react";
import { forwardRef } from "react";
import { InlineSpinner } from "../LoadingSpinner";

interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

export const FormButton = forwardRef<HTMLButtonElement, FormButtonProps>(
  (
    {
      loading = false,
      disabled = false,
      variant = "primary",
      size = "md",
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "w-full font-medium rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variantClasses = {
      primary:
        "bg-[rgb(237,116,90)] hover:bg-[rgb(221,89,66)] text-white focus:ring-[rgb(237,116,90)]",
      secondary:
        "bg-[rgb(94,145,226)] hover:bg-[rgb(76,119,197)] text-white focus:ring-[rgb(94,145,226)]",
    };

    const sizeClasses = {
      sm: "py-2 px-3 text-sm",
      md: "py-3 px-4 text-base",
      lg: "py-4 px-6 text-lg",
    };

    return (
      <button
        ref={ref}
        type="submit"
        disabled={disabled || loading}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <InlineSpinner
              size={size === "sm" ? "sm" : "md"}
              className="mr-2 text-white"
            />
            {typeof children === "string" ? `Processing...` : children}
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

FormButton.displayName = "FormButton";
