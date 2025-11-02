import type { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";

import { SectionForm } from "@/components/dashboard/forms/section-form";

import { decodeJwtPayload, isTokenExpired } from "@/lib/auth/token";
import { DASHBOARD_SECTIONS, isDashboardState } from "@/lib/config";
import {
  type SectionFormValuesMap,
  createSectionInitialValues,
} from "@/lib/schema";
import { fetchPortfolioByAccountId } from "@/lib/supabase/portfolio";

type DashboardStateParams = {
  state: string;
};

type DashboardStatePageProps = {
  params: Promise<DashboardStateParams>;
};

export const dynamicParams = false;
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return DASHBOARD_SECTIONS.map((section) => ({
    state: section.key,
  }));
}

export async function generateMetadata({
  params,
}: DashboardStatePageProps): Promise<Metadata> {
  const { state } = await params;
  const label =
    DASHBOARD_SECTIONS.find((section) => section.key === state)?.label ??
    "Dashboard";
  return {
    title: `${label} settings`,
    description: `Update your ${label.toLowerCase()} details in the Linked dashboard.`,
    robots: {
      index: false,
    },
    openGraph: {
      title: `${label} settings`,
      description: `Update your ${label.toLowerCase()} details in the Linked dashboard.`,
    },
    twitter: {
      title: `${label} settings`,
      description: `Update your ${label.toLowerCase()} details in the Linked dashboard.`,
    },
  };
}

export default async function Page({ params }: DashboardStatePageProps) {
  const { state } = await params;

  if (!isDashboardState(state)) {
    notFound();
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("sb-access-token")?.value ?? "";

  const dashboardRedirect = `/dashboard/${state}`;

  if (!accessToken) {
    redirect(`/auth/login?redirect=${encodeURIComponent(dashboardRedirect)}`);
  }

  const payload = decodeJwtPayload(accessToken);

  if (
    !payload?.sub ||
    typeof payload.sub !== "string" ||
    isTokenExpired(payload)
  ) {
    redirect(`/auth/login?redirect=${encodeURIComponent(dashboardRedirect)}`);
  }

  const accountId = payload.sub;

  const userData = await fetchPortfolioByAccountId(accountId);

  if (!userData) {
    notFound();
  }

  const section = DASHBOARD_SECTIONS.find((item) => item.key === state);

  if (!section) {
    notFound();
  }

  const sectionInitialValues: SectionFormValuesMap =
    createSectionInitialValues(userData);
  const initialValues = sectionInitialValues[section.key];

  const avatarSource = Array.isArray(userData.profile.avatar)
    ? userData.profile.avatar[0]
    : userData.profile.avatar
      ? userData.profile.avatar
      : null;

  const avatarSrc =
    avatarSource?.src && avatarSource.src.trim().length > 0
      ? avatarSource.src
      : "/images/placeholder.webp";
  const avatarAlt =
    avatarSource?.alt && avatarSource.alt.trim().length > 0
      ? avatarSource.alt
      : `${userData.profile.name} avatar`;

  return (
    <div className="mx-auto flex h-full w-full max-w-4xl flex-col justify-center px-6 py-10">
      <header className="mb-6 flex items-center gap-4">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-full border">
          <Image
            fill
            src={avatarSrc}
            alt={avatarAlt}
            className="rounded-full object-cover p-0.5"
          />
        </div>
        <div className="space-y-1">
          <h1 className="text-foreground text-xl font-semibold">
            {userData.profile.name}
          </h1>
          {section.description ? (
            <p className="text-muted-foreground text-xs sm:text-sm">
              Edit and customize your {section.label.toLowerCase()} settings
            </p>
          ) : null}
        </div>
      </header>
      <SectionForm
        stateKey={section.key}
        userId={userData.id}
        initialValues={initialValues}
        allInitialValues={sectionInitialValues}
      />
    </div>
  );
}
