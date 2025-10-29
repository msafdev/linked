"use client";

import {
  FieldArray,
  type FormikProps,
} from "formik";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { CollectionField, TextField } from "../fields";
import {
  emptyEntryFactories,
  type SectionInitialValuesMap,
  type WorkFormValues,
} from "@/lib/dashboard-forms";

type WorkFormik = FormikProps<SectionInitialValuesMap["work"]>;

export function renderWorkSection(formik: WorkFormik): ReactNode {
  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold text-foreground">
        Work experience
      </h2>
      <CollectionField
        formik={formik}
        name="work"
        emptyEntryKey="work"
        entryTitle="Role"
        renderEntry={(entryIndex) => (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                formik={formik}
                label="Role"
                name={`work.${entryIndex}.role`}
              />
              <TextField
                formik={formik}
                label="Company"
                name={`work.${entryIndex}.company`}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                formik={formik}
                label="Location"
                name={`work.${entryIndex}.location`}
              />
              <TextField
                formik={formik}
                label="Company Website"
                name={`work.${entryIndex}.url`}
                placeholder="https://company.com"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                formik={formik}
                label="Start"
                name={`work.${entryIndex}.range.from`}
                placeholder="2023"
              />
              <TextField
                formik={formik}
                label="End"
                name={`work.${entryIndex}.range.to`}
                placeholder="Present"
              />
            </div>
            <FieldArray name={`work.${entryIndex}.images`}>
              {({ push, remove }) => {
                const values = formik.values as WorkFormValues;
                const images = values.work?.[entryIndex]?.images ?? [];
                return (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">
                        Images
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => push(emptyEntryFactories.workImage())}
                      >
                        Add image
                      </Button>
                    </div>
                    {images.length === 0 ? (
                      <p className="text-xs text-muted-foreground">
                        No images added yet.
                      </p>
                    ) : (
                      images.map((_, imageIndex) => (
                        <div
                          key={
                            // biome-ignore lint/suspicious/noArrayIndexKey: FieldArray data relies on ordered indices.
                            imageIndex
                          }
                          className="grid gap-3 md:grid-cols-[1fr_1fr_auto]"
                        >
                          <TextField
                            formik={formik}
                            label="Image URL"
                            name={`work.${entryIndex}.images.${imageIndex}.src`}
                            placeholder="/images/example.jpg"
                          />
                          <TextField
                            formik={formik}
                            label="Alt text"
                            name={`work.${entryIndex}.images.${imageIndex}.alt`}
                            placeholder="Optional description"
                          />
                          <div className="flex items-end">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(imageIndex)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                );
              }}
            </FieldArray>
          </div>
        )}
      />
    </section>
  );
}
