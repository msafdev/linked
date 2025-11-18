import type { Country } from "@/types/country";
import type { PortfolioTemplateId } from "@/types/portfolio-template";

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
  alt?: string;
  storagePath?: string;
};

export type Profile = {
  name: string;
  title: string;
  location: Country["value"];
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

export type BillingStatus = "active" | "trial" | "trialing" | "past_due";
export type BillingType = "free" | "pro" | "enterprise";

export type Settings = {
  domain: string;
  billingStatus: BillingStatus;
  billingType: BillingType;
  template: PortfolioTemplateId;
  isPublic: boolean;
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
