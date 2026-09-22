import { useRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { cn } from '@/lib/utils'
import { useFinePointer, usePrefersReducedMotion } from '@/hooks/useMediaQuery'

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  /** Max tilt in degrees (0 disables tilt). */
  tilt?: number
  spot?: string
}

/**
 * Card with a pointer-following spotlight and an optional gentle 3D tilt.
 * Tilt is disabled on touch devices and for reduced-motion users.
 */
export function SpotlightCard({ children, className, tilt = 0, spot, style, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const fine = useFinePointer()
  const reduced = usePrefersReducedMotion()
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const cfg = { stiffness: 180, damping: 20, mass: 0.5 }
  const rx = useSpring(useTransform(py, [0, 1], [tilt, -tilt]), cfg)
  const ry = useSpring(useTransform(px, [0, 1], [-tilt, tilt]), cfg)
  const tiltOn = tilt > 0 && fine && !reduced

  return (
    <motion.div
      ref={ref}
      className={cn('card spotlight', className)}
      style={{
        ...(style as object),
        ...(spot ? ({ '--spot': spot } as CSSProperties) : {}),
        ...(tiltOn ? { rotateX: rx, rotateY: ry, transformPerspective: 1000 } : {}),
      }}
      onPointerMove={(e) => {
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width
        const y = (e.clientY - r.top) / r.height
        el.style.setProperty('--mx', `${x * 100}%`)
        el.style.setProperty('--my', `${y * 100}%`)
        px.set(x)
        py.set(y)
      }}
      onPointerLeave={() => {
        px.set(0.5)
        py.set(0.5)
      }}
      {...(rest as object)}
    >
      {children}
    </motion.div>
  )
}
