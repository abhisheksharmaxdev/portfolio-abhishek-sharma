import { useEffect, useRef } from 'react'
import { useFinePointer, usePrefersReducedMotion } from '@/hooks/useMediaQuery'

/** Soft light that trails the pointer across the page (desktop only). */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)
  const fine = useFinePointer()
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!fine || reduced) return
    let x = -1000
    let y = -1000
    let cx = x
    let cy = y
    let raf = 0
    const onMove = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
    }
    const loop = () => {
      cx += (x - cx) * 0.12
      cy += (y - cy) * 0.12
      if (ref.current) ref.current.style.transform = `translate3d(${cx - 300}px, ${cy - 300}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [fine, reduced])

  if (!fine || reduced) return null
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-0 size-[600px] rounded-full opacity-[0.07] blur-3xl"
      style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 65%)' }}
    />
  )
}
