const STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "images";

const NEXT_PUBLIC_SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(
  /\/$/,
  "",
);
const STORAGE_PUBLIC_BASE = NEXT_PUBLIC_SUPABASE_URL
  ? `${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}`
  : "";

export type StorageUploadParams = {
  path: string;
  file: File | Blob;
  contentType?: string;
};

export const uploadImage = async ({
  path,
  file,
  contentType,
}: StorageUploadParams) => {
  if (typeof window === "undefined") {
    throw new Error("uploadImage can only be called from the browser.");
  }

  const formData = new FormData();
  formData.append("path", path);
  if (contentType ?? file.type) {
    formData.append("contentType", contentType ?? file.type);
  }
  formData.append("file", file);

  const response = await fetch("/api/storage/upload", {
    method: "POST",
    body: formData,
  });

  const result = await response.json().catch(() => ({ success: false }));

  if (!response.ok || !result?.success) {
    throw new Error(result?.message ?? "Failed to upload image");
  }

  if (typeof result.publicUrl === "string" && result.publicUrl.length > 0) {
    return result.publicUrl as string;
  }

  return `${STORAGE_PUBLIC_BASE}/${path}`;
};

export const uploadImageFromBrowser = async (
  path: string,
  file: File,
  contentType?: string,
) => uploadImage({ path, file, contentType });

export const getPublicImageUrl = (path: string) => {
  if (!path) {
    return "";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${STORAGE_PUBLIC_BASE}/${path}`;
};

export const deleteImages = async (paths: string[]) => {
  if (typeof window === "undefined" || paths.length === 0) {
    return;
  }

  const response = await fetch("/api/storage/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paths }),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({ message: "" }));
    throw new Error(result?.message ?? "Failed to delete images");
  }
};

export const createSignedImageUrl = async (_path: string) => {
  return getPublicImageUrl(_path);
};
