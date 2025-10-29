"use client";

import type { FormikProps } from "formik";
import type { ReactNode } from "react";

import { CollectionField, TextField } from "../fields";
import type { SectionInitialValuesMap } from "@/lib/dashboard-forms";

type ProjectsFormik = FormikProps<SectionInitialValuesMap["projects"]>;

export function renderProjectsSection(formik: ProjectsFormik): ReactNode {
  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold text-foreground">
        Side projects
      </h2>
      <CollectionField
        formik={formik}
        name="sideProjects"
        emptyEntryKey="sideProjects"
        entryTitle="Project"
        minimumLength={0}
        addLabel="Add project"
        emptyState="No side projects yet. Add your experiments and independent initiatives."
        renderEntry={(entryIndex) => (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                formik={formik}
                label="Title"
                name={`sideProjects.${entryIndex}.title`}
              />
              <TextField
                formik={formik}
                label="Year"
                name={`sideProjects.${entryIndex}.year`}
                placeholder="2024"
              />
            </div>
            <TextField
              formik={formik}
              label="Subtitle"
              name={`sideProjects.${entryIndex}.subtitle`}
              placeholder="Optional context"
            />
            <TextField
              formik={formik}
              label="URL"
              name={`sideProjects.${entryIndex}.url`}
              placeholder="https://"
            />
          </div>
        )}
      />
    </section>
  );
}
