import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { DASHBOARD_BASE_PATH } from "@/lib/config";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Manage every section of your Linked portfolio from the unified dashboard.",
  robots: {
    index: false,
  },
};

export default function Page() {
  redirect(`${DASHBOARD_BASE_PATH}/profile`);
}
