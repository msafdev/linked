"use client";

import { FieldArray, type FormikProps } from "formik";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  emptyEntryFactories,
  type ImageFormValues,
} from "@/lib/dashboard-forms";
import { PiPlusBold, PiXBold } from "react-icons/pi";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

type ImagesFieldProps<FormValues> = {
  formik: FormikProps<FormValues>;
  fieldArrayName: string;
  images: ImageFormValues[];
  altPrefix?: string;
};

export function ImagesField<FormValues>({
  formik,
  fieldArrayName,
  images,
  altPrefix = "image",
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

          let encounteredError = false;
          const existingCount = images.length;

          Array.from(fileList).forEach((file, index) => {
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
          });

          setUploadError(
            encounteredError
              ? "Only image files up to 5MB are supported."
              : null
          );
        };

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
                    className="relative"
                  >
                    {typeof image?.src === "string" && image.src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={image.src}
                        alt={image.alt ?? `Image ${imageIndex + 1}`}
                        className="aspect-video w-full object-cover rounded-[4px]"
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
