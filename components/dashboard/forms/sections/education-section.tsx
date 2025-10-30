"use client";

import { motion } from "motion/react";
import type { FormikProps } from "formik";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { CollectionField, TextField } from "../fields";
import type { SectionInitialValuesMap } from "@/lib/dashboard-forms";
import { PiCaretDownBold, PiCaretUpBold, PiTrashDuotone } from "react-icons/pi";
import { cn } from "@/lib/utils";
import { COLLAPSE_TRANSITION, COLLAPSE_VARIANTS } from "./collapsible";

type EducationFormik = FormikProps<SectionInitialValuesMap["education"]>;

export function renderEducationSection(formik: EducationFormik): ReactNode {
  return (
    <div className="space-y-6 w-full">
      <section className="space-y-6 w-full">
        <div className="header">
          <h2>Education</h2>
          <p className="text-sm text-muted-foreground font-normal mt-0.5">
            Document your academic background and formal training.
          </p>
        </div>
        <CollectionField
          formik={formik}
          name="education"
          emptyEntryKey="education"
          entryTitle="Education"
          renderEntry={(entryIndex, removeEntry) => (
            <EducationEntry
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

type EducationEntryProps = {
  entryIndex: number;
  formik: EducationFormik;
  removeEntry: () => void;
};

function EducationEntry({
  entryIndex,
  formik,
  removeEntry,
}: EducationEntryProps): ReactNode {
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
          <span className="font-mono text-muted-foreground text-sm font-normal">{`${
            entryIndex + 1
          }. `}</span>
          Program details
        </h3>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label={isCollapsed ? "Expand education" : "Collapse education"}
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
            label="Degree"
            name={`education.${entryIndex}.degree`}
            placeholder="Program or certification"
          />
          <TextField
            formik={formik}
            label="School"
            name={`education.${entryIndex}.school`}
            placeholder="Institution name"
          />
          <TextField
            formik={formik}
            label="Location"
            name={`education.${entryIndex}.location`}
            placeholder="Jakarta, Indonesia"
          />
          <section className="space-y-6 w-full pb-6 border-b-2 border-dashed">
            <h3 className="header">Timeline</h3>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <TextField
                formik={formik}
                label="Start"
                name={`education.${entryIndex}.range.from`}
                placeholder="From"
                as="date"
                className="lg:col-span-4"
              />
              <TextField
                formik={formik}
                label="End"
                name={`education.${entryIndex}.range.to`}
                placeholder="Present"
                as="date"
                className="lg:col-span-4"
              />
            </div>
          </section>
        </div>
      </motion.div>
    </section>
  );
}
