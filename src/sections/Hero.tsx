import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { education, profile } from '@/content'
import { scrollToId } from '@/lib/scroll'
import { cn, EASE } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Icon } from '@/components/ui/Icon'
import { ButtonLink, Button, Magnetic } from '@/components/ui/Button'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { SHAPES } from '@/components/three/shapes'

const HeroScene = lazy(() => import('@/components/three/HeroScene'))

interface HeroProps {
  ready: boolean
  theme: 'dark' | 'light'
  reduced: boolean
}

/** Static glow shown while the 3D scene loads, or if WebGL is unavailable. */
function SceneFallback() {
  return (
    <div aria-hidden className="absolute inset-0 flex items-center justify-center lg:justify-end lg:pr-[10%]">
      <div className="size-[min(70vw,520px)] rounded-full bg-[radial-gradient(circle_at_35%_35%,var(--accent)_0%,transparent_55%),radial-gradient(circle_at_70%_70%,var(--accent-2)_0%,transparent_50%)] opacity-25 blur-3xl" />
    </div>
  )
}

export function Hero({ ready, theme, reduced }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(true)
  const [shape, setShape] = useState(0)
  const [autoCycle, setAutoCycle] = useState(!reduced)
  const compact = useMediaQuery('(max-width: 767px)')
  const edu = education[0]

  // Pause the WebGL loop when the hero is off-screen.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.02 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Morph Data → Model → Optimize every few seconds (until the user picks one).
  useEffect(() => {
    if (!autoCycle || reduced || !inView || !ready) return
    const id = setInterval(() => setShape((s) => (s + 1) % SHAPES.length), 5500)
    return () => clearInterval(id)
  }, [autoCycle, reduced, inView, ready])

  const show = (delay: number) => ({
    initial: { opacity: 0, y: 28 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, ease: EASE, delay },
  })

  return (
    <section
      id="top"
      ref={sectionRef}
      aria-label="Introduction"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden"
    >
      <div aria-hidden className="grid-bg absolute inset-0 -z-20" />
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 -z-20 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]"
      />
      <div className="absolute inset-0 -z-10">
        <ErrorBoundary fallback={<SceneFallback />}>
          <Suspense fallback={<SceneFallback />}>
            <HeroScene
              shapeIndex={shape}
              theme={theme}
              reduced={reduced}
              active={inView}
              compact={compact}
              eventSource={sectionRef}
            />
          </Suspense>
        </ErrorBoundary>
      </div>
      {/* Keeps the headline readable over the particles */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-bg/30 via-bg/50 to-bg lg:bg-gradient-to-r lg:from-bg/80 lg:via-bg/20 lg:to-transparent"
      />

      <div className="container-x flex flex-1 flex-col justify-center pt-28 pb-10 md:pt-32">
        <div className="max-w-3xl">
          <motion.div {...show(0.05)}>
            <span className="glass inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-[0.8rem] text-muted">
              <span className="relative size-2 rounded-full bg-emerald-400 [animation:pulse-dot_2s_infinite]" aria-hidden />
              {profile.availability}
            </span>
          </motion.div>

          <h1 className="mt-7 font-display text-[clamp(3rem,10vw,7.2rem)] font-bold leading-[0.92] tracking-[-0.045em]">
            <span className="sr-only">
              {profile.name}: {profile.headline}
            </span>
            <span aria-hidden className="block overflow-hidden pb-2">
              <motion.span
                className="block"
                initial={{ y: '105%' }}
                animate={ready ? { y: '0%' } : undefined}
                transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
              >
                Abhishek
              </motion.span>
            </span>
            <span aria-hidden className="block overflow-hidden pb-3">
              <motion.span
                className="text-gradient block"
                initial={{ y: '105%' }}
                animate={ready ? { y: '0%' } : undefined}
                transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
              >
                Sharma
              </motion.span>
            </span>
          </h1>

          <motion.p aria-hidden {...show(0.35)} className="mt-6 max-w-2xl font-display text-[clamp(1.1rem,2.4vw,1.5rem)] leading-snug">
            <span className="text-muted">{profile.headlineParts.role}</span>
            <span className="mx-2 text-faint">·</span>
            <br className="hidden sm:block" />
            <span className="text-fg">
              Building with{' '}
              {profile.headlineParts.focus.map((f, i, arr) => (
                <span key={f}>
                  <span className="text-accent">{f}</span>
                  {i < arr.length - 2 ? ', ' : i === arr.length - 2 ? ' & ' : ''}
                </span>
              ))}
            </span>
          </motion.p>

          <motion.p {...show(0.45)} className="mt-5 max-w-xl text-[1.02rem] leading-relaxed text-muted">
            {profile.intro}
          </motion.p>

          <motion.div {...show(0.55)} className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Button size="lg" onClick={() => scrollToId('projects')}>
                View projects
                <Icon name="arrow-right" size={17} className="transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Magnetic>
            <ButtonLink
              href={profile.resume.url}
              variant="secondary"
              size="lg"
              magnetic
            >
              <Icon name="file" size={17} />
              View CV
            </ButtonLink>
            <div className="flex items-center gap-1 sm:ml-1">
              {[
                { href: profile.socials.github.href, icon: 'github' as const, label: 'GitHub profile' },
                { href: profile.socials.linkedin.href, icon: 'linkedin' as const, label: 'LinkedIn profile' },
                { href: `mailto:${profile.email}`, icon: 'mail' as const, label: `Email ${profile.email}` },
              ].map((s) => (
                <Magnetic key={s.icon} strength={0.35}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    {...(s.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="grid size-12 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-fg"
                  >
                    <Icon name={s.icon} size={18} />
                  </a>
                </Magnetic>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : undefined}
        transition={{ duration: 1, delay: 0.8 }}
        className="container-x pb-8"
      >
        <div className="flex flex-col gap-5 border-t border-line pt-5 md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-muted">
            <li className="flex items-center gap-2">
              <Icon name="graduation" size={14} className="text-accent" /> B.Tech CSE · {edu.specialization}
            </li>
            <li className="flex items-center gap-2">
              <Icon name="calendar" size={14} className="text-accent" /> {edu.period.replace(' – ', '–')}
            </li>
            <li className="flex items-center gap-2">
              <Icon name="map-pin" size={14} className="text-accent" /> {profile.location}
            </li>
          </ul>

          <div className="flex items-center gap-3" role="group" aria-label="3D scene: choose a shape">
            <span className="hidden font-mono text-[0.68rem] uppercase tracking-[0.14em] text-faint sm:inline">Scene</span>
            {SHAPES.map((s, i) => (
              <button
                key={s.key}
                type="button"
                onClick={() => {
                  setAutoCycle(false)
                  setShape(i)
                }}
                aria-pressed={shape === i}
                className={cn(
                  'relative rounded-full px-3 py-1.5 font-mono text-xs transition-colors',
                  shape === i ? 'text-fg' : 'text-faint hover:text-muted',
                )}
              >
                {shape === i && (
                  <motion.span
                    layoutId="scene-pill"
                    className="absolute inset-0 -z-10 rounded-full border border-line-strong bg-surface/70"
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  />
                )}
                <span className="text-accent">0{i + 1}</span> {s.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <button
        type="button"
        onClick={() => scrollToId('about')}
        aria-label="Scroll to About section"
        className="absolute bottom-24 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-faint transition-colors hover:text-fg md:flex"
      >
        <span className="relative h-10 w-6 rounded-full border border-line-strong">
          <motion.span
            className="absolute left-1/2 top-2 h-2 w-0.5 -translate-x-1/2 rounded-full bg-accent"
            animate={reduced ? undefined : { y: [0, 12, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </button>
    </section>
  )
}
