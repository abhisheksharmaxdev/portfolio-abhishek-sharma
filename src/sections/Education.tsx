import { motion } from 'motion/react'
import { certifications, education } from '@/content'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal, staggerChild, staggerParent } from '@/components/ui/Reveal'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { Icon } from '@/components/ui/Icon'

/** Fraction of the degree elapsed, from the "YYYY – YYYY" period (July to July, per CV). */
function degreeProgress(period: string) {
  const [start, end] = period.split(/\s*[–-]\s*/).map(Number)
  if (!start || !end) return null
  const s = new Date(start, 6, 1).getTime()
  const e = new Date(end, 6, 1).getTime()
  return Math.min(1, Math.max(0, (Date.now() - s) / (e - s)))
}

export function Education() {
  return (
    <section id="education" className="section scroll-mt-20" aria-labelledby="education-title">
      <div className="container-x">
        <SectionHeading id="education-title" index="05" eyebrow="Education & certifications" title="Learning, formally and otherwise" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.15fr]">
          {education.map((ed) => {
            const progress = degreeProgress(ed.period)
            return (
              <Reveal key={ed.institution}>
                <SpotlightCard className="flex h-full flex-col overflow-hidden p-7 sm:p-9">
                  <div
                    aria-hidden
                    className="absolute -right-24 -top-24 size-72 rounded-full bg-accent/15 blur-3xl"
                  />
                  <span className="relative grid size-12 place-items-center rounded-2xl border border-line bg-surface-2 text-accent">
                    <Icon name="graduation" size={22} />
                  </span>
                  <p className="relative mt-7 font-mono text-xs text-accent">{ed.period}</p>
                  <h3 className="relative mt-2 font-display text-[1.7rem] font-semibold leading-tight">
                    {ed.degree}
                    <span className="block text-muted">{ed.field}</span>
                  </h3>
                  <p className="relative mt-4 text-fg/90">{ed.institution}</p>
                  <p className="relative mt-1 flex items-center gap-1.5 text-sm text-muted">
                    <Icon name="map-pin" size={14} /> {ed.location}
                  </p>
                  <div className="relative mt-5">
                    <span className="chip border-accent/40 text-fg">Specialization · {ed.specialization}</span>
                  </div>

                  {progress !== null && (
                    <div className="relative mt-auto pt-10">
                      <div className="flex justify-between font-mono text-[0.68rem] text-faint">
                        <span>{ed.period.split(/\s*[–-]\s*/)[0]}</span>
                        <span>Expected graduation {ed.period.split(/\s*[–-]\s*/)[1]}</span>
                      </div>
                      <div
                        className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2"
                        role="progressbar"
                        aria-label="Degree progress"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(progress * 100)}
                      >
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${progress * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                        />
                      </div>
                    </div>
                  )}
                </SpotlightCard>
              </Reveal>
            )
          })}

          <div>
            <Reveal>
              <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
                <Icon name="award" size={18} className="text-accent" /> Certifications
              </h3>
            </Reveal>
            <motion.ul
              variants={staggerParent}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-10%' }}
              className="grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
              {certifications.map((c) => (
                <motion.li key={c.title} variants={staggerChild} className="h-full">
                  <SpotlightCard className="flex h-full flex-col p-5">
                    <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-accent">{c.issuer}</p>
                    <p className="mt-2 flex-1 text-[0.95rem] font-medium leading-snug text-fg">{c.title}</p>
                    {c.url && (
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-1 self-start text-sm text-muted transition-colors hover:text-accent"
                        aria-label={`Verify ${c.title} credential (opens in new tab)`}
                      >
                        Verify <Icon name="arrow-up-right" size={14} />
                      </a>
                    )}
                  </SpotlightCard>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>
    </section>
  )
}
