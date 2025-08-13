import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({
  type = "text",
  label,
  error,
  className,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="form-label">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={cn(
          "form-input",
          error && "border-error focus:ring-error",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;