import type { Country } from "@/types/country";

export type ExternalLink = {
  label: string;
  url: string;
};

export type DateRange = {
  from: string;
  to?: string;
};

export type MediaResource = {
  src: string;
  alt: string;
};

export type Profile = {
  name: string;
  title: string;
  location: string;
  about: string;
  website?: ExternalLink;
  avatar?: MediaResource[] | null;
};

export type WorkEntry = {
  role: string;
  company: string;
  location: Country["value"];
  range: DateRange;
  url?: string;
  images?: MediaResource[];
};

export type WritingEntry = {
  title: string;
  year: number;
  subtitle?: string;
  url?: string;
  images?: MediaResource[];
};

export type SpeakingEntry = {
  title: string;
  date: string;
  location: string;
  subtitle?: string;
  url?: string;
  images?: MediaResource[];
};

export type SideProjectEntry = {
  title: string;
  year: number;
  subtitle?: string;
  url?: string;
  images?: MediaResource[];
};

export type EducationEntry = {
  degree: string;
  school: string;
  location: string;
  range: DateRange;
};

export type ContactEntry = {
  label: string;
  value: string;
  url?: string;
};

export type BillingStatus = "active" | "trial" | "past_due";

export type Settings = {
  domain: string;
  billingStatus: BillingStatus;
};

export type ReadCV = {
  id: string;
  profile: Profile;
  work: WorkEntry[];
  writing: WritingEntry[];
  speaking: SpeakingEntry[];
  sideProjects: SideProjectEntry[];
  education: EducationEntry[];
  contact: ContactEntry[];
  settings: Settings;
};

export const READ_CV_DATA: Record<string, ReadCV> = {
  msafdev: {
    id: "msafdev",
    profile: {
      name: "Salman Alfarisi",
      title: "Product Designer",
      location: "id",
      about:
        "Product designer focusing on AI-assisted workflows, practical systems, and shipping velocity for lean teams.",
      website: {
        label: "website.com",
        url: "https://salmoon.vercel.app",
      },
      avatar: [
        {
          src: "/images/placeholder.webp",
          alt: "Salman Alfarisi",
        },
      ],
    },
    work: [
      {
        role: "Senior Product Designer",
        company: "Atlas Labs",
        location: "San Francisco, CA",
        range: { from: "2023-01-01" },
        url: "https://atlaslabs.ai",
        images: [
          { src: "/images/placeholder.webp", alt: "Placeholder" },
          { src: "/images/placeholder.webp", alt: "Placeholder" },
        ],
      },
    ],
    writing: [
      {
        title: "Designing With Guardrails",
        year: 2024,
        subtitle: "Collaboration with Mia Rahma and Dimas Putra",
        url: "https://read.cv/msafdev",
        images: [{ src: "/images/placeholder.webp", alt: "Placeholder" }],
      },
    ],
    speaking: [
      {
        title: "Designing With Guardrails",
        date: "2024",
        location: "San Francisco, CA",
        subtitle: "Config 2024",
        url: "https://read.cv/config-2024",
        images: [
          { src: "/images/placeholder.webp", alt: "Placeholder" },
          { src: "/images/placeholder.webp", alt: "Placeholder" },
        ],
      },
    ],
    sideProjects: [
      {
        title: "Nature Walks",
        year: 2021,
        subtitle: "Photo journal exploring city greens",
        images: [
          { src: "/images/placeholder.webp", alt: "Placeholder" },
          { src: "/images/placeholder.webp", alt: "Placeholder" },
        ],
      },
      {
        title: "Interactive Art Installation",
        year: 2020,
        subtitle: "Collaboration with Kinetic Studio",
      },
    ],
    education: [
      {
        degree: "MFA Interaction Design",
        school: "School of Visual Arts",
        location: "New York, NY",
        range: { from: "2018-01-01", to: "2020-12-31" },
      },
      {
        degree: "BFA Graphic Design",
        school: "University of Toronto",
        location: "Toronto, ON",
        range: { from: "2014-01-01", to: "2018-12-31" },
      },
    ],
    contact: [
      { label: "Threads", value: "@salmoon", url: "https://example.com" },
      { label: "Instagram", value: "@salmoon.design", url: "https://example.com" },
      { label: "Twitter", value: "@salmoon", url: "https://example.com" },
      { label: "Email", value: "msafdev@example.com", url: "mailto:msafdev@example.com" },
    ],
    settings: {
      domain: "salmoon",
      billingStatus: "active",
    },
  },
};

export const DEFAULT_USER_ID = "msafdev";

export function getReadCvById(id: string): ReadCV | null {
  return READ_CV_DATA[id] ?? null;
}

export function getAllReadCvIds(): string[] {
  return Object.keys(READ_CV_DATA);
}

export const LINK: ReadCV = READ_CV_DATA[DEFAULT_USER_ID];

export const SITE_BASE_URL = "https://site.com";

export function getLiveSiteUrl(domain: string): string {
  const cleaned = domain.trim().replace(/^\//, "").replace(/\/+$/g, "");
  if (cleaned.length === 0) {
    return SITE_BASE_URL;
  }
  return `${SITE_BASE_URL}/${cleaned}`;
}
