import { LINK } from "@/constant";

export type DashboardState =
  | "profile"
  | "work"
  | "writing"
  | "speaking"
  | "projects"
  | "education"
  | "contact";

export type DashboardSectionIcon = DashboardState;

export type DashboardSection = {
  key: DashboardState;
  label: string;
  description?: string;
  icon: DashboardSectionIcon; // string key, serializable
};

export const DASHBOARD_SECTIONS: DashboardSection[] = [
  {
    key: "profile",
    label: "Profile",
    description: "Basic profile information that appears publicly.",
    icon: "profile",
  },
  {
    key: "work",
    label: "Experience",
    description: "Professional history, roles, and achievements.",
    icon: "work",
  },
  {
    key: "writing",
    label: "Writing",
    description: "Articles, essays, and notable publications.",
    icon: "writing",
  },
  {
    key: "speaking",
    label: "Speaking",
    description: "Talks, conferences, and public speaking events.",
    icon: "speaking",
  },
  {
    key: "projects",
    label: "Projects",
    description: "Experiments and independent initiatives.",
    icon: "projects",
  },
  {
    key: "education",
    label: "Education",
    description: "Academic background and certifications.",
    icon: "education",
  },
  {
    key: "contact",
    label: "Contact",
    description: "Ways for people to get in touch.",
    icon: "contact",
  },
];

export const DASHBOARD_ID = LINK.id;
export const DASHBOARD_BASE_PATH = `/dashboard/${DASHBOARD_ID}`;

export function isDashboardState(value: string): value is DashboardState {
  return DASHBOARD_SECTIONS.some((section) => section.key === value);
}
