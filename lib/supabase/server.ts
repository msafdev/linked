import { cookies } from "next/headers";

import { type CookieOptions, createServerClient } from "@supabase/ssr";

import type { Database } from "@/lib/supabase/types";

const getCookieStore = () => {
  try {
    return cookies();
  } catch {
    return undefined;
  }
};

export const createSupabaseServerClient = () => {
  const cookieStore = getCookieStore();

  type MutableRequestCookies =
    | (ReturnType<typeof cookies> & {
        set?: (cookie: { name: string; value: string } & CookieOptions) => void;
      })
    | undefined;
  const mutableCookies = cookieStore as MutableRequestCookies;

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        async getAll() {
          return (
            (await cookieStore)?.getAll().map((cookie) => ({
              name: cookie.name,
              value: cookie.value,
            })) ?? []
          );
        },
        setAll(cookiesToSet) {
          if (!mutableCookies?.set) {
            return;
          }

          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              mutableCookies.set?.({
                name,
                value,
                ...options,
              });
            } catch {
              // ignore if cookies are read-only (e.g. during static rendering)
            }
          });
        },
      },
    },
  );
};
