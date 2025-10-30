"use client";

import type { FormikProps } from "formik";
import type { ReactNode } from "react";

import { TextField } from "../fields";
import type { SectionInitialValuesMap } from "@/lib/dashboard-forms";

type ProfileFormik = FormikProps<SectionInitialValuesMap["profile"]>;

export function renderProfileSection(formik: ProfileFormik): ReactNode {
  return (
    <div className="space-y-6 w-full border-b-2 border-dashed pb-6">
      <section className="space-y-6 w-full">
        <div className="header">
          <h2>Profile basics</h2>
          <p className="text-sm text-muted-foreground font-normal mt-0.5">
            Share some basic information about yourself.
          </p>
        </div>
        <TextField formik={formik} label="Name" name="name" />
        <TextField
          formik={formik}
          label="Profile picture"
          name="avatar.src"
          as="avatar"
        />
        <TextField
          formik={formik}
          label="Title"
          name="title"
          className="col-span-full md:col-span-2"
        />
        <TextField
          formik={formik}
          label="Location"
          name="location"
          as="country"
        />
        <h2 className="header">Website</h2>
        <TextField
          formik={formik}
          label="Label"
          name="website.label"
          placeholder="Portfolio"
          className="col-span-full md:col-span-2"
        />
        <TextField
          formik={formik}
          label="URL"
          name="website.url"
          placeholder="example.com"
          as="url"
        />
      </section>
      <section className="space-y-6 w-full">
        <h2 className="header">Summary</h2>
        <TextField
          formik={formik}
          label="About"
          name="about"
          as="textarea"
          description="Let people know more about you. Share your interests, passions, and what drives you."
          placeholder="Write something short"
        />
      </section>
    </div>
  );
}
