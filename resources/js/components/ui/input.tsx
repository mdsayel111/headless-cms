import * as React from "react";
import { FieldLabel } from "./field";
import { cn } from "@/lib/utils";
import ErrorText from "./error-text";

function Input({
  label,
  required,
  className,
  type,
  error,
  ...props
}: React.ComponentProps<"input"> & { label?: string; required?: boolean, error?: string }) {
  return (
    <div>
      {label && (
        <FieldLabel htmlFor="date-required" className="mb-2 uppercase">
          {label}
          {required && <span className="text-red-500">*</span>}
        </FieldLabel>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          "h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base",
          "placeholder:text-sm! font-light placeholder:text-muted-foreground",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          className,
        )}
        {...props}
      />

      <ErrorText error={error} />
    </div>
  );
}

export { Input };

