import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { experience, projects } from '@/content'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { Icon } from '@/components/ui/Icon'
import { useProjectModal } from '@/components/projects/ProjectModalContext'

export function Experience() {
  const listRef = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 75%', 'end 60%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const { openProject } = useProjectModal()

  return (
    <section id="experience" className="section scroll-mt-20" aria-labelledby="experience-title">
      <div className="container-x">
        <SectionHeading
          id="experience-title"
          index="02"
          eyebrow="Experience"
          title="Internship & volunteering"
          description="Hands-on work across the data science lifecycle, plus teaching technology to first-time learners."
        />

        <ol ref={listRef} className="relative space-y-8 pl-8 md:pl-12">
          {/* Timeline rail that fills as you scroll */}
          <div aria-hidden className="absolute left-[7px] top-2 bottom-2 w-px bg-line md:left-[11px]" />
          <motion.div
            aria-hidden
            className="absolute left-[7px] top-2 bottom-2 w-px origin-top bg-gradient-to-b from-accent to-accent-2 md:left-[11px]"
            style={{ scaleY: fill }}
          />

          {experience.map((job, i) => (
            <li key={job.role} className="relative">
              <span
                aria-hidden
                className="absolute -left-8 top-7 grid size-[15px] place-items-center rounded-full border border-accent bg-bg md:-left-12 md:size-[23px]"
              >
                <span className="size-[7px] rounded-full bg-accent md:size-[9px]" />
              </span>

              <Reveal delay={i * 0.05}>
                <SpotlightCard className="p-6 sm:p-8">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-mono text-xs text-accent">{job.type}</p>
                      <h3 className="mt-2 font-display text-2xl font-semibold">{job.role}</h3>
                      <p className="mt-1 text-fg/90">{job.organization}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 md:flex-col md:items-end">
                      <span className="chip">
                        <Icon name="calendar" size={12} /> {job.period}
                      </span>
                      {job.duration && <span className="chip">{job.duration}</span>}
                      <span className="chip">
                        <Icon name="map-pin" size={12} /> {job.location}
                      </span>
                    </div>
                  </div>

                  <p className="mt-5 max-w-3xl leading-relaxed text-muted">{job.summary}</p>

                  <ul className="mt-5 grid gap-x-8 gap-y-2.5 md:grid-cols-2">
                    {job.highlights.map((h) => (
                      <li key={h} className="flex gap-3 text-[0.95rem] leading-relaxed text-fg/85">
                        <Icon name="check" size={16} className="mt-1 shrink-0 text-accent-2" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  {(job.stack || job.relatedProjects) && (
                    <div className="mt-7 flex flex-col gap-5 border-t border-line pt-6 lg:flex-row lg:items-start lg:justify-between">
                      {job.stack && (
                        <ul className="flex flex-wrap gap-1.5" aria-label="Technologies used">
                          {job.stack.map((s) => (
                            <li key={s} className="chip">
                              {s}
                            </li>
                          ))}
                        </ul>
                      )}
                      {job.relatedProjects && (
                        <div className="shrink-0">
                          <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-faint">Projects from this role</p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {job.relatedProjects.map((slug) => {
                              const p = projects.find((x) => x.slug === slug)
                              if (!p) return null
                              return (
                                <button
                                  key={slug}
                                  type="button"
                                  onClick={() => openProject(slug)}
                                  className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-fg"
                                >
                                  {p.shortTitle}
                                  <Icon name="arrow-up-right" size={12} />
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {job.credential?.href && (
                    <a
                      href={job.credential.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-1.5 text-sm text-accent link-underline"
                    >
                      <Icon name="award" size={15} /> {job.credential.label}
                    </a>
                  )}
                </SpotlightCard>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
