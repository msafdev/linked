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

import type {
  SectionInitialValuesMap,
  SideProjectsFormValues,
} from "@/lib/schema";
import { cn } from "@/lib/utils";

type ProjectsFormik = FormikProps<SectionInitialValuesMap["projects"]>;

export function renderProjectsSection(formik: ProjectsFormik): ReactNode {
  return (
    <div className="w-full space-y-6">
      <section className="w-full space-y-6">
        <div className="header">
          <h2>Side projects</h2>
          <p className="text-muted-foreground mt-0.5 text-sm font-normal">
            Highlight your self-initiated work, experiments, and collaborations.
          </p>
        </div>
        <CollectionField
          formik={formik}
          name="projects"
          emptyEntryKey="sideProjects"
          entryTitle="Project"
          addButtonLabel="Add project"
          renderEntryAction={(entryIndex, removeEntry) => (
            <ProjectEntry
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

type ProjectEntryProps = {
  entryIndex: number;
  formik: ProjectsFormik;
  removeEntry: () => void;
};

function ProjectEntry({
  entryIndex,
  formik,
  removeEntry,
}: ProjectEntryProps): ReactNode {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const values = formik.values as SideProjectsFormValues;
  const images = values.projects?.[entryIndex]?.images ?? [];

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
          Project overview
        </h3>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label={isCollapsed ? "Expand project" : "Collapse project"}
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
            name={`projects.${entryIndex}.title`}
            placeholder="Project name"
          />
          <TextField
            formik={formik}
            label="Year"
            name={`projects.${entryIndex}.year`}
            placeholder="January 1st, 2024"
            as="date"
            className="lg:col-span-4 w-[210px]"
          />
          <TextField
            formik={formik}
            label="URL"
            name={`projects.${entryIndex}.url`}
            placeholder="project.com"
            as="url"
          />
          <TextField
            formik={formik}
            label="Subtitle"
            name={`projects.${entryIndex}.subtitle`}
            description="Share context about your role, collaborators, or impact."
            placeholder="Additional context"
            as="textarea"
          />
          <ImagesField
            formik={formik}
            fieldArrayName={`projects.${entryIndex}.images`}
            images={images}
            altPrefix={`project-${entryIndex + 1}`}
          />
        </div>
      </motion.div>
    </section>
  );
}
