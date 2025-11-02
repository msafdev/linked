import type { Metadata } from "next";

import { LoginPage } from "@/components/auth/login-page";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Log in",
  description: "Access your Linked dashboard to update your portfolio and manage published sections.",
  robots: {
    index: false,
  },
  openGraph: {
    title: `Log in | ${SITE_NAME}`,
    description: "Sign in to Linked to keep your public portfolio up to date.",
  },
  twitter: {
    title: `Log in | ${SITE_NAME}`,
    description: "Sign in to Linked to keep your public portfolio up to date.",
  },
};

export default function Page() {
  return <LoginPage />;
}
