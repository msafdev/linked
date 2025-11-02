"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";

export type UrlInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "type" | "value" | "onChange"
> & {
  value?: string;
  onValueChange?: (nextValue: string) => void;
  prefix?: string | null;
};

const UrlInput = React.forwardRef<HTMLInputElement, UrlInputProps>(
  (
    {
      className,
      prefix = "https://",
      value = "",
      placeholder = "example.com",
      onValueChange,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const hasPrefix = typeof prefix === "string" && prefix.length > 0;

    const displayValue =
      hasPrefix && value.startsWith(prefix)
        ? value.slice(prefix.length)
        : value;

    return (
      <div className={cn("flex w-full items-center rounded", className)}>
        {hasPrefix ? (
          <span className="bg-muted text-muted-foreground inline-flex h-9 items-center rounded-s border px-3 text-sm">
            {prefix}
          </span>
        ) : null}
        <Input
          ref={ref}
          type="text"
          className={cn(
            "shadow-none",
            hasPrefix ? "-ms-px rounded-s-none" : undefined,
          )}
          placeholder={placeholder}
          value={displayValue}
          onChange={(event) => {
            onValueChange?.(event.target.value);
          }}
          onBlur={onBlur}
          {...props}
        />
      </div>
    );
  },
);
UrlInput.displayName = "UrlInput";

export { UrlInput };
