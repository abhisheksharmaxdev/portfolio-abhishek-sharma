import { forwardRef, useRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { cn } from '@/lib/utils'
import { useFinePointer, usePrefersReducedMotion } from '@/hooks/useMediaQuery'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const base =
  'group relative inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] duration-300 disabled:opacity-60 disabled:pointer-events-none select-none'

const variants: Record<Variant, string> = {
  primary:
    'bg-fg text-bg hover:shadow-[0_10px_40px_-10px_var(--glow)] hover:bg-accent hover:text-accent-contrast',
  secondary: 'border border-line-strong bg-surface/60 text-fg hover:border-accent hover:text-accent backdrop-blur',
  ghost: 'text-muted hover:text-fg hover:bg-surface-2',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-[0.94rem]',
  lg: 'h-13 px-7 text-base',
}

function buttonClasses(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(base, variants[variant], sizes[size], className)
}

interface CommonProps {
  variant?: Variant
  size?: Size
  children: ReactNode
  /** Subtle magnetic pull toward the pointer (desktop only). */
  magnetic?: boolean
}

/** Wrapper that gives its child a springy magnetic hover effect. */
export function Magnetic({ children, strength = 0.25, disabled }: { children: ReactNode; strength?: number; disabled?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  const fine = useFinePointer()
  const reduced = usePrefersReducedMotion()
  const x = useSpring(useMotionValue(0), { stiffness: 250, damping: 18, mass: 0.4 })
  const y = useSpring(useMotionValue(0), { stiffness: 250, damping: 18, mass: 0.4 })
  const active = fine && !reduced && !disabled

  return (
    <motion.span
      ref={ref}
      className="inline-flex"
      style={active ? { x, y } : undefined}
      onPointerMove={(e) => {
        if (!active || !ref.current) return
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.span>
  )
}

type LinkProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>

export const ButtonLink = forwardRef<HTMLAnchorElement, LinkProps>(function ButtonLink(
  { variant = 'primary', size = 'md', magnetic = false, className, children, ...rest },
  ref,
) {
  const external = rest.href?.startsWith('http')
  const el = (
    <a
      ref={ref}
      className={buttonClasses(variant, size, className)}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
    </a>
  )
  return magnetic ? <Magnetic>{el}</Magnetic> : el
})

type BtnProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>

export const Button = forwardRef<HTMLButtonElement, BtnProps>(function Button(
  { variant = 'primary', size = 'md', magnetic = false, className, children, type = 'button', ...rest },
  ref,
) {
  const el = (
    <button ref={ref} type={type} className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </button>
  )
  return magnetic ? <Magnetic>{el}</Magnetic> : el
})
