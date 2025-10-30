"use client";

import * as React from "react";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PiArrowLeftBold, PiArrowRightBold } from "react-icons/pi";

const WEEKDAYS = 7;
const WEEK_START = 0; // Sunday

export type CalendarProps = {
  className?: string;
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  month?: Date;
  onMonthChange?: (month: Date) => void;
  disabled?: (date: Date) => boolean;
  minDate?: Date;
  maxDate?: Date;
};

export function Calendar({
  className,
  selected,
  onSelect,
  month,
  onMonthChange,
  disabled,
  minDate,
  maxDate,
}: CalendarProps) {
  const initialMonth = React.useMemo(
    () => startOfMonth(month ?? selected ?? new Date()),
    [month, selected]
  );
  const [currentMonth, setCurrentMonth] = React.useState(initialMonth);

  React.useEffect(() => {
    setCurrentMonth(startOfMonth(month ?? selected ?? new Date()));
  }, [month, selected]);

  const weekDayLabels = React.useMemo(() => {
    const start = startOfWeek(currentMonth, { weekStartsOn: WEEK_START });
    return Array.from({ length: WEEKDAYS }, (_, index) =>
      format(addDays(start, index), "EEEEE")
    );
  }, [currentMonth]);

  const daysInMonth = React.useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), {
      weekStartsOn: WEEK_START,
    });
    const end = endOfWeek(endOfMonth(currentMonth), {
      weekStartsOn: WEEK_START,
    });

    const allDays = eachDayOfInterval({ start, end });
    const weeks: Date[][] = [];

    for (let index = 0; index < allDays.length; index += WEEKDAYS) {
      weeks.push(allDays.slice(index, index + WEEKDAYS));
    }

    return weeks;
  }, [currentMonth]);

  const isDateDisabled = React.useCallback(
    (date: Date) => {
      if (disabled?.(date)) return true;

      if (minDate && isBefore(date, startOfDay(minDate))) {
        return true;
      }

      if (maxDate && isAfter(date, startOfDay(maxDate))) {
        return true;
      }

      return false;
    },
    [disabled, minDate, maxDate]
  );

  const handleMonthChange = React.useCallback(
    (offset: number) => {
      const nextMonth = startOfMonth(addMonths(currentMonth, offset));
      setCurrentMonth(nextMonth);
      onMonthChange?.(nextMonth);
    },
    [currentMonth, onMonthChange]
  );

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-2 flex items-center justify-between bg-accent p-2 border-b">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={() => handleMonthChange(-1)}
        >
          <PiArrowLeftBold className="size-4" />
          <span className="sr-only">Previous month</span>
        </Button>
        <div className="text-sm font-medium">
          {format(currentMonth, "MMMM yyyy")}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={() => handleMonthChange(1)}
        >
          <PiArrowRightBold className="size-4" />
          <span className="sr-only">Next month</span>
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground px-2">
        {weekDayLabels.map((label, index) => (
          <div key={`${index}-${label}`} className="rounded-md px-1 py-2">
            {label}
          </div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1 text-sm p-2 pt-0">
        {daysInMonth.map((week, weekIndex) =>
          week.map((date) => {
            const isSelected = selected && isSameDay(date, selected);
            const outsideMonth = !isSameMonth(date, currentMonth);
            const disabledDay = isDateDisabled(date);
            const isCurrentDay = isToday(date);

            return (
              <button
                key={`${weekIndex}-${date.toISOString()}`}
                type="button"
                onClick={() => {
                  if (disabledDay) {
                    return;
                  }
                  if (isSelected) {
                    onSelect?.(undefined);
                    return;
                  }
                  onSelect?.(date);
                }}
                disabled={disabledDay}
                className={cn(
                  "flex size-9 items-center justify-center rounded-md text-sm font-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  outsideMonth && "text-muted-foreground/40",
                  isCurrentDay && !isSelected && "text-primary",
                  disabledDay && "cursor-not-allowed opacity-40",
                  isSelected
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    : "hover:bg-muted"
                )}
                aria-pressed={isSelected}
              >
                {format(date, "d")}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
