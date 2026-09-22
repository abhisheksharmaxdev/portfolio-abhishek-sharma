import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { projectCategories, projects, type Project } from '@/content'
import { cn, EASE } from '@/lib/utils'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { Icon } from '@/components/ui/Icon'
import { ProjectVisual } from '@/components/visuals/ProjectVisual'
import { useProjectModal } from '@/components/projects/ProjectModalContext'

export function Projects() {
  const [filter, setFilter] = useState<(typeof projectCategories)[number]>('All')
  const list = useMemo(
    () => (filter === 'All' ? projects : projects.filter((p) => p.categories.includes(filter as Project['categories'][number]))),
    [filter],
  )

  return (
    <section id="projects" className="section scroll-mt-20" aria-labelledby="projects-title">
      <div className="container-x">
        <div className="flex flex-col gap-8">
          <SectionHeading
            id="projects-title"
            index="03"
            eyebrow="Selected work"
            title="Projects"
            flush
            description="From machine learning and optimization to a deployed full-stack product. Open any project for the problem, my approach, what I built and the results. Every metric shows where it comes from."
          />
          <div role="group" aria-label="Filter projects by category" className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 md:flex-wrap">
            {projectCategories.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={filter === c}
                onClick={() => setFilter(c)}
                className={cn(
                  'relative shrink-0 rounded-full px-3.5 py-2 text-sm transition-colors',
                  filter === c ? 'text-fg' : 'text-muted hover:text-fg',
                )}
              >
                {filter === c && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 -z-10 rounded-full border border-line-strong bg-surface-2"
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  />
                )}
                {c}
              </button>
            ))}
          </div>
        </div>
        <motion.ul layout className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((p, i) => (
              <motion.li
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.7, ease: EASE }}
                className={p.featured ? 'md:col-span-2' : ''}
              >
                {p.featured ? <FeaturedCard project={p} flip={i % 2 === 1} /> : <CompactCard project={p} />}
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  )
}

function Links({ project }: { project: Project }) {
  return (
    <div className="flex items-center gap-1.5">
      {project.links.live && (
        <a
          href={project.links.live}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-xs text-muted transition-colors hover:border-accent hover:text-fg"
          aria-label={`${project.shortTitle} live demo (opens in new tab)`}
        >
          <Icon name="globe" size={14} /> Live
        </a>
      )}
      {project.links.github && (
        <a
          href={project.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-xs text-muted transition-colors hover:border-accent hover:text-fg"
          aria-label={`${project.shortTitle} source code on GitHub (opens in new tab)`}
        >
          <Icon name="github" size={14} /> Code
        </a>
      )}
    </div>
  )
}

function FeaturedCard({ project, flip }: { project: Project; flip: boolean }) {
  const { openProject } = useProjectModal()
  return (
    <SpotlightCard spot={project.accent} className="group overflow-hidden">
      <div className={cn('grid grid-cols-1 gap-0 lg:grid-cols-2', flip && 'lg:[&>*:first-child]:order-2')}>
        <div className="relative p-4 sm:p-6 lg:p-8">
          <div
            aria-hidden
            className="absolute inset-0 opacity-50 transition-opacity duration-500 group-hover:opacity-80"
            style={{ background: `radial-gradient(60% 60% at 50% 50%, ${project.accent}22, transparent 70%)` }}
          />
          <div className="relative aspect-[4/3] transition-transform sm:aspect-[16/11] duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.02]">
            <ProjectVisual visual={project.visual} />
          </div>
        </div>
        <div className="flex flex-col p-6 pt-2 sm:p-8 lg:pt-8">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-faint">
            <span style={{ color: project.accent }}>{project.categories.join(' · ')}</span>
            <span aria-hidden>•</span>
            <span>{project.period}</span>
          </div>
          <h3 className="mt-3 font-display text-2xl font-semibold leading-tight sm:text-[1.75rem]">{project.title}</h3>
          <p className="mt-3 leading-relaxed text-muted">{project.tagline}</p>

          <dl className="mt-6 grid grid-cols-3 gap-3 border-y border-line py-4">
            {project.metrics.slice(0, 3).map((m) => (
              <div key={m.label} title={`Source: ${m.source}`} className="flex flex-col-reverse justify-end">
                <dt className="mt-0.5 text-[0.72rem] leading-snug text-muted">{m.label}</dt>
                <dd className="font-display text-xl font-semibold sm:text-2xl">{m.value}</dd>
              </div>
            ))}
          </dl>

          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Tech stack">
            {project.stack.slice(0, 7).map((s) => (
              <li key={s} className="chip">
                {s}
              </li>
            ))}
            {project.stack.length > 7 && <li className="chip">+{project.stack.length - 7}</li>}
          </ul>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-7">
            <button
              type="button"
              onClick={() => openProject(project.slug)}
              className="group/btn inline-flex h-11 items-center gap-2 rounded-full bg-fg px-5 text-sm font-medium text-bg transition-colors hover:bg-accent hover:text-accent-contrast"
            >
              Read case study
              <Icon name="arrow-up-right" size={16} className="transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
            </button>
            <Links project={project} />
          </div>
        </div>
      </div>
    </SpotlightCard>
  )
}

function CompactCard({ project }: { project: Project }) {
  const { openProject } = useProjectModal()
  return (
    <SpotlightCard spot={project.accent} tilt={4} className="group flex h-full flex-col overflow-hidden">
      <div className="relative p-4 sm:p-5">
        <div className="aspect-[16/10]">
          <ProjectVisual visual={project.visual} />
        </div>
      </div>
      <div className="flex flex-1 flex-col px-5 pb-5 sm:px-6 sm:pb-6">
        <div className="font-mono text-xs" style={{ color: project.accent }}>
          {project.categories.join(' · ')}
          {project.context && <span className="text-faint"> · Internship</span>}
        </div>
        <h3 className="mt-2 font-display text-xl font-semibold">{project.shortTitle}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{project.tagline}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tech stack">
          {project.stack.slice(0, 5).map((s) => (
            <li key={s} className="chip">
              {s}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-center justify-between gap-3 pt-6">
          <button
            type="button"
            onClick={() => openProject(project.slug)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-fg transition-colors hover:text-accent"
          >
            Case study <Icon name="arrow-right" size={15} className="transition-transform group-hover:translate-x-0.5" />
          </button>
          <Links project={project} />
        </div>
      </div>
    </SpotlightCard>
  )
}
