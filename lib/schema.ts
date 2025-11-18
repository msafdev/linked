import { z } from "zod";

import type { DashboardState } from "@/lib/config";
import type { ReadCV } from "@/types/cv";
import {
  DEFAULT_PORTFOLIO_TEMPLATE_ID,
  PORTFOLIO_TEMPLATE_IDS,
} from "@/types/portfolio-template";

const optionalUrlSchema = z
  .string()
  .or(z.literal(""))
  .optional()
  .transform((value) => value ?? "");

const optionalStringSchema = z
  .union([z.string(), z.null()])
  .optional()
  .transform((value) => value ?? "");

const imageSchema = z.object({
  src: z.string().min(1, "Image source is required"),
  alt: optionalStringSchema,
  storagePath: optionalStringSchema,
});

export type ImageFormValues = z.infer<typeof imageSchema>;

const avatarSchema = z.object({
  src: optionalStringSchema,
  alt: optionalStringSchema,
});

export const profileSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(32, "Name must be 32 characters or fewer"),
    title: z
      .string()
      .min(1, "Title is required")
      .max(32, "Title must be 32 characters or fewer"),
    location: z.string().min(1, "Location is required"),
    about: z
      .string()
      .min(1, "About is required")
      .max(500, "About must be 500 characters or fewer"),
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

const sideProjectEntrySchema = z.object({
  ...listEntryBase,
  year: z.string().min(1, "Year is required"),
  images: z.array(imageSchema).default([]),
});

export type SideProjectEntryFormValues = z.infer<typeof sideProjectEntrySchema>;

export const sideProjectsSchema = z.object({
  projects: z.array(sideProjectEntrySchema).min(1, "Add at least one entry"),
});

export type SideProjectsFormValues = z.infer<typeof sideProjectsSchema>;

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

const domainRegex = /^[a-zA-Z0-9]+$/;

const settingsSchema = z.object({
  domain: z
    .string()
    .min(3, "Domain must be at least 3 characters")
    .max(16, "Domain must be 16 characters or fewer")
    .regex(domainRegex, "Only letters and numbers are allowed"),
  billingStatus: z.string().min(1),
  billingType: z.string().min(1),
  template: z.enum(PORTFOLIO_TEMPLATE_IDS),
  isPublic: z.boolean(),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;

export const sectionSchemas: Record<DashboardState, z.ZodTypeAny> = {
  profile: profileSchema,
  work: workSchema,
  writing: writingSchema,
  speaking: speakingSchema,
  projects: sideProjectsSchema,
  education: educationSchema,
  contact: contactSchema,
  settings: settingsSchema,
};

export type SectionFormValuesMap = {
  profile: ProfileFormValues;
  work: WorkFormValues;
  writing: WritingFormValues;
  speaking: SpeakingFormValues;
  projects: SideProjectsFormValues;
  education: EducationFormValues;
  contact: ContactFormValues;
  settings: SettingsFormValues;
};

function normalizeAvatarSource(avatar: ReadCV["profile"]["avatar"]): {
  src: string;
  alt: string;
  storagePath: string;
} {
  const avatarArray = Array.isArray(avatar) ? avatar : avatar ? [avatar] : [];
  const firstAvatar = avatarArray[0] ?? null;
  return {
    src: firstAvatar?.src ?? "",
    alt: firstAvatar?.alt ?? "",
    storagePath:
      typeof (firstAvatar as { storagePath?: string })?.storagePath === "string"
        ? ((firstAvatar as { storagePath?: string }).storagePath ?? "")
        : "",
  };
}

function mapImages(
  images: ReadCV["work"][number]["images"] | undefined,
): ImageFormValues[] {
  return (
    images?.map((image) => ({
      src: image?.src ?? "",
      alt: image?.alt ?? "",
      storagePath:
        typeof (image as { storagePath?: string })?.storagePath === "string"
          ? ((image as { storagePath?: string }).storagePath ?? "")
          : "",
    })) ?? []
  );
}

function toYearString(value: number | undefined | null): string {
  return value !== undefined && value !== null ? String(value) : "";
}

export function createProfileInitialValues(data: ReadCV): ProfileFormValues {
  const avatar = normalizeAvatarSource(data.profile.avatar);
  return {
    name: data.profile.name ?? "",
    title: data.profile.title ?? "",
    location: data.profile.location ?? "",
    about: data.profile.about ?? "",
    website: {
      label: data.profile.website?.label ?? "",
      url: data.profile.website?.url ?? "",
    },
    avatar,
  };
}

export function createWorkInitialValues(data: ReadCV): WorkFormValues {
  return {
    work:
      data.work?.map((entry) => ({
        role: entry.role ?? "",
        company: entry.company ?? "",
        location: entry.location ?? "",
        range: {
          from: entry.range.from ?? "",
          to: entry.range.to ?? "",
        },
        url: entry.url ?? "",
        images: mapImages(entry.images),
      })) ?? [],
  };
}

export function createWritingInitialValues(data: ReadCV): WritingFormValues {
  return {
    writing:
      data.writing?.map((entry) => ({
        title: entry.title ?? "",
        year: toYearString(entry.year),
        subtitle: entry.subtitle ?? "",
        url: entry.url ?? "",
        images: mapImages(entry.images),
      })) ?? [],
  };
}

export function createSpeakingInitialValues(data: ReadCV): SpeakingFormValues {
  return {
    speaking:
      data.speaking?.map((entry) => ({
        title: entry.title ?? "",
        date: entry.date ?? "",
        location: entry.location ?? "",
        subtitle: entry.subtitle ?? "",
        url: entry.url ?? "",
        images: mapImages(entry.images),
      })) ?? [],
  };
}

export function createSideProjectsInitialValues(
  data: ReadCV,
): SideProjectsFormValues {
  return {
    projects:
      data.sideProjects?.map((entry) => ({
        title: entry.title ?? "",
        year: toYearString(entry.year),
        subtitle: entry.subtitle ?? "",
        url: entry.url ?? "",
        images: mapImages(entry.images),
      })) ?? [],
  };
}

export function createEducationInitialValues(
  data: ReadCV,
): EducationFormValues {
  return {
    education:
      data.education?.map((entry) => ({
        degree: entry.degree ?? "",
        school: entry.school ?? "",
        location: entry.location ?? "",
        range: {
          from: entry.range.from ?? "",
          to: entry.range.to ?? "",
        },
      })) ?? [],
  };
}

export function createContactInitialValues(data: ReadCV): ContactFormValues {
  return {
    contact:
      data.contact?.map((entry) => ({
        label: entry.label ?? "",
        value: entry.value ?? "",
        url: entry.url ?? "",
      })) ?? [],
  };
}

const sanitizeDomainValue = (value?: string | null): string => {
  if (!value) {
    return "";
  }

  const sanitized = value
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 32);
  return sanitized;
};

export function createSettingsInitialValues(data: ReadCV): SettingsFormValues {
  const existingDomain = sanitizeDomainValue(data.settings?.domain);
  const derivedDomain =
    existingDomain ||
    sanitizeDomainValue(data.profile?.name) ||
    sanitizeDomainValue(data.settings?.domain) ||
    sanitizeDomainValue(data.id);

  return {
    domain: derivedDomain,
    billingStatus: data.settings?.billingStatus ?? "trial",
    billingType: data.settings?.billingType ?? "free",
    template: data.settings?.template ?? DEFAULT_PORTFOLIO_TEMPLATE_ID,
    isPublic: data.settings?.isPublic ?? true,
  };
}

export function createSectionInitialValues(data: ReadCV): SectionFormValuesMap {
  return {
    profile: createProfileInitialValues(data),
    work: createWorkInitialValues(data),
    writing: createWritingInitialValues(data),
    speaking: createSpeakingInitialValues(data),
    projects: createSideProjectsInitialValues(data),
    education: createEducationInitialValues(data),
    contact: createContactInitialValues(data),
    settings: createSettingsInitialValues(data),
  };
}

const EMPTY_READ_CV: ReadCV = {
  id: "",
  profile: {
    name: "",
    title: "",
    location: "",
    about: "",
    website: undefined,
    avatar: [],
  },
  work: [],
  writing: [],
  speaking: [],
  sideProjects: [],
  education: [],
  contact: [],
  settings: {
    domain: "",
    billingStatus: "trial",
    billingType: "free",
    template: DEFAULT_PORTFOLIO_TEMPLATE_ID,
    isPublic: true,
  },
};

export const defaultSectionInitialValues =
  createSectionInitialValues(EMPTY_READ_CV);

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
    storagePath: "",
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

export type SectionInitialValuesMap = SectionFormValuesMap;
