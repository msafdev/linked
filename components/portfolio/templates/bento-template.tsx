import { PiArrowUpRightBold } from "react-icons/pi";
import { TbMail, TbMapPin, TbWorld } from "react-icons/tb";

import type { ReactNode } from "react";

import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Menu } from "@/components/menu";

import { formatYear } from "@/lib/date";
import { selectAvatarSource } from "@/lib/utils";
import { COUNTRIES } from "@/types/country";

import type { PortfolioTemplateProps } from "../types";

const formatRange = (range: { from: string; to?: string }) => {
  if (!range.from) {
    return "";
  }

  const starts = formatYear(range.from);
  const ends = range.to ? formatYear(range.to) : "Present";
  return `${starts} — ${ends}`;
};

type SectionCardProps = {
  title: string;
  children: ReactNode;
  subtitle?: string | null;
  className?: string;
};

const SectionCard = ({
  title,
  subtitle,
  children,
  className,
}: SectionCardProps) => (
  <section
    className={`bg-card/60 border-border/60 rounded-3xl border p-6 shadow-sm ${className ?? ""}`}
  >
    <header className="mb-5 space-y-1">
      <p className="text-muted-foreground text-xs font-medium tracking-[0.2em] uppercase">
        {title}
      </p>
      {subtitle ? (
        <p className="text-muted-foreground text-sm">{subtitle}</p>
      ) : null}
    </header>
    {children}
  </section>
);

export function BentoTemplate({
  portfolio,
  menuSessionState,
}: PortfolioTemplateProps) {
  const profileCountry =
    COUNTRIES.find((country) => country.value === portfolio.profile.location) ??
    null;
  const profileLocation =
    profileCountry?.label ?? portfolio.profile.location ?? null;

  const avatar = selectAvatarSource(portfolio.profile.avatar);
  const avatarSrc =
    avatar?.src && avatar.src.trim().length > 0 ? avatar.src : undefined;
  const avatarAlt =
    avatar?.alt && avatar.alt.trim().length > 0
      ? avatar.alt
      : portfolio.profile.name;

  const initials =
    portfolio.profile.name
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 2) || "??";

  const contactEntries = Array.isArray(portfolio.contact)
    ? portfolio.contact.filter(
        (entry) =>
          entry &&
          typeof entry.value === "string" &&
          entry.value.trim().length > 0,
      )
    : [];
  const hasContact = contactEntries.length > 0;
  const summary =
    typeof portfolio.profile.about === "string"
      ? portfolio.profile.about.trim()
      : "";
  const hasSummary = summary.length > 0;
  const hasWork = Array.isArray(portfolio.work) && portfolio.work.length > 0;
  const hasWriting =
    Array.isArray(portfolio.writing) && portfolio.writing.length > 0;
  const hasSpeaking =
    Array.isArray(portfolio.speaking) && portfolio.speaking.length > 0;
  const hasProjects =
    Array.isArray(portfolio.sideProjects) && portfolio.sideProjects.length > 0;

  const spotlightWork = hasWork ? portfolio.work.slice(0, 2) : [];
  const remainingWork =
    hasWork && portfolio.work.length > 2 ? portfolio.work.slice(2) : [];

  return (
    <main className="bg-background text-foreground min-h-svh w-full">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12 md:gap-12 md:px-12 md:py-16">
        {menuSessionState && <Menu sessionState={menuSessionState} />}

        <section className="bg-primary text-primary-foreground relative overflow-hidden rounded-[32px] px-8 py-10 shadow-2xl md:px-12 md:py-16">
          <div className="pointer-events-none absolute inset-0 opacity-15">
            <div className="absolute inset-y-0 right-0 w-2/3 bg-gradient-to-br from-white via-transparent to-transparent blur-3xl" />
          </div>

          <div className="relative flex flex-col gap-8 md:flex-row md:items-center">
            <Avatar className="border-primary-foreground/40 size-20 border bg-transparent">
              <AvatarImage src={avatarSrc} alt={avatarAlt} />
              <AvatarFallback className="bg-primary-foreground/10 text-primary-foreground text-xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col gap-4">
              <div>
                <p className="text-primary-foreground/70 text-sm tracking-[0.25em] uppercase">
                  Portfolio
                </p>
                <h1 className="text-3xl font-semibold md:text-4xl">
                  {portfolio.profile.name}
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm md:text-base">
                {portfolio.profile.title ? (
                  <span>{portfolio.profile.title}</span>
                ) : null}
                {profileLocation ? (
                  <span className="text-primary-foreground/80 inline-flex items-center gap-1">
                    <TbMapPin aria-hidden="true" />
                    {profileLocation}
                  </span>
                ) : null}
              </div>
              {portfolio.profile.website?.url &&
              portfolio.profile.website?.label ? (
                <Link
                  href={
                    portfolio.profile.website.url.startsWith("http")
                      ? portfolio.profile.website.url
                      : `https://${portfolio.profile.website.url}`
                  }
                  className="border-primary-foreground/30 bg-primary-foreground/10 hover:bg-primary-foreground/20 inline-flex w-fit items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TbWorld aria-hidden="true" />
                  {portfolio.profile.website.label}
                  <PiArrowUpRightBold aria-hidden="true" />
                </Link>
              ) : null}
            </div>
          </div>

          {hasSummary ? (
            <p className="text-primary-foreground/90 mt-8 max-w-3xl text-base leading-relaxed">
              {summary}
            </p>
          ) : null}

          {hasContact ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {contactEntries.map((entry) => {
                const key = `${entry.label ?? "contact"}-${entry.value}`;
                const label = entry.label ?? entry.value;
                const baseClass =
                  "bg-primary-foreground/15 text-primary-foreground inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition hover:bg-primary-foreground/25";

                if (entry.url && entry.url.trim().length > 0) {
                  const href = entry.url.startsWith("http")
                    ? entry.url
                    : entry.url.startsWith("mailto:")
                      ? entry.url
                      : `https://${entry.url}`;

                  return (
                    <Link
                      key={key}
                      href={href}
                      className={baseClass}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <TbMail aria-hidden="true" />
                      <span>{label}</span>
                    </Link>
                  );
                }

                return (
                  <span key={key} className={baseClass}>
                    <TbMail aria-hidden="true" />
                    <span>{label}</span>
                  </span>
                );
              })}
            </div>
          ) : null}
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          {hasWork ? (
            <SectionCard
              title="Experience"
              subtitle="Selected roles and the work that shaped me"
              className="md:col-span-2"
            >
              <div className="grid gap-6 md:grid-cols-2">
                {spotlightWork.map((entry) => (
                  <article
                    key={`${entry.company}-${entry.role}-${entry.range.from}`}
                    className="border-border/60 rounded-2xl border p-5"
                  >
                    <header className="mb-3 space-y-1">
                      <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
                        {formatRange(entry.range)}
                      </p>
                      <h3 className="text-lg font-semibold">{entry.role}</h3>
                      <p className="text-muted-foreground text-sm">
                        {entry.company}
                      </p>
                    </header>
                    {entry.location ? (
                      <p className="text-muted-foreground text-xs">
                        {entry.location}
                      </p>
                    ) : null}
                    {entry.url ? (
                      <Link
                        href={entry.url}
                        className="text-primary mt-4 inline-flex items-center gap-2 text-sm font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View work
                        <PiArrowUpRightBold aria-hidden="true" />
                      </Link>
                    ) : null}
                  </article>
                ))}
              </div>
              {remainingWork.length > 0 ? (
                <div className="mt-6 space-y-3">
                  {remainingWork.map((entry) => (
                    <div
                      key={`${entry.company}-${entry.role}-${entry.range.from}-list`}
                      className="border-border/60 flex flex-col gap-1 rounded-xl border border-dashed px-4 py-3 text-sm md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="font-medium">{entry.role}</p>
                        <p className="text-muted-foreground text-xs">
                          {entry.company}
                        </p>
                      </div>
                      <span className="text-muted-foreground text-xs">
                        {formatRange(entry.range)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
            </SectionCard>
          ) : null}

          {hasProjects ? (
            <SectionCard
              title="Spotlight"
              subtitle="Independent projects and experiments"
              className={hasWork ? undefined : "md:col-span-2"}
            >
              <div className="space-y-4">
                {portfolio.sideProjects.slice(0, 4).map((project) => (
                  <article
                    key={`${project.title}-${project.year}`}
                    className="border-border/60 rounded-2xl border p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold">
                          {project.title}
                        </h3>
                        {project.subtitle ? (
                          <p className="text-muted-foreground text-sm">
                            {project.subtitle}
                          </p>
                        ) : null}
                      </div>
                      <span className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
                        {project.year}
                      </span>
                    </div>
                    {project.url ? (
                      <Link
                        href={project.url}
                        className="text-primary mt-3 inline-flex items-center gap-2 text-sm font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Explore
                        <PiArrowUpRightBold aria-hidden="true" />
                      </Link>
                    ) : null}
                  </article>
                ))}
              </div>
            </SectionCard>
          ) : null}

          {hasWriting ? (
            <SectionCard title="Writing" subtitle="Ideas, notes, and essays">
              <ul className="space-y-4">
                {portfolio.writing.slice(0, 5).map((entry) => (
                  <li key={`${entry.title}-${entry.year}`}>
                    <div className="flex items-baseline justify-between gap-3">
                      <div>
                        <p className="font-medium">{entry.title}</p>
                        {entry.subtitle ? (
                          <p className="text-muted-foreground text-sm">
                            {entry.subtitle}
                          </p>
                        ) : null}
                      </div>
                      <span className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
                        {entry.year}
                      </span>
                    </div>
                    {entry.url ? (
                      <Link
                        href={entry.url}
                        className="text-primary mt-2 inline-flex items-center gap-2 text-xs font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Read
                        <PiArrowUpRightBold aria-hidden="true" />
                      </Link>
                    ) : null}
                  </li>
                ))}
              </ul>
            </SectionCard>
          ) : null}

          {hasSpeaking ? (
            <SectionCard title="Speaking" subtitle="Talks and appearances">
              <ul className="space-y-4">
                {portfolio.speaking.slice(0, 4).map((entry) => (
                  <li
                    key={`${entry.title}-${entry.date}`}
                    className="border-border/60 rounded-2xl border p-4"
                  >
                    <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
                      {entry.date}
                    </p>
                    <h3 className="mt-1 text-base font-semibold">
                      {entry.title}
                    </h3>
                    {entry.location ? (
                      <p className="text-muted-foreground text-sm">
                        {entry.location}
                      </p>
                    ) : null}
                    {entry.url ? (
                      <Link
                        href={entry.url}
                        className="text-primary mt-3 inline-flex items-center gap-2 text-xs font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Details
                        <PiArrowUpRightBold aria-hidden="true" />
                      </Link>
                    ) : null}
                  </li>
                ))}
              </ul>
            </SectionCard>
          ) : null}
        </div>
      </div>
    </main>
  );
}
