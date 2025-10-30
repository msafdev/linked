"use client";

import { motion } from "motion/react";
import { type FormikProps } from "formik";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { CollectionField, TextField } from "../fields";
import {
  type SectionInitialValuesMap,
  type WorkFormValues,
} from "@/lib/dashboard-forms";
import { ImagesField } from "@/components/input/images-field";
import { PiCaretDownBold, PiCaretUpBold, PiTrashDuotone } from "react-icons/pi";
import { cn } from "@/lib/utils";
import {
  COLLAPSE_TRANSITION,
  COLLAPSE_VARIANTS,
} from "./collapsible";

type WorkFormik = FormikProps<SectionInitialValuesMap["work"]>;

export function renderWorkSection(formik: WorkFormik): ReactNode {
  return (
    <div className="space-y-6 w-full">
      <section className="space-y-6 w-full">
        <div className="header">
          <h2>Work experience</h2>
          <p className="text-sm text-muted-foreground font-normal mt-0.5">
            List your previous roles and relevant work experience.
          </p>
        </div>
        <CollectionField
          formik={formik}
          name="work"
          emptyEntryKey="work"
          entryTitle="Work"
          renderEntryHeader={() => null}
          renderEntry={(entryIndex, removeEntry) => (
            <WorkEntry
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

type WorkEntryProps = {
  entryIndex: number;
  formik: WorkFormik;
  removeEntry: () => void;
};

function WorkEntry({ entryIndex, formik, removeEntry }: WorkEntryProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const values = formik.values as WorkFormValues;
  const images = values.work?.[entryIndex]?.images ?? [];

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
          Job overview
        </h3>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label={isCollapsed ? "Expand role" : "Collapse role"}
            onClick={() => {
              setIsCollapsed((previous) => !previous);
            }}
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
        <div className="flex flex-col gap-6">
          <TextField
            formik={formik}
            label="Role"
            name={`work.${entryIndex}.role`}
            placeholder="Fullstack Developer"
          />
          <TextField
            formik={formik}
            label="Company"
            name={`work.${entryIndex}.company`}
            placeholder="Example Inc."
            className="md:col-span-2"
          />
          <TextField
            formik={formik}
            label="Location"
            name={`work.${entryIndex}.location`}
            placeholder="Jakarta, Indonesia"
            className="md:col-span-2"
          />
          <TextField
            formik={formik}
            label="Company Website"
            name={`work.${entryIndex}.url`}
            placeholder="company.com"
            as="url"
          />
          <section className="space-y-6 w-full">
            <h3 className="header">Timeline</h3>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <TextField
                formik={formik}
                label="Start"
                name={`work.${entryIndex}.range.from`}
                placeholder="From"
                as="date"
                className="lg:col-span-4"
              />
              <TextField
                formik={formik}
                label="End"
                name={`work.${entryIndex}.range.to`}
                placeholder="Present"
                as="date"
                className="lg:col-span-4"
              />
            </div>
          </section>
          <ImagesField
            formik={formik}
            fieldArrayName={`work.${entryIndex}.images`}
            images={images}
          />
        </div>
      </motion.div>
    </section>
  );
}
