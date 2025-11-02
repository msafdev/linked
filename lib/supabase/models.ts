import type { SupabaseClient, User } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type PublicTables = Database["public"]["Tables"];

export type Account = PublicTables["account"]["Row"];
export type AccountInsert = PublicTables["account"]["Insert"];
export type AccountUpdate = PublicTables["account"]["Update"];

export type Content = PublicTables["content"]["Row"];
export type ContentUpsert = PublicTables["content"]["Insert"] &
  PublicTables["content"]["Update"];

export type Setting = PublicTables["setting"]["Row"];
export type SettingUpsert = PublicTables["setting"]["Insert"] &
  PublicTables["setting"]["Update"];

const getClient = (): SupabaseClient<Database> => createSupabaseServerClient();

export const getAccountById = async (id: string, client = getClient()) => {
  const { data, error } = await client
    .from("account")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
};

export const ensureAccountForUser = async (
  user: User,
  client = getClient(),
) => {
  if (!user.email) {
    throw new Error("Supabase user is missing an email address.");
  }

  const existing = await getAccountById(user.id, client);
  if (existing) {
    return existing;
  }

  const fullName =
    (typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : null) ??
    (typeof user.user_metadata?.name === "string"
      ? user.user_metadata.name
      : null) ??
    null;

  const avatarUrl =
    typeof user.user_metadata?.avatar_url === "string"
      ? user.user_metadata.avatar_url
      : null;

  const { data, error } = await client
    .from("account")
    .upsert(
      {
        id: user.id,
        email: user.email,
        full_name: fullName,
        avatar_url: avatarUrl,
      },
      { onConflict: "id" },
    )
    .select()
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (data) {
    return data;
  }

  return getAccountById(user.id, client);
};

export const upsertAccount = async (
  payload: AccountInsert,
  client = getClient(),
) => {
  const { data, error } = await client
    .from("account")
    .upsert(payload, { onConflict: "id" })
    .select()
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
};

export const getContentBySection = async (
  accountId: string,
  section: string,
  client = getClient(),
) => {
  const { data, error } = await client
    .from("content")
    .select("*")
    .eq("account_id", accountId)
    .eq("section", section)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
};

export const upsertContent = async (
  payload: ContentUpsert,
  client = getClient(),
) => {
  const { data, error } = await client
    .from("content")
    .upsert(payload, { onConflict: "account_id,section" })
    .select()
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
};

export const getSettingByAccountId = async (
  accountId: string,
  client = getClient(),
) => {
  const { data, error } = await client
    .from("setting")
    .select("*")
    .eq("account_id", accountId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
};

export const upsertSetting = async (
  payload: SettingUpsert,
  client = getClient(),
) => {
  const { data, error } = await client
    .from("setting")
    .upsert(payload, { onConflict: "account_id" })
    .select()
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
};
