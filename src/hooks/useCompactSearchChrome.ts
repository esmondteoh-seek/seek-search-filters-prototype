import { useEffect, useState } from "react"
import { useStickyFilterBlock } from "@/src/hooks/useStickyFilterBlock"
import { useScrollAwayHeader } from "@/src/hooks/useScrollAwayHeader"

/** Mobile: site header scrolls away; desktop: hides on scroll down */
export function useCompactSearchChrome(sentinelId: string) {
  const [compactChrome, setCompactChrome] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const update = () => setCompactChrome(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  const scrollAway = useScrollAwayHeader(!compactChrome)
  const headerOffset = compactChrome || scrollAway.hidden ? 0 : undefined

  const sticky = useStickyFilterBlock(sentinelId, {
    headerHeight: headerOffset,
  })

  return {
    compactChrome,
    headerHidden: scrollAway.hidden,
    headerInstant: scrollAway.instant,
    compact: sticky.isFilterBlockStuck,
    ...sticky,
  }
}
