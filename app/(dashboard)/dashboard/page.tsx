import { redirect } from "next/navigation";

import { DASHBOARD_BASE_PATH } from "@/lib/dashboard-config";

export default function DashboardIndexPage() {
  redirect(`${DASHBOARD_BASE_PATH}/profile`);
}
