"use client";

import { motion } from "motion/react";
import type { FormikProps } from "formik";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { CollectionField, TextField } from "@/components/dashboard/forms/fields";
import {
  type SectionInitialValuesMap,
  type WritingFormValues,
} from "@/lib/schema";
import { ImagesField } from "@/components/input/images-field";
import { PiCaretDownBold, PiCaretUpBold, PiTrashDuotone } from "react-icons/pi";
import { cn } from "@/lib/utils";
import {
  COLLAPSE_TRANSITION,
  COLLAPSE_VARIANTS,
} from "@/components/dashboard/collapsible";

type WritingFormik = FormikProps<SectionInitialValuesMap["writing"]>;

export function renderWritingSection(formik: WritingFormik): ReactNode {
  return (
    <div className="space-y-6 w-full">
      <section className="space-y-6 w-full">
        <div className="header">
          <h2>Published writing</h2>
          <p className="text-sm text-muted-foreground font-normal mt-0.5">
            Manage your published articles, posts, and other writing.
          </p>
        </div>
        <CollectionField
          formik={formik}
          name="writing"
          emptyEntryKey="writing"
          entryTitle="Writing"
          renderEntry={(entryIndex, removeEntry) => (
            <WritingEntry
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

type WritingEntryProps = {
  entryIndex: number;
  formik: WritingFormik;
  removeEntry: () => void;
};

function WritingEntry({
  entryIndex,
  formik,
  removeEntry,
}: WritingEntryProps): ReactNode {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const values = formik.values as WritingFormValues;
  const images = values.writing?.[entryIndex]?.images ?? [];

  return (
    <section className="w-full">
      <div
        className={cn(
          "header flex items-center justify-between gap-3",
          entryIndex !== 0 && "border-t-0"
        )}
      >
        <h3>
          <span className="font-mono text-muted-foreground text-sm font-normal">{`${
            entryIndex + 1
          }. `}</span>
          Writing entry
        </h3>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label={isCollapsed ? "Expand entry" : "Collapse entry"}
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
        <div className="flex flex-col gap-6">
          <TextField
            formik={formik}
            label="Title"
            name={`writing.${entryIndex}.title`}
            placeholder="Article title"
          />
          <TextField
            formik={formik}
            label="Year"
            name={`writing.${entryIndex}.year`}
            placeholder="Publication date"
            as="date"
            className="lg:col-span-2"
          />
          <TextField
            formik={formik}
            label="Subtitle"
            name={`writing.${entryIndex}.subtitle`}
            as="textarea"
            description="Share additional context about the writing piece."
            placeholder="Additional context"
          />
          <TextField
            formik={formik}
            label="URL"
            name={`writing.${entryIndex}.url`}
            placeholder="example.com/article"
            as="url"
          />
          <ImagesField
            formik={formik}
            fieldArrayName={`writing.${entryIndex}.images`}
            images={images}
            altPrefix={`writing-${entryIndex + 1}`}
            aspects="square"
          />
        </div>
      </motion.div>
    </section>
  );
}
