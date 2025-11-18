import type { ReactNode } from "react";

import type { Metadata } from "next";

import { DashboardMobileNav } from "@/components/dashboard/mobile-nav";
import { buildDashboardNavItems } from "@/components/dashboard/nav-utils";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

import { DASHBOARD_BASE_PATH, DASHBOARD_SECTIONS } from "@/lib/config";
import { SITE_NAME } from "@/lib/site";

const DASHBOARD_NAV_ITEMS = buildDashboardNavItems(
  DASHBOARD_SECTIONS,
  DASHBOARD_BASE_PATH,
);

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: `%s | ${SITE_NAME}`,
  },
  openGraph: {
    type: "website",
  },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background text-foreground flex min-h-svh">
      <DashboardSidebar navItems={DASHBOARD_NAV_ITEMS} />
      <div className="relative flex-1 overflow-y-auto">
        <DashboardMobileNav items={DASHBOARD_NAV_ITEMS} />
        {children}
      </div>
    </div>
  );
}
