export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

// Shared easing curve for most transitions.
export const EASE = [0.16, 1, 0.3, 1] as const
