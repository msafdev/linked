"use client";

import { motion } from "motion/react";
import type { FormikProps } from "formik";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { CollectionField, TextField } from "../fields";
import type { SectionInitialValuesMap } from "@/lib/dashboard-forms";
import { PiCaretDownBold, PiCaretUpBold, PiTrashDuotone } from "react-icons/pi";
import { cn } from "@/lib/utils";
import {
  COLLAPSE_TRANSITION,
  COLLAPSE_VARIANTS,
} from "./collapsible";

type ContactFormik = FormikProps<SectionInitialValuesMap["contact"]>;

export function renderContactSection(formik: ContactFormik): ReactNode {
  return (
    <div className="space-y-6 w-full">
      <section className="space-y-6 w-full">
        <div className="header">
          <h2>Contact methods</h2>
          <p className="text-sm text-muted-foreground font-normal mt-0.5">
            Add ways for people to reach you across platforms.
          </p>
        </div>
        <CollectionField
          formik={formik}
          name="contact"
          emptyEntryKey="contact"
          entryTitle="Contact"
          renderEntry={(entryIndex, removeEntry) => (
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

  return (
    <section className="w-full">
      <div
        className={cn(
          "header flex items-center justify-between gap-3",
          entryIndex !== 0 && "border-t-0"
        )}
      >
        <h3>
          <span className="font-mono text-muted-foreground text-sm">{`${
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
        className="overflow-hidden"
        style={{ pointerEvents: isCollapsed ? "none" : "auto" }}
      >
        <div className="space-y-6 border-b-2 border-dashed pb-6">
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
          <TextField
            formik={formik}
            label="URL"
            name={`contact.${entryIndex}.url`}
            placeholder="mailto:you@example.com"
          />
        </div>
      </motion.div>
    </section>
  );
}
