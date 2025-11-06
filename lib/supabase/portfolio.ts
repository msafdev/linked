import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";
import type {
  ContactEntry,
  EducationEntry,
  ExternalLink,
  ReadCV,
  SideProjectEntry,
  SpeakingEntry,
  WorkEntry,
  WritingEntry,
} from "@/types/cv";
import {
  DEFAULT_PORTFOLIO_TEMPLATE_ID,
  PORTFOLIO_TEMPLATE_IDS,
  type PortfolioTemplateId,
} from "@/types/portfolio-template";

import { extractAvatarSrcFromContent } from "../media";

type ContentRow = Database["public"]["Tables"]["content"]["Row"];
type SettingRow = Database["public"]["Tables"]["setting"]["Row"];
type AccountRow = Database["public"]["Tables"]["account"]["Row"];

export type SectionRow = Pick<ContentRow, "section" | "data">;
type SectionMap = Record<string, unknown>;

const SECTIONS = [
  "profile",
  "work",
  "writing",
  "speaking",
  "projects",
  "education",
  "contact",
  "settings",
] as const;

const createSectionMap = (rows: SectionRow[]): SectionMap => {
  return rows.reduce<SectionMap>((acc, row) => {
    acc[row.section] = row.data ?? {};
    return acc;
  }, {});
};

const safeArray = <T>(value: unknown): T[] => {
  return Array.isArray(value) ? (value as T[]) : [];
};

const isPortfolioTemplateId = (
  value: unknown,
): value is PortfolioTemplateId => {
  return (
    typeof value === "string" &&
    (PORTFOLIO_TEMPLATE_IDS as readonly string[]).includes(value)
  );
};

const mapReadCv = (
  account: Pick<AccountRow, "id" | "full_name" | "avatar_url">,
  sectionMap: SectionMap,
  setting: SettingRow | null,
): ReadCV => {
  const profileData = (sectionMap.profile as Partial<ReadCV["profile"]>) ?? {};
  const workData = (sectionMap.work as { work?: ReadCV["work"] }) ?? {};
  const writingData =
    (sectionMap.writing as { writing?: ReadCV["writing"] }) ?? {};
  const speakingData =
    (sectionMap.speaking as { speaking?: ReadCV["speaking"] }) ?? {};
  const projectsData =
    (sectionMap.projects as { projects?: ReadCV["sideProjects"] }) ?? {};
  const educationData =
    (sectionMap.education as { education?: ReadCV["education"] }) ?? {};
  const contactData =
    (sectionMap.contact as { contact?: ReadCV["contact"] }) ?? {};
  const settingsData =
    (sectionMap.settings as Partial<ReadCV["settings"]>) ?? {};

  const avatarData = profileData.avatar as
    | ReadCV["profile"]["avatar"]
    | undefined;
  const normalizedAvatar = Array.isArray(avatarData)
    ? avatarData
        .map((item) => ({
          src: typeof item?.src === "string" ? item.src : "",
          alt: typeof item?.alt === "string" ? item.alt : "",
          storagePath:
            typeof (item as { storagePath?: string })?.storagePath === "string"
              ? ((item as { storagePath?: string }).storagePath ?? "")
              : "",
        }))
        .filter((item) => item.src.length > 0)
    : [];

  const rawDomain =
    (typeof setting?.domain === "string" && setting.domain) ||
    (typeof settingsData.domain === "string" && settingsData.domain) ||
    account.id;

  const rawBillingStatus =
    (typeof setting?.billing_status === "string" && setting.billing_status) ||
    (typeof settingsData.billingStatus === "string" &&
      settingsData.billingStatus) ||
    "trial";

  const rawBillingType =
    (typeof setting?.billing_type === "string" && setting.billing_type) ||
    (typeof settingsData.billingType === "string" &&
      settingsData.billingType) ||
    "free";

  const preferences =
    setting?.preferences && typeof setting.preferences === "object"
      ? (setting.preferences as Record<string, unknown>)
      : null;
  const templateCandidates: unknown[] = [
    (preferences as { template?: unknown } | null)?.template ?? null,
    settingsData.template ?? null,
  ];
  const template =
    templateCandidates.find((candidate): candidate is PortfolioTemplateId =>
      isPortfolioTemplateId(candidate),
    ) ?? DEFAULT_PORTFOLIO_TEMPLATE_ID;

  const websiteData = profileData.website as Partial<ExternalLink> | undefined;
  const website =
    websiteData &&
    typeof websiteData.label === "string" &&
    typeof websiteData.url === "string" &&
    websiteData.label.length > 0 &&
    websiteData.url.length > 0
      ? {
          label: websiteData.label,
          url: websiteData.url,
        }
      : undefined;

  return {
    id: account.id,
    profile: {
      name: profileData.name ?? account.full_name ?? "",
      title: profileData.title ?? "",
      location: profileData.location ?? "",
      about: profileData.about ?? "",
      website,
      avatar:
        normalizedAvatar.length > 0
          ? normalizedAvatar
          : account.avatar_url
            ? [{ src: account.avatar_url, alt: account.full_name ?? "" }]
            : null,
    },
    work: safeArray<WorkEntry>(workData.work),
    writing: safeArray<WritingEntry>(writingData.writing),
    speaking: safeArray<SpeakingEntry>(speakingData.speaking),
    sideProjects: safeArray<SideProjectEntry>(projectsData.projects),
    education: safeArray<EducationEntry>(educationData.education),
    contact: safeArray<ContactEntry>(contactData.contact),
    settings: {
      domain: rawDomain ? rawDomain.toLowerCase() : "",
      billingStatus:
        (rawBillingStatus as ReadCV["settings"]["billingStatus"]) ?? "trial",
      billingType:
        (rawBillingType as ReadCV["settings"]["billingType"]) ?? "free",
      template,
    },
  };
};

const fetchAccountContent = async (
  supabase: ReturnType<typeof createSupabaseServerClient>,
  accountId: string,
) => {
  const { data, error } = await supabase
    .from("content")
    .select("section, data")
    .eq("account_id", accountId)
    .in(
      "section",
      SECTIONS.map((section) => section),
    );

  if (error) {
    throw error;
  }

  return (data ?? []) as SectionRow[];
};

const fetchPublicAccountProfile = async (
  supabase: ReturnType<typeof createSupabaseServerClient>,
  accountId: string,
) => {
  const { data, error } = await supabase
    .from("public_account_profile")
    .select("*")
    .eq("id", accountId)
    .maybeSingle();

  if (error) throw error;
  return data as {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

const fetchSettingByAccountId = async (
  supabase: ReturnType<typeof createSupabaseServerClient>,
  accountId: string,
) => {
  const { data, error } = await supabase
    .from("setting")
    .select("*")
    .eq("account_id", accountId)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data ?? null;
};

export const fetchPortfolioByAccountId = async (
  accountId: string,
): Promise<ReadCV | null> => {
  const supabase = createSupabaseServerClient();

  const [publicAccount, contentRows, setting] = await Promise.all([
    fetchPublicAccountProfile(supabase, accountId),
    fetchAccountContent(supabase, accountId),
    fetchSettingByAccountId(supabase, accountId),
  ]);

  if (!setting || !setting.is_public) return null;

  const sectionMap = createSectionMap(contentRows);

  const avatarSrcFromContent = extractAvatarSrcFromContent(contentRows);

  return mapReadCv(
    {
      id: accountId,
      full_name: publicAccount?.full_name ?? null,
      email: null as any,
      avatar_url: publicAccount?.avatar_url ?? avatarSrcFromContent ?? null,
    } as AccountRow,
    sectionMap,
    setting,
  );
};

export const fetchPortfolioByDomain = async (
  domain: string,
): Promise<ReadCV | null> => {
  const normalized = domain.trim().toLowerCase();

  if (!normalized) {
    return null;
  }

  const supabase = createSupabaseServerClient();

  const { data: setting, error } = await supabase
    .from("setting")
    .select("*")
    .ilike("domain", normalized)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  if (!setting) {
    return null;
  }

  return fetchPortfolioByAccountId(setting.account_id);
};

export const listAvailableDomains = async (): Promise<string[]> => {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("setting")
    .select("domain")
    .not("domain", "is", null);

  if (error) {
    throw error;
  }

  const domains = (data ?? [])
    .map((row) => row.domain?.trim().toLowerCase())
    .filter((domain): domain is string => Boolean(domain && domain.length > 0));

  return Array.from(new Set(domains));
};

export const getDefaultDomain = async (): Promise<string | null> => {
  const domains = await listAvailableDomains();
  return domains[0] ?? null;
};
