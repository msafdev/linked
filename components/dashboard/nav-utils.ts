"use client";

import type { ComponentType } from "react";
import {
  PiAddressBookTabsDuotone,
  PiBriefcaseDuotone,
  PiCirclesThreeDuotone,
  PiGearSixDuotone,
  PiGraduationCapDuotone,
  PiGridFourDuotone,
  PiLightbulbDuotone,
  PiNotebookDuotone,
  PiUserDuotone,
} from "react-icons/pi";

import type { DashboardSection, DashboardSectionIcon } from "@/lib/config";

type DashboardNavIcon = ComponentType<{ className?: string }>;

export type DashboardNavItem = DashboardSection & {
  href: string;
  Icon: DashboardNavIcon;
};

export const DASHBOARD_ICON_MAP: Record<DashboardSectionIcon, DashboardNavIcon> =
  {
    profile: PiUserDuotone,
    work: PiBriefcaseDuotone,
    writing: PiNotebookDuotone,
    speaking: PiLightbulbDuotone,
    projects: PiCirclesThreeDuotone,
    education: PiGraduationCapDuotone,
    contact: PiAddressBookTabsDuotone,
    settings: PiGearSixDuotone,
  };

export function buildDashboardNavItems(
  sections: DashboardSection[],
  basePath: string,
): DashboardNavItem[] {
  return sections.map((section) => {
    const href = `${basePath}/${section.key}`;
    const Icon = DASHBOARD_ICON_MAP[section.icon] ?? PiGridFourDuotone;

    return { ...section, href, Icon };
  });
}
