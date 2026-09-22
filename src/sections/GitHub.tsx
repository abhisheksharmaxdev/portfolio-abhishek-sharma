import { useMemo } from 'react'
import { motion } from 'motion/react'
import { profile, projects } from '@/content'
import { siteConfig } from '@/config/site'
import { useGitHubRepos, type Repo } from '@/hooks/useGitHubRepos'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { Reveal, staggerChild, staggerParent } from '@/components/ui/Reveal'
import { Icon } from '@/components/ui/Icon'
import { ButtonLink } from '@/components/ui/Button'
import { useProjectModal } from '@/components/projects/ProjectModalContext'

const langColors: Record<string, string> = {
  Python: '#3572A5',
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  'Jupyter Notebook': '#DA5B0B',
  HTML: '#e34c26',
  CSS: '#663399',
}

/** Offline / rate-limit fallback built from the local project content. */
const fallbackRepos: Repo[] = projects
  .filter((p) => p.links.github)
  .map((p) => ({
    name: p.links.github!.split('/').pop()!,
    description: p.tagline,
    html_url: p.links.github!,
    homepage: p.links.live ?? null,
    language: p.stack.includes('Angular') ? 'TypeScript' : 'Python',
    stargazers_count: 0,
    forks_count: 0,
    updated_at: '',
    fork: false,
  }))

function timeAgo(iso: string) {
  if (!iso) return ''
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
  if (days < 1) return 'updated today'
  if (days < 30) return `updated ${days}d ago`
  const months = Math.floor(days / 30)
  return months < 12 ? `updated ${months}mo ago` : `updated ${Math.floor(months / 12)}y ago`
}

export function GitHub() {
  const { repos, status } = useGitHubRepos(siteConfig.githubUser)
  const list = status === 'ready' && repos?.length ? repos : fallbackRepos
  const { openProject } = useProjectModal()

  const languages = useMemo(() => {
    const counts = new Map<string, number>()
    list.forEach((r) => r.language && counts.set(r.language, (counts.get(r.language) ?? 0) + 1))
    const total = [...counts.values()].reduce((a, b) => a + b, 0) || 1
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name, n]) => ({ name, pct: (n / total) * 100 }))
  }, [list])

  const slugFor = (repo: Repo) => projects.find((p) => p.links.github?.toLowerCase().endsWith('/' + repo.name.toLowerCase()))?.slug

  return (
    <section id="github" className="section scroll-mt-20" aria-labelledby="github-title">
      <div className="container-x">
        <SectionHeading
          id="github-title"
          index="06"
          eyebrow="Open source"
          title="On GitHub"
          description="Every project on this site is public, with code, documentation and generated outputs you can check yourself."
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          <Reveal>
            <SpotlightCard className="flex h-full flex-col p-6">
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-2xl border border-line bg-surface-2">
                  <Icon name="github" size={24} />
                </span>
                <div>
                  <p className="font-display text-lg font-semibold">@{profile.socials.github.handle}</p>
                  <p className="text-sm text-muted">{list.length} public repositories</p>
                </div>
              </div>

              <div className="mt-7">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-faint">Languages by repo</p>
                <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-surface-2">
                  {languages.map((l) => (
                    <motion.span
                      key={l.name}
                      className="h-full"
                      style={{ background: langColors[l.name] ?? 'var(--accent)' }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${l.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    />
                  ))}
                </div>
                <ul className="mt-3 space-y-1.5">
                  {languages.map((l) => (
                    <li key={l.name} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted">
                        <span className="size-2.5 rounded-full" style={{ background: langColors[l.name] ?? 'var(--accent)' }} />
                        {l.name}
                      </span>
                      <span className="font-mono text-xs text-faint">{Math.round(l.pct)}%</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-8">
                <ButtonLink href={profile.socials.github.href} className="w-full">
                  <Icon name="github" size={16} /> View GitHub profile
                </ButtonLink>
              </div>
            </SpotlightCard>
          </Reveal>

          <motion.ul
            variants={staggerParent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-10%' }}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
            aria-busy={status === 'loading'}
          >
            {list.map((r) => {
              const slug = slugFor(r)
              return (
                <motion.li key={r.name} variants={staggerChild} className="h-full">
                  <SpotlightCard className="group flex h-full flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <a
                        href={r.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 font-mono text-[0.92rem] font-medium text-fg after:absolute after:inset-0 after:rounded-[inherit] hover:text-accent"
                      >
                        <Icon name="layers" size={15} className="shrink-0 text-accent" />
                        <span className="break-all">{r.name}</span>
                      </a>
                      <Icon name="arrow-up-right" size={15} className="shrink-0 text-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
                    </div>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{r.description ?? 'No description'}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.7rem] text-faint">
                      {r.language && (
                        <span className="flex items-center gap-1.5">
                          <span className="size-2 rounded-full" style={{ background: langColors[r.language] ?? 'var(--accent)' }} />
                          {r.language}
                        </span>
                      )}
                      {r.stargazers_count > 0 && (
                        <span className="flex items-center gap-1">
                          <Icon name="star" size={12} /> {r.stargazers_count}
                        </span>
                      )}
                      {r.updated_at && <span>{timeAgo(r.updated_at)}</span>}
                      {slug && (
                        <button
                          type="button"
                          onClick={() => openProject(slug)}
                          className="relative z-10 ml-auto rounded-full border border-line px-2.5 py-1 text-[0.68rem] text-muted transition-colors hover:border-accent hover:text-fg"
                        >
                          Case study
                        </button>
                      )}
                    </div>
                  </SpotlightCard>
                </motion.li>
              )
            })}
          </motion.ul>
        </div>
      </div>
    </section>
  )
}
