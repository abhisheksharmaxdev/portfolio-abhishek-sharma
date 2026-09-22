import { motion } from 'motion/react'
import { Frame } from './Frame'
import { Icon } from '@/components/ui/Icon'

// Illustrative mockup of the MindMate chat UI (not a screenshot).
const messages = [
  { from: 'user', text: 'Exams next week and I can’t focus at all.' },
  { from: 'bot', text: 'That sounds stressful. Want to try a 2-minute breathing exercise, or talk through what’s on your mind?' },
  { from: 'user', text: 'Let’s talk it through.' },
]

export function MindEaseVisual() {
  return (
    <Frame title="mindease-as.netlify.app" badge="mockup">
      <div className="grid h-full grid-cols-[88px_1fr] sm:grid-cols-[108px_1fr]">
        <aside className="flex flex-col gap-1 border-r border-line p-2.5" aria-hidden>
          <div className="mb-2 flex items-center gap-1.5 font-display text-[0.72rem] font-semibold">
            <span className="grid size-4 place-items-center rounded bg-accent/25 text-accent">
              <Icon name="heart" size={10} />
            </span>
            MindEase
          </div>
          {['Dashboard', 'MindMate', 'Book session', 'Report'].map((l, i) => (
            <span
              key={l}
              className={`truncate rounded-md px-1.5 py-1 text-[0.62rem] ${i === 1 ? 'bg-accent/15 text-fg' : 'text-faint'}`}
            >
              {l}
            </span>
          ))}
          <div className="mt-auto space-y-1">
            {['User', 'Therapist', 'Admin'].map((r) => (
              <span key={r} className="block rounded border border-line px-1.5 py-0.5 font-mono text-[0.55rem] text-faint">
                {r}
              </span>
            ))}
          </div>
        </aside>
        <div className="flex flex-col gap-2 p-3">
          <div className="flex items-center gap-2 border-b border-line pb-2">
            <span className="grid size-6 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-2 text-[0.6rem] font-bold text-accent-contrast">
              M
            </span>
            <div>
              <div className="text-[0.7rem] font-medium">MindMate</div>
              <div className="flex items-center gap-1 text-[0.56rem] text-faint">
                <span className="size-1.5 rounded-full bg-emerald-400" /> online · AI support
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-end gap-1.5">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.45, duration: 0.45 }}
                className={`max-w-[85%] rounded-2xl px-2.5 py-1.5 text-[0.64rem] leading-snug ${
                  m.from === 'user'
                    ? 'self-end rounded-br-sm bg-accent text-accent-contrast'
                    : 'self-start rounded-bl-sm border border-line bg-surface-2 text-fg'
                }`}
              >
                {m.text}
              </motion.div>
            ))}
            <motion.div
              className="flex gap-1 self-start rounded-2xl border border-line bg-surface-2 px-2.5 py-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.8 }}
              aria-hidden
            >
              {[0, 1, 2].map((d) => (
                <span key={d} className="size-1 animate-bounce rounded-full bg-muted" style={{ animationDelay: `${d * 0.15}s` }} />
              ))}
            </motion.div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[0.62rem] text-faint">
            Type a message…
            <Icon name="send" size={11} className="ml-auto text-accent" />
          </div>
        </div>
      </div>
    </Frame>
  )
}
