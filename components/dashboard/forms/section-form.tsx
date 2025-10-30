"use client";

import { Formik, setIn } from "formik";
import type { ZodTypeAny } from "zod";

import { Button } from "@/components/ui/button";
import type { DashboardState } from "@/lib/dashboard-config";
import {
  type SectionInitialValuesMap,
  sectionSchemas,
} from "@/lib/dashboard-forms";
import { sectionRenderers } from "./sections";

type SectionFormProps<K extends DashboardState = DashboardState> = {
  stateKey: K;
  initialValues: SectionInitialValuesMap[K];
};

export function SectionForm<K extends DashboardState>({
  stateKey,
  initialValues,
}: SectionFormProps<K>) {
  const schema = sectionSchemas[stateKey] as ZodTypeAny | undefined;

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
        console.log({ section: stateKey, values });
        helpers.setSubmitting(false);
      }}
    >
      {(formik) => (
        <form className="w-full" onSubmit={formik.handleSubmit}>
          {renderSection(formik)}
          
          <div className="flex justify-center gap-3 border-b-2 border-dashed py-6">
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
