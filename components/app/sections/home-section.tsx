import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function HomeSection() {
  return (
    <section className="w-full max-w-2xl space-y-16">
      <div className="space-y-12">
        {/* Badge */}
        <div className="border-border/50 bg-card inline-flex items-center gap-2 rounded-full border px-4 py-2 shadow-xs transition-shadow hover:shadow-sm">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-emerald-400"></span>
              <span className="relative inline-flex size-2 shrink-0 rounded-full bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Live
            </span>
          </div>
          <div className="bg-border/30 h-4 w-px" />
          <span className="text-card-foreground/80 text-xs font-medium">
            Beta release
          </span>
        </div>

        {/* Hero Text */}
        <div className="space-y-4">
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Your beautiful online portfolio.
            <br />
            From showcasing work to landing clients
          </h1>
          <p className="text-muted-foreground text-center text-sm text-pretty sm:text-base">
            Forget messy links, outdated resumes, or scattered projects. Use{" "}
            <span className="text-foreground font-medium">Linked</span> to
            create a sleek personal page, highlight your best work, share
            contact details, and grow your audience effortlessly.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button
          asChild
          className="h-fit rounded-full border-t-2 border-zinc-600 px-5 py-2.5 shadow-xs"
        >
          <Link href="/auth/login">Join Linked</Link>
        </Button>
      </div>

      {/* Hero Image */}
      <div className="relative aspect-video h-auto w-full">
        <Image
          src="/images/hero.webp"
          alt="Hero image"
          fill
          sizes="(max-width: 768px) 100vw, 800px"
          className="z-10 rounded object-contain"
        />
        <div className="bg-muted absolute -bottom-4 left-0 h-full w-full scale-95 rounded blur md:-bottom-6" />
      </div>
    </section>
  );
}
