import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { profile } from '@/content'
import { siteConfig } from '@/config/site'
import { cn, EASE } from '@/lib/utils'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { Reveal } from '@/components/ui/Reveal'
import { Icon, type IconName } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'

type Status = 'idle' | 'sending' | 'sent' | 'error'
type Fields = { name: string; email: string; message: string }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(f: Fields) {
  const e: Partial<Record<keyof Fields, string>> = {}
  if (f.name.trim().length < 2) e.name = 'Please enter your name.'
  if (!EMAIL_RE.test(f.email.trim())) e.email = 'Please enter a valid email address.'
  if (f.message.trim().length < 10) e.message = 'Please write at least a sentence (10+ characters).'
  return e
}

function CopyEmail() {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(profile.email)
          setCopied(true)
          setTimeout(() => setCopied(false), 1800)
        } catch {
          window.location.href = `mailto:${profile.email}`
        }
      }}
      className="relative z-10 inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-xs text-muted transition-colors hover:border-accent hover:text-fg"
      aria-label={copied ? 'Email address copied' : 'Copy email address'}
    >
      <Icon name={copied ? 'check' : 'copy'} size={14} className={copied ? 'text-emerald-400' : ''} />
      <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
    </button>
  )
}

export function Contact() {
  const [fields, setFields] = useState<Fields>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [honey, setHoney] = useState('')
  const usesService = Boolean(siteConfig.formspreeId)

  const update = (k: keyof Fields) => (e: { target: { value: string } }) => {
    setFields((f) => ({ ...f, [k]: e.target.value }))
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const errs = validate(fields)
    setErrors(errs)
    if (Object.keys(errs).length) {
      document.getElementById(`contact-${Object.keys(errs)[0]}`)?.focus()
      return
    }
    if (honey) return // bot

    if (!usesService) {
      // No form backend configured: hand off to the visitor's email client.
      const subject = encodeURIComponent(`Portfolio enquiry from ${fields.name.trim()}`)
      const body = encodeURIComponent(`${fields.message.trim()}\n\n— ${fields.name.trim()} (${fields.email.trim()})`)
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
      setStatus('sent')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(`https://formspree.io/f/${siteConfig.formspreeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...fields, _subject: `Portfolio enquiry from ${fields.name}` }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('sent')
      setFields({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  const channels: { icon: IconName; label: string; value: string; href: string; extra?: React.ReactNode }[] = [
    { icon: 'mail', label: 'Email', value: profile.email, href: `mailto:${profile.email}`, extra: <CopyEmail /> },
    { icon: 'linkedin', label: 'LinkedIn', value: `in/${profile.socials.linkedin.handle}`, href: profile.socials.linkedin.href },
    { icon: 'github', label: 'GitHub', value: `@${profile.socials.github.handle}`, href: profile.socials.github.href },
    { icon: 'file', label: 'CV', value: 'View on Google Drive', href: profile.resume.url },
  ]

  const inputCls = (err?: string) =>
    cn(
      'w-full rounded-xl border bg-surface-2/60 px-4 py-3 text-fg placeholder:text-faint transition-colors outline-none focus:border-accent focus:bg-surface-2 focus-visible:outline-none',
      err ? 'border-red-400/70' : 'border-line',
    )

  return (
    <section id="contact" className="section scroll-mt-20 overflow-hidden" aria-labelledby="contact-title">
      <div aria-hidden className="absolute top-1/3 left-1/2 -z-10 h-[420px] w-[900px] max-w-full -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
      <div className="container-x">
        <SectionHeading
          id="contact-title"
          index="07"
          eyebrow="Contact"
          title="Let’s connect."
          description={
            <>
              I’m looking for <span className="text-fg">internship and entry-level opportunities</span> in Data Science, AI/ML,
              Python Development and Software Engineering. Email and LinkedIn are the fastest ways to reach me.
            </>
          }
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.1fr]">
          <ul className="grid grid-cols-1 content-start gap-3">
            {channels.map((c, i) => (
              <Reveal as="li" key={c.label} delay={i * 0.06}>
                <SpotlightCard className="group flex items-center gap-4 p-4 sm:p-5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 text-accent transition-colors group-hover:border-accent">
                    <Icon name={c.icon} size={19} />
                  </span>
                  <a
                    href={c.href}
                    {...(c.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="min-w-0 flex-1 after:absolute after:inset-0 after:rounded-[inherit]"
                  >
                    <span className="block font-mono text-[0.68rem] uppercase tracking-[0.14em] text-faint">{c.label}</span>
                    <span className="block truncate text-[0.98rem] font-medium text-fg">{c.value}</span>
                  </a>
                  {c.extra}
                  <Icon
                    name="arrow-up-right"
                    size={17}
                    className="shrink-0 text-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg"
                  />
                </SpotlightCard>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.1}>
            <div className="card p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {status === 'sent' ? (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="flex min-h-[380px] flex-col items-center justify-center text-center"
                    role="status"
                  >
                    <span className="grid size-16 place-items-center rounded-full bg-emerald-400/15 text-emerald-400">
                      <Icon name="check" size={30} />
                    </span>
                    <h3 className="mt-6 font-display text-2xl font-semibold">
                      {usesService ? 'Message sent. Thank you!' : 'Your email app should open now'}
                    </h3>
                    <p className="mt-2 max-w-sm text-muted">
                      {usesService
                        ? 'I’ll get back to you as soon as I can.'
                        : `If it didn’t open, email me directly at ${profile.email}.`}
                    </p>
                    <Button variant="secondary" size="sm" className="mt-6" onClick={() => setStatus('idle')}>
                      Write another message
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={onSubmit}
                    noValidate
                    className="space-y-5"
                    aria-describedby="form-note"
                  >
                    <h3 className="font-display text-xl font-semibold">Send a message</h3>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <Field id="contact-name" label="Name" error={errors.name}>
                        <input
                          id="contact-name"
                          name="name"
                          autoComplete="name"
                          value={fields.name}
                          onChange={update('name')}
                          className={inputCls(errors.name)}
                          placeholder="Your name"
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? 'contact-name-err' : undefined}
                        />
                      </Field>
                      <Field id="contact-email" label="Email" error={errors.email}>
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          value={fields.email}
                          onChange={update('email')}
                          className={inputCls(errors.email)}
                          placeholder="you@company.com"
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? 'contact-email-err' : undefined}
                        />
                      </Field>
                    </div>
                    <Field id="contact-message" label="Message" error={errors.message}>
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={5}
                        value={fields.message}
                        onChange={update('message')}
                        className={cn(inputCls(errors.message), 'resize-y')}
                        placeholder="Tell me about the role, project or idea…"
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? 'contact-message-err' : undefined}
                      />
                    </Field>
                    {/* Honeypot for bots — hidden from people and assistive tech */}
                    <input
                      type="text"
                      name="_gotcha"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honey}
                      onChange={(e) => setHoney(e.target.value)}
                      className="hidden"
                      aria-hidden
                    />

                    {status === 'error' && (
                      <p role="alert" className="rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                        Something went wrong sending your message. Please email me directly at{' '}
                        <a className="underline" href={`mailto:${profile.email}`}>
                          {profile.email}
                        </a>
                        .
                      </p>
                    )}

                    <div className="flex flex-col-reverse items-start justify-between gap-4 sm:flex-row sm:items-center">
                      <p id="form-note" className="text-xs text-faint">
                        {usesService ? 'Your message goes straight to my inbox.' : 'Opens your email app with the message filled in.'}
                      </p>
                      <Button type="submit" size="lg" disabled={status === 'sending'} magnetic>
                        {status === 'sending' ? 'Sending…' : 'Send message'}
                        <Icon name="send" size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-fg">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
