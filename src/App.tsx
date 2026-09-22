import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import { MotionConfig } from 'motion/react'
import { registerLenis } from '@/lib/scroll'
import { useTheme } from '@/hooks/useTheme'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { Loader } from '@/components/layout/Loader'
import { Navbar } from '@/components/layout/Navbar'
import { ScrollProgress } from '@/components/layout/ScrollProgress'
import { CursorGlow } from '@/components/layout/CursorGlow'
import { Footer } from '@/components/layout/Footer'
import { ProjectModalProvider } from '@/components/projects/ProjectModalContext'
import { Hero } from '@/sections/Hero'
import { About } from '@/sections/About'
import { Experience } from '@/sections/Experience'
import { Projects } from '@/sections/Projects'
import { Skills } from '@/sections/Skills'
import { Education } from '@/sections/Education'
import { GitHub } from '@/sections/GitHub'
import { Contact } from '@/sections/Contact'

export default function App() {
  const { theme, toggle } = useTheme()
  const reduced = usePrefersReducedMotion()
  const [ready, setReady] = useState(false)

  // Smooth scrolling (skipped for reduced-motion users).
  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    registerLenis(lenis)
    let raf = requestAnimationFrame(function loop(t) {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    })
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      registerLenis(null)
    }
  }, [reduced])

  // Honour a #section hash on first load once the intro has finished.
  useEffect(() => {
    if (!ready || !location.hash) return
    document.getElementById(location.hash.slice(1))?.scrollIntoView()
  }, [ready])

  return (
    <MotionConfig reducedMotion="user">
      <ProjectModalProvider>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-bg"
        >
          Skip to content
        </a>
        <Loader reduced={reduced} onDone={() => setReady(true)} />
        <ScrollProgress />
        <CursorGlow />
        <div className="noise" aria-hidden />
        <Navbar theme={theme} onToggleTheme={toggle} />
        <main id="main" className="relative z-[1]">
          <Hero ready={ready} theme={theme} reduced={reduced} />
          <About />
          <Experience />
          <Projects />
          <Skills />
          <Education />
          <GitHub />
          <Contact />
        </main>
        <Footer />
      </ProjectModalProvider>
    </MotionConfig>
  )
}
