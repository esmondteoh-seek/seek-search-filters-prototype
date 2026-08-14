import { useCallback, useEffect, useRef, useState, type RefObject } from "react"
import { useReducedMotion } from "motion/react"

const SCROLL_DELTA = 8

/** Hide a chrome row when the user scrolls down; show again on scroll up or reveal() */
export function useHideOnScrollDown(
  scrollRef: RefObject<HTMLElement | null>,
  options: { forceVisible?: boolean; enabled?: boolean } = {},
) {
  const { forceVisible = false, enabled = true } = options
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)
  const reduceMotion = useReducedMotion()

  const reveal = useCallback(() => setHidden(false), [])

  useEffect(() => {
    if (forceVisible) setHidden(false)
  }, [forceVisible])

  useEffect(() => {
    if (!enabled) {
      setHidden(false)
      return
    }
    const el = scrollRef.current
    if (!el) return

    lastY.current = el.scrollTop

    const onScroll = () => {
      if (forceVisible) {
        lastY.current = el.scrollTop
        return
      }
      const y = el.scrollTop
      if (y <= SCROLL_DELTA) {
        setHidden(false)
      } else if (y - lastY.current > SCROLL_DELTA) {
        setHidden(true)
      } else if (lastY.current - y > SCROLL_DELTA) {
        setHidden(false)
      }
      lastY.current = y
    }

    el.addEventListener("scroll", onScroll, { passive: true })
    return () => el.removeEventListener("scroll", onScroll)
  }, [scrollRef, enabled, forceVisible])

  return { hidden: enabled && hidden && !forceVisible, reveal, instant: reduceMotion ?? false }
}
