import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { profile } from '@/content'
import { EASE } from '@/lib/utils'

const STEPS = ['loading data', 'fitting model', 'rendering portfolio']

/**
 * Brief intro overlay (~1.4s). Content renders underneath from the start, so
 * the loader never delays the page for crawlers or assistive tech.
 */
export function Loader({ onDone, reduced }: { onDone: () => void; reduced: boolean }) {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const duration = reduced ? 300 : 1400
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      setProgress(Math.round((1 - Math.pow(1 - t, 3)) * 100))
      if (t < 1) raf = requestAnimationFrame(tick)
      else {
        // Wait for web fonts (max 800ms) so the hero doesn't reflow after reveal.
        const fonts = document.fonts?.ready ?? Promise.resolve()
        Promise.race([fonts, new Promise((r) => setTimeout(r, 800))]).then(() => setVisible(false))
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  const step = STEPS[Math.min(STEPS.length - 1, Math.floor((progress / 100) * STEPS.length))]

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          key="loader"
          role="status"
          aria-label="Loading portfolio"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg"
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={reduced ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: reduced ? 0.2 : 0.9, ease: EASE }}
        >
          <div className="grid-bg absolute inset-0 opacity-60" aria-hidden />
          <motion.div className="relative flex flex-col items-center" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            <div className="relative grid size-20 place-items-center rounded-2xl border border-line-strong bg-surface font-display text-2xl font-bold">
              <span className="text-gradient">{profile.initials}</span>
              <svg className="absolute -inset-2 size-24 -rotate-90" viewBox="0 0 100 100" aria-hidden>
                <defs>
                  <linearGradient id="loader-grad" x1="0" x2="1">
                    <stop offset="0" stopColor="var(--accent)" />
                    <stop offset="1" stopColor="var(--accent-2)" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="46" fill="none" stroke="var(--border)" strokeWidth="2" />
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="url(#loader-grad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={289}
                  strokeDashoffset={289 - (289 * progress) / 100}
                />
              </svg>
            </div>
            <p className="mt-8 font-display text-lg font-medium tracking-tight">{profile.name}</p>
            <p className="mt-2 font-mono text-xs text-muted">
              <span className="text-accent">&gt;</span> {step}
              <span className="animate-pulse">_</span>
              <span className="ml-3 tabular-nums text-faint">{String(progress).padStart(3, '0')}%</span>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
