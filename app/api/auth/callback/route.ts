import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { decodeJwtPayload, isTokenExpired } from "@/lib/auth/token";

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

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const accessTokenParam = searchParams.get("access_token");
  const refreshTokenParam = searchParams.get("refresh_token");
  const expiresAtParam = searchParams.get("expires_at");
  const expiresInParam = searchParams.get("expires_in");

  const redirectPath = getRedirectPath(searchParams);

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
