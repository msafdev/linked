"use client";

import { getIn, type FormikProps, type FormikValues } from "formik";
import type { HTMLInputTypeAttribute } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CountrySelect } from "@/components/input/country-select";
import { COUNTRIES } from "@/types/country";
import { UrlInput } from "@/components/input/url-input";

export type TextFieldProps<TValues extends FormikValues> = {
  formik: FormikProps<TValues>;
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  type?: HTMLInputTypeAttribute;
  as?: "input" | "textarea" | "country" | "url";
  className?: string;
};

export function TextField<TValues extends FormikValues>({
  formik,
  name,
  label,
  placeholder,
  description,
  type = "text",
  as = "input",
  className,
}: TextFieldProps<TValues>) {
  const fieldId = name.replace(/\./g, "-");
  const value = getIn(formik.values, name);
  const error = getIn(formik.errors, name);
  const touched = getIn(formik.touched, name);
  const showError =
    typeof error === "string" && (formik.submitCount > 0 || Boolean(touched));

  return (
    <div className="grid grid-cols-8 gap-4">
      <div
        className={cn(
          "flex flex-col items-start col-span-full md:col-span-3",
          description ? "justify-start mt-1" : "justify-center"
        )}
      >
        <Label htmlFor={fieldId} className="font-medium">
          {label}
        </Label>
        {description ? (
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        ) : null}
        {showError ? (
          <p className="text-xs text-destructive mt-2">{error}</p>
        ) : null}
      </div>

      {/* dynamic input type */}
      {as === "textarea" ? (
        <Textarea
          id={fieldId}
          name={name}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          rows={5}
          className={cn("resize-y col-span-full md:col-span-4", className)}
        />
      ) : as === "country" ? (
        <CountrySelect
          value={value ?? ""}
          onChange={(next) => {
            formik.setFieldValue(name, next);
            formik.setFieldTouched(name, true, false);
          }}
          countries={COUNTRIES}
          placeholder={placeholder ?? "Select a country"}
          className={cn("col-span-full md:col-span-2", className)}
        />
      ) : as === "url" ? (
        <UrlInput
          type={type}
          name={name}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={cn("col-span-full md:col-span-3", className)}
        />
      ) : (
        <Input
          id={fieldId}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={cn("col-span-full md:col-span-3", className)}
        />
      )}
    </div>
  );
}
