import { useCallback, useEffect, useRef, useState } from "react"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { useMobileSearchSheet } from "@/src/hooks/useMobileSearchSheet"

const SCROLL_COLLAPSE_THRESHOLD_PX = 4

/** Desktop inline expansion on pill click; mobile opens full-screen search sheet */
export function useExpandedSearchBand(filterState: UseJobFiltersReturn) {
  const [searchExpanded, setSearchExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const mobileSheet = useMobileSearchSheet(filterState)
  const scrollYAtExpandRef = useRef(0)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const update = () => {
      const mobile = mq.matches
      setIsMobile(mobile)
      if (mobile) setSearchExpanded(false)
    }
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  const closeExpanded = useCallback(() => {
    setSearchExpanded(false)
    filterState.updateDraftSearch(filterState.search)
  }, [filterState])

  useEffect(() => {
    if (!searchExpanded) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeExpanded()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [searchExpanded, closeExpanded])

  useEffect(() => {
    if (!searchExpanded || isMobile) return

    scrollYAtExpandRef.current = window.scrollY

    const handleScroll = () => {
      if (Math.abs(window.scrollY - scrollYAtExpandRef.current) >= SCROLL_COLLAPSE_THRESHOLD_PX) {
        closeExpanded()
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [searchExpanded, isMobile, closeExpanded])

  const openSearch = useCallback(() => {
    filterState.updateDraftSearch(filterState.search)
    if (isMobile) {
      mobileSheet.openSheet()
      return
    }
    scrollYAtExpandRef.current = window.scrollY
    setSearchExpanded(true)
  }, [isMobile, mobileSheet, filterState])

  const submitSearch = useCallback(() => {
    filterState.submitSearch()
    setSearchExpanded(false)
  }, [filterState])

  return {
    searchExpanded,
    isMobile,
    openSearch,
    closeExpanded,
    submitSearch,
    mobileSearchOpen: mobileSheet.open,
    closeMobileSearch: mobileSheet.closeSheet,
  }
}
