export type DashboardState =
  | "profile"
  | "work"
  | "writing"
  | "speaking"
  | "projects"
  | "education"
  | "contact"
  | "settings";

export type DashboardSegment = "cv" | "account";

export type DashboardSectionIcon = DashboardState;

export type DashboardSection = {
  key: DashboardState;
  label: string;
  description?: string;
  icon: DashboardSectionIcon; // string key, serializable
  segment: DashboardSegment;
};

export const DASHBOARD_SECTIONS: DashboardSection[] = [
  {
    key: "profile",
    label: "Profile",
    description: "Basic profile information that appears publicly.",
    icon: "profile",
    segment: "cv",
  },
  {
    key: "work",
    label: "Experience",
    description: "Professional history, roles, and achievements.",
    icon: "work",
    segment: "cv",
  },
  {
    key: "writing",
    label: "Writing",
    description: "Articles, essays, and notable publications.",
    icon: "writing",
    segment: "cv",
  },
  {
    key: "speaking",
    label: "Speaking",
    description: "Talks, conferences, and public speaking events.",
    icon: "speaking",
    segment: "cv",
  },
  {
    key: "projects",
    label: "Projects",
    description: "Experiments and independent initiatives.",
    icon: "projects",
    segment: "cv",
  },
  {
    key: "education",
    label: "Education",
    description: "Academic background and certifications.",
    icon: "education",
    segment: "cv",
  },
  {
    key: "contact",
    label: "Contact",
    description: "Ways for people to get in touch.",
    icon: "contact",
    segment: "cv",
  },
  {
    key: "settings",
    label: "Settings",
    description: "Account preferences, billing, and domain controls.",
    icon: "settings",
    segment: "account",
  },
];

export const DASHBOARD_BASE_PATH = "/dashboard";

export function isDashboardState(value: string): value is DashboardState {
  return DASHBOARD_SECTIONS.some((section) => section.key === value);
}
