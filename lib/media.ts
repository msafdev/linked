import { SectionRow } from "@/lib/supabase";
import { MediaResource } from "@/types/cv";

function isMediaResource(v: any): v is MediaResource {
  return (
    v && typeof v === "object" && typeof v.src === "string" && v.src.length > 0
  );
}

export function extractAvatarSrcFromContent(rows: SectionRow[]): string | null {
  const profileRow = rows.find((r) => r.section === "profile");
  const data = (profileRow?.data ?? {}) as any;

  const list: any[] = Array.isArray(data?.avatar)
    ? data.avatar
    : data?.avatar
      ? [data.avatar]
      : [];

  const firstValid = list.find(isMediaResource);
  return firstValid?.src ?? null;
}
