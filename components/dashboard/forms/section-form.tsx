"use client";

import { Formik, setIn } from "formik";
import { useEffect } from "react";
import type { ZodTypeAny } from "zod";

import { Button } from "@/components/ui/button";
import type { DashboardState } from "@/lib/config";
import {
  sectionSchemas,
  type SectionFormValuesMap,
  type SectionInitialValuesMap,
} from "@/lib/schema";
import {
  getAllSectionValues,
  initializeUserSectionValues,
  updateSectionValues,
} from "@/lib/form";
import { sectionRenderers } from "@/components/dashboard/forms/sections";

type SectionFormProps<K extends DashboardState = DashboardState> = {
  stateKey: K;
  userId: string;
  initialValues: SectionInitialValuesMap[K];
  allInitialValues: SectionFormValuesMap;
};

export function SectionForm<K extends DashboardState>({
  stateKey,
  userId,
  initialValues,
  allInitialValues,
}: SectionFormProps<K>) {
  const schema = sectionSchemas[stateKey] as ZodTypeAny | undefined;

  useEffect(() => {
    initializeUserSectionValues(userId, allInitialValues);
  }, [userId, allInitialValues]);

  if (!schema) {
    return null;
  }

  const renderSection = sectionRenderers[stateKey];

  if (!renderSection) {
    return null;
  }

  return (
    <Formik<SectionInitialValuesMap[K]>
      initialValues={initialValues}
      enableReinitialize
      validate={(values) => zodValidate(schema, values)}
      onSubmit={(values, helpers) => {
        updateSectionValues(userId, stateKey, values);
        const allSections = getAllSectionValues(userId) ?? allInitialValues;
        console.log({
          userId,
          section: stateKey,
          values,
          allSections,
        });
        helpers.setSubmitting(false);
      }}
    >
      {(formik) => (
        <form className="w-full" onSubmit={formik.handleSubmit}>
          {renderSection(formik)}

          <div className="flex justify-center gap-3 pt-6">
            <Button
              type="button"
              variant="secondary"
              className="border"
              size="sm"
              onClick={() => formik.resetForm()}
            >
              Reset
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={formik.isSubmitting || formik.isValidating}
            >
              Save changes
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
}

function zodValidate(schema: ZodTypeAny, values: unknown) {
  const result = schema.safeParse(values);

  if (result.success) {
    return {};
  }

  return result.error.issues.reduce<Record<string, unknown>>((acc, issue) => {
    if (issue.path.length === 0) {
      return setIn(acc, "_error", issue.message);
    }

    const path = issue.path.join(".");
    return setIn(acc, path, issue.message);
  }, {});
}
