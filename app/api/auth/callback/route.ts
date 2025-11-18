import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { createServerClient } from "@supabase/ssr";

import { decodeJwtPayload, isTokenExpired } from "@/lib/auth/token";
import type { Database } from "@/lib/supabase/types";

const ACCESS_COOKIE = "sb-access-token";
const REFRESH_COOKIE = "sb-refresh-token";
const DEFAULT_REDIRECT = "/dashboard/profile";
const LOGIN_PATH = "/auth/login";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

const getRedirectPath = (searchParams: URLSearchParams): string => {
  const redirect = searchParams.get("redirect");
  return redirect?.startsWith("/") ? redirect : DEFAULT_REDIRECT;
};

const createRedirectUrl = (
  path: string,
  origin: string,
  redirectParam?: string,
): URL => {
  const url = new URL(path, origin);
  if (redirectParam) {
    url.searchParams.set("redirect", redirectParam);
  }
  return url;
};

const isValidToken = (token: string): boolean => {
  try {
    const payload = decodeJwtPayload(token);

    if (!payload?.sub || typeof payload.sub !== "string") {
      return false;
    }

    return !isTokenExpired(payload);
  } catch {
    return false;
  }
};

const createSupabaseServerClient = async () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are not configured");
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(
        name: string,
        value: string,
        options?: Parameters<typeof cookieStore.set>[2],
      ) {
        cookieStore.set(name, value, options);
      },
      remove(name: string) {
        cookieStore.delete(name);
      },
    },
  });
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const isLogout = searchParams.get("logout") === "1";
  const codeParam = searchParams.get("code");
  const accessTokenParam = searchParams.get("access_token");
  const refreshTokenParam = searchParams.get("refresh_token");
  const expiresAtParam = searchParams.get("expires_at");
  const expiresInParam = searchParams.get("expires_in");

  const redirectPath = getRedirectPath(searchParams);

  if (isLogout) {
    const response = NextResponse.json({ success: true });
    response.cookies.set(ACCESS_COOKIE, "", { ...COOKIE_OPTIONS, maxAge: 0 });
    response.cookies.set(REFRESH_COOKIE, "", { ...COOKIE_OPTIONS, maxAge: 0 });
    return response;
  }

  if (codeParam) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } =
        await supabase.auth.exchangeCodeForSession(codeParam);

      if (error || !data.session) {
        console.error("[Auth Callback] Failed to exchange code", error);
        const loginUrl = createRedirectUrl(
          LOGIN_PATH,
          request.url,
          redirectPath,
        );
        return NextResponse.redirect(loginUrl);
      }

      const session = data.session;
      const accessToken = session.access_token;
      const refreshToken = session.refresh_token;

      if (!accessToken || !refreshToken) {
        console.error("[Auth Callback] Missing tokens after exchange", session);
        const loginUrl = createRedirectUrl(
          LOGIN_PATH,
          request.url,
          redirectPath,
        );
        return NextResponse.redirect(loginUrl);
      }

      const expiresDate = session.expires_at
        ? new Date(session.expires_at * 1000)
        : undefined;

      const response = NextResponse.redirect(
        createRedirectUrl(redirectPath, request.url),
      );

      response.cookies.set(ACCESS_COOKIE, accessToken, {
        ...COOKIE_OPTIONS,
        expires: expiresDate,
      });
      response.cookies.set(REFRESH_COOKIE, refreshToken, {
        ...COOKIE_OPTIONS,
        expires: expiresDate,
      });

      return response;
    } catch (error) {
      console.error("[Auth Callback] Unexpected error exchanging code", error);
      const loginUrl = createRedirectUrl(LOGIN_PATH, request.url, redirectPath);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (accessTokenParam && refreshTokenParam) {
    const expiresAt = expiresAtParam
      ? Number.parseInt(expiresAtParam, 10) * 1000
      : null;
    const expiresInSeconds = expiresInParam
      ? Number.parseInt(expiresInParam, 10)
      : null;
    const expiresDate = expiresAt
      ? new Date(expiresAt)
      : expiresInSeconds
        ? new Date(Date.now() + expiresInSeconds * 1000)
        : undefined;

    const response = NextResponse.redirect(
      createRedirectUrl(redirectPath, request.url),
    );

    response.cookies.set(ACCESS_COOKIE, accessTokenParam, {
      ...COOKIE_OPTIONS,
      expires: expiresDate,
    });
    response.cookies.set(REFRESH_COOKIE, refreshTokenParam, {
      ...COOKIE_OPTIONS,
      expires: expiresDate,
    });

    return response;
  }

  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;

  if (!accessToken || !isValidToken(accessToken)) {
    const loginUrl = createRedirectUrl(LOGIN_PATH, request.url, redirectPath);
    return NextResponse.redirect(loginUrl);
  }

  const destinationUrl = createRedirectUrl(redirectPath, request.url);
  return NextResponse.redirect(destinationUrl);
}
