"use client";

import { FieldArray, getIn, type FormikProps, type FormikValues } from "formik";
import {
  useRef,
  useState,
  type HTMLInputTypeAttribute,
  type ReactNode,
} from "react";
import { format, isValid, parseISO } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CountrySelect } from "@/components/input/country-select";
import { COUNTRIES } from "@/types/country";
import { UrlInput } from "@/components/input/url-input";
import { DatePicker } from "@/components/input/date-picker";
import { emptyEntryFactories } from "@/lib/dashboard-forms";
import { PiImageSquareDuotone, PiPlusBold } from "react-icons/pi";

export type TextFieldProps<TValues extends FormikValues> = {
  formik: FormikProps<TValues>;
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  type?: HTMLInputTypeAttribute;
  as?: "input" | "textarea" | "country" | "url" | "date" | "file";
  className?: string;
  accept?: string;
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
  accept,
}: TextFieldProps<TValues>) {
  const fieldId = name.replace(/\./g, "-");
  const value = getIn(formik.values, name);
  const error = getIn(formik.errors, name);
  const touched = getIn(formik.touched, name);
  const showError =
    typeof error === "string" && (formik.submitCount > 0 || Boolean(touched));
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const maxFileSizeBytes = 5 * 1024 * 1024;

  const handleFileSelection = (file: File | null) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      formik.setFieldError(name, "Only image files are supported");
      formik.setFieldTouched(name, true, false);
      return;
    }

    if (file.size > maxFileSizeBytes) {
      formik.setFieldError(name, "Max file size is 5MB");
      formik.setFieldTouched(name, true, false);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        formik.setFieldValue(name, result);
        formik.setFieldTouched(name, true, false);
        formik.setFieldError(name, undefined);
      }
    };
    reader.readAsDataURL(file);
  };

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
      ) : as === "date" ? (
        (() => {
          const toDate = (input: unknown): Date | undefined => {
            if (!input) {
              return undefined;
            }
            if (input instanceof Date) {
              return isValid(input) ? input : undefined;
            }
            if (typeof input === "string") {
              const trimmed = input.trim();
              if (!trimmed) {
                return undefined;
              }
              const isoParsed = parseISO(trimmed);
              if (isValid(isoParsed)) {
                return isoParsed;
              }
              const fallback = new Date(trimmed);
              return isValid(fallback) ? fallback : undefined;
            }
            if (typeof input === "number") {
              const numericDate = new Date(input);
              return isValid(numericDate) ? numericDate : undefined;
            }
            return undefined;
          };
          const parsedDate = toDate(value);
          return (
            <DatePicker
              id={fieldId}
              name={name}
              value={parsedDate}
              onChange={(nextDate) => {
                const formatted = nextDate ? format(nextDate, "yyyy-MM-dd") : "";
                formik.setFieldValue(name, formatted);
              }}
              onBlur={() => {
                formik.setFieldTouched(name, true, false);
              }}
              placeholder={placeholder}
              className={cn("col-span-full md:col-span-3 w-full", className)}
            />
          );
        })()
      ) : as === "file" ? (
        <div className={cn("col-span-full md:col-span-3 space-y-4", className)}>
          <input
            ref={fileInputRef}
            id={fieldId}
            type="file"
            name={name}
            accept={accept ?? "image/*"}
            className="hidden"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0] ?? null;
              handleFileSelection(file);
              event.currentTarget.value = "";
            }}
            onBlur={() => {
              formik.setFieldTouched(name, true, false);
            }}
          />
          <div
            role="button"
            tabIndex={0}
            className={cn(
              "flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/60 bg-muted/10 px-6 py-10 text-center transition",
              "hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
              isDraggingFile && "border-primary bg-primary/5 text-primary"
            )}
            onClick={() => {
              fileInputRef.current?.click();
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDraggingFile(true);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = "copy";
              if (!isDraggingFile) {
                setIsDraggingFile(true);
              }
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              const relatedTarget = event.relatedTarget as Node | null;
              if (!relatedTarget || !event.currentTarget.contains(relatedTarget)) {
                setIsDraggingFile(false);
              }
            }}
            onDrop={(event) => {
              event.preventDefault();
              setIsDraggingFile(false);
              const file = event.dataTransfer?.files?.[0] ?? null;
              handleFileSelection(file);
            }}
          >
            <PiImageSquareDuotone className="mb-4 h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground">
              {typeof value === "string" && value
                ? "Drop a new image or click to replace"
                : "Drop your image here or click to browse"}
            </p>
            <p className="mt-2 text-xs text-muted-foreground/80">Max size: 5MB</p>
          </div>
          {typeof value === "string" && value ? (
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-md border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={value}
                  alt={label}
                  className="size-full object-cover"
                />
              </div>
              <span className="text-xs text-muted-foreground break-all">
                Image selected
              </span>
            </div>
          ) : null}
        </div>
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

export type CollectionFieldProps<TValues extends FormikValues> = {
  formik: FormikProps<TValues>;
  name: string;
  emptyEntryKey: keyof typeof emptyEntryFactories;
  entryTitle: string;
  renderEntry: (entryIndex: number, removeEntry: () => void) => ReactNode;
  addButtonLabel?: string;
  emptyMessage?: string;
  renderEntryHeader?: (
    entryIndex: number,
    removeEntry: () => void
  ) => ReactNode;
};

export function CollectionField<TValues extends FormikValues>({
  formik,
  name,
  emptyEntryKey,
  entryTitle,
  renderEntry,
  addButtonLabel,
  emptyMessage = "No entries added yet.",
  renderEntryHeader,
}: CollectionFieldProps<TValues>) {
  const entries = (getIn(formik.values, name) as unknown[]) ?? [];
  const createEntry =
    emptyEntryFactories[emptyEntryKey] ?? (() => ({} as unknown));
  const addLabel =
    addButtonLabel ?? `Add ${entryTitle.toLowerCase()}`.trimEnd();

  return (
    <FieldArray name={name}>
      {({ push, remove }) => (
        <div className="">
          <div className="flex items-center justify-center mb-6">
            <Button
              type="button"
              variant="secondary"
              className="min-w-64 h-10 cursor-pointer"
              onClick={() => {
                push(createEntry());
              }}
            >
              <PiPlusBold className="size-3 mr-2 text-muted-foreground" />
              {addLabel}
            </Button>
          </div>

          {entries.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center border-y-2 border-dashed py-6">
              {emptyMessage}
            </p>
          ) : (
            entries.map((_, index) => {
              const handleRemove = () => remove(index);
              const headerContent =
                renderEntryHeader?.(index, handleRemove) ?? null;

              return (
                <div
                  key={
                    // biome-ignore lint/suspicious/noArrayIndexKey: FieldArray data relies on ordered indices.
                    index
                  }
                  className="w-full"
                >
                  {headerContent}
                  {renderEntry(index, handleRemove)}
                </div>
              );
            })
          )}
        </div>
      )}
    </FieldArray>
  );
}
