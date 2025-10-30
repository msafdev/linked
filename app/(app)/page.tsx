import { redirect } from "next/navigation";

import { DEFAULT_USER_ID } from "@/constant";

export default function Page() {
  redirect(`/${DEFAULT_USER_ID}`);
}
