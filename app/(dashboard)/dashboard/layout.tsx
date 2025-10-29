import type { ReactNode } from "react";

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import {
  DASHBOARD_BASE_PATH,
  DASHBOARD_SECTIONS,
} from "@/lib/dashboard-config";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh bg-background text-foreground">
      <DashboardSidebar
        sections={DASHBOARD_SECTIONS}
        basePath={DASHBOARD_BASE_PATH}
      />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
