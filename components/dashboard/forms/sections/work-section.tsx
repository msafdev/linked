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
import { ImagesField } from "@/components/input/images-field";

import {
  type SectionInitialValuesMap,
  type WorkFormValues,
} from "@/lib/schema";
import { cn } from "@/lib/utils";

type WorkFormik = FormikProps<SectionInitialValuesMap["work"]>;

export function renderWorkSection(formik: WorkFormik): ReactNode {
  return (
    <div className="w-full space-y-6">
      <section className="w-full space-y-6">
        <div className="header">
          <h2>Work experience</h2>
          <p className="text-muted-foreground mt-0.5 text-sm font-normal">
            List your previous roles and relevant work experience.
          </p>
        </div>
        <CollectionField
          formik={formik}
          name="work"
          emptyEntryKey="work"
          entryTitle="Work"
          renderEntryHeaderAction={() => null}
          renderEntryAction={(entryIndex, removeEntry) => (
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
  const endFieldPath = `work.${entryIndex}.range.to` as const;
  const isPresent = getIn(formik.values, endFieldPath) === null;
  const presentCheckboxId = `work-${entryIndex}-present`;

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
          <section className="w-full space-y-6">
            <h3 className="header">Timeline</h3>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <TextField
                formik={formik}
                label="Start"
                name={`work.${entryIndex}.range.from`}
                placeholder="From"
                as="date"
                className="w-[210px] lg:col-span-5"
              />
              <TextField
                formik={formik}
                label="End"
                name={endFieldPath}
                placeholder="Present"
                as="date"
                disabled={isPresent}
                className="w-[210px] lg:col-span-5"
              />
              <div className="flex items-center gap-2 lg:col-span-4">
                <Checkbox
                  id={presentCheckboxId}
                  checked={isPresent}
                  onCheckedChange={handlePresentToggle}
                  aria-label="Mark role as ongoing"
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
