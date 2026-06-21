import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function calculateReadTime(text: string | null | undefined): number {
  if (!text?.trim()) return 0;

  const words = text.trim().split(/\s+/).length;

  return Math.max(1, Math.ceil(words / 200));
}

export type SlateBgVariant = 'warm_white' | 'cool_gray' | 'cream';

export const SLATE_BACKGROUNDS = {
  cool_gray: {
    renderer: "from-zinc-50 via-zinc-100 to-zinc-200",
    preview: "from-zinc-50 to-zinc-200"
  },
  warm_white: {
    renderer: "from-stone-50 via-stone-100/50 to-stone-100",
    preview: "from-stone-50 to-stone-100"
  },
  cream: {
    renderer: "from-amber-50/60 via-amber-50 to-amber-100/70",
    preview: "from-amber-50/60 to-amber-100"
  }
} as const;
