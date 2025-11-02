import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Buffer } from "node:buffer";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/types";

const STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "images";

const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
);

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");
  const path = formData.get("path");
  const contentType = formData.get("contentType")?.toString() ?? undefined;

  if (
    !(file instanceof File) ||
    typeof path !== "string" ||
    path.length === 0
  ) {
    return NextResponse.json(
      { success: false, message: "Invalid upload payload" },
      { status: 400 },
    );
  }

  const accessToken = (await cookies()).get("sb-access-token")?.value ?? "";

  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const { data: userData, error: userError } =
    await supabaseAdmin.auth.getUser(accessToken);

  if (userError || !userData?.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const { data, error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(path, fileBuffer, {
      cacheControl: "3600",
      upsert: true,
      contentType: (contentType ?? file.type) || "application/octet-stream",
    });

  if (error) {
    console.error("[Storage][Upload] error", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }

  const { data: publicData } = supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(data.path);

  return NextResponse.json({
    success: true,
    path: data.path,
    publicUrl: publicData.publicUrl,
  });
}
