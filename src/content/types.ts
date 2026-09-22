// Shape of the data in src/content. Components read from these files rather than hard-coding text.

export interface Link {
  label: string
  href: string
}

export type ProjectCategory = 'Machine Learning' | 'Data Engineering' | 'Deep Learning' | 'Optimization' | 'Full-Stack'

/** Which illustrative visual to render for the project (see components/visuals). */
export type ProjectVisual = 'mindease' | 'student-performance' | 'supply-chain' | 'cnn' | 'etl'

export interface Metric {
  value: string
  label: string
  /** Where the number comes from — shown on hover so claims stay verifiable. */
  source: string
}

export interface Project {
  slug: string
  title: string
  shortTitle: string
  tagline: string
  period: string
  categories: ProjectCategory[]
  featured: boolean
  context?: string // e.g. "Codtech IT Solutions internship"
  problem: string
  approach: string[]
  contribution: string[]
  results: string[]
  metrics: Metric[]
  stack: string[]
  links: { github?: string; live?: string }
  visual: ProjectVisual
  accent: string // CSS colour used for the card glow
}

export interface ExperienceItem {
  role: string
  organization: string
  type: string
  period: string
  duration?: string
  location: string
  summary: string
  highlights: string[]
  stack?: string[]
  relatedProjects?: string[] // project slugs
  credential?: Link
}

export interface SkillGroup {
  name: string
  icon: 'code' | 'server' | 'brain' | 'chart' | 'database' | 'target' | 'tool' | 'layout'
  skills: string[]
}

export interface Certification {
  title: string
  issuer: string
  /** Paste the credential / verification URL here when available. */
  url: string | null
}

export interface Education {
  degree: string
  field: string
  specialization: string
  institution: string
  location: string
  period: string
}
