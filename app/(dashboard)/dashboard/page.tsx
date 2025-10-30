import { redirect } from "next/navigation";

import { DASHBOARD_BASE_PATH } from "@/lib/config";

export default function Page() {
  redirect(`${DASHBOARD_BASE_PATH}/profile`);
}
