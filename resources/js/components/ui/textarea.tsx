import * as React from "react";
import { FieldLabel } from "./field";
import { cn } from "@/lib/utils";
import ErrorText from "./error-text";

interface TextareaProps
  extends React.ComponentProps<"textarea"> {
  label?: string;
  required?: boolean;
  error?: string;
}

function Textarea({
  label,
  required,
  className,
  error,
  ...props
}: TextareaProps) {
  return (
    <div>
      {label && (
        <FieldLabel htmlFor="date-required" className="mb-2 uppercase">
          {label}
          {required && <span className="text-red-500">*</span>}
        </FieldLabel>
      )}

      <textarea
        data-slot="textarea"
        className={cn(
          "w-full rounded-md border border-input bg-transparent px-3 py-1 text-base",
          "placeholder:text-sm! font-light placeholder:text-muted-foreground",
          "focus-visible:border-primary focus-visible:ring-0 outline-none focus:outline-0",
          className,
        )}
        {...props}
      />

      {error && (
        <ErrorText error={error} />
      )}
    </div>
  );
}

export { Textarea };
