import type { Metadata } from "next";

import { RegisterSection } from "@/components/dashboard/forms/register-section";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Join Linked to craft a polished public portfolio and manage every section from one dashboard.",
  robots: {
    index: false,
  },
  openGraph: {
    title: `Register | ${SITE_NAME}`,
    description:
      "Start your Linked portfolio and manage your content with an all-in-one dashboard.",
  },
  twitter: {
    title: `Register | ${SITE_NAME}`,
    description:
      "Start your Linked portfolio and manage your content with an all-in-one dashboard.",
  },
};

export default function Page() {
  return <RegisterSection />;
}
