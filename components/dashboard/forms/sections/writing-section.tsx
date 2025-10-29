"use client";

import type { FormikProps } from "formik";
import type { ReactNode } from "react";

import { CollectionField, TextField } from "../fields";
import type { SectionInitialValuesMap } from "@/lib/dashboard-forms";

type WritingFormik = FormikProps<SectionInitialValuesMap["writing"]>;

export function renderWritingSection(formik: WritingFormik): ReactNode {
  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold text-foreground">
        Published writing
      </h2>
      <CollectionField
        formik={formik}
        name="writing"
        emptyEntryKey="writing"
        entryTitle="Writing"
        renderEntry={(entryIndex) => (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                formik={formik}
                label="Title"
                name={`writing.${entryIndex}.title`}
              />
              <TextField
                formik={formik}
                label="Year"
                name={`writing.${entryIndex}.year`}
                placeholder="2024"
              />
            </div>
            <TextField
              formik={formik}
              label="Subtitle"
              name={`writing.${entryIndex}.subtitle`}
              placeholder="Optional context"
            />
            <TextField
              formik={formik}
              label="URL"
              name={`writing.${entryIndex}.url`}
              placeholder="https://"
            />
          </div>
        )}
      />
    </section>
  );
}
