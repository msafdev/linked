"use client";

import type { FormikProps } from "formik";
import type { ReactNode } from "react";

import { CollectionField, TextField } from "../fields";
import type { SectionInitialValuesMap } from "@/lib/dashboard-forms";

type EducationFormik = FormikProps<SectionInitialValuesMap["education"]>;

export function renderEducationSection(formik: EducationFormik): ReactNode {
  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold text-foreground">Education</h2>
      <CollectionField
        formik={formik}
        name="education"
        emptyEntryKey="education"
        entryTitle="Education"
        renderEntry={(entryIndex) => (
          <div className="space-y-4">
            <TextField
              formik={formik}
              label="Degree"
              name={`education.${entryIndex}.degree`}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                formik={formik}
                label="School"
                name={`education.${entryIndex}.school`}
              />
              <TextField
                formik={formik}
                label="Location"
                name={`education.${entryIndex}.location`}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                formik={formik}
                label="Start"
                name={`education.${entryIndex}.range.from`}
                placeholder="2018"
              />
              <TextField
                formik={formik}
                label="End"
                name={`education.${entryIndex}.range.to`}
                placeholder="2020"
              />
            </div>
          </div>
        )}
      />
    </section>
  );
}
