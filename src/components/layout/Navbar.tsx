import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { navItems, profile } from '@/content'
import { useActiveSection } from '@/hooks/useActiveSection'
import { lockScroll, scrollToId } from '@/lib/scroll'
import { cn, EASE } from '@/lib/utils'
import { Icon } from '@/components/ui/Icon'
import { ButtonLink } from '@/components/ui/Button'

const ids = navItems.map((n) => n.id)

export function Navbar({ theme, onToggleTheme }: { theme: 'dark' | 'light'; onToggleTheme: () => void }) {
  const active = useActiveSection(ids)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 24)
    setHidden(y > 400 && y > prev + 2 && !open)
    if (y < prev - 2) setHidden(false)
  })

  useEffect(() => {
    lockScroll(open)
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (id: string) => {
    const wasOpen = open
    setOpen(false)
    // Let the mobile menu close (and scrolling unlock) before scrolling.
    setTimeout(() => scrollToId(id), wasOpen ? 250 : 0)
  }

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden ? '-110%' : '0%' }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <div className="container-x pt-3">
          <nav
            aria-label="Primary"
            className={cn(
              'flex h-14 items-center justify-between rounded-full pl-2 pr-2 transition-all duration-500',
              scrolled || open ? 'glass shadow-[0_10px_40px_-20px_rgb(0_0_0/0.5)]' : 'border border-transparent',
            )}
          >
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault()
                go('top')
              }}
              className="group flex items-center gap-2.5 rounded-full pr-2"
              aria-label={`${profile.name}, back to top`}
            >
              <span className="grid size-10 place-items-center rounded-full border border-line-strong bg-surface font-display text-[0.8rem] font-bold transition-colors group-hover:border-accent">
                <span className="text-gradient">{profile.initials}</span>
              </span>
              <span className="hidden font-display text-[0.95rem] font-semibold tracking-tight sm:block">{profile.name}</span>
            </a>

            <ul className="hidden items-center gap-0.5 lg:flex">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      go(item.id)
                    }}
                    aria-current={active === item.id ? 'location' : undefined}
                    className={cn(
                      'relative block rounded-full px-3.5 py-2 text-sm transition-colors',
                      active === item.id ? 'text-fg' : 'text-muted hover:text-fg',
                    )}
                  >
                    {active === item.id && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-surface-2 ring-1 ring-line"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onToggleTheme}
                className="grid size-10 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-fg"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={theme}
                    className="grid"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
                  </motion.span>
                </AnimatePresence>
              </button>
              <ButtonLink href={profile.resume.url} size="sm" className="hidden sm:inline-flex" aria-label="View CV (opens in new tab)">
                <Icon name="file" size={15} />
                View CV
              </ButtonLink>
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="grid size-10 place-items-center rounded-full text-fg hover:bg-surface-2 lg:hidden"
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? 'Close menu' : 'Open menu'}
              >
                <Icon name={open ? 'x' : 'menu'} size={20} />
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 bg-bg/95 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav aria-label="Mobile" className="container-x flex h-full flex-col justify-center pt-16 pb-10">
              <ul className="space-y-1">
                {navItems.map((item, i) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.045, duration: 0.5, ease: EASE }}
                  >
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault()
                        go(item.id)
                      }}
                      className="flex items-baseline gap-4 py-2 font-display text-4xl font-semibold tracking-tight"
                    >
                      <span className="font-mono text-xs text-faint">0{i + 1}</span>
                      <span className={active === item.id ? 'text-gradient' : ''}>{item.label}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
              <motion.div className="mt-10 flex flex-wrap gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <ButtonLink href={profile.resume.url}>
                  <Icon name="file" size={16} /> View CV
                </ButtonLink>
                <ButtonLink href={profile.socials.linkedin.href} variant="secondary">
                  <Icon name="linkedin" size={16} /> LinkedIn
                </ButtonLink>
                <ButtonLink href={profile.socials.github.href} variant="secondary">
                  <Icon name="github" size={16} /> GitHub
                </ButtonLink>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
