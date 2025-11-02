import type { Metadata } from "next";

import { FeaturesSection } from "@/components/app/sections/features-section";
import { FooterSection } from "@/components/app/sections/footer-section";
import { HomeSection } from "@/components/app/sections/home-section";

import { SITE_DESCRIPTION } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "Linked",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: `Linked`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    title: `Linked`,
    description: SITE_DESCRIPTION,
  },
};

export default async function Page() {
  return (
    <main className="bg-background text-foreground flex min-h-svh flex-col items-center gap-24 px-6 pt-12 pb-12 text-center sm:gap-32 sm:pt-24 md:gap-64 md:pt-32">
      <HomeSection />
      <FeaturesSection />
      <FooterSection />
    </main>
  );
}
