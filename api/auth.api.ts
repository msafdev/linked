import type { Session } from "@supabase/supabase-js";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type SessionResult = {
  session: Session | null;
};

const clearServerCookies = async () => {
  try {
    await fetch("/api/auth/callback?logout=1", {
      method: "GET",
      credentials: "include",
    });
  } catch (error) {
    console.error("[Auth API] Failed to clear auth cookies", error);
  }
};

export const authApi = {
  async getSession(): Promise<SessionResult | null> {
    const supabase = createSupabaseBrowserClient();
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }

      return {
        session: data.session,
      };
    } catch (error) {
      console.error("[Auth API] Unable to get session", error);
      return null;
    }
  },

  async logout(): Promise<void> {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signOut();
    await clearServerCookies();
    if (error) {
      throw error;
    }
  },
};

export const authQueryKeys = {
  all: () => ["auth"] as const,
  session: () => ["auth", "session"] as const,
  detail: (id: string) => ["auth", "detail", id] as const,
};
