import type { FormikProps } from "formik";
import type { ReactNode } from "react";

import type { DashboardState } from "@/lib/dashboard-config";
import type { SectionInitialValuesMap } from "@/lib/dashboard-forms";

import { renderContactSection } from "./contact-section";
import { renderEducationSection } from "./education-section";
import { renderProfileSection } from "./profile-section";
import { renderProjectsSection } from "./project-section";
import { renderSpeakingSection } from "./speaking-section";
import { renderWorkSection } from "./work-section";
import { renderWritingSection } from "./writing-section";

export type SectionRenderer<State extends DashboardState> = (
  formik: FormikProps<SectionInitialValuesMap[State]>
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
};
