import { Country } from "./types/country";

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

export type ReadCV = {
  id: string;
  profile: Profile;
  work: WorkEntry[];
  writing: WritingEntry[];
  speaking: SpeakingEntry[];
  sideProjects: SideProjectEntry[];
  education: EducationEntry[];
  contact: ContactEntry[];
};

export const LINK: ReadCV = {
  id: "bfc74a00-3173-49d3-b891-e3d86101c1ac",
  profile: {
    name: "Salman Alfarisi",
    title: "Product Designer",
    location: "id",
    about:
      "Product designer focusing on AI-assisted workflows, practical systems, and shipping velocity for lean teams.",
    website: {
      label: "website.com",
      url: "salmoon.vercel.app",
    },
  },
  work: [
    {
      role: "Senior Product Designer",
      company: "Atlas Labs",
      location: "San Francisco, CA",
      range: { from: "2023-01-01" },
      url: "atlaslabs.ai",
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
      url: "read.cv/msafdev",
    },
  ],
  speaking: [
    {
      title: "Designing With Guardrails",
      date: "2024",
      location: "San Francisco, CA",
      subtitle: "Config 2024",
      url: "read.cv/config-2024",
    },
  ],
  sideProjects: [
    {
      title: "Nature Walks",
      year: 2021,
      subtitle: "Photo journal exploring city greens",
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
    { label: "Threads", value: "@salmoon" },
    { label: "Instagram", value: "@salmoon.design" },
    { label: "X", value: "@salmoon" },
  ],
};
