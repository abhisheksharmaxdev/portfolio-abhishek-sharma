import type Lenis from 'lenis'

let lenis: Lenis | null = null

export function registerLenis(instance: Lenis | null) {
  lenis = instance
}

/** Smooth-scroll to a section id, falling back to native scrolling. */
export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: -72, duration: 1.2 })
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  // Move focus for keyboard / screen-reader users without jumping.
  el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
  history.replaceState(null, '', `#${id}`)
}

export function lockScroll(locked: boolean) {
  document.body.classList.toggle('is-locked', locked)
  if (lenis) {
    if (locked) lenis.stop()
    else lenis.start()
  }
}
