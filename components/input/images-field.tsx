"use client";

import { FieldArray, type FormikProps } from "formik";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  emptyEntryFactories,
  type ImageFormValues,
} from "@/lib/schema";
import { PiPlusBold, PiXBold } from "react-icons/pi";
import { cn } from "@/lib/utils";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

type ImagesFieldProps<FormValues> = {
  formik: FormikProps<FormValues>;
  fieldArrayName: string;
  images: ImageFormValues[];
  altPrefix?: string;
  aspects?: "video" | "square" | "auto";
  maxItems?: number;
};

export function ImagesField<FormValues>({
  formik,
  fieldArrayName,
  images,
  altPrefix = "image",
  aspects = "video",
  maxItems,
}: ImagesFieldProps<FormValues>) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  return (
    <FieldArray name={fieldArrayName}>
      {({ push, remove }) => {
        const handleFiles = (fileList: FileList | null) => {
          if (!fileList?.length) {
            return;
          }

          const limit = typeof maxItems === "number" ? maxItems : null;
          if (limit && images.length >= limit) {
            setUploadError(
              `You can upload up to ${limit} image${limit > 1 ? "s" : ""}.`
            );
            return;
          }

          let encounteredError = false;
          let limitExceeded = false;
          const existingCount = images.length;
          let addedCount = 0;

          Array.from(fileList).forEach((file, index) => {
            if (limit && existingCount + addedCount >= limit) {
              limitExceeded = true;
              return;
            }

            if (
              !file.type.startsWith("image/") ||
              file.size > MAX_IMAGE_SIZE_BYTES
            ) {
              encounteredError = true;
              return;
            }

            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result;
              if (typeof result === "string") {
                push({
                  ...emptyEntryFactories.image(),
                  src: result,
                  alt: `${altPrefix}-${existingCount + index + 1}`,
                });
                formik.setFieldTouched(fieldArrayName, true, false);
              }
            };
            reader.readAsDataURL(file);
            addedCount += 1;
          });

          if (limitExceeded) {
            setUploadError(
              `You can upload up to ${limit ?? 0} image${
                limit && limit > 1 ? "s" : ""
              }.`
            );
            return;
          }

          setUploadError(
            encounteredError
              ? "Only image files up to 5MB are supported."
              : null
          );
        };

        const limit = typeof maxItems === "number" ? maxItems : null;
        const hasReachedLimit = Boolean(limit && images.length >= limit);

        return (
          <section className="flex flex-col gap-6">
            <div className="header flex items-center gap-4 justify-between">
              <h3>
                Uploaded files
                <span className="font-mono text-muted-foreground text-sm font-normal">
                  {" "}
                  ({images.length})
                </span>
              </h3>
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(event) => {
                    handleFiles(event.currentTarget.files);
                    event.currentTarget.value = "";
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={hasReachedLimit}
                  className="disabled:opacity-50"
                >
                  <PiPlusBold />
                </Button>
              </div>
            </div>
            {uploadError ? (
              <p className="text-xs text-destructive">{uploadError}</p>
            ) : null}
            {images.length !== 0 && (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 border-b-2 border-dashed pb-6">
                {images.map((image, imageIndex) => (
                  <div
                    key={
                      // biome-ignore lint/suspicious/noArrayIndexKey: FieldArray data relies on ordered indices.
                      imageIndex
                    }
                    className={cn(
                      "relative rounded-[4px]",
                      aspects ? `aspect-${aspects}` : "aspect-video"
                    )}
                  >
                    {typeof image?.src === "string" && image.src ? (
                      <Image
                        src={image.src}
                        alt={image.alt ?? `Image ${imageIndex + 1}`}
                        fill
                        sizes="200px"
                        className="object-cover rounded"
                        unoptimized
                      />
                    ) : (
                      <div className="flex aspect-square items-center justify-center text-xs text-muted-foreground">
                        No preview
                      </div>
                    )}
                    <Button
                      type="button"
                      size="icon"
                      className="absolute -right-2 -top-2 size-6 rounded-full p-0 border-[2.5px] border-background shrink-0"
                      onClick={() => remove(imageIndex)}
                    >
                      <PiXBold className="size-3.5 text-white" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      }}
    </FieldArray>
  );
}
