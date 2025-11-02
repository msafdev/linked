"use client";

import { format } from "date-fns";

import { PiCalendarDotsDuotone } from "react-icons/pi";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Portal } from "@/components/ui/portal";

import { cn } from "@/lib/utils";

export type DatePickerProps = {
  id?: string;
  name?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  displayFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
};

const DEFAULT_PLACEHOLDER = "Pick a date";

export function DatePicker({
  id,
  name,
  value,
  onChange,
  onBlur,
  placeholder = DEFAULT_PLACEHOLDER,
  className,
  disabled,
  displayFormat = "PPP",
  minDate,
  maxDate,
  isDateDisabled,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover
      modal
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          onBlur?.();
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          id={id}
          name={name}
          variant="outline"
          disabled={disabled}
          data-empty={!value}
          className={cn(
            "data-[empty=true]:text-muted-foreground w-[280px] justify-start rounded text-left font-normal",
            className,
          )}
        >
          <PiCalendarDotsDuotone
            className="text-muted-foreground mr-3 -ml-1 size-4 shrink-0"
            aria-hidden="true"
          />
          {value ? (
            <span className="text-sm">{format(value, displayFormat)}</span>
          ) : (
            placeholder
          )}
        </Button>
      </PopoverTrigger>
      <Portal className="w-auto p-0" align="start">
        <Calendar
          selected={value}
          onSelect={(date) => {
            onChange?.(date);
            if (date) {
              setOpen(false);
              onBlur?.();
            }
          }}
          minDate={minDate}
          maxDate={maxDate}
          disabled={isDateDisabled}
        />
      </Portal>
    </Popover>
  );
}
