"use client";

import { useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

export function CallbackSection() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const hash = window.location.hash.replace(/^#/, "");

    if (hash) {
      const hashParams = new URLSearchParams(hash);
      const redirect = searchParams.get("redirect");

      if (redirect && !hashParams.get("redirect")) {
        hashParams.set("redirect", redirect);
      }

      const queryString = hashParams.toString();
      const target =
        queryString.length > 0
          ? `/api/auth/callback?${queryString}`
          : "/api/auth/callback";
      window.location.replace(target);
      return;
    }

    router.replace("/auth/login");
  }, [router, searchParams]);

  return (
    <main className="flex min-h-svh items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm text-center">
        <p className="text-muted-foreground text-sm">Finishing sign in...</p>
      </div>
    </main>
  );
}
