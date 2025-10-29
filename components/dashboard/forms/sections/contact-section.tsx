"use client";

import type { FormikProps } from "formik";
import type { ReactNode } from "react";

import { CollectionField, TextField } from "../fields";
import type { SectionInitialValuesMap } from "@/lib/dashboard-forms";

type ContactFormik = FormikProps<SectionInitialValuesMap["contact"]>;

export function renderContactSection(formik: ContactFormik): ReactNode {
  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold text-foreground">
        Contact methods
      </h2>
      <CollectionField
        formik={formik}
        name="contact"
        emptyEntryKey="contact"
        entryTitle="Contact"
        renderEntry={(entryIndex) => (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                formik={formik}
                label="Label"
                name={`contact.${entryIndex}.label`}
                placeholder="Email"
              />
              <TextField
                formik={formik}
                label="Value"
                name={`contact.${entryIndex}.value`}
                placeholder="you@example.com"
              />
            </div>
            <TextField
              formik={formik}
              label="URL"
              name={`contact.${entryIndex}.url`}
              placeholder="mailto:you@example.com"
            />
          </div>
        )}
      />
    </section>
  );
}
