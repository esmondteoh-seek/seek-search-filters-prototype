import { useEffect, useState } from "react"
import { Concept3FilterRow } from "@/src/components/concept3/Concept3FilterRow"
import { MobileSearchSheet } from "@/src/components/MobileSearchSheet"
import { SearchBandCompactRow } from "@/src/components/shared/searchBand/SearchBandCompactRow"
import { SearchBandDesktopExpanded } from "@/src/components/shared/searchBand/SearchBandDesktopExpanded"
import { SearchBandShell } from "@/src/components/shared/searchBand/SearchBandShell"
import { useSearchBandForm } from "@/src/components/shared/searchBand/useSearchBandForm"
import { useMobileSearchSheet } from "@/src/hooks/useMobileSearchSheet"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { formatBulletSearchLabel } from "@/src/utils/searchLabel"

interface Concept3SearchBandProps {
  filterState: UseJobFiltersReturn
  /** Stuck-on-scroll — collapses the two-row band into a single compact row */
  compact?: boolean
  /** Parent-controlled override — expands band in place while scrolled */
  forceExpanded?: boolean
  onForceExpandedChange?: (expanded: boolean) => void
}

const SCROLL_COLLAPSE_DELTA = 8

/** Concept 3 — expanded two-row band at top; compacts to one row on scroll (Figma 4199:25011 / 4199:25286) */
export function Concept3SearchBand({
  filterState,
  compact = false,
  forceExpanded = false,
  onForceExpandedChange,
}: Concept3SearchBandProps) {
  const form = useSearchBandForm(filterState)
  const { search } = filterState
  const { open: mobileSearchOpen, openSheet, closeSheet } = useMobileSearchSheet(filterState)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  // Back at the top — drop the override so scroll-driven compaction resumes
  useEffect(() => {
    if (!compact) onForceExpandedChange?.(false)
  }, [compact, onForceExpandedChange])

  // Re-compact only when the user scrolls down — not on layout reflow from expanding
  useEffect(() => {
    if (!forceExpanded) return

    let lastScrollY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (y - lastScrollY > SCROLL_COLLAPSE_DELTA) onForceExpandedChange?.(false)
      lastScrollY = y
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [forceExpanded, onForceExpandedChange])

  const searchPillLabel = formatBulletSearchLabel(search.keywords, search.location)
  const bandExpanded = !isMobile && (!compact || forceExpanded)

  // Expand the band in place while scrolled — do not auto-scroll to top
  const expandInPlace = () => {
    if (isMobile) {
      openSheet()
      return
    }
    filterState.updateDraftSearch(filterState.search)
    onForceExpandedChange?.(true)
  }

  return (
    <SearchBandShell expanded={bandExpanded}>
      {bandExpanded ? (
        <>
          <SearchBandDesktopExpanded
            filterState={filterState}
            expanded
            locationPlaceholder="All Australia"
            onKeyDown={form.handleKeyDown}
            onRestoreKeywordsIfEmpty={form.restoreKeywordsIfEmpty}
            onSubmitSearch={form.submitSearch}
          />

          <div className="mt-4 hidden md:block">
            <Concept3FilterRow filterState={filterState} />
          </div>
        </>
      ) : (
        <SearchBandCompactRow
          filterState={filterState}
          searchPillLabel={searchPillLabel}
          onOpenSearch={expandInPlace}
          desktopFilters={<Concept3FilterRow filterState={filterState} inline onExpand={expandInPlace} />}
          mobileFilters={<Concept3FilterRow filterState={filterState} inline onExpand={expandInPlace} />}
        />
      )}

      <MobileSearchSheet open={mobileSearchOpen} onClose={closeSheet} filterState={filterState} />
    </SearchBandShell>
  )
}
