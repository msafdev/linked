"use client";

import type { FormikProps } from "formik";
import { motion } from "motion/react";

import { PiCaretDownBold, PiCaretUpBold, PiTrashDuotone } from "react-icons/pi";

import { type ReactNode, useState } from "react";

import { Button } from "@/components/ui/button";

import {
  COLLAPSE_TRANSITION,
  COLLAPSE_VARIANTS,
} from "@/components/dashboard/collapsible";
import {
  CollectionField,
  TextField,
} from "@/components/dashboard/forms/fields";
import { ImagesField } from "@/components/input/images-field";

import type { SectionInitialValuesMap, SpeakingFormValues } from "@/lib/schema";
import { cn } from "@/lib/utils";

type SpeakingFormik = FormikProps<SectionInitialValuesMap["speaking"]>;

export function renderSpeakingSection(formik: SpeakingFormik): ReactNode {
  return (
    <div className="w-full space-y-6">
      <section className="flex flex-col gap-6">
        <div className="header">
          <h2>Speaking engagements</h2>
          <p className="text-muted-foreground mt-0.5 text-sm font-normal">
            Add your talks, workshops, and conference appearances.
          </p>
        </div>
        <CollectionField
          formik={formik}
          name="speaking"
          emptyEntryKey="speaking"
          entryTitle="Talk"
          renderEntryAction={(entryIndex, removeEntry) => (
            <SpeakingEntry
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

type SpeakingEntryProps = {
  entryIndex: number;
  formik: SpeakingFormik;
  removeEntry: () => void;
};

function SpeakingEntry({
  entryIndex,
  formik,
  removeEntry,
}: SpeakingEntryProps): ReactNode {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const values = formik.values as SpeakingFormValues;
  const images = values.speaking?.[entryIndex]?.images ?? [];

  return (
    <section className="w-full">
      <div
        className={cn(
          "header flex items-center justify-between gap-3",
          entryIndex !== 0 && "border-t-0",
        )}
      >
        <h3>
          <span className="text-muted-foreground font-mono text-sm font-normal">{`${
            entryIndex + 1
          }. `}</span>
          Talk details
        </h3>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label={isCollapsed ? "Expand talk" : "Collapse talk"}
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
            name={`speaking.${entryIndex}.title`}
            placeholder="Event name"
          />
          <TextField
            formik={formik}
            label="Date"
            name={`speaking.${entryIndex}.date`}
            placeholder="January 1st, 2025"
            as="date"
            className="lg:col-span-2 w-[210px]"
          />
          <TextField
            formik={formik}
            label="Location"
            name={`speaking.${entryIndex}.location`}
            placeholder="Jakarta, Indonesia"
          />
          <TextField
            formik={formik}
            label="Subtitle"
            name={`speaking.${entryIndex}.subtitle`}
            description="Include the event, track, or organizer."
            placeholder="Additional context"
            as="textarea"
          />
          <TextField
            formik={formik}
            label="URL"
            name={`speaking.${entryIndex}.url`}
            placeholder="example.com/talk"
            as="url"
          />
          <ImagesField
            formik={formik}
            fieldArrayName={`speaking.${entryIndex}.images`}
            images={images}
            altPrefix={`speaking-${entryIndex + 1}`}
          />
        </div>
      </motion.div>
    </section>
  );
}
