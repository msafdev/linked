import type { Metadata } from "next";

import { AuthCallbackPage } from "@/components/auth/callback-page";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Finishing sign in",
  description: "Completing your Linked sign-in and redirecting you back to the app.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: `Finishing sign in | ${SITE_NAME}`,
    description: "Completing your Linked sign-in and redirecting you back to the app.",
  },
  twitter: {
    title: `Finishing sign in | ${SITE_NAME}`,
    description: "Completing your Linked sign-in and redirecting you back to the app.",
  },
};

export default function Page() {
  return <AuthCallbackPage />;
}
