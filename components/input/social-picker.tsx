"use client";

import type { IconType } from "react-icons";
import {
  PiBehanceLogoBold,
  PiDribbbleLogo,
  PiEnvelopeSimpleBold,
  PiFacebookLogoBold,
  PiGithubLogoBold,
  PiInstagramLogoBold,
  PiLinkedinLogoBold,
  PiThreadsLogoBold,
  PiTwitterLogoBold,
  PiYoutubeLogoBold,
} from "react-icons/pi";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type SocialOption = {
  value: string;
  label: string;
  icon: IconType;
  valuePlaceholder: string;
  urlPrefix: "mailto:" | "https://";
  urlPlaceholder: string;
};

export const SOCIAL_OPTIONS: SocialOption[] = [
  {
    value: "Email",
    label: "Email",
    icon: PiEnvelopeSimpleBold,
    valuePlaceholder: "you@example.com",
    urlPrefix: "mailto:",
    urlPlaceholder: "you@example.com",
  },
  {
    value: "Instagram",
    label: "Instagram",
    icon: PiInstagramLogoBold,
    valuePlaceholder: "@username",
    urlPrefix: "https://",
    urlPlaceholder: "instagram.com/username",
  },
  {
    value: "Threads",
    label: "Threads",
    icon: PiThreadsLogoBold,
    valuePlaceholder: "@username",
    urlPrefix: "https://",
    urlPlaceholder: "threads.net/@username",
  },
  {
    value: "Twitter",
    label: "Twitter",
    icon: PiTwitterLogoBold,
    valuePlaceholder: "@username",
    urlPrefix: "https://",
    urlPlaceholder: "twitter.com/username",
  },
  {
    value: "Facebook",
    label: "Facebook",
    icon: PiFacebookLogoBold,
    valuePlaceholder: "username",
    urlPrefix: "https://",
    urlPlaceholder: "facebook.com/username",
  },
  {
    value: "YouTube",
    label: "YouTube",
    icon: PiYoutubeLogoBold,
    valuePlaceholder: "@channel",
    urlPrefix: "https://",
    urlPlaceholder: "youtube.com/@channel",
  },
  {
    value: "Behance",
    label: "Behance",
    icon: PiBehanceLogoBold,
    valuePlaceholder: "username",
    urlPrefix: "https://",
    urlPlaceholder: "behance.net/username",
  },
  {
    value: "Dribbble",
    label: "Dribbble",
    icon: PiDribbbleLogo,
    valuePlaceholder: "username",
    urlPrefix: "https://",
    urlPlaceholder: "dribbble.com/username",
  },
  {
    value: "GitHub",
    label: "GitHub",
    icon: PiGithubLogoBold,
    valuePlaceholder: "username",
    urlPrefix: "https://",
    urlPlaceholder: "github.com/username",
  },
  {
    value: "LinkedIn",
    label: "LinkedIn",
    icon: PiLinkedinLogoBold,
    valuePlaceholder: "username",
    urlPrefix: "https://",
    urlPlaceholder: "linkedin.com/in/username",
  },
];

export type SocialPickerProps = {
  value?: string;
  onChange: (next: string) => void;
  placeholder?: string;
  className?: string;
};

export function SocialPicker({
  value = "",
  onChange,
  placeholder = "Select a platform",
  className,
}: SocialPickerProps) {
  const selectedOption =
    SOCIAL_OPTIONS.find((option) => option.value === value) ?? null;
  const Icon = selectedOption?.icon;

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          "[&>span]:flex [&>span]:items-center [&>span]:gap-3 [&>span_svg]:shrink-0 [&>span_svg]:text-muted-foreground/80 w-full",
          className,
        )}
      >
        <SelectValue placeholder={placeholder}>
          {Icon ? (
            <span className="flex items-center gap-2">
              <Icon size={16} aria-hidden="true" />
              <span className="truncate">{selectedOption.label}</span>
            </span>
          ) : null}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80">
        {SOCIAL_OPTIONS.map((option) => {
          const Icon = option.icon;
          return (
            <SelectItem
              key={option.value}
              value={option.value}
              textValue={option.label}
            >
              <Icon size={16} aria-hidden="true" />
              <span className="truncate">{option.label}</span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

export default SocialPicker;
