import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { projects, type Project } from '@/content'
import { lockScroll } from '@/lib/scroll'
import { EASE } from '@/lib/utils'
import { Icon } from '@/components/ui/Icon'
import { ButtonLink } from '@/components/ui/Button'
import { ProjectVisual } from '@/components/visuals/ProjectVisual'

interface Props {
  project: Project | null
  onClose: () => void
  onNavigate: (slug: string) => void
}

/** Accessible case-study dialog: focus trap, Esc to close, focus restore. */
export function ProjectModal({ project, onClose, onNavigate }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const lastFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!project) return
    lastFocused.current ??= document.activeElement as HTMLElement
    lockScroll(true)
    const t = setTimeout(() => panelRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus(), 50)
    panelRef.current?.scrollTo({ top: 0 })

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        )
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  }, [project, onClose])

  useEffect(() => {
    if (project) return
    lockScroll(false)
    lastFocused.current?.focus?.({ preventScroll: true })
    lastFocused.current = null
  }, [project])

  const idx = project ? projects.findIndex((p) => p.slug === project.slug) : -1
  const next = idx >= 0 ? projects[(idx + 1) % projects.length] : null

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden />
          <motion.div
            ref={panelRef}
            key={project.slug}
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-title"
            data-lenis-prevent
            className="relative max-h-[92svh] w-full max-w-4xl overflow-y-auto overscroll-contain rounded-t-3xl border border-line bg-bg-elev shadow-2xl sm:rounded-3xl"
            initial={{ y: 60, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{ ['--spot' as string]: project.accent }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-line bg-bg-elev/90 px-5 py-3 backdrop-blur sm:px-8">
              <span className="eyebrow truncate">Case study · {project.categories.join(' · ')}</span>
              <button
                type="button"
                data-autofocus
                onClick={onClose}
                className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-fg"
                aria-label="Close case study"
              >
                <Icon name="x" />
              </button>
            </div>

            <div className="px-5 pt-6 pb-8 sm:px-8">
              <p className="font-mono text-xs text-faint">
                {project.period}
                {project.context && <> · {project.context}</>}
              </p>
              <h2 id="case-title" className="mt-2 text-[clamp(1.6rem,4vw,2.4rem)] font-semibold leading-tight">
                {project.title}
              </h2>
              <p className="mt-3 max-w-2xl text-muted">{project.tagline}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {project.links.live && (
                  <ButtonLink href={project.links.live} size="sm">
                    <Icon name="globe" size={15} /> Live demo
                  </ButtonLink>
                )}
                {project.links.github && (
                  <ButtonLink href={project.links.github} size="sm" variant={project.links.live ? 'secondary' : 'primary'}>
                    <Icon name="github" size={15} /> Source code
                  </ButtonLink>
                )}
              </div>

              <div className="mt-7 aspect-[16/10] w-full sm:aspect-[16/8]">
                <ProjectVisual visual={project.visual} />
              </div>
              <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {project.metrics.map((m) => (
                  <div key={m.label} className="rounded-2xl border border-line bg-surface p-4">
                    <dt className="text-xs text-muted">{m.label}</dt>
                    <dd className="mt-1 font-display text-2xl font-semibold text-gradient">{m.value}</dd>
                    <dd className="mt-2 font-mono text-[0.62rem] leading-relaxed text-faint">Source: {m.source}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[1fr_1.3fr]">
                <section>
                  <h3 className="eyebrow">The problem</h3>
                  <p className="mt-3 leading-relaxed text-fg/90">{project.problem}</p>

                  <h3 className="eyebrow mt-8">Tech stack</h3>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {project.stack.map((s) => (
                      <li key={s} className="chip">
                        {s}
                      </li>
                    ))}
                  </ul>
                </section>
                <div className="space-y-8">
                  <CaseList title="Approach" items={project.approach} />
                  <CaseList title="My contribution" items={project.contribution} />
                  <CaseList title="Results" items={project.results} accent />
                </div>
              </div>

              {next && next.slug !== project.slug && (
                <button
                  type="button"
                  onClick={() => onNavigate(next.slug)}
                  className="group mt-12 flex w-full items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-5 text-left transition-colors hover:border-accent"
                >
                  <span>
                    <span className="eyebrow">Next project</span>
                    <span className="mt-1 block font-display text-lg font-semibold">{next.shortTitle}</span>
                  </span>
                  <Icon name="arrow-right" size={20} className="shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-fg" />
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function CaseList({ title, items, accent }: { title: string; items: string[]; accent?: boolean }) {
  return (
    <section>
      <h3 className="eyebrow">{title}</h3>
      <ul className="mt-3 space-y-2.5">
        {items.map((it) => (
          <li key={it} className="flex gap-3 leading-relaxed text-fg/90">
            <span
              aria-hidden
              className={`mt-[0.6em] size-1.5 shrink-0 rounded-full ${accent ? 'bg-accent-2' : 'bg-accent'}`}
            />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
