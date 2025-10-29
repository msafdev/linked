import { redirect } from "next/navigation";

import {
  DASHBOARD_ID,
  DASHBOARD_SECTIONS,
  type DashboardState,
} from "@/lib/dashboard-config";

type DashboardIdPageProps = {
  params: {
    id: string;
  };
};

export default function DashboardIdPage({ params }: DashboardIdPageProps) {
  if (params.id !== DASHBOARD_ID) {
    return redirect("/");
  }

  const defaultState = DASHBOARD_SECTIONS[0]?.key as DashboardState | undefined;

  if (!defaultState) {
    return redirect("/");
  }

  return redirect(`/dashboard/${params.id}/${defaultState}`);
}
