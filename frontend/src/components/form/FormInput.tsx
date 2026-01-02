import { forwardRef, useState } from "react";
import type { InputHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { ClosedEyeIcon, OpenEyeIcon, EmailIcon } from "../icons";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  registration: UseFormRegisterReturn;
  containerClassName?: string;
  icon?: React.ReactNode;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    { label, error, registration, containerClassName = "", icon, ...props },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = props.type === "password";

    const inputType = isPassword && showPassword ? "text" : props.type;

    const iconNode =
      icon ??
      (isPassword ? (
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="text-gray-400 hover:text-[rgb(237,116,90)] transition"
        >
          {showPassword ? <OpenEyeIcon /> : <ClosedEyeIcon />}
        </button>
      ) : props.type === "email" || props.type === "text" ? (
        <EmailIcon />
      ) : null);

    return (
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-500">{label}</label>
        <div className="relative">
          <input
            {...registration}
            {...props}
            ref={ref}
            type={inputType}
            className={[
              "w-full rounded bg-gray-50 px-5 py-3",
              "border border-gray-200",
              "focus:outline-none focus:ring-2 focus:ring-[rgb(237,116,90)]/40",
              "transition",
              iconNode && "pr-12",
              error && "border-red-300 focus:ring-red-300/40",
              props.className,
              containerClassName,
            ]
              .filter(Boolean)
              .join(" ")}
          />
          {iconNode && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {iconNode}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
