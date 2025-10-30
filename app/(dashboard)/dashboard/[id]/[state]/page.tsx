import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SectionForm } from "@/components/dashboard/forms/section-form";
import {
  DASHBOARD_ID,
  DASHBOARD_SECTIONS,
  isDashboardState,
} from "@/lib/dashboard-config";
import { sectionInitialValues } from "@/lib/dashboard-forms";
import Image from "next/image";

type DashboardStatePageProps = {
  params: {
    id: string;
    state: string;
  };
};

export const dynamicParams = false;

export function generateStaticParams() {
  return DASHBOARD_SECTIONS.map((section) => ({
    id: DASHBOARD_ID,
    state: section.key,
  }));
}

export function generateMetadata({
  params,
}: DashboardStatePageProps): Metadata {
  const label =
    DASHBOARD_SECTIONS.find((section) => section.key === params.state)?.label ??
    "Dashboard";
  return {
    title: `${label} - Dashboard`,
  };
}

export default function DashboardStatePage({
  params,
}: DashboardStatePageProps) {
  const { id, state } = params;

  if (id !== DASHBOARD_ID) {
    notFound();
  }

  if (!isDashboardState(state)) {
    notFound();
  }

  const section = DASHBOARD_SECTIONS.find((item) => item.key === state);

  if (!section) {
    notFound();
  }

  const initialValues = sectionInitialValues[section.key];

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10 h-full flex justify-center flex-col">
      <header className="flex items-center mb-6 gap-4">
        <div className="relative size-16 rounded-full border overflow-hidden shrink-0">
          <Image
            fill
            src="/images/placeholder.webp"
            alt="Current profile image"
            className="rounded-full p-0.5"
          />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          {section.description ? (
            <p className="text-xs sm:text-sm text-muted-foreground">
              Edit and customize your {section.label.toLowerCase()} settings
            </p>
          ) : null}
        </div>
      </header>
      <SectionForm initialValues={initialValues} stateKey={section.key} />
    </div>
  );
}
