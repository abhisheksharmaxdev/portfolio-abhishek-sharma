import type { ReactNode } from 'react'
import { Reveal, SplitText } from './Reveal'
import { cn } from '@/lib/utils'

interface Props {
  index: string
  eyebrow: string
  title: string
  description?: ReactNode
  className?: string
  id?: string
  /** Remove bottom margin (when the heading sits in a row with other controls). */
  flush?: boolean
  align?: 'left' | 'center'
}

export function SectionHeading({ index, eyebrow, title, description, className, id, flush, align = 'left' }: Props) {
  return (
    <header className={cn(!flush && 'mb-12 md:mb-16', align === 'center' && 'text-center mx-auto max-w-2xl', className)}>
      <Reveal>
        <p className={cn('eyebrow flex items-center gap-3', align === 'center' && 'justify-center')}>
          <span className="text-faint">{index}</span>
          <span className="h-px w-8 bg-accent/60" aria-hidden />
          {eyebrow}
        </p>
      </Reveal>
      <h2 id={id} className="mt-4 text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.05]">
        <SplitText text={title} />
      </h2>
      {description && (
        <Reveal delay={0.15}>
          <p className={cn('mt-5 max-w-2xl text-muted text-[1.05rem] leading-relaxed', align === 'center' && 'mx-auto')}>
            {description}
          </p>
        </Reveal>
      )}
    </header>
  )
}
