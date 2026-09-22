// Settings that vary per deployment come from env vars (see .env.example).
export const siteConfig = {
  /** Formspree form ID — when empty, the contact form falls back to mailto. */
  formspreeId: (import.meta.env.VITE_FORMSPREE_ID as string | undefined)?.trim() || '',
  /** GitHub username used for the live repositories feed. */
  githubUser: 'abhisheksharmaxdev',
}
