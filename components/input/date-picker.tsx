"use client";

import * as React from "react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PiCalendarDotsDuotone } from "react-icons/pi";

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
            "data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal rounded-md",
            className
          )}
        >
          <PiCalendarDotsDuotone className="-ml-1 mr-3 size-4 text-muted-foreground" aria-hidden="true" />
          {value ? <span className="text-sm">{format(value, displayFormat)}</span> : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
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
      </PopoverContent>
    </Popover>
  );
}
