"use client";

import type { FormikProps } from "formik";

import type { ReactNode } from "react";

import { TextField } from "@/components/dashboard/forms/fields";

import type { SectionInitialValuesMap } from "@/lib/schema";

type ProfileFormik = FormikProps<SectionInitialValuesMap["profile"]>;

export function renderProfileSection(formik: ProfileFormik): ReactNode {
  return (
    <div className="w-full space-y-6 border-b-2 border-dashed pb-6">
      <section className="w-full space-y-6">
        <div className="header">
          <h2>Profile basics</h2>
          <p className="text-muted-foreground mt-0.5 text-sm font-normal">
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
      <section className="w-full space-y-6">
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
