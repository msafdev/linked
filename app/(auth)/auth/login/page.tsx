import type { Metadata } from "next";

import { Suspense } from "react";

import { LoginSection } from "@/components/dashboard/forms/login-section";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Log in",
  description:
    "Access your Linked dashboard to update your portfolio and manage published sections.",
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
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginSection />
    </Suspense>
  );
}

function LoginFallback() {
  return (
    <main className="bg-background text-foreground grid min-h-svh md:grid-cols-2">
      <section className="flex w-full items-center justify-center border-r border-dashed px-6 py-12 md:flex-1 md:px-16">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="font-heading text-2xl font-bold tracking-tight">
              Log in
            </h1>
            <p className="text-muted-foreground text-sm">
              Preparing the sign-in form...
            </p>
          </div>
        </div>
      </section>
      <section className="relative hidden flex-1 overflow-hidden bg-[#F8F8F8] md:block" />
    </main>
  );
}
