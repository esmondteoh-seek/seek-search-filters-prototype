import { useEffect, useState } from "react"

const REDUCED_MOTION =
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

/** Keeps content mounted through exit animation before unmounting */
export function useMountTransition(open: boolean, durationMs = 200) {
  const [mounted, setMounted] = useState(open)
  const [visible, setVisible] = useState(open)

  useEffect(() => {
    const duration = REDUCED_MOTION ? 0 : durationMs

    if (open) {
      setMounted(true)
      if (duration === 0) {
        setVisible(true)
        return
      }
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true))
      })
      return () => cancelAnimationFrame(frame)
    }

    setVisible(false)
    if (duration === 0) {
      setMounted(false)
      return
    }
    const timer = window.setTimeout(() => setMounted(false), duration)
    return () => window.clearTimeout(timer)
  }, [open, durationMs])

  return { mounted, visible, durationMs: REDUCED_MOTION ? 0 : durationMs }
}
