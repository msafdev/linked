import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DASHBOARD_COOKIE = "dashboard-id";

function sanitizeRedirect(path: string | null, request: NextRequest) {
  if (!path || !path.startsWith("/")) {
    return new URL("/", request.url);
  }

  return new URL(path, request.url);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user");
  const redirectPath = searchParams.get("redirect");

  const destination = sanitizeRedirect(redirectPath, request);

  const response = NextResponse.redirect(destination);

  if (userId) {
    response.cookies.set({
      name: DASHBOARD_COOKIE,
      value: userId,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });
  }

  return response;
}
