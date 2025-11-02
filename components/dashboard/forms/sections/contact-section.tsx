"use client";

import type { FormikProps } from "formik";
import { motion } from "motion/react";

import { PiCaretDownBold, PiCaretUpBold, PiTrashDuotone } from "react-icons/pi";

import { type ReactNode, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import {
  COLLAPSE_TRANSITION,
  COLLAPSE_VARIANTS,
} from "@/components/dashboard/collapsible";
import {
  CollectionField,
  TextField,
} from "@/components/dashboard/forms/fields";
import { SOCIAL_OPTIONS } from "@/components/input/social-picker";

import type { SectionInitialValuesMap } from "@/lib/schema";
import { cn } from "@/lib/utils";

type ContactFormik = FormikProps<SectionInitialValuesMap["contact"]>;

export function renderContactSection(formik: ContactFormik): ReactNode {
  return (
    <div className="w-full space-y-6">
      <section className="w-full space-y-6">
        <div className="header">
          <h2>Contact methods</h2>
          <p className="text-muted-foreground mt-0.5 text-sm font-normal">
            Add ways for people to reach you across platforms.
          </p>
        </div>
        <CollectionField
          formik={formik}
          name="contact"
          emptyEntryKey="contact"
          entryTitle="Contact"
          renderEntryAction={(entryIndex, removeEntry) => (
            <ContactEntry
              entryIndex={entryIndex}
              formik={formik}
              removeEntry={removeEntry}
            />
          )}
        />
      </section>
    </div>
  );
}

type ContactEntryProps = {
  entryIndex: number;
  formik: ContactFormik;
  removeEntry: () => void;
};

function ContactEntry({
  entryIndex,
  formik,
  removeEntry,
}: ContactEntryProps): ReactNode {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const labelFieldName = `contact.${entryIndex}.label` as const;
  const valueFieldName = `contact.${entryIndex}.value` as const;
  const urlFieldName = `contact.${entryIndex}.url` as const;

  const labelMeta = formik.getFieldMeta<string>(labelFieldName);

  const selectedOption =
    SOCIAL_OPTIONS.find((option) => option.value === (labelMeta.value ?? "")) ??
    null;

  useEffect(() => {
    if (!selectedOption) {
      return;
    }
    const currentUrl =
      formik.values.contact?.[entryIndex]?.url?.toString() ?? "";

    if (selectedOption.urlPrefix === "mailto:") {
      if (!currentUrl || !currentUrl.startsWith("mailto:")) {
        formik.setFieldValue(urlFieldName, "mailto:");
      }
      return;
    }

    if (
      !currentUrl ||
      currentUrl === "mailto:" ||
      !/^https?:\/\//i.test(currentUrl)
    ) {
      formik.setFieldValue(urlFieldName, "https://");
    }
  }, [selectedOption?.urlPrefix, selectedOption?.value]);

  return (
    <section className="w-full">
      <div
        className={cn(
          "header flex items-center justify-between gap-3",
          entryIndex !== 0 && "border-t-0",
        )}
      >
        <h3>
          <span className="text-muted-foreground font-mono text-sm">{`${
            entryIndex + 1
          }. `}</span>
          Contact detail
        </h3>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label={
              isCollapsed ? "Expand contact detail" : "Collapse contact detail"
            }
            onClick={() => setIsCollapsed((previous) => !previous)}
          >
            {isCollapsed ? <PiCaretDownBold /> : <PiCaretUpBold />}
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={removeEntry}
          >
            <PiTrashDuotone />
          </Button>
        </div>
      </div>

      <motion.div
        initial={false}
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={COLLAPSE_VARIANTS}
        transition={COLLAPSE_TRANSITION}
        style={{ pointerEvents: isCollapsed ? "none" : "auto" }}
      >
        <div className="space-y-6 border-b-2 border-dashed pb-6">
          <TextField
            formik={formik}
            label="Label"
            name={labelFieldName}
            placeholder="Select a platform"
            as="social"
          />
          <TextField
            formik={formik}
            label="Value"
            name={valueFieldName}
            placeholder={
              selectedOption?.valuePlaceholder ?? "Enter contact value"
            }
            type={selectedOption?.urlPrefix === "mailto:" ? "email" : "text"}
          />
          <TextField
            formik={formik}
            label="URL"
            name={urlFieldName}
            placeholder={selectedOption?.urlPlaceholder ?? "example.com"}
            as="url"
            pre={selectedOption?.urlPrefix}
          />
        </div>
      </motion.div>
    </section>
  );
}
