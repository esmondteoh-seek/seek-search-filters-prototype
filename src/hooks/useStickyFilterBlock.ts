import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { usePageScrolled } from "@/src/hooks/usePageScrolled"

const DEFAULT_HEADER_HEIGHT = 64
const DEFAULT_EXPANDED_HEIGHT = 168
const DEFAULT_COMPACT_HEIGHT = 72

export interface StickyFilterBlockOptions {
  /** Height of sticky site header above the search band — 0 when header scrolls away */
  headerHeight?: number
}

/** Sticky search/filter block scroll shadow — shared by concept layouts */
export function useStickyFilterBlock(
  sentinelId = "filter-sticky-sentinel",
  options: StickyFilterBlockOptions = {},
) {
  const headerHeight = options.headerHeight ?? DEFAULT_HEADER_HEIGHT
  const filterBlockRef = useRef<HTMLDivElement>(null)
  const [isFilterBlockStuck, setIsFilterBlockStuck] = useState(false)
  const [heights, setHeights] = useState({
    expanded: DEFAULT_EXPANDED_HEIGHT,
    compact: DEFAULT_COMPACT_HEIGHT,
  })
  const hasPageScrolled = usePageScrolled()

  // Cache measured heights per mode so stickyTop updates instantly with compact toggle
  useLayoutEffect(() => {
    const el = filterBlockRef.current
    if (!el) return
    const measured = el.offsetHeight
    if (measured <= 0) return
    setHeights((prev) => ({
      ...prev,
      [isFilterBlockStuck ? "compact" : "expanded"]: measured,
    }))
  }, [isFilterBlockStuck])

  useEffect(() => {
    const el = filterBlockRef.current
    if (!el) return
    const report = () => {
      const measured = el.offsetHeight
      if (measured <= 0) return
      setHeights((prev) => ({
        ...prev,
        [isFilterBlockStuck ? "compact" : "expanded"]: measured,
      }))
    }
    const ro = new ResizeObserver(report)
    ro.observe(el)
    return () => ro.disconnect()
  }, [isFilterBlockStuck])

  useEffect(() => {
    const sentinel = document.getElementById(sentinelId)
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setIsFilterBlockStuck(true)
          return
        }
        // Latch off only when truly back at the page top. Using headerHeight as the
        // threshold let filter-driven content shrink (scroll clamp) unstick the band
        // and flash the site header.
        if (window.scrollY <= 4) {
          setIsFilterBlockStuck(false)
        }
      },
      { threshold: 0, rootMargin: `-${headerHeight}px 0px 0px 0px` },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [sentinelId, headerHeight])

  const filterBlockHeight = isFilterBlockStuck ? heights.compact : heights.expanded

  return {
    filterBlockRef,
    filterBlockHeight,
    isFilterBlockStuck,
    hasPageScrolled,
    stickyTop: headerHeight + filterBlockHeight,
    headerHeight,
  }
}
