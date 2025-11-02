"use client";

import { type FormikProps, getIn } from "formik";
import { motion } from "motion/react";

import { PiCaretDownBold, PiCaretUpBold, PiTrashDuotone } from "react-icons/pi";

import { type ReactNode, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import {
  COLLAPSE_TRANSITION,
  COLLAPSE_VARIANTS,
} from "@/components/dashboard/collapsible";
import {
  CollectionField,
  TextField,
} from "@/components/dashboard/forms/fields";

import type { SectionInitialValuesMap } from "@/lib/schema";
import { cn } from "@/lib/utils";

type EducationFormik = FormikProps<SectionInitialValuesMap["education"]>;

export function renderEducationSection(formik: EducationFormik): ReactNode {
  return (
    <div className="w-full space-y-6">
      <section className="w-full space-y-6">
        <div className="header">
          <h2>Education</h2>
          <p className="text-muted-foreground mt-0.5 text-sm font-normal">
            Document your academic background and formal training.
          </p>
        </div>
        <CollectionField
          formik={formik}
          name="education"
          emptyEntryKey="education"
          entryTitle="Education"
          renderEntryAction={(entryIndex, removeEntry) => (
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
  const endFieldPath = `education.${entryIndex}.range.to` as const;
  const isPresent = getIn(formik.values, endFieldPath) === null;
  const presentCheckboxId = `education-${entryIndex}-present`;

  const handlePresentToggle = (checked: boolean | "indeterminate") => {
    const nextChecked = checked === true;
    formik.setFieldTouched(endFieldPath, true, false);
    formik.setFieldError(endFieldPath, undefined);

    if (nextChecked) {
      formik.setFieldValue(endFieldPath, null);
    } else {
      formik.setFieldValue(endFieldPath, "");
    }
  };

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
          <section className="w-full space-y-6 border-b-2 border-dashed pb-6">
            <h3 className="header">Timeline</h3>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <TextField
                formik={formik}
                label="Start"
                name={`education.${entryIndex}.range.from`}
                placeholder="From"
                as="date"
                className="lg:col-span-5 w-[210px]"
              />
              <TextField
                formik={formik}
                label="End"
                name={endFieldPath}
                placeholder="Present"
                as="date"
                disabled={isPresent}
                className="lg:col-span-5 w-[210px]"
              />
              <div className="lg:col-span-5 flex items-center gap-2">
                <Checkbox
                  id={presentCheckboxId}
                  checked={isPresent}
                  onCheckedChange={handlePresentToggle}
                  aria-label="Mark education as ongoing"
                />
                <Label
                  htmlFor={presentCheckboxId}
                  className="text-sm font-medium"
                >
                  Present
                </Label>
              </div>
            </div>
          </section>
        </div>
      </motion.div>
    </section>
  );
}
