import { createSupabaseBrowserClient } from "@/lib/supabase/client";

import { createCrudApi } from "./base.api";

const baseAuthApi = createCrudApi("auth");

const AUTH_SESSION_ENDPOINT = "/api/auth/session";

type SessionPayload = {
  email: string;
  password: string;
  mode: "login" | "register";
  name?: string;
  avatarUrl?: string;
};

type SessionResponse = {
  success: boolean;
  user?: {
    id: string;
    email: string;
  };
  session?: {
    access_token: string;
    refresh_token: string;
    expires_at: number | null;
    expires_in: number | null;
    token_type: string;
  };
  message?: string;
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response
    .json()
    .catch(() => ({ message: "Invalid response" }));

  if (!response.ok) {
    throw new Error(data.message || `HTTP ${response.status}`);
  }

  return data;
};

export const authApi = {
  ...baseAuthApi,

  async createSession(payload: SessionPayload): Promise<SessionResponse> {
    const response = await fetch(AUTH_SESSION_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const result = await handleResponse<SessionResponse>(response);

    return result;
  },

  async logout(): Promise<void> {
    const response = await fetch(AUTH_SESSION_ENDPOINT, {
      method: "DELETE",
      credentials: "include",
    });

    await handleResponse<{ success: boolean }>(response);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  },

  async getSession(): Promise<SessionResponse | null> {
    try {
      const response = await fetch(AUTH_SESSION_ENDPOINT, {
        method: "GET",
        credentials: "include",
      });
      return await handleResponse<SessionResponse>(response);
    } catch {
      return null;
    }
  },
};

export const authQueryKeys = {
  all: () => ["auth"] as const,
  session: () => ["auth", "session"] as const,
  detail: (id: string) => ["auth", "detail", id] as const,
};

