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

import type { ComponentType } from "react";

import type { DashboardSection, DashboardSectionIcon } from "@/lib/config";

type DashboardNavIcon = ComponentType<{ className?: string }>;

export type DashboardNavItem = DashboardSection & {
  href: string;
};

export type DashboardNavItemWithIcon = DashboardNavItem & {
  Icon: DashboardNavIcon;
};

export const DASHBOARD_ICON_MAP: Record<
  DashboardSectionIcon,
  DashboardNavIcon
> = {
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
  return sections.map((section) => ({
    ...section,
    href: `${basePath}/${section.key}`,
  }));
}

export function addIconsToNavItems(
  navItems: DashboardNavItem[],
): DashboardNavItemWithIcon[] {
  return navItems.map((item) => ({
    ...item,
    Icon: DASHBOARD_ICON_MAP[item.icon] ?? PiGridFourDuotone,
  }));
}
