"use client";

import { FieldArray, type FormikProps } from "formik";

import { PiPlusBold, PiXBold } from "react-icons/pi";

import { useRef, useState } from "react";

import Image from "next/image";

import { Button } from "@/components/ui/button";

import { useSectionFormContext } from "@/components/dashboard/forms/section-form";

import {
  deleteImages,
  getPublicImageUrl,
  uploadImage,
} from "@/lib/supabase/storage";
import { type ImageFormValues, emptyEntryFactories } from "@/lib/schema";
import { cn } from "@/lib/utils";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

type ImagesFieldProps<FormValues> = {
  formik: FormikProps<FormValues>;
  fieldArrayName: string;
  images: ImageFormValues[];
  altPrefix?: string;
  aspects?: "video" | "square" | "4/3" | "auto";
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
  const [isUploading, setIsUploading] = useState(false);
  const { userId, stateKey } = useSectionFormContext();
  const limit = typeof maxItems === "number" ? maxItems : null;

  const createStoragePath = (file: File) => {
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
    const fileName = `${uniqueId}-${Date.now()}${
      safeStem ? `-${safeStem}` : ""
    }.${extension}`;
    return [userId, stateKey, fileName]
      .map((segment) => segment.replace(/^\/*|\/*$/g, ""))
      .join("/");
  };

  return (
    <FieldArray name={fieldArrayName}>
      {({ push, remove }) => {
        const handleFiles = (fileList: FileList | null) => {
          if (!fileList?.length || isUploading) {
            return;
          }

          if (limit && images.length >= limit) {
            setUploadError(
              `You can upload up to ${limit} image${limit > 1 ? "s" : ""}.`,
            );
            return;
          }

          const files = Array.from(fileList);
          const existingCount = images.length;
          let addedCount = 0;
          let encounteredError = false;
          let limitExceeded = false;

          setIsUploading(true);
          setUploadError(null);

          const processFiles = async () => {
            try {
              for (const file of files) {
                if (limit && existingCount + addedCount >= limit) {
                  limitExceeded = true;
                  break;
                }

                if (
                  !file.type.startsWith("image/") ||
                  file.size > MAX_IMAGE_SIZE_BYTES
                ) {
                  encounteredError = true;
                  continue;
                }

                try {
                  const path = createStoragePath(file);
                  await uploadImage({
                    path,
                    file,
                    contentType: file.type || undefined,
                  });

                  const publicUrl = getPublicImageUrl(path);
                  push({
                    ...emptyEntryFactories.image(),
                    src: publicUrl,
                    alt: `${altPrefix}-${existingCount + addedCount + 1}`,
                    storagePath: path,
                  });
                  formik.setFieldTouched(fieldArrayName, true, false);
                  addedCount += 1;
                } catch (error) {
                  console.error("[ImagesField][Upload Error]", error);
                  encounteredError = true;
                }
              }
            } finally {
              if (limitExceeded) {
                setUploadError(
                  `You can upload up to ${limit ?? 0} image${
                    limit && limit > 1 ? "s" : ""
                  }.`,
                );
              } else if (encounteredError) {
                setUploadError(
                  "Some files could not be uploaded. Ensure they are images under 5MB.",
                );
              } else {
                setUploadError(null);
              }

              setIsUploading(false);
            }
          };

          void processFiles();
        };

        const hasReachedLimit = Boolean(limit && images.length >= limit);

        const handleRemoveImage = async (imageIndex: number) => {
          const image = images[imageIndex];
          let deletionFailed = false;

          if (image?.storagePath) {
            try {
              await deleteImages([image.storagePath]);
            } catch (error) {
              console.error("[ImagesField][Delete Error]", error);
              setUploadError("Failed to delete image from storage.");
              deletionFailed = true;
            }
          }

          remove(imageIndex);
          formik.setFieldTouched(fieldArrayName, true, false);

          if (!deletionFailed) {
            setUploadError(null);
          }
        };

        return (
          <section className="flex flex-col gap-6">
            <div className="header flex items-center justify-between gap-4">
              <h3>
                Uploaded files
                <span className="text-muted-foreground font-mono text-sm font-normal">
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
                  disabled={hasReachedLimit || isUploading}
                  className="disabled:opacity-50"
                >
                  <PiPlusBold />
                </Button>
              </div>
            </div>
            {uploadError ? (
              <p className="text-destructive text-xs">{uploadError}</p>
            ) : null}
            {images.length !== 0 && (
              <div className="grid grid-cols-2 gap-4 border-b-2 border-dashed pb-6 md:grid-cols-4">
                {images.map((image, imageIndex) => (
                  <div
                    key={
                      // biome-ignore lint/suspicious/noArrayIndexKey: FieldArray data relies on ordered indices.
                      imageIndex
                    }
                    className={cn(
                      "relative rounded-[4px]",
                      aspects ? `aspect-${aspects}` : "aspect-video",
                    )}
                  >
                    {typeof image?.src === "string" && image.src ? (
                      <Image
                        src={image.src}
                        alt={image.alt ?? `Image ${imageIndex + 1}`}
                        fill
                        sizes="200px"
                        className="rounded object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="text-muted-foreground flex aspect-square items-center justify-center text-xs">
                        No preview
                      </div>
                    )}
                    <Button
                      type="button"
                      size="icon"
                      className="border-background absolute -top-2 -right-2 size-6 shrink-0 rounded-full border-[2.5px] p-0"
                      onClick={() => {
                        void handleRemoveImage(imageIndex);
                      }}
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
