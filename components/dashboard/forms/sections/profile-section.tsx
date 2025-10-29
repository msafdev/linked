"use client";

import type { FormikProps } from "formik";
import type { ReactNode } from "react";

import { TextField } from "../fields";
import type { SectionInitialValuesMap } from "@/lib/dashboard-forms";

type ProfileFormik = FormikProps<SectionInitialValuesMap["profile"]>;

export function renderProfileSection(formik: ProfileFormik): ReactNode {
  return (
    <div className="space-y-6">
      <section className="space-y-6">
        <h2 className="header">Profile basics</h2>
        <TextField formik={formik} label="Name" name="name" />
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
          placeholder="https://example.com"
          as="url"
        />
      </section>
      <section className="space-y-6">
        <h2 className="header">About you</h2>
        <TextField
          formik={formik}
          label="About"
          name="about"
          as="textarea"
          description="Share what you do, the problems you love solving, and what makes your work unique."
        />
      </section>
    </div>
  );
}
