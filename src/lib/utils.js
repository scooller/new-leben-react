/**
 * Simple className merge utility.
 * Replaces shadcn's `cn` (clsx + tailwind-merge) for non-Tailwind projects.
 * Filters falsy values and joins with spaces.
 */
export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ')
}
