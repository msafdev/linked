import { Suspense } from "react";

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
  return (
    <Suspense fallback={<RegisterFallback />}>
      <RegisterSection />
    </Suspense>
  );
}

function RegisterFallback() {
  return (
    <main className="bg-background text-foreground grid min-h-svh md:grid-cols-2">
      <section className="flex w-full items-center justify-center border-r border-dashed px-6 py-12 md:flex-1 md:px-16">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="font-heading text-2xl font-bold tracking-tight">
              Register
            </h1>
            <p className="text-muted-foreground text-sm">
              Preparing the registration form...
            </p>
          </div>
        </div>
      </section>
      <section className="relative hidden flex-1 overflow-hidden bg-[#F8F8F8] md:block" />
    </main>
  );
}
