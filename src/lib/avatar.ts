/**
 * Extract initials from a user's display name.
 * Returns the first letter of the first word and the first letter of the last word (e.g. "Nanda Sai" -> "NS").
 * Falls back to "U" if name is null, undefined, or empty.
 */
export function getInitials(name: string | null | undefined): string {
  if (!name) return 'U';

  const trimmed = name.trim();
  if (!trimmed) return 'U';

  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  const firstLetter = parts[0].charAt(0).toUpperCase();
  const lastLetter = parts[parts.length - 1].charAt(0).toUpperCase();

  return `${firstLetter}${lastLetter}`;
}

const AVATAR_COLORS = [
  'bg-violet-500/10 text-violet-600 border-violet-200/30 backdrop-blur-md dark:bg-violet-950/30 dark:text-violet-400 dark:border-violet-900/30',
  'bg-pink-500/10 text-pink-600 border-pink-200/30 backdrop-blur-md dark:bg-pink-950/30 dark:text-pink-400 dark:border-pink-900/30',
  'bg-emerald-500/10 text-emerald-600 border-emerald-200/30 backdrop-blur-md dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30',
  'bg-blue-500/10 text-blue-600 border-blue-200/30 backdrop-blur-md dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30',
  'bg-amber-500/10 text-amber-600 border-amber-200/30 backdrop-blur-md dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30',
  'bg-rose-500/10 text-rose-600 border-rose-200/30 backdrop-blur-md dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30',
];

/**
 * Generate a consistent glassmorphic color theme based on the user's name.
 */
export function getAvatarColorClass(name: string | null | undefined): string {
  if (!name) return AVATAR_COLORS[0];

  const trimmed = name.trim();
  let hash = 0;
  for (let i = 0; i < trimmed.length; i++) {
    hash = trimmed.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}
