import Image from "next/image";
import Link from "next/link";
import { TbLink } from "react-icons/tb";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LINK } from "@/constant";

const formatRange = (range: { from: string; to?: string }) => {
  return range.to ? `${range.from} – ${range.to}` : `${range.from} – Present`;
};

export default function Home() {
  return (
    <main className="min-h-svh w-full bg-background text-sm text-foreground">
      <div className="mx-auto flex w-full max-w-2xl flex-col px-6 py-12 sm:px-8 sm:py-16">
        <header className="flex md:flex-row flex-col md:items-start gap-4 md:gap-8 mb-12">
          <Avatar className="size-16 border border-border">
            <AvatarImage src="https://github.com/msafdev.png" />
            <AvatarFallback>SA</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h1 className="text-xl font-medium mb-0.5">{LINK.profile.name}</h1>
            <p className="text-sm text-muted-foreground mb-1.5">
              {LINK.profile.title} 📍 {LINK.profile.location}
            </p>
            {LINK.profile.website && (
              <Link
                href={LINK.profile.website.url}
                className="inline-flex w-fit items-center rounded-full px-3 bg-muted py-1 hover:bg-muted/60"
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

        <section className="space-y-4 w-full mb-12">
          <h2 className="text-sm font-medium text-foreground">About</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {LINK.profile.about}
          </p>
        </section>

        <section className="space-y-4 w-full mb-12">
          <h2 className="text-sm font-medium text-foreground">
            Work Experience
          </h2>
          <div className="space-y-6">
            {LINK.work.map((role) => (
              <article
                key={`${role.company}-${role.role}-${role.range.from}`}
                className="grid gap-4 sm:grid-cols-[124px_auto]"
              >
                <span className="text-xs text-muted-foreground font-mono">
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
                          <div className="bg-muted text-muted-foreground p-0.5 rounded">
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
                          className="relative w-full aspect-video max-w-48 overflow-hidden rounded-md bg-muted"
                        >
                          <Image
                            src={image.src}
                            alt=""
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

        <section className="space-y-4 w-full mb-12">
          <h2 className="text-sm font-medium text-foreground">Writing</h2>
          <div className="space-y-4">
            {LINK.writing.map((piece) => (
              <article
                key={`${piece.title}-${piece.year}`}
                className="grid gap-4 sm:grid-cols-[124px_auto]"
              >
                <span className="text-xs text-muted-foreground font-mono">
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
                        <div className="bg-muted text-muted-foreground p-0.5 rounded">
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
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4 w-full mb-12">
          <h2 className="text-sm font-medium text-foreground">Speaking</h2>
          <div className="space-y-4">
            {LINK.speaking.map((talk) => (
              <article
                key={`${talk.title}-${talk.date}`}
                className="grid gap-4 sm:grid-cols-[124px_auto]"
              >
                <span className="text-xs text-muted-foreground font-mono">
                  {talk.date}
                </span>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium leading-tight">
                      {talk.title}
                    </h3>
                    {talk.url && (
                      <Link
                        href={talk.url}
                        className="flex items-center gap-2"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <h3 className="text-sm font-medium leading-tight">
                          {talk.title}
                        </h3>
                        <div className="bg-muted text-muted-foreground p-0.5 rounded">
                          <TbLink size={10} />
                        </div>
                      </Link>
                    )}
                  </div>
                  <div className="space-y-1">
                    {talk.subtitle && (
                      <p className="text-xs text-muted-foreground">
                        {talk.subtitle}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {talk.location}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {LINK.sideProjects.length > 0 && (
          <section className="space-y-4 w-full mb-12">
            <h2 className="text-sm font-medium text-foreground">
              Side Projects
            </h2>
            <div className="space-y-4">
              {LINK.sideProjects.map((project) => (
                <article
                  key={`${project.title}-${project.year}`}
                  className="grid gap-4 sm:grid-cols-[124px_auto]"
                >
                  <span className="text-xs text-muted-foreground font-mono">
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
                          <div className="bg-muted text-muted-foreground p-0.5 rounded">
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
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-4 w-full mb-12">
          <h2 className="text-sm font-medium text-foreground">Education</h2>
          <div className="space-y-4">
            {LINK.education.map((school) => (
              <article
                key={`${school.school}-${school.degree}`}
                className="grid gap-4 sm:grid-cols-[124px_auto]"
              >
                <span className="text-xs text-muted-foreground font-mono">
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

        <section className="space-y-4 w-full mb-12">
          <h2 className="text-sm font-medium text-foreground">Contact</h2>
          <div className="space-y-3">
            {LINK.contact.map((item) => (
              <div
                key={`${item.label}-${item.value}`}
                className="grid gap-4 sm:grid-cols-[124px_auto] items-baseline"
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
