import type { Metadata } from "next";
import type { ReactNode } from "react";

import { DashboardSidebar } from "@/components/dashboard/sidebar";

import { DASHBOARD_BASE_PATH, DASHBOARD_SECTIONS } from "@/lib/config";
import { SITE_NAME } from "@/lib/site";

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
      <DashboardSidebar
        sections={DASHBOARD_SECTIONS}
        basePath={DASHBOARD_BASE_PATH}
      />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
