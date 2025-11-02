import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { ReadCV } from "@/types/cv";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function selectAvatarSource(
  avatar: ReadCV["profile"]["avatar"],
): { src?: string; alt?: string } | null {
  if (!avatar) {
    return null;
  }

  if (Array.isArray(avatar)) {
    return avatar[0] ?? null;
  }

  return avatar;
}
