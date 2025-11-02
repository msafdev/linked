import type { FormikProps } from "formik";

import type { ReactNode } from "react";

import { renderSettingsSection } from "@/components/dashboard/forms/sections/account-section";
import { renderContactSection } from "@/components/dashboard/forms/sections/contact-section";
import { renderEducationSection } from "@/components/dashboard/forms/sections/education-section";
import { renderProfileSection } from "@/components/dashboard/forms/sections/profile-section";
import { renderProjectsSection } from "@/components/dashboard/forms/sections/project-section";
import { renderSpeakingSection } from "@/components/dashboard/forms/sections/speaking-section";
import { renderWorkSection } from "@/components/dashboard/forms/sections/work-section";
import { renderWritingSection } from "@/components/dashboard/forms/sections/writing-section";

import type { DashboardState } from "@/lib/config";
import type { SectionInitialValuesMap } from "@/lib/schema";

export type SectionRenderer<State extends DashboardState> = (
  formik: FormikProps<SectionInitialValuesMap[State]>,
) => ReactNode;

export type SectionRenderersMap = {
  [State in DashboardState]: SectionRenderer<State>;
};

export const sectionRenderers: SectionRenderersMap = {
  profile: renderProfileSection,
  work: renderWorkSection,
  writing: renderWritingSection,
  speaking: renderSpeakingSection,
  projects: renderProjectsSection,
  education: renderEducationSection,
  contact: renderContactSection,
  settings: renderSettingsSection,
};
