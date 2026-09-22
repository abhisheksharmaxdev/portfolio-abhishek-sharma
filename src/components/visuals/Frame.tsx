import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Window chrome used by all project visuals. */
export function Frame({
  title,
  children,
  className,
  badge,
}: {
  title: string
  children: ReactNode
  className?: string
  badge?: string
}) {
  return (
    <div
      className={cn(
        'relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-line bg-bg-elev/90 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.6)]',
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-line px-3.5 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-[#ff5f57]/80" />
          <span className="size-2.5 rounded-full bg-[#febc2e]/80" />
          <span className="size-2.5 rounded-full bg-[#28c840]/80" />
        </span>
        <span className="ml-2 truncate font-mono text-[0.68rem] text-faint">{title}</span>
        {badge && (
          <span className="ml-auto shrink-0 rounded-full border border-line px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider text-faint">
            {badge}
          </span>
        )}
      </div>
      <div className="relative flex-1">{children}</div>
    </div>
  )
}
