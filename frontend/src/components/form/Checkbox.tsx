import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  containerClassName?: string;
  labelClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      id,
      containerClassName = "",
      labelClassName = "",
      className = "",
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;

    return (
      <div className={`flex items-center ${containerClassName}`}>
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          className={`h-4 w-4 text-[rgb(237,116,90)] focus:ring-[rgb(237,116,90)] border-[rgb(238,243,251)] rounded ${className}`}
          {...props}
        />
        <label
          htmlFor={checkboxId}
          className={`ml-2 block text-sm text-[rgb(107,114,128)] ${labelClassName}`}
        >
          {label}
        </label>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
