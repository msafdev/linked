"use client";

import { Formik, type FormikProps, setIn } from "formik";
import { toast } from "sonner";
import type { ZodTypeAny } from "zod";

import { createContext, useContext, useEffect, useMemo, useRef } from "react";

import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";

import { sectionRenderers } from "@/components/dashboard/forms/sections";

import type { DashboardState } from "@/lib/config";
import {
  getAllSectionValues,
  initializeUserSectionValues,
  updateSectionValues,
} from "@/lib/form";
import {
  type SectionFormValuesMap,
  type SectionInitialValuesMap,
  sectionSchemas,
} from "@/lib/schema";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type SectionFormProps<K extends DashboardState = DashboardState> = {
  stateKey: K;
  userId: string;
  initialValues: SectionInitialValuesMap[K];
  allInitialValues: SectionFormValuesMap;
};

type MutationPayload<K extends DashboardState> = {
  values: SectionInitialValuesMap[K];
  allSections: SectionFormValuesMap;
};

type SectionFormContextValue = {
  userId: string;
  stateKey: DashboardState;
};

const SectionFormContext = createContext<SectionFormContextValue | null>(null);

export const useSectionFormContext = () => {
  const context = useContext(SectionFormContext);
  if (!context) {
    throw new Error("useSectionFormContext must be used within SectionForm");
  }
  return context;
};

export function SectionForm<K extends DashboardState>({
  stateKey,
  userId,
  initialValues,
  allInitialValues,
}: SectionFormProps<K>) {
  const schema = sectionSchemas[stateKey] as ZodTypeAny | undefined;
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const sectionLabel = stateKey.charAt(0).toUpperCase() + stateKey.slice(1);

  useEffect(() => {
    if (!userId) {
      return;
    }
    initializeUserSectionValues(userId, allInitialValues);
  }, [userId, allInitialValues]);

  const saveSectionMutation = useMutation<
    void,
    unknown,
    MutationPayload<K>
  >({
    mutationKey: ["dashboard", "section", "save", userId, stateKey],
    mutationFn: async ({ values, allSections }: MutationPayload<K>) => {
      if (stateKey === "settings") {
        const settingsValues = values as SectionInitialValuesMap["settings"];
        const domain =
          typeof settingsValues.domain === "string"
            ? settingsValues.domain.trim().toLowerCase()
            : "";

        const { error: upsertContentError } = await supabase
          .from("content")
          .upsert(
            {
              account_id: userId,
              section: stateKey,
              data: settingsValues,
            },
            { onConflict: "account_id,section" },
          );

        if (upsertContentError) {
          throw upsertContentError;
        }

        const preferences = {
          sections: JSON.parse(
            JSON.stringify(allSections),
          ) as SectionFormValuesMap,
          template: settingsValues.template,
        };

        const updatePayload = {
          domain: domain.length > 0 ? domain : null,
          billing_status: settingsValues.billingStatus,
          billing_type: settingsValues.billingType,
          is_public: settingsValues.isPublic,
          preferences,
        };

        const { data: settingRow, error: updateSettingError } = await supabase
          .from("setting")
          .update(updatePayload)
          .eq("account_id", userId)
          .select("id")
          .maybeSingle();

        if (updateSettingError) {
          throw updateSettingError;
        }

        if (!settingRow?.id) {
          const message =
            "Could not update account settings because no settings record exists for this account.";
          throw new Error(message);
        }
        return;
      }

      const { error: upsertContentError } = await supabase
        .from("content")
        .upsert(
          {
            account_id: userId,
            section: stateKey,
            data: values,
          },
          { onConflict: "account_id,section" },
        );

      if (upsertContentError) {
        throw upsertContentError;
      }
    },
    onSuccess: () => {
      toast.success(`${sectionLabel} saved`);
    },
  });

  if (!schema) {
    return null;
  }

  const renderSection = sectionRenderers[stateKey];

  if (!renderSection) {
    return null;
  }

  return (
    <SectionFormContext.Provider value={{ userId, stateKey }}>
      <Formik<SectionInitialValuesMap[K]>
        initialValues={initialValues}
        enableReinitialize
        validate={(values) => zodValidate(schema, values)}
        onSubmit={async (values, helpers) => {
          updateSectionValues(userId, stateKey, values);
          const allSections = getAllSectionValues(userId) ?? allInitialValues;
          helpers.setStatus(undefined);

          try {
            await saveSectionMutation.mutateAsync({
              values,
              allSections,
            });
          } catch (error) {
            toast.error(
              error instanceof Error
                ? error.message || "Failed to save changes."
                : "Failed to save changes.",
            );
            helpers.setStatus({
              error: (error as Error).message ?? "Failed to save changes.",
            });
          } finally {
            helpers.setSubmitting(false);
          }
        }}
      >
        {(formik) => (
          <form className="w-full" onSubmit={formik.handleSubmit}>
            <SectionValidationWatcher formik={formik} />
            
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
                disabled={
                  formik.isSubmitting ||
                  formik.isValidating ||
                  saveSectionMutation.isPending
                }
              >
                Save changes
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </SectionFormContext.Provider>
  );
}

function SectionValidationWatcher({ formik }: { formik: FormikProps<any> }) {
  const lastSubmitCountRef = useRef(formik.submitCount);

  useEffect(() => {
    const hasSubmitted = formik.submitCount > lastSubmitCountRef.current;

    if (hasSubmitted) {
      if (!formik.isValid && !formik.isValidating) {
        toast.error("Please fix the errors highlighted in the form.");
      }
      lastSubmitCountRef.current = formik.submitCount;
    } else if (formik.submitCount < lastSubmitCountRef.current) {
      lastSubmitCountRef.current = formik.submitCount;
    }
  }, [formik.submitCount, formik.isValid, formik.isValidating]);

  return null;
}

function zodValidate(schema: ZodTypeAny, values: unknown) {
  const result = schema.safeParse(values);

  if (result.success) {
    return {};
  }

  return result.error.issues.reduce<Record<string, unknown>>((acc, issue) => {
    const defaultMessage = "Please review the highlighted fields.";
    const issueMessage =
      typeof issue.message === "string" && issue.message.trim().length > 0
        ? issue.message
        : defaultMessage;

    if (issue.path.length === 0) {
      return setIn(acc, "_error", defaultMessage);
    }

    const path = issue.path.join(".");
    return setIn(acc, path, issueMessage);
  }, {});
}
