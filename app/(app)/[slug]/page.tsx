import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { TbLink } from "react-icons/tb";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DEFAULT_USER_ID,
  getAllReadCvIds,
  getReadCvById,
  type ReadCV,
} from "@/constant";
import { formatYear } from "@/lib/date";
import { COUNTRIES } from "@/types/country";

const formatRange = (range: { from: string; to?: string }) => {
  return range.to
    ? `${formatYear(range.from)} - ${formatYear(range.to)}`
    : `${formatYear(range.from)} - Present`;
};

export const dynamicParams = false;
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return getAllReadCvIds().map((slug) => ({ slug }));
}

type PortfolioPageProps = {
  params: {
    slug?: string;
  };
};

function selectAvatarSource(
  avatar: ReadCV["profile"]["avatar"]
): { src?: string; alt?: string } | null {
  if (!avatar) {
    return null;
  }

  if (Array.isArray(avatar)) {
    return avatar[0] ?? null;
  }

  return avatar;
}

export default async function Page({ params }: PortfolioPageProps) {
  const slug = params.slug?.toLowerCase() ?? DEFAULT_USER_ID;
  const cookieStore = await cookies();

  let readCv = getReadCvById(slug);

  if (!readCv) {
    readCv = getReadCvById(DEFAULT_USER_ID);
  }

  if (!readCv) {
    notFound();
  }

  const existingDashboardId = cookieStore.get("dashboard-id")?.value ?? null;

  if (existingDashboardId !== readCv.id) {
    const searchParams = new URLSearchParams({
      user: readCv.id,
      redirect: `/${slug}`,
    });
    redirect(`/api/dashboard-cookie?${searchParams.toString()}`);
  }

  const LINK = readCv;

  const profileCountry =
    COUNTRIES.find((country) => country.value === LINK.profile.location) ??
    null;
  const profileLocationLabel = profileCountry?.label ?? null;
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

  return (
    <main className="min-h-svh w-full bg-background text-sm text-foreground">
      <div className="mx-auto flex w-full max-w-2xl flex-col px-6 py-12 sm:px-8 sm:py-16">
        <header className="mb-12 flex flex-col gap-4 md:flex-row md:items-start md:gap-8">
          <Avatar className="size-16 border border-border">
            <AvatarImage src={profileAvatarSrc} alt={profileAvatarAlt} />
            <AvatarFallback>{profileInitials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h1 className="mb-0.5 text-xl font-medium">{LINK.profile.name}</h1>
            <p className="mb-1.5 text-sm text-muted-foreground">
              {LINK.profile.title} 📍{" "}
              {profileLocationLabel ?? LINK.profile.location}
            </p>
            {LINK.profile.website && (
              <Link
                href={LINK.profile.website.url}
                className="inline-flex w-fit items-center rounded-full bg-muted px-3 py-1 hover:bg-muted/60"
                target="_blank"
                rel="noopener noreferrer"
              >
                <p className="text-xs text-muted-foreground">
                  {LINK.profile.website.label}
                </p>
              </Link>
            )}
          </div>
        </header>

        <section className="mb-12 w-full space-y-4">
          <h2 className="text-sm font-medium text-foreground">About</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {LINK.profile.about}
          </p>
        </section>

        <section className="mb-12 w-full space-y-4">
          <h2 className="text-sm font-medium text-foreground">
            Work Experience
          </h2>
          <div className="space-y-6">
            {LINK.work.map((role) => (
              <article
                key={`${role.company}-${role.role}-${role.range.from}`}
                className="grid gap-4 sm:grid-cols-[124px_auto]"
              >
                <span className="font-mono text-xs text-muted-foreground">
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
                          <h3 className="text-sm font-medium leading-tight">
                            {role.role} at {role.company}
                          </h3>
                          <div className="rounded bg-muted p-0.5 text-muted-foreground">
                            <TbLink size={10} />
                          </div>
                        </Link>
                      ) : (
                        <h3 className="text-sm font-medium leading-tight">
                          {role.role} at {role.company}
                        </h3>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {role.location}
                    </p>
                  </div>
                  {role.images && role.images.length > 0 && (
                    <div className="flex flex-wrap gap-4">
                      {role.images.map((image, index) => (
                        <div
                          key={`${index}-${image.src}`}
                          className="relative aspect-video w-full max-w-48 overflow-hidden rounded-md bg-muted"
                        >
                          <Image
                            src={image.src}
                            alt={image.alt || `${role.company} ${index + 1}`}
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
            ))}
          </div>
        </section>

        {LINK.writing.length > 0 && (
          <section className="mb-12 w-full space-y-4">
            <h2 className="text-sm font-medium text-foreground">Writing</h2>
            <div className="space-y-4">
              {LINK.writing.map((piece) => (
                <article
                  key={`${piece.title}-${piece.year}`}
                  className="grid gap-4 sm:grid-cols-[124px_auto]"
                >
                  <span className="font-mono text-xs text-muted-foreground">
                    {piece.year}
                  </span>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      {piece.url ? (
                        <Link
                          href={piece.url}
                          className="flex items-center gap-2"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <h3 className="text-sm font-medium leading-tight">
                            {piece.title}
                          </h3>
                          <div className="rounded bg-muted p-0.5 text-muted-foreground">
                            <TbLink size={10} />
                          </div>
                        </Link>
                      ) : (
                        <h3 className="text-sm font-medium leading-tight">
                          {piece.title}
                        </h3>
                      )}
                    </div>
                    {piece.subtitle && (
                      <p className="text-xs text-muted-foreground">
                        {piece.subtitle}
                      </p>
                    )}
                    {piece.images && piece.images.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-4">
                        {piece.images.map((image, index) => (
                          <div
                            key={`${index}-${image.src}`}
                            className="relative aspect-video w-full max-w-48 overflow-hidden rounded-md bg-muted"
                          >
                            <Image
                              src={image.src}
                              alt={
                                image.alt || `${piece.title} image ${index + 1}`
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
              ))}
            </div>
          </section>
        )}

        {LINK.speaking.length > 0 && (
          <section className="mb-12 w-full space-y-4">
            <h2 className="text-sm font-medium text-foreground">Speaking</h2>
            <div className="space-y-4">
              {LINK.speaking.map((talk) => (
                <article
                  key={`${talk.title}-${talk.date}`}
                  className="grid gap-4 sm:grid-cols-[124px_auto]"
                >
                  <span className="font-mono text-xs text-muted-foreground">
                    {talk.date}
                  </span>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      {talk.url ? (
                        <Link
                          href={talk.url}
                          className="flex items-center gap-2"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <h3 className="text-sm font-medium leading-tight">
                            {talk.title}
                          </h3>
                          <div className="rounded bg-muted p-0.5 text-muted-foreground">
                            <TbLink size={10} />
                          </div>
                        </Link>
                      ) : (
                        <h3 className="text-sm font-medium leading-tight">
                          {talk.title}
                        </h3>
                      )}
                    </div>
                    {talk.subtitle && (
                      <p className="text-xs text-muted-foreground">
                        {talk.subtitle}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {talk.location}
                    </p>
                    {talk.images && talk.images.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-4">
                        {talk.images.map((image, index) => (
                          <div
                            key={`${index}-${image.src}`}
                            className="relative aspect-video w-full max-w-48 overflow-hidden rounded-md bg-muted"
                          >
                            <Image
                              src={image.src}
                              alt={
                                image.alt || `${talk.title} image ${index + 1}`
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
              ))}
            </div>
          </section>
        )}

        {LINK.sideProjects.length > 0 && (
          <section className="mb-12 w-full space-y-4">
            <h2 className="text-sm font-medium text-foreground">
              Side Projects
            </h2>
            <div className="space-y-4">
              {LINK.sideProjects.map((project) => (
                <article
                  key={`${project.title}-${project.year}`}
                  className="grid gap-4 sm:grid-cols-[124px_auto]"
                >
                  <span className="font-mono text-xs text-muted-foreground">
                    {project.year}
                  </span>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      {project.url ? (
                        <Link
                          href={project.url}
                          className="flex items-center gap-2"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <h3 className="text-sm font-medium leading-tight">
                            {project.title}
                          </h3>
                          <div className="rounded bg-muted p-0.5 text-muted-foreground">
                            <TbLink size={10} />
                          </div>
                        </Link>
                      ) : (
                        <h3 className="text-sm font-medium leading-tight">
                          {project.title}
                        </h3>
                      )}
                    </div>
                    {project.subtitle && (
                      <p className="text-xs text-muted-foreground">
                        {project.subtitle}
                      </p>
                    )}
                    {project.images && project.images.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-4">
                        {project.images.map((image, index) => (
                          <div
                            key={`${index}-${image.src}`}
                            className="relative aspect-video w-full max-w-48 overflow-hidden rounded-md bg-muted"
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
              ))}
            </div>
          </section>
        )}

        <section className="mb-12 w-full space-y-4">
          <h2 className="text-sm font-medium text-foreground">Education</h2>
          <div className="space-y-4">
            {LINK.education.map((school) => (
              <article
                key={`${school.school}-${school.degree}`}
                className="grid gap-4 sm:grid-cols-[124px_auto]"
              >
                <span className="font-mono text-xs text-muted-foreground">
                  {formatRange(school.range)}
                </span>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium leading-tight">
                      {school.degree}
                    </h3>
                  </div>
                  <div className="space-y-1">
                    {school.school && (
                      <p className="text-xs text-muted-foreground">
                        {school.school}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {school.location}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-12 w-full space-y-4">
          <h2 className="text-sm font-medium text-foreground">Contact</h2>
          <div className="space-y-3">
            {LINK.contact.map((item) => (
              <div
                key={`${item.label}-${item.value}`}
                className="grid items-baseline gap-4 sm:grid-cols-[124px_auto]"
              >
                <span className="text-xs text-muted-foreground">
                  {item.label}
                </span>
                {item.url ? (
                  <Link
                    href={item.url}
                    className="text-sm text-foreground transition-colors hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.value}
                  </Link>
                ) : (
                  <span className="text-sm text-foreground">{item.value}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
