import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/types";
import { defaultSectionInitialValues } from "@/lib/schema";

const ACCESS_COOKIE = "sb-access-token";
const REFRESH_COOKIE = "sb-refresh-token";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, mode } = body;

    if (!email || !mode || !password) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { success: false, message: "Supabase environment variables are not configured" },
        { status: 500 },
      );
    }

    const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

    const ensureAccountBootstrap = async (
      client: SupabaseClient<Database>,
      targetUser: User,
      fallbackEmail: string,
    ) => {
      const userId = targetUser.id;
      const userEmail = targetUser.email ?? fallbackEmail;

      if (!userId || !userEmail) {
        return;
      }

      const clonedDefaults = JSON.parse(
        JSON.stringify(defaultSectionInitialValues),
      ) as typeof defaultSectionInitialValues;

      const { settings: defaultSettings, ...sectionDefaults } = clonedDefaults;

      const fullName =
        typeof targetUser.user_metadata?.full_name === "string" &&
        targetUser.user_metadata.full_name.trim().length > 0
          ? targetUser.user_metadata.full_name.trim()
          : userEmail.split("@")[0] ?? "New user";

      const profileDefaults = {
        ...sectionDefaults.profile,
        name: fullName,
      };

      sectionDefaults.profile = profileDefaults;
      clonedDefaults.profile = profileDefaults;

      const { data: accountsForEmail } = await client
        .from("account")
        .select("id")
        .eq("email", userEmail);

      const strayIds =
        accountsForEmail
          ?.map((row) => row.id)
          .filter((id): id is string => Boolean(id && id !== userId)) ?? [];

      if (strayIds.length > 0) {
        await client.from("content").delete().in("account_id", strayIds);
        await client.from("setting").delete().in("account_id", strayIds);
        await client.from("account").delete().in("id", strayIds);
      }

      await client.from("account").upsert(
        {
          id: userId,
          email: userEmail,
          full_name: fullName,
          avatar_url:
            typeof targetUser.user_metadata?.avatar_url === "string"
              ? targetUser.user_metadata.avatar_url
              : null,
        },
        { onConflict: "id" },
      );

      const { data: existingSections } = await client
        .from("content")
        .select("section")
        .eq("account_id", userId);

      const existingSectionSet = new Set(
        existingSections?.map((row) => row.section) ?? [],
      );

      const contentPayload = Object.entries(sectionDefaults)
        .filter(([section]) => !existingSectionSet.has(section))
        .map(([section, data]) => ({
          account_id: userId,
          section,
          data,
        }));

      if (contentPayload.length > 0) {
        await client.from("content").insert(contentPayload);
      }

      const { data: existingSetting } = await client
        .from("setting")
        .select("id")
        .eq("account_id", userId)
        .maybeSingle();

      if (!existingSetting) {
        let defaultDomain = userEmail
          .split("@")[0]
          ?.replace(/[^a-z0-9]/gi, "")
          .toLowerCase()
          .slice(0, 32);

        if (!defaultDomain || defaultDomain.length < 3) {
          defaultDomain = `${userId.replace(/-/g, "").slice(0, 8)}`;
        }

        const { data: conflictingDomains } = await client
          .from("setting")
          .select("id")
          .eq("domain", defaultDomain)
          .not("account_id", "eq", userId);

        if (conflictingDomains && conflictingDomains.length > 0) {
          defaultDomain = `${defaultDomain}-${userId.slice(0, 4)}`;
        }

        const preferences = {
          sections: clonedDefaults,
        };

        await client.from("setting").insert({
          account_id: userId,
          domain: defaultDomain,
          billing_status: defaultSettings.billingStatus,
          billing_type: defaultSettings.billingType,
          preferences,
        });
      }
    };

    const isLogin = mode === "login";

    const authResult = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error.message },
        { status: 401 },
      );
    }

    let { session, user } = authResult.data;

    if (!session || !user) {
      const followUp = await supabase.auth.signInWithPassword({ email, password });

      if (followUp.error || !followUp.data.session || !followUp.data.user) {
        return NextResponse.json(
          {
            success: false,
            message:
              followUp.error?.message ??
              "Unable to establish Supabase session for the provided credentials",
          },
          { status: 401 },
        );
      }

      session = followUp.data.session;
      user = followUp.data.user;
    }

    const accessToken = session.access_token;
    const refreshToken = session.refresh_token;

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { success: false, message: "Supabase did not return the expected tokens" },
        { status: 401 },
      );
    }

    if (user) {
      await ensureAccountBootstrap(supabase, user, email);
    }


    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email ?? email,
      },
      session: {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: session.expires_at ?? null,
        expires_in: session.expires_in ?? null,
        token_type: session.token_type ?? "bearer",
      },
    });

    response.cookies.set(ACCESS_COOKIE, accessToken, COOKIE_OPTIONS);
    response.cookies.set(REFRESH_COOKIE, refreshToken, COOKIE_OPTIONS);

    return response;
  } catch (error) {
    console.error("[Auth Session Error]", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;

  if (!accessToken || !refreshToken) {
    const response = NextResponse.json({ success: false, user: null }, { status: 401 });

    if (!accessToken) {
      response.cookies.set(ACCESS_COOKIE, "", { ...COOKIE_OPTIONS, maxAge: 0 });
    }

    if (!refreshToken) {
      response.cookies.set(REFRESH_COOKIE, "", { ...COOKIE_OPTIONS, maxAge: 0 });
    }

    return response;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json(
      { success: false, message: "Supabase environment variables are not configured" },
      { status: 500 },
    );
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error || !data.session || !data.user) {
    const response = NextResponse.json({ success: false, user: null }, { status: 401 });

    response.cookies.set(ACCESS_COOKIE, "", { ...COOKIE_OPTIONS, maxAge: 0 });
    response.cookies.set(REFRESH_COOKIE, "", { ...COOKIE_OPTIONS, maxAge: 0 });

    return response;
  }

  const nextAccessToken = data.session.access_token ?? accessToken;
  const nextRefreshToken = data.session.refresh_token ?? refreshToken;

  const response = NextResponse.json({
    success: true,
    user: {
      id: data.user.id,
      email: data.user.email,
      role: data.user.role,
      app_metadata: data.user.app_metadata,
      user_metadata: data.user.user_metadata,
      aud: data.user.aud,
      created_at: data.user.created_at,
      last_sign_in_at: data.user.last_sign_in_at,
    },
    session: {
      access_token: nextAccessToken,
      refresh_token: nextRefreshToken,
      expires_at: data.session.expires_at ?? null,
      expires_in: data.session.expires_in ?? null,
      token_type: data.session.token_type ?? "bearer",
    },
  });

  response.cookies.set(ACCESS_COOKIE, nextAccessToken, COOKIE_OPTIONS);
  response.cookies.set(REFRESH_COOKIE, nextRefreshToken, COOKIE_OPTIONS);

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });

  response.cookies.set(ACCESS_COOKIE, "", { ...COOKIE_OPTIONS, maxAge: 0 });
  response.cookies.set(REFRESH_COOKIE, "", { ...COOKIE_OPTIONS, maxAge: 0 });

  return response;
}




