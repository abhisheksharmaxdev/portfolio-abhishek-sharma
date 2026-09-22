import { navItems, profile } from '@/content'
import { scrollToId } from '@/lib/scroll'
import { Icon } from '@/components/ui/Icon'
import { Magnetic } from '@/components/ui/Button'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative border-t border-line">
      <div className="container-x py-14">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full border border-line-strong bg-surface font-display text-sm font-bold">
                <span className="text-gradient">{profile.initials}</span>
              </span>
              <div>
                <p className="font-display text-lg font-semibold">{profile.name}</p>
                <p className="text-sm text-muted">B.Tech CSE (Big Data Analytics) · Ganpat University</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">{profile.availability}. Let’s talk about data, ML or software.</p>
            <a
              href={`mailto:${profile.email}`}
              className="link-underline mt-4 inline-block font-display text-lg text-fg transition-colors hover:text-accent"
            >
              {profile.email}
            </a>
          </div>

          <nav aria-label="Footer">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-faint">Sections</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
              {navItems.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToId(n.id)
                    }}
                    className="text-muted transition-colors hover:text-fg"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-faint">Connect</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href={profile.socials.linkedin.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-muted transition-colors hover:text-fg">
                  <Icon name="linkedin" size={15} /> LinkedIn
                </a>
              </li>
              <li>
                <a href={profile.socials.github.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-muted transition-colors hover:text-fg">
                  <Icon name="github" size={15} /> GitHub
                </a>
              </li>
              <li>
                <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 text-muted transition-colors hover:text-fg">
                  <Icon name="mail" size={15} /> Email
                </a>
              </li>
              <li>
                <a href={profile.resume.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-muted transition-colors hover:text-fg">
                  <Icon name="file" size={15} /> CV
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse items-start justify-between gap-5 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-faint">
            © {year} {profile.name}. Designed & built with React, Three.js and Motion.
          </p>
          <Magnetic strength={0.3}>
            <button
              type="button"
              onClick={() => scrollToId('top')}
              className="group inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs text-muted transition-colors hover:border-accent hover:text-fg"
            >
              Back to top
              <Icon name="arrow-up" size={14} className="transition-transform group-hover:-translate-y-0.5" />
            </button>
          </Magnetic>
        </div>
      </div>
    </footer>
  )
}
