import { Input } from "@/components/ui/input";

import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const UrlInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className={cn("flex rounded-md w-full", className)}>
        <span className="bg-muted inline-flex items-center rounded-s-md border px-3 text-sm text-muted-foreground">
          https://
        </span>
        <Input
          className="-ms-px rounded-s-none shadow-none"
          placeholder="google.com"
          type="text"
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
UrlInput.displayName = "UrlInput";

export { UrlInput };
