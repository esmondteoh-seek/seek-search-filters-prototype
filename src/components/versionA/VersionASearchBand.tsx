import { useEffect, useState } from "react"
import { IconSearch } from "@/components/braid/icons"
import { MobileSearchSheet } from "@/src/components/MobileSearchSheet"
import { StandardFiltersRow } from "@/src/components/FilterBar/StandardFiltersRow"
import { SearchBandDesktopExpanded } from "@/src/components/shared/searchBand/SearchBandDesktopExpanded"
import { SearchBandShell } from "@/src/components/shared/searchBand/SearchBandShell"
import { useSearchBandForm } from "@/src/components/shared/searchBand/useSearchBandForm"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { useExpandedSearchBand } from "@/src/hooks/useExpandedSearchBand"
import { formatBulletSearchLabel } from "@/src/utils/searchLabel"
import { cn } from "@/lib/utils"

interface VersionASearchBandProps {
  filterState: UseJobFiltersReturn
  compact?: boolean
  forceExpanded?: boolean
  onForceExpandedChange?: (expanded: boolean) => void
}

const SCROLL_COLLAPSE_DELTA = 8

/** Version A search band — Figma 17292:45149 expanded / 17292:45659 compact / 17291:43226 mobile */
export function VersionASearchBand({
  filterState,
  compact = false,
  forceExpanded = false,
  onForceExpandedChange,
}: VersionASearchBandProps) {
  const form = useSearchBandForm(filterState)
  const { search } = filterState
  const [isMobile, setIsMobile] = useState(false)
  const {
    openSearch,
    submitSearch,
    mobileSearchOpen,
    closeMobileSearch,
  } = useExpandedSearchBand(filterState)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    if (!compact) onForceExpandedChange?.(false)
  }, [compact, onForceExpandedChange])

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
  const desktopExpanded = !compact || forceExpanded

  const expandDesktopInPlace = () => {
    filterState.updateDraftSearch(filterState.search)
    onForceExpandedChange?.(true)
  }

  return (
    <SearchBandShell expanded={isMobile ? true : desktopExpanded} tone="delivery">
      {!isMobile ? (
        desktopExpanded ? (
          <>
            <SearchBandDesktopExpanded
              filterState={filterState}
              expanded
              locationPlaceholder="All Australia"
              onKeyDown={form.handleKeyDown}
              onRestoreKeywordsIfEmpty={form.restoreKeywordsIfEmpty}
              onSubmitSearch={submitSearch}
              showSaveSearch={false}
              showLocationRadius={false}
              brandSeekButton
            />

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <StandardFiltersRow filterState={filterState} variant="navy" className="min-w-0" />
            </div>
          </>
        ) : (
          <div className="flex min-w-0 items-center">
            <button
              type="button"
              onClick={expandDesktopInPlace}
              className={cn(
                "flex h-10 w-[min(480px,100%)] shrink-0 items-center gap-2 rounded-full bg-white px-3 text-left",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2E3849]",
              )}
              aria-label={`Search: ${searchPillLabel}`}
            >
              <IconSearch className="h-4 w-4 shrink-0 text-[#5A6881]" aria-hidden />
              <span className="min-w-0 flex-1 truncate text-sm text-[#2E3849]">{searchPillLabel}</span>
            </button>
          </div>
        )
      ) : (
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={openSearch}
            className={cn(
              "flex h-10 w-full items-center gap-2 rounded-full bg-white px-3 text-left",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2E3849]",
            )}
            aria-label={`Search: ${searchPillLabel}`}
          >
            <IconSearch className="h-[18px] w-[18px] shrink-0 text-[#5A6881]" aria-hidden />
            <span className="min-w-0 flex-1 truncate text-sm text-[#2E3849]">{searchPillLabel}</span>
          </button>

          <StandardFiltersRow
            filterState={filterState}
            variant="compact"
            compactLabels
            className="min-w-0 -mx-1 px-1"
          />
        </div>
      )}

      <MobileSearchSheet
        open={mobileSearchOpen}
        onClose={closeMobileSearch}
        filterState={filterState}
        showLocationRadius={false}
        brandSeekButton
      />
    </SearchBandShell>
  )
}
