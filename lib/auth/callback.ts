import type { Session } from "@supabase/supabase-js";

const buildCallbackSearchParams = (
  session: Session,
  redirectPath: string,
) => {
  const params = new URLSearchParams({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    redirect: redirectPath,
  });

  if (session.expires_at) {
    params.set("expires_at", String(session.expires_at));
  }

  if (session.expires_in) {
    params.set("expires_in", String(session.expires_in));
  }

  return params;
};

export const redirectViaAuthCallback = (
  session: Session,
  redirectPath: string,
) => {
  const params = buildCallbackSearchParams(session, redirectPath);
  window.location.replace(`/api/auth/callback?${params.toString()}`);
};

