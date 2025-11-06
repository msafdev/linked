import type { Metadata } from "next";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { MenuSessionState } from "@/components/menu";
import { resolvePortfolioTemplateComponent } from "@/components/portfolio/templates";

import { decodeJwtPayload, isTokenExpired } from "@/lib/auth/token";
import { SITE_BASE_URL, SITE_NAME } from "@/lib/site";
import {
  fetchPortfolioByDomain,
  getDefaultDomain,
  listAvailableDomains,
} from "@/lib/supabase/portfolio";
import { selectAvatarSource } from "@/lib/utils";

const normalizeWhitespace = (value?: string | null) => {
  if (!value) {
    return null;
  }
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length > 0 ? normalized : null;
};

type ResolvedPortfolio = {
  portfolio: NonNullable<Awaited<ReturnType<typeof fetchPortfolioByDomain>>>;
  domain: string;
  pathSegment: string;
};

async function resolvePortfolioFromSlug(
  slug?: string,
): Promise<ResolvedPortfolio | null> {
  const slugParam = slug?.toLowerCase();
  const domain = slugParam ?? (await getDefaultDomain());

  if (!domain) {
    return null;
  }

  const portfolio = await fetchPortfolioByDomain(domain);

  if (!portfolio) {
    return null;
  }

  return {
    portfolio,
    domain,
    pathSegment: slugParam ?? domain,
  };
}

export const dynamicParams = true;
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const domains = await listAvailableDomains();
    return domains.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

type PortfolioPageParams = {
  slug?: string;
};

type PortfolioPageProps = {
  params: Promise<PortfolioPageParams>;
};

export async function generateMetadata({
  params,
}: PortfolioPageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolved = await resolvePortfolioFromSlug(slug);

  if (!resolved) {
    return {
      title: "Portfolio not found",
      description: "The requested portfolio could not be found.",
      robots: {
        index: false,
      },
    };
  }

  const { portfolio, pathSegment } = resolved;
  const name =
    normalizeWhitespace(portfolio.profile.name) ?? `${SITE_NAME} portfolio`;
  const role = normalizeWhitespace(portfolio.profile.title);
  const headline = name;
  const description =
    normalizeWhitespace(portfolio.profile.about) ??
    (role
      ? `${name} is ${role}. Explore their work, writing, and projects.`
      : `Explore the work, writing, and projects published by ${name}.`);
  const canonicalUrl = new URL(`/${pathSegment}`, SITE_BASE_URL).toString();
  const avatar = selectAvatarSource(portfolio.profile.avatar);
  const ogImage =
    avatar?.src && avatar.src.trim().length > 0 ? avatar.src : undefined;
  const ogAlt =
    avatar?.alt && avatar.alt.trim().length > 0 ? avatar.alt : `${name} avatar`;

  return {
    title: headline,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: headline,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: ogImage
        ? [
            {
              url: ogImage,
              alt: ogAlt,
            },
          ]
        : undefined,
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: headline,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function Page({ params }: PortfolioPageProps) {
  const { slug } = await params;
  const resolved = await resolvePortfolioFromSlug(slug);

  if (!resolved) {
    redirect("/");
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("sb-access-token")?.value ?? "";
  let menuSessionState: MenuSessionState = "unauthenticated";

  if (accessToken) {
    const payload = decodeJwtPayload(accessToken);
    if (
      payload?.sub &&
      typeof payload.sub === "string" &&
      !isTokenExpired(payload)
    ) {
      menuSessionState = "authenticated";
    }
  }

  const Template = resolvePortfolioTemplateComponent(
    resolved.portfolio.settings.template,
  );

  return (
    <Template
      portfolio={resolved.portfolio}
      menuSessionState={menuSessionState}
    />
  );
}
