"use client";

import { motion } from "motion/react";

import { useMemo, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { DashboardSegment } from "@/lib/config";
import { cn } from "@/lib/utils";

import type { DashboardNavItem, DashboardNavItemWithIcon } from "./nav-utils";
import { addIconsToNavItems } from "./nav-utils";

const SEGMENT_LABELS: Record<DashboardSegment, string> = {
  cv: "CV",
  account: "Account",
};

const SEGMENT_ORDER: DashboardSegment[] = ["cv", "account"];

type SidebarProps = {
  navItems: DashboardNavItem[];
};

export function Sidebar({ navItems }: SidebarProps) {
  const pathname = usePathname();
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const itemsWithIcons: DashboardNavItemWithIcon[] = useMemo(
    () => addIconsToNavItems(navItems),
    [navItems],
  );

  const groupedSections = useMemo(
    () =>
      SEGMENT_ORDER.map((segment) => ({
        segment,
        label: SEGMENT_LABELS[segment],
        items: itemsWithIcons.filter((section) => section.segment === segment),
      })).filter((group) => group.items.length > 0),
    [itemsWithIcons],
  );

  return (
    <aside className="sticky top-0 hidden max-h-svh items-center md:flex">
      <nav className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-4">
        {groupedSections.map(({ segment, label, items }) => (
          <div key={segment}>
            <span className="text-muted-foreground px-2 font-mono text-xs font-medium tracking-wide uppercase">
              {label}
            </span>
            <ul className="mt-3">
              {items.map(({ key, label: itemLabel, Icon, href }) => {
                const isActive =
                  pathname === href || pathname?.startsWith(`${href}/`);
                const shouldHighlight = hoveredKey
                  ? hoveredKey === key
                  : isActive;

                return (
                  <li key={key}>
                    <Link
                      href={href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "group relative flex min-w-40 items-center rounded px-2 py-2 transition-colors",
                        isActive ? "text-foreground" : "text-muted-foreground",
                      )}
                      onMouseEnter={() => setHoveredKey(key)}
                      onMouseLeave={() => setHoveredKey(null)}
                    >
                      {shouldHighlight && (
                        <motion.div
                          layoutId="sidebar-background"
                          className="bg-muted absolute inset-0 rounded mix-blend-difference"
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                          initial={false}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-2.5">
                        <Icon className="size-3 shrink-0" />
                        <span className="text-sm">{itemLabel}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
