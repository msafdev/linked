"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type Country = {
  value: string;
  label: string;
  flag: string;
  region: string;
};

export type CountryPickerProps = {
  value?: string;
  onChange: (next: string) => void; 
  countries: Country[];
  placeholder?: string;
  className?: string;
};

export function CountryPicker({
  value = "",
  onChange,
  countries,
  placeholder = "Select a country",
  className,
}: CountryPickerProps) {
  const groups = countries.reduce<Record<string, Country[]>>((acc, c) => {
    (acc[c.region] ||= []).push(c);
    return acc;
  }, {});

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(groups).map(([region, list]) => (
          <SelectGroup key={region}>
            <SelectLabel>{region}</SelectLabel>
            {list.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                <div className="flex items-center gap-2">
                  <span>{c.flag}</span>
                  <span>{c.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}

export default CountryPicker;
