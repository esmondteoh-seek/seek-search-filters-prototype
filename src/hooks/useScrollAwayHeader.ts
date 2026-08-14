import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"

const HEADER_HEIGHT = 64
const SCROLL_DELTA = 8

/** Hide sticky site header on scroll down; reveal on scroll up or near top */
export function useScrollAwayHeader(enabled = true) {
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)
  const lastDocHeight = useRef(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!enabled) {
      setHidden(false)
      return
    }

    lastScrollY.current = window.scrollY
    lastDocHeight.current = document.documentElement.scrollHeight

    const onScroll = () => {
      const y = window.scrollY
      const docHeight = document.documentElement.scrollHeight
      const heightDelta = docHeight - lastDocHeight.current
      lastDocHeight.current = docHeight

      // Content shrunk (e.g. smart filters) — browser clamps scrollY downward.
      // Treat that as layout reflow, not a user scroll-up that should reveal the header.
      if (heightDelta < -SCROLL_DELTA) {
        lastScrollY.current = y
        if (y > HEADER_HEIGHT) setHidden(true)
        return
      }

      if (y <= HEADER_HEIGHT) {
        setHidden(false)
      } else if (y - lastScrollY.current > SCROLL_DELTA) {
        setHidden(true)
      } else if (lastScrollY.current - y > SCROLL_DELTA) {
        setHidden(false)
      }

      lastScrollY.current = y
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [enabled])

  return { hidden, instant: reduceMotion ?? false }
}
