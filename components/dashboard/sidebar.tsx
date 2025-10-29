"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useState } from "react";

import type {
  DashboardSection,
  DashboardSectionIcon,
} from "@/lib/dashboard-config";
import {
  PiAddressBookTabsDuotone,
  PiBriefcaseDuotone,
  PiCirclesThreeDuotone,
  PiGraduationCapDuotone,
  PiGridFourDuotone,
  PiNotebookDuotone,
  PiUserDuotone,
  PiLightbulbDuotone,
} from "react-icons/pi";
import type { IconType } from "react-icons";

const ICONS: Record<DashboardSectionIcon, IconType> = {
  profile: PiUserDuotone,
  work: PiBriefcaseDuotone,
  writing: PiNotebookDuotone,
  speaking: PiLightbulbDuotone,
  projects: PiCirclesThreeDuotone,
  education: PiGraduationCapDuotone,
  contact: PiAddressBookTabsDuotone,
};

type DashboardSidebarProps = {
  sections: DashboardSection[];
  basePath: string;
};

export function DashboardSidebar({
  sections,
  basePath,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  return (
    <aside className="hidden md:flex items-center max-h-svh sticky top-0">
      <nav className="flex flex-col flex-1 overflow-y-auto px-6 py-4">
        <ul>
          {sections.map(({ key, label, icon }) => {
            const href = `${basePath}/${key}`;
            const isActive =
              pathname === href || pathname?.startsWith(`${href}/`);
            const shouldHighlight =
              hoveredKey ? hoveredKey === key : isActive;
            const IconComponent = ICONS[icon] ?? PiGridFourDuotone;

            return (
              <li key={key}>
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "group relative flex items-center px-2 py-2 rounded transition-colors min-w-40",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                  onMouseEnter={() => setHoveredKey(key)}
                  onMouseLeave={() => setHoveredKey(null)}
                >
                  {shouldHighlight && (
                    <motion.div
                      layoutId="sidebar-background"
                      className="absolute inset-0 bg-muted rounded"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                      initial={false}
                    />
                  )}
                  <span className="relative flex items-center gap-2.5 z-10">
                    <IconComponent className="size-3 shrink-0" />
                    <span className="text-sm font-medium">{label}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
