"use client";

import type { FormikProps } from "formik";
import type { ReactNode } from "react";

import { CollectionField, TextField } from "../fields";
import type { SectionInitialValuesMap } from "@/lib/dashboard-forms";

type SpeakingFormik = FormikProps<SectionInitialValuesMap["speaking"]>;

export function renderSpeakingSection(formik: SpeakingFormik): ReactNode {
  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold text-foreground">
        Speaking engagements
      </h2>
      <CollectionField
        formik={formik}
        name="speaking"
        emptyEntryKey="speaking"
        entryTitle="Talk"
        renderEntry={(entryIndex) => (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                formik={formik}
                label="Title"
                name={`speaking.${entryIndex}.title`}
              />
              <TextField
                formik={formik}
                label="Date"
                name={`speaking.${entryIndex}.date`}
                placeholder="2024"
              />
            </div>
            <TextField
              formik={formik}
              label="Location"
              name={`speaking.${entryIndex}.location`}
            />
            <TextField
              formik={formik}
              label="Subtitle"
              name={`speaking.${entryIndex}.subtitle`}
              placeholder="Conference, track, etc."
            />
            <TextField
              formik={formik}
              label="URL"
              name={`speaking.${entryIndex}.url`}
              placeholder="https://"
            />
          </div>
        )}
      />
    </section>
  );
}
