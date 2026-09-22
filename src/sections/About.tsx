import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView } from 'motion/react'
import { certifications, education, experience, profile, projects } from '@/content'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal, staggerChild, staggerParent } from '@/components/ui/Reveal'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { Icon, type IconName } from '@/components/ui/Icon'

const strengthIcons: Record<string, IconName> = {
  'Problem-Solving': 'puzzle',
  'Analytical Thinking': 'chart',
  'Team Collaboration': 'users',
  Communication: 'message',
}

/** Counts up from 0 when scrolled into view. */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 1.4, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setVal(Math.round(v)) })
    return () => c.stop()
  }, [inView, to])
  return (
    <span ref={ref} className="tabular-nums">
      {val}
      {suffix}
    </span>
  )
}

export function About() {
  const edu = education[0]
  const intern = experience[0]
  const stats = [
    { value: projects.length, label: 'Projects on GitHub', suffix: '' },
    { value: 6, label: 'Weeks · Data Science internship', suffix: '' },
    { value: certifications.length, label: 'Certifications', suffix: '' },
    { value: 40, label: 'Students taught computer basics', suffix: '' },
  ]

  const facts: { icon: IconName; label: string; value: string; sub: string }[] = [
    { icon: 'graduation', label: 'Studying', value: `B.Tech CSE · ${edu.specialization}`, sub: `Ganpat University (ICT) · ${edu.period}` },
    { icon: 'briefcase', label: 'Recent', value: intern.role, sub: `${intern.organization} · ${intern.duration}` },
    { icon: 'target', label: 'Seeking', value: 'Internships & entry-level roles', sub: profile.seeking.join(' · ') },
    { icon: 'map-pin', label: 'Based in', value: profile.location, sub: 'Reach me by email or LinkedIn' },
  ]

  return (
    <section id="about" className="section scroll-mt-20" aria-labelledby="about-title">
      <div className="container-x">
        <SectionHeading id="about-title" index="01" eyebrow="About me" title="Data, models and the software around them." />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <div className="space-y-5 text-[1.05rem] leading-relaxed text-muted">
            {profile.about.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className={i === 0 ? 'text-fg' : ''}>{p}</p>
              </Reveal>
            ))}

            <Reveal delay={0.25}>
              <div className="pt-4">
                <h3 className="eyebrow">Strengths</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {profile.strengths.map((s) => (
                    <li
                      key={s}
                      className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 text-sm text-fg transition-colors hover:border-accent"
                    >
                      <Icon name={strengthIcons[s] ?? 'sparkles'} size={15} className="text-accent" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <motion.ul
            variants={staggerParent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-10%' }}
            className="grid grid-cols-1 content-start gap-3 sm:grid-cols-2 lg:grid-cols-1"
          >
            {facts.map((f) => (
              <motion.li key={f.label} variants={staggerChild}>
                <SpotlightCard className="flex items-start gap-4 p-5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 text-accent">
                    <Icon name={f.icon} size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-faint">{f.label}</p>
                    <p className="mt-1 font-medium text-fg">{f.value}</p>
                    <p className="mt-0.5 text-sm text-muted">{f.sub}</p>
                  </div>
                </SpotlightCard>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <Reveal delay={0.1}>
          <dl className="mt-16 grid grid-cols-2 overflow-hidden rounded-2xl border border-line md:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col-reverse justify-end gap-1 bg-surface/50 p-6 md:p-8 ${i % 2 === 0 ? 'border-r' : ''} ${i < 2 ? 'border-b md:border-b-0' : ''} ${i === 1 ? 'md:border-r' : ''} border-line`}
              >
                <dt className="text-sm text-muted">{s.label}</dt>
                <dd className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
                  <span className="text-gradient">
                    <Counter to={s.value} suffix={s.suffix} />
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
