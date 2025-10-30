import { z } from "zod";

import { LINK } from "@/constant";
import type { DashboardState } from "./dashboard-config";

const optionalUrlSchema = z
  .string()
  .or(z.literal(""))
  .optional()
  .transform((value) => value ?? "");

const optionalStringSchema = z
  .string()
  .optional()
  .transform((value) => value ?? "");

const imageSchema = z.object({
  src: z.string().min(1, "Image source is required"),
  alt: optionalStringSchema,
});

export type ImageFormValues = z.infer<typeof imageSchema>;

const avatarSchema = z.object({
  src: optionalStringSchema,
  alt: optionalStringSchema,
});

export const profileSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    title: z.string().min(1, "Title is required"),
    location: z.string().min(1, "Location is required"),
    about: z.string().min(1, "About is required"),
    website: z.object({
      label: optionalStringSchema,
      url: optionalUrlSchema,
    }),
    avatar: avatarSchema,
  })
  .superRefine(({ website }, ctx) => {
    const hasLabel = website.label.trim().length > 0;
    const hasUrl = website.url.trim().length > 0;
    if (hasLabel !== hasUrl) {
      ctx.addIssue({
        path: ["website"],
        code: z.ZodIssueCode.custom,
        message: "Website label and URL must both be provided.",
      });
    }
  });

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const profileInitialValues: ProfileFormValues = {
  name: LINK.profile.name ?? "",
  title: LINK.profile.title ?? "",
  location: LINK.profile.location ?? "",
  about: LINK.profile.about ?? "",
  website: {
    label: LINK.profile.website?.label ?? "",
    url: LINK.profile.website?.url ?? "",
  },
  avatar: {
    src: LINK.profile.avatar?.src ?? "",
    alt: LINK.profile.avatar?.alt ?? "",
  },
};

const workRangeSchema = z.object({
  from: z.string().min(1, "Start date is required"),
  to: optionalStringSchema,
});

const workEntrySchema = z.object({
  role: z.string().min(1, "Role is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().min(1, "Location is required"),
  range: workRangeSchema,
  url: optionalUrlSchema,
  images: z.array(imageSchema).default([]),
});

export type WorkEntryFormValues = z.infer<typeof workEntrySchema>;

export const workSchema = z.object({
  work: z.array(workEntrySchema).min(1, "Add at least one role"),
});

export type WorkFormValues = z.infer<typeof workSchema>;

export const workInitialValues: WorkFormValues = {
  work: LINK.work.map((entry) => ({
    role: entry.role ?? "",
    company: entry.company ?? "",
    location: entry.location ?? "",
    range: {
      from: entry.range.from ?? "",
      to: entry.range.to ?? "",
    },
    url: entry.url ?? "",
    images:
      entry.images?.map((image) => ({
        src: image.src ?? "",
        alt: image.alt ?? "",
      })) ?? [],
  })),
};

const listEntryBase = {
  title: z.string().min(1, "Title is required"),
  subtitle: optionalStringSchema,
  url: optionalUrlSchema,
};

const writingEntrySchema = z.object({
  ...listEntryBase,
  year: z.string().min(1, "Year is required"),
  images: z.array(imageSchema).default([]),
});

export type WritingEntryFormValues = z.infer<typeof writingEntrySchema>;

export const writingSchema = z.object({
  writing: z.array(writingEntrySchema).min(1, "Add at least one entry"),
});

export type WritingFormValues = z.infer<typeof writingSchema>;

export const writingInitialValues: WritingFormValues = {
  writing: LINK.writing.map((entry) => ({
    title: entry.title ?? "",
    year: entry.year?.toString() ?? "",
    subtitle: entry.subtitle ?? "",
    url: entry.url ?? "",
    images:
      entry.images?.map((image) => ({
        src: image.src ?? "",
        alt: image.alt ?? "",
      })) ?? [],
  })),
};

const speakingEntrySchema = z.object({
  ...listEntryBase,
  date: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location is required"),
  images: z.array(imageSchema).default([]),
});

export type SpeakingEntryFormValues = z.infer<typeof speakingEntrySchema>;

export const speakingSchema = z.object({
  speaking: z.array(speakingEntrySchema).min(1, "Add at least one entry"),
});

export type SpeakingFormValues = z.infer<typeof speakingSchema>;

export const speakingInitialValues: SpeakingFormValues = {
  speaking: LINK.speaking.map((entry) => ({
    title: entry.title ?? "",
    subtitle: entry.subtitle ?? "",
    url: entry.url ?? "",
    date: entry.date ?? "",
    location: entry.location ?? "",
    images:
      entry.images?.map((image) => ({
        src: image.src ?? "",
        alt: image.alt ?? "",
      })) ?? [],
  })),
};

const sideProjectEntrySchema = z.object({
  ...listEntryBase,
  year: z.string().min(1, "Year is required"),
  images: z.array(imageSchema).default([]),
});

export type SideProjectEntryFormValues = z.infer<typeof sideProjectEntrySchema>;

export const sideProjectsSchema = z.object({
  sideProjects: z.array(sideProjectEntrySchema).min(0),
});

export type SideProjectsFormValues = z.infer<typeof sideProjectsSchema>;

export const sideProjectsInitialValues: SideProjectsFormValues = {
  sideProjects:
    LINK.sideProjects?.map((entry) => ({
      title: entry.title ?? "",
      year: entry.year?.toString() ?? "",
      subtitle: entry.subtitle ?? "",
      url: entry.url ?? "",
      images:
        entry.images?.map((image) => ({
          src: image.src ?? "",
          alt: image.alt ?? "",
        })) ?? [],
    })) ?? [],
};

const educationEntrySchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  school: z.string().min(1, "School is required"),
  location: z.string().min(1, "Location is required"),
  range: workRangeSchema,
});

export type EducationEntryFormValues = z.infer<typeof educationEntrySchema>;

export const educationSchema = z.object({
  education: z.array(educationEntrySchema).min(1, "Add at least one entry"),
});

export type EducationFormValues = z.infer<typeof educationSchema>;

export const educationInitialValues: EducationFormValues = {
  education: LINK.education.map((entry) => ({
    degree: entry.degree ?? "",
    school: entry.school ?? "",
    location: entry.location ?? "",
    range: {
      from: entry.range.from ?? "",
      to: entry.range.to ?? "",
    },
  })),
};

const contactEntrySchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
  url: optionalUrlSchema,
});

export type ContactEntryFormValues = z.infer<typeof contactEntrySchema>;

export const contactSchema = z.object({
  contact: z.array(contactEntrySchema).min(1, "Add at least one entry"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export const contactInitialValues: ContactFormValues = {
  contact: LINK.contact.map((entry) => ({
    label: entry.label ?? "",
    value: entry.value ?? "",
    url: entry.url ?? "",
  })),
};

export const sectionSchemas: Record<DashboardState, z.ZodTypeAny> = {
  profile: profileSchema,
  work: workSchema,
  writing: writingSchema,
  speaking: speakingSchema,
  projects: sideProjectsSchema,
  education: educationSchema,
  contact: contactSchema,
};

export type SectionFormValuesMap = {
  profile: ProfileFormValues;
  work: WorkFormValues;
  writing: WritingFormValues;
  speaking: SpeakingFormValues;
  projects: SideProjectsFormValues;
  education: EducationFormValues;
  contact: ContactFormValues;
};

export const sectionInitialValues: SectionFormValuesMap = {
  profile: profileInitialValues,
  work: workInitialValues,
  writing: writingInitialValues,
  speaking: speakingInitialValues,
  projects: sideProjectsInitialValues,
  education: educationInitialValues,
  contact: contactInitialValues,
};

export const emptyEntryFactories = {
  work: (): WorkEntryFormValues => ({
    role: "",
    company: "",
    location: "",
    range: { from: "", to: "" },
    url: "",
    images: [],
  }),
  image: (): ImageFormValues => ({
    src: "",
    alt: "",
  }),
  writing: (): WritingEntryFormValues => ({
    title: "",
    year: "",
    subtitle: "",
    url: "",
    images: [],
  }),
  speaking: (): SpeakingEntryFormValues => ({
    title: "",
    subtitle: "",
    url: "",
    date: "",
    location: "",
    images: [],
  }),
  sideProjects: (): SideProjectEntryFormValues => ({
    title: "",
    year: "",
    subtitle: "",
    url: "",
    images: [],
  }),
  education: (): EducationEntryFormValues => ({
    degree: "",
    school: "",
    location: "",
    range: { from: "", to: "" },
  }),
  contact: (): ContactEntryFormValues => ({
    label: "",
    value: "",
    url: "",
  }),
} satisfies Record<string, () => unknown>;

export type SectionInitialValuesMap = typeof sectionInitialValues;
