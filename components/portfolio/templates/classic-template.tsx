import { TbLink } from "react-icons/tb";

import type { ReactNode } from "react";

import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Menu } from "@/components/menu";

import { formatYear } from "@/lib/date";
import { selectAvatarSource } from "@/lib/utils";
import { COUNTRIES } from "@/types/country";

import type { PortfolioTemplateProps } from "./types";

const TIMELINE_GRID_CLASSES = "grid gap-4 md:grid-cols-[124px_auto]";
const TIMELINE_LABEL_CLASSES =
  "text-muted-foreground font-mono text-xs row-start-2 md:row-start-1 md:mt-0.5";

const formatRange = (range: { from: string; to?: string }) => {
  return range.to
    ? `${formatYear(range.from)} - ${formatYear(range.to)}`
    : `${formatYear(range.from)} - Present`;
};

export function ClassicPortfolioTemplate({
  portfolio,
  menuSessionState,
}: PortfolioTemplateProps) {
  const profileCountry =
    COUNTRIES.find((country) => country.value === portfolio.profile.location) ??
    null;
  const profileLocationLabel = profileCountry?.label ?? null;
  const profileLocation =
    profileLocationLabel ?? portfolio.profile.location ?? null;
  const profileAvatar = selectAvatarSource(portfolio.profile.avatar);
  const profileAvatarSrc =
    profileAvatar?.src && profileAvatar.src.trim().length > 0
      ? profileAvatar.src
      : undefined;
  const profileAvatarAlt =
    profileAvatar?.alt && profileAvatar.alt.trim().length > 0
      ? profileAvatar.alt
      : portfolio.profile.name;

  const profileInitials =
    portfolio.profile.name
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 2) || "??";

  const hasProfileSummary = Boolean(portfolio.profile.about?.trim());
  const hasWork = Array.isArray(portfolio.work) && portfolio.work.length > 0;
  const hasWriting =
    Array.isArray(portfolio.writing) && portfolio.writing.length > 0;
  const hasSpeaking =
    Array.isArray(portfolio.speaking) && portfolio.speaking.length > 0;
  const hasProjects =
    Array.isArray(portfolio.sideProjects) &&
    portfolio.sideProjects.length > 0;
  const hasEducation =
    Array.isArray(portfolio.education) && portfolio.education.length > 0;
  const hasContact =
    Array.isArray(portfolio.contact) && portfolio.contact.length > 0;

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
                  {portfolio.profile.name}
                </h1>
                {(portfolio.profile.title || profileLocation) && (
                  <p className="text-muted-foreground flex flex-wrap items-center gap-x-1 gap-y-1 text-sm">
                    {portfolio.profile.title && (
                      <span>{portfolio.profile.title}</span>
                    )}
                    {profileLocation && (
                      <span className="inline-flex items-center gap-1">
                        <span aria-hidden="true">•</span>
                        <span>{profileLocation}</span>
                      </span>
                    )}
                  </p>
                )}
              </div>
              {portfolio.profile.website?.label &&
                portfolio.profile.website?.url && (
                  <Link
                    href={`https://${portfolio.profile.website.url}`}
                    className="bg-muted hover:bg-muted/60 inline-flex w-fit items-center rounded-full px-3 py-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="text-muted-foreground text-xs leading-relaxed">
                      {portfolio.profile.website.label}
                    </span>
                  </Link>
                )}
            </div>
          </header>

          {hasProfileSummary && (
            <Section title="About">
              <p className="text-muted-foreground leading-relaxed">
                {portfolio.profile.about}
              </p>
            </Section>
          )}

          {hasWork && (
            <Section title="Work Experience">
              <ul className="list-none space-y-6 pl-0">
                {portfolio.work.map((role) => (
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
                        {Array.isArray(role.images) && role.images.length > 0 && (
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
                {portfolio.writing.map((piece) => (
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
                                  className="bg-muted relative aspect-video w-full max-w-48 overflow-hidden rounded"
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
                {portfolio.speaking.map((talk) => (
                  <li key={`${talk.title}-${talk.date}`}>
                    <article className={TIMELINE_GRID_CLASSES}>
                      <span className={TIMELINE_LABEL_CLASSES}>
                        {formatYear(talk.date)}
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
                {portfolio.sideProjects.map((project) => (
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
                {portfolio.education.map((school) => (
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
                {portfolio.contact.map((item) => (
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
