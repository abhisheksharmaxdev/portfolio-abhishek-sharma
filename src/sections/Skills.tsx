import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { projects, skillGroups, skillProjectOverrides, type Project } from '@/content'
import { cn, EASE } from '@/lib/utils'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { Reveal } from '@/components/ui/Reveal'
import { Icon } from '@/components/ui/Icon'
import { useProjectModal } from '@/components/projects/ProjectModalContext'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

function projectsUsing(skill: string): Project[] {
  const slugs = skillProjectOverrides[skill]
  if (slugs) return projects.filter((p) => slugs.includes(p.slug))
  const s = skill.toLowerCase()
  return projects.filter((p) => p.stack.some((t) => t.toLowerCase() === s || t.toLowerCase().startsWith(s + ' ')))
}

function UsagePanel({ skill }: { skill: string }) {
  const { openProject } = useProjectModal()
  const used = useMemo(() => projectsUsing(skill), [skill])
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={skill}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.3, ease: EASE }}
        aria-live="polite"
      >
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-faint">Where I’ve used it</p>
        <p className="mt-2 font-display text-3xl font-semibold text-gradient">{skill}</p>
        {used.length ? (
          <>
            <p className="mt-2 text-sm text-muted">
              Used in {used.length} project{used.length > 1 ? 's' : ''}:
            </p>
            <ul className="mt-4 space-y-2">
              {used.map((p) => (
                <li key={p.slug}>
                  <button
                    type="button"
                    onClick={() => openProject(p.slug)}
                    className="group flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-surface-2/60 px-4 py-3 text-left transition-colors hover:border-accent"
                  >
                    <span>
                      <span className="block text-sm font-medium text-fg">{p.shortTitle}</span>
                      <span className="block font-mono text-[0.68rem] text-faint">{p.categories.join(' · ')}</span>
                    </span>
                    <Icon name="arrow-up-right" size={15} className="shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-muted">
           Projects coming soon.
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export function Skills() {
  const [selected, setSelected] = useState('Python')
  const reduced = usePrefersReducedMotion()
  const all = useMemo(() => skillGroups.flatMap((g) => g.skills), [])

  return (
    <section id="skills" className="section scroll-mt-20 overflow-hidden" aria-labelledby="skills-title">
      <div className="container-x">
        <SectionHeading
          id="skills-title"
          index="04"
          eyebrow="Technical skills"
          title="The toolkit"
          description="Select any skill to see which of my projects actually use it."
        />
      </div>
      <div aria-hidden className="relative mb-14 flex overflow-hidden border-y border-line py-4 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <div className="flex shrink-0 gap-10 pr-10" style={{ animation: reduced ? 'none' : 'marquee 60s linear infinite' }}>
          {[...all, ...all].map((s, i) => (
            <span key={i} className="flex items-center gap-10 whitespace-nowrap font-display text-2xl font-medium text-faint md:text-3xl">
              {s}
              <span className="text-accent/60">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="container-x grid gap-6 lg:grid-cols-[1fr_340px]">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {skillGroups.map((g, gi) => {
            const containsSelected = g.skills.includes(selected)
            return (
              <Reveal as="li" key={g.name} delay={(gi % 2) * 0.06}>
                <SpotlightCard className={cn('h-full p-5 transition-colors', containsSelected && 'border-line-strong')}>
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-lg border border-line bg-surface-2 text-accent">
                      <Icon name={g.icon} size={17} />
                    </span>
                    <h3 className="font-display text-lg font-semibold">{g.name}</h3>
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {g.skills.map((s) => {
                      const active = s === selected
                      return (
                        <li key={s}>
                          <button
                            type="button"
                            onClick={() => setSelected(s)}
                            aria-pressed={active}
                            className={cn(
                              'relative rounded-full border px-3 py-1.5 text-sm transition-all duration-300',
                              active
                                ? 'border-transparent bg-fg text-bg'
                                : 'border-line bg-surface-2/60 text-muted hover:-translate-y-0.5 hover:border-accent hover:text-fg',
                            )}
                          >
                            {s}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                  {/* Inline usage on small screens */}
                  {containsSelected && (
                    <div className="mt-5 border-t border-line pt-5 lg:hidden">
                      <UsagePanel skill={selected} />
                    </div>
                  )}
                </SpotlightCard>
              </Reveal>
            )
          })}
        </ul>

        <aside className="hidden lg:block">
          <div className="card sticky top-24 p-6">
            <UsagePanel skill={selected} />
          </div>
        </aside>
      </div>
    </section>
  )
}
