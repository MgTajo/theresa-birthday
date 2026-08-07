import confetti from 'canvas-confetti'

const COLORS = ['#22d3ee', '#f59e0b', '#f43f5e', '#a78bfa', '#ffffff']

const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Two angled cannons from the bottom corners. Used on the hero. */
export function burst() {
  if (reducedMotion()) return
  const shared = { particleCount: 60, spread: 70, colors: COLORS, disableForReducedMotion: true }
  confetti({ ...shared, origin: { x: 0, y: 0.75 }, angle: 60 })
  confetti({ ...shared, origin: { x: 1, y: 0.75 }, angle: 120 })
}

/** Sustained rain, for the moment the wheel lands and for the final screen. */
export function shower(durationMs = 2200) {
  if (reducedMotion()) return
  const end = Date.now() + durationMs
  const frame = () => {
    confetti({
      particleCount: 3,
      startVelocity: 28,
      spread: 360,
      ticks: 90,
      gravity: 0.85,
      colors: COLORS,
      scalar: 0.9,
      origin: { x: Math.random(), y: Math.random() * 0.3 },
      disableForReducedMotion: true,
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}

/** Short haptic tick on iPhone where supported — silently ignored elsewhere. */
export function tick(pattern: number | number[] = 8) {
  navigator.vibrate?.(pattern)
}
