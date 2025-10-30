import type { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";

import { SectionForm } from "@/components/dashboard/forms/section-form";
import { DEFAULT_USER_ID, getReadCvById } from "@/constant";
import { DASHBOARD_SECTIONS, isDashboardState } from "@/lib/config";
import {
  createSectionInitialValues,
  type SectionFormValuesMap,
} from "@/lib/schema";
type DashboardStatePageProps = {
  params: {
    state: string;
  };
};

export const dynamicParams = false;
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return DASHBOARD_SECTIONS.map((section) => ({
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

export default async function DashboardStatePage({
  params,
}: DashboardStatePageProps) {
  const { state } = params;

  if (!isDashboardState(state)) {
    notFound();
  }

  const cookieStore = await cookies();
  const existingCookie = cookieStore.get("dashboard-id");
  const cookieId = existingCookie?.value ?? DEFAULT_USER_ID;

  let userData = getReadCvById(cookieId);

  if (!userData) {
    userData = getReadCvById(DEFAULT_USER_ID);
  }

  if (!userData) {
    notFound();
  }

  if (existingCookie?.value !== userData.id) {
    const searchParams = new URLSearchParams({
      user: userData.id,
      redirect: `/dashboard/${state}`,
    });
    redirect(`/api/dashboard-cookie?${searchParams.toString()}`);
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
          <h1 className="text-xl font-semibold text-foreground">
            {userData.profile.name}
          </h1>
          {section.description ? (
            <p className="text-xs text-muted-foreground sm:text-sm">
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




