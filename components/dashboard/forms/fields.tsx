"use client";

import { format, isValid, parseISO } from "date-fns";
import { FieldArray, type FormikProps, type FormikValues, getIn } from "formik";

import {
  PiArrowClockwiseBold,
  PiImageSquareDuotone,
  PiPlusBold,
  PiXBold,
} from "react-icons/pi";

import {
  type HTMLInputTypeAttribute,
  type ReactNode,
  useRef,
  useState,
} from "react";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useSectionFormContext } from "@/components/dashboard/forms/section-form";
import { CountryPicker } from "@/components/input/country-picker";
import { DatePicker } from "@/components/input/date-picker";
import { SocialPicker } from "@/components/input/social-picker";
import { UrlInput } from "@/components/input/url-input";

import { emptyEntryFactories } from "@/lib/schema";
import {
  deleteImages,
  getPublicImageUrl,
  uploadImage,
} from "@/lib/supabase/storage";
import { cn } from "@/lib/utils";
import { COUNTRIES } from "@/types/country";

const AVATAR_MAX_FILE_SIZE = 5 * 1024 * 1024;

export type TextFieldProps<TValues extends FormikValues> = {
  formik: FormikProps<TValues>;
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  type?: HTMLInputTypeAttribute;
  as?:
    | "input"
    | "textarea"
    | "country"
    | "social"
    | "url"
    | "date"
    | "file"
    | "avatar";
  className?: string;
  accept?: string;
  pre?: string;
  disabled?: boolean;
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
  pre,
  disabled = false,
}: TextFieldProps<TValues>) {
  const sectionContext = useSectionFormContext();
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
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
          "col-span-full flex flex-col items-start md:col-span-3",
          description ? "mt-1 justify-start" : "justify-center",
        )}
      >
        <Label htmlFor={fieldId} className="font-medium">
          {label}
        </Label>
        {description ? (
          <p className="text-muted-foreground mt-2 text-xs">{description}</p>
        ) : null}
        {showError ? (
          <p className="text-destructive mt-2 text-xs">{error}</p>
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
          disabled={disabled}
          className={cn("col-span-full resize-y md:col-span-4", className)}
        />
      ) : as === "country" ? (
        <CountryPicker
          value={value ?? ""}
          onChange={(next) => {
            formik.setFieldValue(name, next);
            formik.setFieldTouched(name, true, false);
          }}
          countries={COUNTRIES}
          placeholder={placeholder ?? "Select a country"}
          className={cn("col-span-full md:col-span-2", className)}
        />
      ) : as === "social" ? (
        <SocialPicker
          value={value ?? ""}
          onChange={(next) => {
            formik.setFieldValue(name, next);
            formik.setFieldTouched(name, true, false);
          }}
          placeholder={placeholder ?? "Select a platform"}
          className={cn("col-span-full md:col-span-2", className)}
        />
      ) : as === "url" ? (
        <UrlInput
          name={name}
          placeholder={placeholder}
          value={value ?? ""}
          onBlur={formik.handleBlur}
          className={cn("col-span-full md:col-span-3", className)}
          disabled={disabled}
          prefix={pre ?? undefined}
          onValueChange={(inputValue) => {
            const prefix = typeof pre === "string" && pre.length > 0 ? pre : "";
            const trimmed = inputValue.trim();
            const withoutPrefix = trimmed.startsWith(prefix)
              ? trimmed.slice(prefix.length)
              : trimmed;
            const nextValue =
              trimmed.length === 0
                ? prefix
                : prefix
                  ? `${prefix}${withoutPrefix}`
                  : trimmed;
            formik.setFieldValue(name, nextValue);
            formik.setFieldTouched(name, true, false);
            formik.setFieldError(name, undefined);
          }}
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
                const formatted = nextDate
                  ? format(nextDate, "yyyy-MM-dd")
                  : "";
                formik.setFieldValue(name, formatted);
              }}
              onBlur={() => {
                formik.setFieldTouched(name, true, false);
              }}
              placeholder={placeholder}
              disabled={disabled}
              className={cn("col-span-full w-full md:col-span-3", className)}
            />
          );
        })()
      ) : as === "file" ? (
        <div className={cn("col-span-full space-y-4 md:col-span-3", className)}>
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
          <button
            type="button"
            className={cn(
              "border-muted-foreground/60 bg-muted/10 flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-10 text-center transition",
              "hover:border-primary hover:text-primary focus-visible:ring-primary/40 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
              isDraggingFile && "border-primary bg-primary/5 text-primary",
            )}
            onClick={() => {
              fileInputRef.current?.click();
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
              if (
                !relatedTarget ||
                !event.currentTarget.contains(relatedTarget)
              ) {
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
            <PiImageSquareDuotone className="text-muted-foreground mb-4 h-8 w-8" />
            <p className="text-muted-foreground text-sm font-medium">
              {typeof value === "string" && value
                ? "Drop a new image or click to replace"
                : "Drop your image here or click to browse"}
            </p>
            <p className="text-muted-foreground/80 mt-2 text-xs">
              Max size: 5MB
            </p>
          </button>
          {typeof value === "string" && value ? (
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded border">
                <Image
                  src={value}
                  alt={label}
                  fill
                  sizes="80px"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <span className="text-muted-foreground text-xs break-all">
                Image selected
              </span>
            </div>
          ) : null}
        </div>
      ) : as === "avatar" ? (
        (() => {
          const prefix = name.endsWith(".src") ? name.slice(0, -4) : name;
          const altFieldName = `${prefix}.alt`;
          const storagePathFieldName = `${prefix}.storagePath`;
          const previewSrc = typeof value === "string" && value ? value : "";
          const previewStoragePath =
            (formik.getFieldMeta(storagePathFieldName).value as
              | string
              | null) ?? "";
          const { userId, stateKey } = sectionContext;

          const buildAvatarPath = (file: File) => {
            const extension =
              file.name.includes(".") && file.name.lastIndexOf(".") !== -1
                ? file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase()
                : (file.type.split("/")[1] ?? "png").toLowerCase();
            const nameWithoutExt = file.name.replace(/\.[^.]+$/, "");
            const safeStem = nameWithoutExt
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "");
            const uniqueId =
              typeof crypto !== "undefined" && "randomUUID" in crypto
                ? crypto.randomUUID()
                : Math.random().toString(36).slice(2);
            return `${userId}/${stateKey}/avatar-${uniqueId}${
              safeStem ? `-${safeStem}` : ""
            }.${extension}`;
          };

          const handleAvatarSelection = async (file: File | null) => {
            if (!file || isUploadingAvatar) {
              return;
            }

            if (!file.type.startsWith("image/")) {
              formik.setFieldError(name, "Only image files are supported");
              formik.setFieldTouched(name, true, false);
              return;
            }

            if (file.size > AVATAR_MAX_FILE_SIZE) {
              formik.setFieldError(name, "Max file size is 5MB");
              formik.setFieldTouched(name, true, false);
              return;
            }

            const derivedAlt =
              file.name.replace(/\.[^.]+$/, "").trim() || "profile-avatar";
            const previousPath =
              (formik.getFieldMeta(storagePathFieldName).value as
                | string
                | null) ?? "";
            const path = buildAvatarPath(file);

            setIsUploadingAvatar(true);

            try {
              await uploadImage({
                path,
                file,
                contentType: file.type || undefined,
              });

              const publicUrl = getPublicImageUrl(path);

              formik.setFieldValue(name, publicUrl);
              formik.setFieldValue(altFieldName, derivedAlt);
              formik.setFieldValue(storagePathFieldName, path);
              formik.setFieldTouched(name, true, false);
              formik.setFieldTouched(altFieldName, true, false);
              formik.setFieldTouched(storagePathFieldName, true, false);
              formik.setFieldError(name, undefined);

              if (previousPath && previousPath !== path) {
                await deleteImages([previousPath]);
              }
            } catch (error) {
              console.error("[Profile][Avatar Upload]", error);
              formik.setFieldError(
                name,
                "Failed to upload image. Please try again.",
              );
            } finally {
              setIsUploadingAvatar(false);
            }
          };

          const clearAvatar = async () => {
            const currentPath =
              (formik.getFieldMeta(storagePathFieldName).value as
                | string
                | null) ?? "";

            formik.setFieldValue(name, "");
            formik.setFieldValue(altFieldName, "");
            formik.setFieldValue(storagePathFieldName, "");
            formik.setFieldTouched(name, true, false);
            formik.setFieldTouched(altFieldName, true, false);
            formik.setFieldTouched(storagePathFieldName, true, false);
            formik.setFieldError(name, undefined);

            if (currentPath) {
              try {
                await deleteImages([currentPath]);
              } catch (error) {
                console.error("[Profile][Avatar Delete]", error);
              }
            }
          };

          return (
            <div
              className={cn(
                "col-span-full flex flex-col gap-3 md:col-span-3",
                className,
              )}
            >
              <input
                id={fieldId}
                ref={fileInputRef}
                type="file"
                accept={accept ?? "image/*"}
                className="sr-only"
                disabled={isUploadingAvatar}
                onChange={(event) => {
                  void handleAvatarSelection(
                    event.currentTarget.files?.[0] ?? null,
                  );
                  event.currentTarget.value = "";
                }}
              />
              <div
                onClick={() => {
                  if (!isUploadingAvatar) {
                    fileInputRef.current?.click();
                  }
                }}
                aria-busy={isUploadingAvatar}
                className={cn(
                  "bg-accent relative size-20 rounded border shadow-xs transition-colors",
                  "focus-visible:ring-primary/40 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                  isUploadingAvatar && "opacity-80",
                )}
              >
                {previewSrc ? (
                  <>
                    <Image
                      src={previewSrc}
                      alt="Profile preview"
                      fill
                      sizes="96px"
                      className="rounded object-cover"
                      unoptimized
                    />
                    <Button
                      type="button"
                      size="icon"
                      className="border-background absolute -top-2 -right-2 size-6 shrink-0 rounded-full border-[2.5px] p-0"
                      disabled={isUploadingAvatar}
                      onClick={(event) => {
                        event.stopPropagation();
                        void clearAvatar();
                      }}   
                    >
                      <PiXBold className="size-3.5 text-white" />
                    </Button>
                  </>
                ) : (
                  <div className="text-muted-foreground flex size-full flex-col items-center justify-center gap-1">
                    {isUploadingAvatar ? (
                      <PiArrowClockwiseBold className="size-5 animate-spin" />
                    ) : (
                      <PiImageSquareDuotone className="size-5" />
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })()
      ) : (
        <Input
          id={fieldId}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={disabled}
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
  renderEntryAction: (entryIndex: number, removeEntry: () => void) => ReactNode;
  addButtonLabel?: string;
  emptyMessage?: string;
  renderEntryHeaderAction?: (
    entryIndex: number,
    removeEntry: () => void,
  ) => ReactNode;
};

export function CollectionField<TValues extends FormikValues>({
  formik,
  name,
  emptyEntryKey,
  entryTitle,
  renderEntryAction,
  addButtonLabel,
  emptyMessage = "No entries added yet.",
  renderEntryHeaderAction,
}: CollectionFieldProps<TValues>) {
  const entries = (getIn(formik.values, name) as unknown[]) ?? [];
  const createEntry =
    emptyEntryFactories[emptyEntryKey] ?? (() => ({}) as unknown);
  const addLabel =
    addButtonLabel ?? `Add ${entryTitle.toLowerCase()}`.trimEnd();

  return (
    <FieldArray name={name}>
      {({ push, remove }) => (
        <div className="">
          <div className="mb-6 flex items-center justify-center">
            <Button
              type="button"
              variant="secondary"
              className="h-10 min-w-64 cursor-pointer"
              onClick={() => {
                push(createEntry());
              }}
            >
              <PiPlusBold className="text-muted-foreground mr-2 size-3" />
              {addLabel}
            </Button>
          </div>

          {entries.length === 0 ? (
            <p className="text-muted-foreground border-y-2 border-dashed py-6 text-center text-sm">
              {emptyMessage}
            </p>
          ) : (
            entries.map((_, index) => {
              const handleRemove = () => remove(index);
              const headerContent =
                renderEntryHeaderAction?.(index, handleRemove) ?? null;

              return (
                <div
                  key={
                    // biome-ignore lint/suspicious/noArrayIndexKey: FieldArray data relies on ordered indices.
                    index
                  }
                  className="w-full"
                >
                  {headerContent}
                  {renderEntryAction(index, handleRemove)}
                </div>
              );
            })
          )}
        </div>
      )}
    </FieldArray>
  );
}
