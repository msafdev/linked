import { TbLink } from "react-icons/tb";

import type { Metadata } from "next";
import type { ReactNode } from "react";

import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Menu, type MenuSessionState } from "@/components/menu";

import { decodeJwtPayload, isTokenExpired } from "@/lib/auth/token";
import { formatYear } from "@/lib/date";
import {
  fetchPortfolioByDomain,
  getDefaultDomain,
  listAvailableDomains,
} from "@/lib/supabase/portfolio";
import { selectAvatarSource } from "@/lib/utils";
import { SITE_BASE_URL, SITE_NAME } from "@/lib/site";
import { COUNTRIES } from "@/types/country";

const TIMELINE_GRID_CLASSES = "grid gap-4 md:grid-cols-[124px_auto]";
const TIMELINE_LABEL_CLASSES =
  "text-muted-foreground font-mono text-xs row-start-2 md:row-start-1 md:mt-0.5";

const formatRange = (range: { from: string; to?: string }) => {
  return range.to
    ? `${formatYear(range.from)} - ${formatYear(range.to)}`
    : `${formatYear(range.from)} - Present`;
};

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
    avatar?.alt && avatar.alt.trim().length > 0
      ? avatar.alt
      : `${name} avatar`;

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

  const LINK = resolved.portfolio;

  // Determine session state server-side
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("sb-access-token")?.value ?? "";
  let menuSessionState: MenuSessionState | null = null;

  if (accessToken) {
    const payload = decodeJwtPayload(accessToken);
    if (
      payload?.sub &&
      typeof payload.sub === "string" &&
      !isTokenExpired(payload)
    ) {
      menuSessionState = "authenticated";
    } else {
      menuSessionState = "unauthenticated";
    }
  } else {
    menuSessionState = "unauthenticated";
  }

  const profileCountry =
    COUNTRIES.find((country) => country.value === LINK.profile.location) ??
    null;
  const profileLocationLabel = profileCountry?.label ?? null;
  const profileLocation = profileLocationLabel ?? LINK.profile.location ?? null;
  const profileAvatar = selectAvatarSource(LINK.profile.avatar);
  const profileAvatarSrc =
    profileAvatar?.src && profileAvatar.src.trim().length > 0
      ? profileAvatar.src
      : undefined;
  const profileAvatarAlt =
    profileAvatar?.alt && profileAvatar.alt.trim().length > 0
      ? profileAvatar.alt
      : LINK.profile.name;
  const profileInitials =
    LINK.profile.name
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 2) || "??";

  const hasProfileSummary = Boolean(LINK.profile.about?.trim());
  const hasWork = Array.isArray(LINK.work) && LINK.work.length > 0;
  const hasWriting = Array.isArray(LINK.writing) && LINK.writing.length > 0;
  const hasSpeaking = Array.isArray(LINK.speaking) && LINK.speaking.length > 0;
  const hasProjects =
    Array.isArray(LINK.sideProjects) && LINK.sideProjects.length > 0;
  const hasEducation =
    Array.isArray(LINK.education) && LINK.education.length > 0;
  const hasContact = Array.isArray(LINK.contact) && LINK.contact.length > 0;

  type SectionProps = {
    title: string;
    children: ReactNode;
    className?: string;
  };

  const Section = ({ title, children, className }: SectionProps) => (
    <section className={className ? `w-full ${className}` : "w-full"}>
      <header className="mb-4">
        <h2 className="text-foreground text-sm font-medium">{title}</h2>
      </header>
      {children}
    </section>
  );

  return (
    <main className="bg-background text-foreground min-h-svh w-full text-sm">
      <div className="mx-auto flex w-full max-w-2xl flex-col px-6 py-12 md:px-8 md:py-16">
        {menuSessionState && <Menu sessionState={menuSessionState} />}

        <div className="mt-10 flex flex-col gap-12">
          <header className="flex flex-col gap-4 md:flex-row md:items-start md:gap-8">
            <Avatar className="border-border size-16 border">
              <AvatarImage src={profileAvatarSrc} alt={profileAvatarAlt} />
              <AvatarFallback>{profileInitials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-3">
              <div>
                <h1 className="mb-1 text-xl font-medium">
                  {LINK.profile.name}
                </h1>
                {(LINK.profile.title || profileLocation) && (
                  <p className="text-muted-foreground flex flex-wrap items-center gap-x-1 gap-y-1 text-sm">
                    {LINK.profile.title && <span>{LINK.profile.title}</span>}
                    {profileLocation && (
                      <span className="inline-flex items-center gap-1">
                        <span aria-hidden="true">📍</span>
                        <span>{profileLocation}</span>
                      </span>
                    )}
                  </p>
                )}
              </div>
              {LINK.profile.website?.label && LINK.profile.website?.url && (
                <Link
                  href={`https://${LINK.profile.website.url}`}
                  className="bg-muted hover:bg-muted/60 inline-flex w-fit items-center rounded-full px-3 py-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="text-muted-foreground text-xs leading-relaxed">
                    {LINK.profile.website.label}
                  </span>
                </Link>
              )}
            </div>
          </header>

          {hasProfileSummary && (
            <Section title="About">
              <p className="text-muted-foreground leading-relaxed">
                {LINK.profile.about}
              </p>
            </Section>
          )}

          {hasWork && (
            <Section title="Work Experience">
              <ul className="list-none space-y-6 pl-0">
                {LINK.work.map((role) => (
                  <li key={`${role.company}-${role.role}-${role.range.from}`}>
                    <article className={TIMELINE_GRID_CLASSES}>
                      <span className={TIMELINE_LABEL_CLASSES}>
                        {formatRange(role.range)}
                      </span>
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            {role.url ? (
                              <Link
                                href={role.url}
                                className="flex items-center gap-2"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <h3 className="text-sm leading-tight font-medium">
                                  {role.role} at {role.company}
                                </h3>
                                <span className="bg-muted text-muted-foreground rounded p-0.5">
                                  <TbLink size={10} />
                                </span>
                              </Link>
                            ) : (
                              <h3 className="text-sm leading-tight font-medium">
                                {role.role} at {role.company}
                              </h3>
                            )}
                          </div>
                          {role.location && (
                            <p className="text-muted-foreground text-xs leading-relaxed">
                              {role.location}
                            </p>
                          )}
                        </div>
                        {Array.isArray(role.images) &&
                          role.images.length > 0 && (
                            <div className="flex flex-wrap gap-4">
                              {role.images.map((image, index) => (
                                <div
                                  key={`${index}-${image.src}`}
                                  className="bg-muted relative aspect-video w-full max-w-48 overflow-hidden rounded"
                                >
                                  <Image
                                    src={image.src}
                                    alt={
                                      image.alt ||
                                      `${role.company} ${index + 1}`
                                    }
                                    fill
                                    sizes="192px"
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {hasWriting && (
            <Section title="Writing">
              <ul className="list-none space-y-6 pl-0">
                {LINK.writing.map((piece) => (
                  <li key={`${piece.title}-${piece.year}`}>
                    <article className={TIMELINE_GRID_CLASSES}>
                      <span className={TIMELINE_LABEL_CLASSES}>
                        {piece.year}
                      </span>
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            {piece.url ? (
                              <Link
                                href={piece.url}
                                className="flex items-center gap-2"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <h3 className="text-sm leading-tight font-medium">
                                  {piece.title}
                                </h3>
                                <span className="bg-muted text-muted-foreground rounded p-0.5">
                                  <TbLink size={10} />
                                </span>
                              </Link>
                            ) : (
                              <h3 className="text-sm leading-tight font-medium">
                                {piece.title}
                              </h3>
                            )}
                          </div>
                          {piece.subtitle && (
                            <p className="text-muted-foreground text-xs leading-relaxed">
                              {piece.subtitle}
                            </p>
                          )}
                        </div>
                        {Array.isArray(piece.images) &&
                          piece.images.length > 0 && (
                            <div className="flex flex-wrap gap-4">
                              {piece.images.map((image, index) => (
                                <div
                                  key={`${index}-${image.src}`}
                                  className="bg-muted relative aspect-[4/3] w-full max-w-48 overflow-hidden rounded"
                                >
                                  <Image
                                    src={image.src}
                                    alt={
                                      image.alt ||
                                      `${piece.title} image ${index + 1}`
                                    }
                                    fill
                                    sizes="192px"
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {hasSpeaking && (
            <Section title="Speaking">
              <ul className="list-none space-y-6 pl-0">
                {LINK.speaking.map((talk) => (
                  <li key={`${talk.title}-${talk.date}`}>
                    <article className={TIMELINE_GRID_CLASSES}>
                      <span className={TIMELINE_LABEL_CLASSES}>
                        {talk.date}
                      </span>
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            {talk.url ? (
                              <Link
                                href={talk.url}
                                className="flex items-center gap-2"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <h3 className="text-sm leading-tight font-medium">
                                  {talk.title}
                                </h3>
                                <span className="bg-muted text-muted-foreground rounded p-0.5">
                                  <TbLink size={10} />
                                </span>
                              </Link>
                            ) : (
                              <h3 className="text-sm leading-tight font-medium">
                                {talk.title}
                              </h3>
                            )}
                          </div>
                          {talk.subtitle && (
                            <p className="text-muted-foreground text-xs leading-relaxed">
                              {talk.subtitle}
                            </p>
                          )}
                          {talk.location && (
                            <p className="text-muted-foreground text-xs leading-relaxed">
                              {talk.location}
                            </p>
                          )}
                        </div>
                        {Array.isArray(talk.images) &&
                          talk.images.length > 0 && (
                            <div className="flex flex-wrap gap-4">
                              {talk.images.map((image, index) => (
                                <div
                                  key={`${index}-${image.src}`}
                                  className="bg-muted relative aspect-video w-full max-w-48 overflow-hidden rounded"
                                >
                                  <Image
                                    src={image.src}
                                    alt={
                                      image.alt ||
                                      `${talk.title} image ${index + 1}`
                                    }
                                    fill
                                    sizes="192px"
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {hasProjects && (
            <Section title="Side Projects">
              <ul className="list-none space-y-6 pl-0">
                {LINK.sideProjects.map((project) => (
                  <li key={`${project.title}-${project.year}`}>
                    <article className={TIMELINE_GRID_CLASSES}>
                      <span className={TIMELINE_LABEL_CLASSES}>
                        {project.year}
                      </span>
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            {project.url ? (
                              <Link
                                href={project.url}
                                className="flex items-center gap-2"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <h3 className="text-sm leading-tight font-medium">
                                  {project.title}
                                </h3>
                                <span className="bg-muted text-muted-foreground rounded p-0.5">
                                  <TbLink size={10} />
                                </span>
                              </Link>
                            ) : (
                              <h3 className="text-sm leading-tight font-medium">
                                {project.title}
                              </h3>
                            )}
                          </div>
                          {project.subtitle && (
                            <p className="text-muted-foreground text-xs leading-relaxed">
                              {project.subtitle}
                            </p>
                          )}
                        </div>
                        {Array.isArray(project.images) &&
                          project.images.length > 0 && (
                            <div className="flex flex-wrap gap-4">
                              {project.images.map((image, index) => (
                                <div
                                  key={`${index}-${image.src}`}
                                  className="bg-muted relative aspect-video w-full max-w-48 overflow-hidden rounded"
                                >
                                  <Image
                                    src={image.src}
                                    alt={
                                      image.alt ||
                                      `${project.title} image ${index + 1}`
                                    }
                                    fill
                                    sizes="192px"
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {hasEducation && (
            <Section title="Education">
              <ul className="list-none space-y-6 pl-0">
                {LINK.education.map((school) => (
                  <li key={`${school.school}-${school.degree}`}>
                    <article className={TIMELINE_GRID_CLASSES}>
                      <span className={TIMELINE_LABEL_CLASSES}>
                        {formatRange(school.range)}
                      </span>
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                          <h3 className="text-sm leading-tight font-medium">
                            {school.degree}
                          </h3>
                        </div>
                        <div className="flex flex-col gap-1">
                          {school.school && (
                            <p className="text-muted-foreground text-xs leading-relaxed">
                              {school.school}
                            </p>
                          )}
                          {school.location && (
                            <p className="text-muted-foreground text-xs leading-relaxed">
                              {school.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {hasContact && (
            <Section title="Contact">
              <dl className="space-y-3">
                {LINK.contact.map((item) => (
                  <div
                    key={`${item.label}-${item.value}`}
                    className="grid gap-2 md:grid-cols-[124px_auto]"
                  >
                    <dt className="text-muted-foreground text-xs leading-relaxed">
                      {item.label}
                    </dt>
                    <dd className="text-foreground text-sm">
                      {item.url ? (
                        <Link
                          href={item.url}
                          className="transition-colors hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.value}
                        </Link>
                      ) : (
                        item.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </Section>
          )}
        </div>
      </div>
    </main>
  );
}
