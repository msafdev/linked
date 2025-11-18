"use client";

import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getMonth,
  getYear,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  setMonth,
  setYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import { PiArrowLeftBold, PiArrowRightBold } from "react-icons/pi";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";

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
    [month, selected],
  );
  const [currentMonth, setCurrentMonth] = React.useState(initialMonth);

  React.useEffect(() => {
    setCurrentMonth(startOfMonth(month ?? selected ?? new Date()));
  }, [month, selected]);

  const minMonthStart = React.useMemo(
    () => (minDate ? startOfMonth(minDate) : null),
    [minDate],
  );
  const maxMonthStart = React.useMemo(
    () => (maxDate ? startOfMonth(maxDate) : null),
    [maxDate],
  );

  const currentMonthIndex = getMonth(currentMonth);
  const currentYear = getYear(currentMonth);

  const monthOptions = React.useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => ({
        value: index,
        label: format(new Date(2000, index, 1), "MMMM"),
      })),
    [],
  );

  const minYear = minMonthStart ? getYear(minMonthStart) : undefined;
  const maxYear = maxMonthStart ? getYear(maxMonthStart) : undefined;

  const yearOptions = React.useMemo(() => {
    const fallbackSpan = 80;
    const fallbackFuture = 20;
    const defaultMin = currentYear - fallbackSpan;
    const defaultMax = currentYear + fallbackFuture;
    const start = Math.min(minYear ?? defaultMin, currentYear, defaultMin);
    const end = Math.max(maxYear ?? defaultMax, currentYear, defaultMax);
    const safeStart = Math.max(start, 1900);
    const safeEnd = Math.max(end, safeStart);
    return Array.from(
      { length: safeEnd - safeStart + 1 },
      (_, index) => safeStart + index,
    );
  }, [currentYear, minYear, maxYear]);

  const weekDayLabels = React.useMemo(() => {
    const start = startOfWeek(currentMonth, { weekStartsOn: WEEK_START });
    return Array.from({ length: WEEKDAYS }, (_, index) =>
      format(addDays(start, index), "EEEEE"),
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
    [disabled, minDate, maxDate],
  );

  const clampMonthToBounds = React.useCallback(
    (candidate: Date) => {
      let next = startOfMonth(candidate);
      if (minMonthStart && isBefore(next, minMonthStart)) {
        next = minMonthStart;
      }
      if (maxMonthStart && isAfter(next, maxMonthStart)) {
        next = maxMonthStart;
      }
      return next;
    },
    [minMonthStart, maxMonthStart],
  );

  const handleMonthChange = React.useCallback(
    (offset: number) => {
      const nextMonth = clampMonthToBounds(addMonths(currentMonth, offset));
      setCurrentMonth(nextMonth);
      onMonthChange?.(nextMonth);
    },
    [clampMonthToBounds, currentMonth, onMonthChange],
  );

  const handleMonthSelect = React.useCallback(
    (monthIndex: number) => {
      if (Number.isNaN(monthIndex)) return;
      const next = clampMonthToBounds(setMonth(currentMonth, monthIndex));
      setCurrentMonth(next);
      onMonthChange?.(next);
    },
    [clampMonthToBounds, currentMonth, onMonthChange],
  );

  const handleYearSelect = React.useCallback(
    (yearValue: number) => {
      if (Number.isNaN(yearValue)) return;
      const next = clampMonthToBounds(setYear(currentMonth, yearValue));
      setCurrentMonth(next);
      onMonthChange?.(next);
    },
    [clampMonthToBounds, currentMonth, onMonthChange],
  );

  const isMonthOptionDisabled = React.useCallback(
    (monthIndex: number) => {
      const candidate = startOfMonth(new Date(currentYear, monthIndex, 1));
      if (minMonthStart && isBefore(candidate, minMonthStart)) {
        return true;
      }
      if (maxMonthStart && isAfter(candidate, maxMonthStart)) {
        return true;
      }
      return false;
    },
    [currentYear, minMonthStart, maxMonthStart],
  );

  const isYearOptionDisabled = React.useCallback(
    (yearValue: number) => {
      if (minYear !== undefined && yearValue < minYear) {
        return true;
      }
      if (maxYear !== undefined && yearValue > maxYear) {
        return true;
      }
      return false;
    },
    [minYear, maxYear],
  );

  return (
    <div className={cn("bg-popover z-auto w-full", className)}>
      <div className="bg-accent mb-2 flex items-center justify-between gap-2 border-b p-2">
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
        <div className="flex items-center gap-2">
          <Select
            value={String(currentMonthIndex)}
            onValueChange={(value) => {
              handleMonthSelect(Number.parseInt(value, 10));
            }}
          >
            <SelectTrigger
              size="sm"
              className="bg-card text-card-foreground w-[120px] rounded"
              aria-label="Select month"
            >
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent align="start">
              {monthOptions.map(({ value, label }) => (
                <SelectItem
                  key={value}
                  value={String(value)}
                  disabled={isMonthOptionDisabled(value)}
                >
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={String(currentYear)}
            onValueChange={(value) =>
              handleYearSelect(Number.parseInt(value, 10))
            }
          >
            <SelectTrigger
              size="sm"
              className="bg-card text-card-foreground w-[100px] rounded"
              aria-label="Select year"
            >
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent align="start">
              {yearOptions.map((yearOption) => (
                <SelectItem
                  key={yearOption}
                  value={String(yearOption)}
                  disabled={isYearOptionDisabled(yearOption)}
                >
                  {yearOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

      <div className="text-muted-foreground grid grid-cols-7 gap-1 px-2 text-center text-xs font-medium">
        {weekDayLabels.map((label, index) => (
          <div key={`${index}-${label}`} className="rounded px-1 py-2">
            {label}
          </div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1 p-2 pt-0 text-sm">
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
                  "focus-visible:ring-ring flex size-9 items-center justify-center rounded text-sm font-normal transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                  outsideMonth && "text-muted-foreground/40",
                  isCurrentDay && !isSelected && "text-primary",
                  disabledDay && "cursor-not-allowed opacity-40",
                  isSelected
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    : "hover:bg-muted",
                )}
                aria-pressed={isSelected}
              >
                {format(date, "d")}
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
}
