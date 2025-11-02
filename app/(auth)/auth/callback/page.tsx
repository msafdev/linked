import type { Metadata } from "next";

import { Suspense } from "react";

import { CallbackSection } from "@/components/dashboard/forms/callback-section";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Finishing sign in",
  description:
    "Completing your Linked sign-in and redirecting you back to the app.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: `Finishing sign in | ${SITE_NAME}`,
    description:
      "Completing your Linked sign-in and redirecting you back to the app.",
  },
  twitter: {
    title: `Finishing sign in | ${SITE_NAME}`,
    description:
      "Completing your Linked sign-in and redirecting you back to the app.",
  },
};

export default function Page() {
  return (
    <Suspense fallback={<CallbackFallback />}>
      <CallbackSection />
    </Suspense>
  );
}

function CallbackFallback() {
  return (
    <main className="flex min-h-svh items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm text-center">
        <p className="text-muted-foreground text-sm">Finishing sign in...</p>
      </div>
    </main>
  );
}
