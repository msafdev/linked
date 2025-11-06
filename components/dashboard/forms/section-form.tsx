"use client";

import { Formik, type FormikProps, setIn } from "formik";
import { toast } from "sonner";
import type { ZodTypeAny } from "zod";

import { createContext, useContext, useEffect, useMemo, useRef } from "react";

import type { PostgrestError } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

type SectionMetadata = {
  hasContent: boolean;
  hasSetting: boolean;
};

type MutationPayload<K extends DashboardState> = {
  values: SectionInitialValuesMap[K];
  allSections: SectionFormValuesMap;
};

const isMissingRow = (error: PostgrestError | null): boolean =>
  Boolean(error && error.code === "PGRST116");

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
  const queryClient = useQueryClient();
  const sectionLabel = stateKey.charAt(0).toUpperCase() + stateKey.slice(1);

  useEffect(() => {
    initializeUserSectionValues(userId, allInitialValues);
  }, [userId, allInitialValues]);

  const metadataQueryKey = [
    "dashboard",
    "section",
    "metadata",
    userId,
    stateKey,
  ];

  const metadataQuery = useQuery<SectionMetadata>({
    queryKey: metadataQueryKey,
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const base: SectionMetadata = {
        hasContent: false,
        hasSetting: false,
      };

      const { data: contentRow, error: contentError } = await supabase
        .from("content")
        .select("id")
        .eq("account_id", userId)
        .eq("section", stateKey)
        .maybeSingle();

      if (contentError && !isMissingRow(contentError)) {
        throw contentError;
      }

      if (contentRow?.id) {
        base.hasContent = true;
      }

      if (stateKey === "settings") {
        const { data: settingRow, error: settingError } = await supabase
          .from("setting")
          .select("id")
          .eq("account_id", userId)
          .maybeSingle();

        if (settingError && !isMissingRow(settingError)) {
          throw settingError;
        }

        if (settingRow?.id) {
          base.hasSetting = true;
        }
      }

      return base;
    },
  });

  const saveSectionMutation = useMutation<
    SectionMetadata,
    unknown,
    MutationPayload<K>
  >({
    mutationKey: ["dashboard", "section", "save", userId, stateKey],
    mutationFn: async ({ values, allSections }: MutationPayload<K>) => {
      const metadata =
        metadataQuery.data ??
        ({
          hasContent: false,
          hasSetting: false,
        } satisfies SectionMetadata);

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

        const { error: upsertSettingError } = await supabase
          .from("setting")
          .upsert(
            {
              account_id: userId,
              domain: domain.length > 0 ? domain : null,
              billing_status: settingsValues.billingStatus,
              billing_type: settingsValues.billingType,
              preferences,
            },
            { onConflict: "account_id" },
          );

        if (upsertSettingError) {
          throw upsertSettingError;
        }

        return {
          hasContent: true,
          hasSetting: true,
        };
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

      return {
        hasContent: true,
        hasSetting: metadata.hasSetting,
      };
    },
    onSuccess: (metadata) => {
      queryClient.setQueryData<SectionMetadata>(
        metadataQueryKey,
        () => metadata,
      );
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
            console.error("[SectionForm][Save Error]", error);
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
