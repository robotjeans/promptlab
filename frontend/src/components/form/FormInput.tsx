/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useController, type Control } from "react-hook-form";
import type { InputHTMLAttributes } from "react";
import { ClosedEyeIcon, OpenEyeIcon, EmailIcon } from "../icons";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  control: Control<any>;
  error?: string;
  containerClassName?: string;
  icon?: React.ReactNode;
}

export function FormInput({
  name,
  label,
  control,
  error,
  containerClassName = "",
  icon,
  type,
  ...props
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    field: { value, onChange, onBlur, ref },
  } = useController({
    name,
    control,
  });

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  const iconNode =
    icon ??
    (isPassword ? (
      <button
        type="button"
        onClick={() => setShowPassword((v) => !v)}
        className="text-[rgb(107,114,128)] hover:text-[rgb(237,116,90)] transition"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <OpenEyeIcon /> : <ClosedEyeIcon />}
      </button>
    ) : (
      <EmailIcon />
    ));

  return (
    <div className={containerClassName}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-[rgb(107,114,128)] mb-1"
      >
        {label}
      </label>

      <div className="relative">
        <input
          ref={ref}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          type={inputType}
          className={[
            "w-full px-4 py-3 border rounded-lg",
            error
              ? "border-red-300 focus:ring-red-300"
              : "border-[rgb(238,243,251)] focus:ring-[rgb(237,116,90)]",
            "focus:outline-none focus:ring-2 focus:border-transparent",
            "transition-colors",
            iconNode && "pr-12",
            props.className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />

        {iconNode && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {iconNode}
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
